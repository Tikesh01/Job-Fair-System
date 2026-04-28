from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import uvicorn
from database import Db
from models import otpRequest, otpVerify, UserRegister, loginRequest
import random
import string
import re
import jwt
from datetime import datetime, timedelta
from functools import wraps
from dotenv import load_dotenv
import os

load_dotenv()

# app Confings
debug = os.getenv('DEBUG')
host = os.getenv('HOST')
port = int(os.getenv('PORT'))

#Frontend config
frontend_origin = os.getenv('FRONTEND_ORIGIN')
allow_credentials = os.getenv("ALLOW_CREDENTIAL")

app = FastAPI(title="Job-Fair-System",debug=debug)
app.add_middleware(CORSMiddleware,allow_origins=[frontend_origin],allow_methods=["*"], allow_credentials=allow_credentials, allow_headers=["*"])

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={"detail": "Invalid request data. Please check your input."},
    )

#Databse config
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_active_database = os.getenv('DB_ACTIVE_DATABASE')
db = Db(host=db_host, port=db_port, user=db_user, password=db_password,  database=db_active_database)

#jwt token config
secret_key = os.getenv('SECRET_KEY')
algorithm = os.getenv('ALGORITHM')
expiry_minutes = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES'))

def validate_email(email: str) -> bool:
    email_re = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
    if not email or len(email) > 254:
        return False
    return bool(email_re.fullmatch(email))

def validate_role(role:str):
    all_roles = ["candidate", 'company', 'university']
    if role in all_roles:
        return role.strip()
    else:
        return False
        
def check_otp_limit(email:str) -> bool:
    result = db.query("SELECT id FROM otps WHERE email = %s", params=(email, ))
    print(len(result))
    return bool(len(result) < 5)

def verify_email_otp(email:str, otp:str):
    if len(otp) != 6:
        return False
    
    print("otp verification method")
    result = db.query("SELECT id,created_at FROM otps WHERE email = %s AND otp = %s ORDER BY id DESC", (email, otp, ))
    if not result:
        return False
    user = result[0]
    current_time = datetime.now()
    if current_time>=user['created_at'] +timedelta(minutes=10):
        return False
    return True

def check_user_exist(role:str, email:str, pw=None):
    result = []
    if not pw:
        q = f"SELECT {role}_id as user_id, email FROM {role} WHERE email=%s;"
        result = db.query(q, params=(email,))
    else:
        q = f"SELECT {role}_id as user_id, email FROM {role} WHERE email=%s AND password=%s"
        result = db.query(q, params=(email,pw,))
    return result[0] if len(result)>0 else None

def create_access_token(payload: dict, expiry_minutes: timedelta ):
    to_encode = payload.copy()
    expire = datetime.now() + expiry_minutes
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=algorithm)
    return encoded_jwt

def token_decode(token):
    if not token:
        raise HTTPException(status_code=401, detail="Invalid or missing token")

    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_roles(*allowed_roles):
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            try:
                token = request.cookies.get("token")
                payload = token_decode(token)
                user_role = payload.get("role")
                # email = payload.get('email')
                # user = check_user_exist(user_role,email)
                # if not user:
                #     raise HTTPException(status_code=403, detail="You are not Authorized")
                
                if user_role not in allowed_roles:
                    raise HTTPException(status_code=403, detail="You are not Authorized")
                request.state.user = payload
            except Exception as e:
                raise HTTPException(status_code=401,detail="Need to Login")
            return func(request, *args, **kwargs)
        return wrapper
    return decorator

@app.post("/login")
def login(loginObj:loginRequest):
    role = loginObj.role
    email = loginObj.email 
    pw = loginObj.password
    
    if not validate_role(role) or not validate_email(email):
        raise HTTPException(status_code=400,detail="Invalid Role or Email!")
    
    user = check_user_exist(role, email, pw)
    if not user:
        raise HTTPException(status_code=400,detail="Invalid credentials")
    
    payload = { 
        "sub": str(user['user_id']), 
        "role": role, 
        "email": email
    }
    minutes = timedelta(minutes=expiry_minutes)
    access_token = create_access_token(payload=payload, expiry_minutes=minutes)
    response = JSONResponse({"message": "Login successful"})
    response.set_cookie(key="token", value=access_token , secure=False, samesite="strict", max_age=3600)
    response.set_cookie(key="role", value=role, secure=False, samesite="strict", max_age=3600)
    response.set_cookie(key="expiry_time", value=datetime.now()+minutes, secure=False, samesite="strict", max_age=3600)
    return response 

@app.post('/logout')
@require_roles("candidate","university","company")
def logout(request:Request):
    response = JSONResponse({"message": "Logged out successfully"})
    response.delete_cookie("token")
    response.delete_cookie("role")
    response.delete_cookie("expiry_time")
    return response

@app.post("/generate/otp")
def generate_otp(request: otpRequest):
    role = request.role
    email = request.email.strip()
    if isDuplicateUser(email) == True:
        raise HTTPException(status_code=409, detail="User Alredy Exists")
    if validate_email(email) and validate_role(role):

        if check_otp_limit(email):
            otp = ''.join(random.choices(string.digits, k=6))
            db.query("INSERT INTO otps (email, otp) VALUES (%s, %s)", (email, otp,), commit=True)
            # send email 
            print(f"OTP for {request.email}: {otp}")  # For testing
            return {"massage":"OTP sent successfully"}
        else:
           raise HTTPException(status_code=409, detail="Repeatative Request, Try again Later")
    else:
        raise HTTPException(status_code=400, detail="Wrong Email or Role!")

@app.post("/verify/otp")
def verify_otp(request: otpVerify):
    email = request.email
    otp = request.otp.strip()
    print(otp)
    if verify_email_otp(email, otp):
        return {"message": "OTP verified successfully"}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP")

def isStrongPass(password:str):
    length_error = len(password) < 8
    digit_error = re.search(r"\d", password) is None
    uppercase_error = re.search(r"[A-Z]", password) is None
    lowercase_error = re.search(r"[a-z]", password) is None
    special_char_error = re.search(r"[@$!%*?&]", password) is None

    # Check if all criteria are met
    if not (length_error or digit_error or uppercase_error or lowercase_error or special_char_error):
        return True
    
    return False

def isDuplicateUser(email:str):
    result = db.query(
        """
            SELECT candidate_id FROM candidate WHERE email = %s
            UNION
            SELECT university_id FROM university WHERE email = %s
            UNION
            SELECT company_id FROM company WHERE email = %s
        """,
        params=(email, email, email,)
    )
    return len(result) > 0

@app.post("/register")
def register_user(request: UserRegister):
    email = request.email
    otp = request.otp
    role = validate_role(request.role) 
    password = request.password
    cnfm_password = request.cnfm_password

    if len(password) > 30:
        raise HTTPException(status_code=400, detail="Password exceeds maximum length")

    if not role or not validate_email(email) or not verify_email_otp(email, otp):
        raise HTTPException(status_code=400, detail="Invalid email, role, or OTP")
    
    if password != cnfm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    if isDuplicateUser(email):
        raise HTTPException(status_code=409, detail="Email already registered")

    if not isStrongPass(password):
        raise HTTPException(status_code=400, detail="Password must be 8+ chars with uppercase, lowercase, digit, and special character")
    
    q = "INSERT INTO " + role + "(email, password) VALUES(%s, %s)"
    db.query(Q=q, params=(email, password), commit=True)
    return {"message": "Registration successful"}


@app.get('/companies', response_model=list)
def get_company_list():
    try:
        companies = db.getTable('company')
        print(companies)
        return companies

    except Exception as e:
        raise HTTPException(status_code=400, detail="Some Errro occured")
    
@app.get("/user/detail")
@require_roles("candidate","university","company")
def get_user_details(request:Request):
    try:
        payload = request.state.user
        role = payload.get('role')
        if not validate_role(role):
            raise HTTPException(status_code=400, detail="Invalid Role")
        
        user_id = payload.get('sub')

        user = db.query(f'SELECT * FROM {role} WHERE {role}_id = %s',params=(user_id,))
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return user[0]
       
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    
@app.get("/courses")
@require_roles("candidate")
def get_all_courses_list(request:Request):
    try:
        result = db.getTable('course')
        return result
    except Exception as e:
        raise HTTPException(status_code=400,detail="Error occured")

def course_branches_by_course_id(course_id):
    q = """
        SELECT b.branch_id,b.branch_title 
        FROM branch b join course_branch cb 
            ON b.branch_id = cb.branch_id 
            WHERE course_id = %s
        
        """
    result = db.query(q, params=(course_id, ))

    return result

def course_by_branch_id_and_course_id(branch_id,course_id):
    q = """
        SELECT c.course_id,c.course_title 
        FROM course c JOIN course_branch cb 
        ON c.course_id = cb.course_id
        WHERE cb.branch_id=%s AND c.course_id=%s
    """
    result = db.query(q,params=(branch_id,course_id))

    return result
    
@app.get("/course/{course_id}")
@require_roles("candidate")
def get_candidate_course_detail(request:Request, course_id:int):
    try:
        candidate_course = db.query("SELECT * FROM course WHERE course_id=%s",params=(course_id,))
        if len(candidate_course) == 0:
            raise HTTPException(status_code=200,detail="No course Found")
        courseObj = dict(candidate_course[0])

        branches_obj_list = course_branches_by_course_id(course_id)
        if (branches_obj_list) == 0:
            branches_obj_list = [{
                                    'branch_id':33,
                                    'branch_title': 'other'
                                }]
            
        courseObj['branches'] = branches_obj_list

        return courseObj
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error Occured")

@app.get("/branch/{branch_id}")
@require_roles("candidate")
def get_candidate_branch_detail(request:Request, branch_id:int):
    try:
        result = db.query('SELECT * FROM branch WHERE branch_id=%s',params=(branch_id, ))

        if len(result) ==0:
            raise HTTPException(status_code=400,detail="No Branch found")
        return result[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error Occured")

@app.post("/profile/update")
@require_roles("candidate","university","company")
def edit_profile(request:Request, data:dict): 
    if not data:
        raise HTTPException(status_code=400, detail="No Changes detected")
    if 'email' in data:
        raise HTTPException(status_code=400, detail="Email cannot be changed!")
    
    try:
        payload = request.state.user
        id = payload.get('sub')
        role = payload.get('role')

        if role == 'candidate':
            if 'is_eligible' in data:
                raise HTTPException(status_code=400, detail="Cannot be chnaged!")
            if 'course_id' in data:
                course_id = int(data['course_id'])
                if course_id > 33 or course_id < 1:
                    raise HTTPException(status_code=400, detail="Wrong Course Selection!")
                branch_obj_list = course_branches_by_course_id(course_id)
                if 'branch_id' in data:
                    branch_id = int(data['branch_id'])
                    if not any(branch['branch_id'] == branch_id for branch in branch_obj_list):  
                        raise HTTPException(status_code=400, detail="Wrong Branch Selection")
                elif 'branch_id' not in data:
                    data['branch_id'] = branch_obj_list[0]['branch_id']

        set_clause = ", ".join([f"{k} = %s" for k in data.keys()])
        q = f"""
                UPDATE {role}
                SET
                    {set_clause}
                WHERE {role}_id = %s;
            """
        params = list(data.values()) + [id]
        db.query(q, params=tuple(params), commit=True)
        return {'msg' : "Profile updated Successfully"}
    except HTTPException: 
        raise
    except Exception as e:  
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/candidate/links")
@require_roles("candidate")
def get_candidate_links(request:Request):
    try:
        payload = request.state.user;
        candidate_id = payload.get('sub');
        url_list = db.query('SELECT link_id, link_url FROM candidate_links WHERE candidate_id = %s', params=(candidate_id, ))

        return url_list

    except Exception as e:
        raise HTTPException(status_code=400, detail='Cant Find links error')
    
@app.post("/candidate/link/update")
@require_roles('candidate')
def update_candidate_link(request:Request, urlObj:dict):
    print(urlObj)
    try:
        user = request.state.user
        user_id = user.get('sub')
        link_id = urlObj['link_id']
        link_url = urlObj['link_url']
        db.query("UPDATE candidate_links cl SET cl.link_url=%s WHERE cl.link_id=%s AND cl.candidate_id=%s", params=(link_url, link_id, user_id,), commit=True)
        return {'msg' : "Link Update Success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Some Error Occured while updating Link")

@app.delete("/candidate/link/{link_id}")
@require_roles('candidate')
def update_candidate_link(request:Request, link_id:int):
    try:
        user = request.state.user
        user_id = user.get('sub')
        db.query("DELETE FROM candidate_links cl WHERE cl.link_id=%s AND cl.candidate_id=%s", params=(link_id, user_id,), commit=True)
        return {'msg' : "Link DELETE Success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Some Error Occured while deleting Link")
    
def is_authenticated_url(url:str):
    pass

def is_safe_links_count(candidate_id):
    result = db.query("SELECT link_id FROM candidate_links WHERE candidate_id = %s",params=(candidate_id, ))
    print(result)
    return bool(len(result) < 3)
    
@app.post("/candidate/link/create")
@require_roles('candidate')
def update_candidate_link(request:Request, urlObj:dict):
    try:
        user = request.state.user
        user_id = user.get('sub')
        if not is_safe_links_count(candidate_id=user_id):
            raise HTTPException(status_code=409,detail="Max Url Count reached")

        link_url = urlObj['link_url']
        db.query("INSERT INTO candidate_links(link_url, candidate_id) VALUES(%s, %s)", params=(link_url, user_id,), commit=True)
        return {'msg' : "Link Creation Success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Some Error Occured while creating Link")

if __name__ == "__main__":
    uvicorn.run(app="main:app",host=host,port=port, reload=True)