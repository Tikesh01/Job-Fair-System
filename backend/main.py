from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import uvicorn
from database import Db
from models import (
    otpRequest,
    otpVerify,
    userRegister,
    loginRequest,
    JobRoleCreate,
    JobRoleUpdate,
    HrCreate,
    HrUpdate,
    feedback,
)
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

#need to change the logic in production 
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    errors = exc.errors()
    error_details = []
    for error in errors:
        error_details.append(f"{error['loc']}: {error['msg']}")
    return JSONResponse(
        status_code=422,
        content={"detail": " | ".join(error_details), "errors": errors},
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
                
                if user_role not in allowed_roles:
                    raise HTTPException(status_code=403, detail="You are not Authorized")
                request.state.user = payload
            except Exception as e:
                raise HTTPException(status_code=401,detail="Need to Login")
            return func(request, *args, **kwargs)
        return wrapper
    return decorator

def check_verification(func):
    @wraps(func)
    def wrapper(request:Request, *args, **kwargs):
        try:
            payload = request.state.user
            id = payload.get('sub')
            role = payload.get('role')

            rs = db.query(f'SELECT is_verified FROM {role} WHERE {role}_id = %s', params=(id, ))

            is_verified = bool(rs[0]['is_verified'])

            if not is_verified:
                raise HTTPException(status_code=401,detail="You are not verified")

        except Exception as e:
            raise HTTPException(status_code=401,detail="You are not verified")
        
        return func(request, *args, **kwargs)
    return wrapper

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
    response.set_cookie(key=f"{role}_id", value=user['user_id'], secure=False, samesite="strict", max_age=3600)
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
def register_user(request: userRegister):
    try:
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
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Internal Server error")

@app.get("/profile")
@require_roles("candidate","university","company")
def get_user_details(request:Request):
    try:
        payload = request.state.user
        role = payload.get('role')
        if not validate_role(role):
            raise HTTPException(status_code=401, detail="Invalid Role")
        
        user_id = payload.get('sub')

        user = db.query(f'SELECT * FROM {role} WHERE {role}_id = %s',params=(user_id,))

        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        userData = user[0]
        userData['role'] = role

        if role=='candidate':
            course_id = int(userData.get('course_id') or 0)
            userData['courseObj'] = get_candidate_course_detail(course_id) if course_id else {}
            branch_id = int(userData.get('branch_id') or 0)
            userData['branchObj'] = get_candidate_branch_detail(branch_id) if branch_id else {}
            userData['job_application_count'] = db.query(
                    'SELECT COUNT(*) AS c FROM job_application ja WHERE ja.candidate_id = %s AND ja.is_applied = 1',
                    params=(user_id, )
                )[0]['c']

            joined_ur_name = get_candidate_joined_university(user_id)
            if joined_ur_name:
                userData['joined_ur_name'] = joined_ur_name
            

        if role=='company':
            userData['job_application_count'] = db.query(
                'SELECT COUNT(*) AS c FROM job_application ja LEFT JOIN job_role jr ON ja.job_role_id = jr.job_role_id WHERE jr.company_id = %s',
                params=(user_id, ) 
            )[0]['c']

        if role=='university':
            userData['student_count'] = db.query(
                'SELECT COUNT(*) AS c FROM university_candidate uc WHERE uc.university_id = %s',
                params=(user_id, )
            )[0]['c']

        return userData
       
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error occured while finding profile")

@app.put("/profile")
@require_roles("candidate","university","company")
def update_profile(request:Request, data:dict): 
    if not data:
        raise HTTPException(status_code=400, detail="No Changes detected")
    if 'email' in data:
        raise HTTPException(status_code=400, detail="Email cannot be changed!")
    if 'is_verified' in data: 
        raise HTTPException(status_code=401, detail='You Are not Authorized')
    try:
        payload = request.state.user
        id = payload.get('sub')
        role = payload.get('role')

        if role == 'candidate':
            if 'ur_joining_token' in data:
                ur_name = join_ur_group(id, data['ur_joining_token'])
                data.pop('ur_joining_token')
                data['university_name'] = ur_name
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
        
        if role == 'university':
            if 'student_joning_token' in data:
                raise HTTPException(status_code=401, detail='You Are not Authorized')


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

@app.get("/vacancy/posted", response_model=list)
def get_posted_vancancies(request:Request):
    vacancy_list  = db.query("""
        SELECT jr.*, com.name as company_name 
        FROM job_role jr JOIN company com 
        ON jr.company_id = com.company_id 
        WHERE jr.is_posted = 1"""
    )
    if len(vacancy_list) == 0:
        raise HTTPException(status_code=404, detail='No Vacancies Found')
    return vacancy_list 

@app.get("/companies", response_model=list)
def get_verified_company_list():
    company_list = db.query(
        """
        SELECT
            c.avatar,c.name, c.is_verified, c.is_active, c.email, c.contact,c.city, c.state,c.about,c.address, c.job_application_count, c.company_type
        FROM company c
        WHERE c.is_verified = 1
        ORDER BY c.is_active DESC, c.job_application_count DESC, c.created_at DESC
        """
    )

    if len(company_list) == 0:
        raise HTTPException(status_code=404, detail="No verified companies found")

    return company_list

@app.post("/feedback")
def add_feedback(fbk:feedback):
    try:
        name = fbk.sender_name
        email = fbk.sender_email
        msg = fbk.msg
        rating = fbk.rating

        db.query(
            'INSERT INTO feedback(sender_name, sender_email, msg, rating) VALUES (%s, %s, %s, %s )', 
            params=(name, email, msg, rating, ), 
            commit=True
        )

        return {'msg': 'Feedback submitted Successfully'}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Can't Submit Feedback")

######################################## == Candidate == ################################################
def get_candidate_joined_university(candidate_id):
    try:
        q = """
            SELECT u.name FROM university_candidate uc 
            join university u on uc.university_id = u.university_id
            WHERE uc.candidate_id = %s
            """
        joined_university = db.query(q, params=(candidate_id, ))
        if len(joined_university) > 0:
            return joined_university[0]['name']
        else:
            return None
    except Exception as e:
        return None
    
def join_ur_group(candidate_id, token):
    try:
        ur = db.query('SELECT u.university_id AS id, u.name FROM university u WHERE u.student_joining_token = %s', params=(token, ))[0]
        q = 'INSERT INTO university_candidate(candidate_id, university_id) VALUES(%s, %s)'

        db.query(q, params=(candidate_id, ur['id'], ), commit=True)

        return ur['name']
    except Exception as e:
        raise HTTPException(status_code=400, detail="Unable to join University")

@app.delete("/candidate/joined-university")
@require_roles("candidate")
@check_verification
def unjoin_univesity(request:Request):
    try:
        candidate_id = request.state.user.get('sub')
        q = """
            DELETE FROM university_candidate uc
            WHERE uc.candidate_id = %s
            """
        db.query(q, params=(candidate_id, ), commit=True)
    except Exception as e:
        return None
    
@app.get("/courses")
@require_roles("candidate")
def get_all_courses_list(request:Request):
    try:
        result = db.getTable('course')
        for course in result:
            course['branches'] = course_branches_by_course_id(course['course_id'])
        if len(result) == 0:
            raise HTTPException(status_code=404, detail='No Courses Found')
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

def get_candidate_course_detail(course_id:int):
    try:
        candidate_course = db.query("SELECT * FROM course WHERE course_id=%s",params=(course_id,))
        if len(candidate_course) == 0:
            return {}
        courseObj = dict(candidate_course[0])

        return courseObj
    
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error Occured")
    
def get_candidate_branch_detail(branch_id:int):
    try:
        result = db.query('SELECT * FROM branch WHERE branch_id=%s',params=(branch_id, ))

        if len(result) == 0:
            return {}
        return result[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error Occured")
    
@app.get("/candidate/link")
@require_roles("candidate")
def get_candidate_links(request:Request):
    try:
        payload = request.state.user;
        candidate_id = payload.get('sub');
        url_list = db.query('SELECT link_id, link_url FROM candidate_links WHERE candidate_id = %s', params=(candidate_id, ))

        return url_list

    except Exception as e:
        raise HTTPException(status_code=400, detail='Cant Find links error')
    
@app.put("/candidate/link")
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
def delete_candidate_link(request:Request, link_id:int):
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
    
@app.post("/candidate/link")
@require_roles('candidate')
def create_candidate_link(request:Request, urlObj:dict):
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

def vacancy_check(job_role_id, candidate_id, apply=False):
    if apply:
        vacancy = db.query('SELECT is_closed, max_application_count AS max_count FROM job_role WHERE job_role_id = %s',params=(job_role_id, ))[0]
        if vacancy['is_closed'] == 1:
            raise HTTPException(status_code=400, detail='Closed Vacancies Cannot be Applied')
        
        applied_count = db.query('SELECT COUNT(*) AS c  FROM job_application WHERE job_role_id = %s AND is_applied = true',params=(job_role_id, ) )[0]['c']

        if applied_count >= vacancy['max_count']:
            raise HTTPException(status_code=400, detail="Max count reached for the role application")
        
    applied =  db.query('SELECT * FROM job_application ja WHERE ja.job_role_id = %s AND ja.candidate_id = %s AND is_applied = 1',params=(job_role_id, candidate_id, ))
    if len(applied) > 0:
        raise HTTPException(status_code=400, detail='Vacancy already Applied')
    
    selected = db.query('SELECT * FROM job_application ja WHERE ja.job_role_id = %s AND ja.candidate_id = %s',params=(job_role_id, candidate_id, ))
    if len(selected) > 0 and apply:
        db.query('UPDATE job_application ja SET ja.is_applied = 1 WHERE job_role_id = %s AND candidate_id = %s', params=(job_role_id, candidate_id, ), commit=True)
        raise HTTPException(status_code=200, detail='Appplication Filed')
    if len(selected) > 0:
        raise HTTPException(status_code=400, detail='Vacancy already selected')
    count = 10
    if apply:
        count = len(db.query(
            'SELECT * FROM job_application ja WHERE ja.candidate_id = %s AND is_applied = 1',
            params=(candidate_id, )
            ))
    else: 
        count = len(db.query(
            'SELECT * FROM job_application ja WHERE ja.candidate_id = %s AND is_applied = 0',
            params=(candidate_id, )
            ))
    print(count)
    if count >= (5 if apply else 10):
        raise HTTPException(status_code=400, detail='Apply or Selection Limit Reached')
    
    return True

@app.post('/candidate/vacancy/{job_role_id}/select')
@require_roles('candidate')
def select_vacancy(request:Request, job_role_id:int):
    payload = request.state.user
    candidate_id = payload.get('sub')
    if vacancy_check(job_role_id, candidate_id):
        db.query('INSERT INTO job_application(candidate_id, job_role_id) VALUES ( %s, %s)', params=(candidate_id, job_role_id), commit=True)
        return {'msg':'Vacancy selection Success'}

    return {'msg':'Vacancy selection Success'}

@app.post('/candidate/vacancy/{job_role_id}/apply')
@require_roles('candidate')
@check_verification
def apply_vacancy(request:Request, job_role_id:int):
    payload = request.state.user
    candidate_id = payload.get('sub')
    if vacancy_check(job_role_id, candidate_id, apply=True):
        db.query('INSERT INTO job_application(is_applied, candidate_id, job_role_id) VALUES (1, %s, %s)', params=(candidate_id, job_role_id), commit=True)
        db.query('UPDATE job_role SET application_count = application_count + 1 WHERE job_role_id = %s',params=(job_role_id, ),commit=True)
        db.query('UPDATE candidate SET job_application_count = job_application_count + 1 WHERE candidate_id = %s',params=(candidate_id, ),commit=True)
        return {'msg':'Vacancy Application Success'}

@app.get('/candidate/vacancy/selected')
@require_roles('candidate')
def get_candidate_selected_vacancies(request:Request):
    payload = request.state.user
    candidate_id = payload.get('sub')

    vacancy_list = db.query(
        '''
        SELECT jr.*, ja.is_applied, ja.application_id
        FROM job_application ja
        JOIN job_role jr ON jr.job_role_id = ja.job_role_id
        WHERE ja.candidate_id = %s AND ja.is_applied = 0
        ORDER BY ja.is_applied DESC, jr.is_closed ASC, jr.job_role_id DESC
        ''',
        params=(candidate_id, )
    )

    return  vacancy_list

@app.get('/candidate/vacancy/applied')
@require_roles('candidate')
@check_verification
def get_candidate_applied_vacancies(request:Request):
    payload = request.state.user
    candidate_id = payload.get('sub')

    vacancy_list = db.query(
        '''
        SELECT jr.*, ja.is_applied, ja.application_id
        FROM job_application ja
        JOIN job_role jr ON jr.job_role_id = ja.job_role_id
        WHERE ja.candidate_id = %s AND ja.is_applied = 1
        ORDER BY ja.is_applied DESC, jr.is_closed ASC, jr.job_role_id DESC
        ''',
        params=(candidate_id, )
    )

    return  vacancy_list

@app.delete('/candidate/vacancy/{job_role_id}')
@require_roles('candidate')    
def delete_select_vacancy(request:Request, job_role_id:int):
    payload = request.state.user
    candidate_id = payload.get('sub')

    exists = db.query('SELECT * FROM job_application ja WHERE ja.job_role_id = %s AND ja.candidate_id = %s AND is_applied = 0',params=(job_role_id, candidate_id))
    if len(exists) == 0:
        raise HTTPException(status_code=400, detail='not Authorized to operate vacancy')
    
    db.query('DELETE FROM job_application WHERE job_role_id = %s AND candidate_id = %s AND is_applied = 0', params=(job_role_id, candidate_id), commit=True)
    
    return {'msg': 'Selected Vacancy Successfully Removed'}


################################### == Company == ###################################

def company_type_by_id(id):
    q = "SELECT * FROM company_type WHERE id = %s"
    result = db.query(q, params=(id, ))
    if result:
        return result[0]
    else:
        return {}
    
def validate_hr_payload(hr_obj):
    if hr_obj.contact is not None:
        if not hr_obj.contact.isdigit():
            raise HTTPException(status_code=400, detail="Contact must contain exactly 10 digits")

    if hr_obj.linkedin_url is not None and hr_obj.linkedin_url.strip() == "":
        raise HTTPException(status_code=400, detail="LinkedIn URL cannot be empty")

    if hr_obj.department is not None and hr_obj.department.strip() == "":
        raise HTTPException(status_code=400, detail="Department cannot be empty")

def ensure_company_can_manage_hr(company_id):
    company = db.query(
        "SELECT company_id FROM company WHERE company_id = %s",
        params=(company_id,),
    )
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company[0]

def get_hr_for_company_or_404(hr_id, company_id):
    result = db.query(
        "SELECT * FROM hr WHERE id = %s AND company_id = %s",
        params=(hr_id, company_id),
    )
    if not result:
        raise HTTPException(status_code=404, detail="HR not found")
    return result[0]

@app.get("/company/hr", response_model=list)
@require_roles("company")
@check_verification
def get_company_hrs(request: Request):
    try:
        payload = request.state.user
        company_id = payload.get("sub")
        return db.query(
            "SELECT * FROM hr WHERE company_id = %s ORDER BY is_primary DESC, id DESC",
            params=(company_id,)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching HR records: {str(e)}")


@app.post("/company/hr")
@require_roles("company")
@check_verification
def create_company_hr(request: Request, hr_obj: HrCreate):
    try:
        payload = request.state.user
        company_id = payload.get("sub")
        company = ensure_company_can_manage_hr(company_id)
        validate_hr_payload(hr_obj)

        existing_count = db.query(
            "SELECT COUNT(*) AS total FROM hr WHERE company_id = %s",
            params=(company_id,),
        )[0]["total"]
        total_limit = 3
        if existing_count >= total_limit:
            raise HTTPException(status_code=400, detail=f"Maximum HR limit reached ({total_limit})")

        if hr_obj.is_primary:
            db.query(
                "UPDATE hr SET is_primary = 0 WHERE company_id = %s",
                params=(company_id,),
                commit=True,
            )

        db.query(
            """
            INSERT INTO hr (name, email, contact, designation, department, linkedin_url, is_primary, company_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            params=(
                hr_obj.name.strip(),
                hr_obj.email,
                hr_obj.contact.strip(),
                hr_obj.designation.strip(),
                hr_obj.department.strip() if hr_obj.department else None,
                hr_obj.linkedin_url.strip() if hr_obj.linkedin_url else None,
                hr_obj.is_primary,
                company_id,
            ),
            commit=True,
        )
        return {"message": "HR created successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating HR: {str(e)}")


@app.put("/company/hr/{hr_id}")
@require_roles("company")
@check_verification
def update_company_hr(request: Request, hr_id: int, hr_obj: HrUpdate):
    try:
        payload = request.state.user
        company_id = payload.get("sub")
        get_hr_for_company_or_404(hr_id, company_id)
        validate_hr_payload(hr_obj)

        update_fields = {}
        if hr_obj.name is not None:
            update_fields["name"] = hr_obj.name.strip()
        if hr_obj.email is not None:
            update_fields["email"] = hr_obj.email
        if hr_obj.contact is not None:
            update_fields["contact"] = hr_obj.contact.strip()
        if hr_obj.designation is not None:
            update_fields["designation"] = hr_obj.designation.strip()
        if hr_obj.department is not None:
            update_fields["department"] = hr_obj.department.strip() or None
        if hr_obj.linkedin_url is not None:
            update_fields["linkedin_url"] = hr_obj.linkedin_url.strip() or None
        if hr_obj.is_primary is not None:
            update_fields["is_primary"] = hr_obj.is_primary

        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")

        if hr_obj.is_primary:
            db.query(
                "UPDATE hr SET is_primary = 0 WHERE company_id = %s",
                params=(company_id,),
                commit=True,
            )

        set_clause = ", ".join([f"{field} = %s" for field in update_fields.keys()])
        params = list(update_fields.values()) + [hr_id, company_id]
        db.query(
            f"UPDATE hr SET {set_clause} WHERE id = %s AND company_id = %s",
            params=tuple(params),
            commit=True,
        )
        return {"message": "HR updated successfully", "id": hr_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating HR: {str(e)}")


@app.delete("/company/hr/{hr_id}")
@require_roles("company")
@check_verification
def delete_company_hr(request: Request, hr_id: int):
    try:
        payload = request.state.user
        company_id = payload.get("sub")
        get_hr_for_company_or_404(hr_id, company_id)
        db.query(
            "DELETE FROM hr WHERE id = %s AND company_id = %s",
            params=(hr_id, company_id),
            commit=True,
        )
        return {"message": "HR deleted successfully", "id": hr_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting HR: {str(e)}")
    
@app.get('/company/vacancy', response_model=list)
@require_roles('company')
@check_verification
def get_vacancys_of_company(request:Request):
    try:
        payload = request.state.user
        company_id = payload.get('sub')
        
        q = 'SELECT * FROM job_role WHERE company_id = %s ORDER BY is_posted DESC, is_closed DESC'
        vacancy_list = db.query(q, params=(company_id, ))

        if not vacancy_list:
            vacancy_list = []

        return vacancy_list
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching vacancies: {str(e)}")

@app.post('/company/vacancy')
@require_roles('company')
@check_verification
def create_vacancy(request:Request, vacancyObj:JobRoleCreate):
    try:
        payload = request.state.user
        company_id = payload.get('sub')
        company_email = payload.get('email')
        
        company_check = db.query(
            "SELECT company_id, is_active, is_verified FROM company WHERE company_id = %s",
            params=(company_id,)
        )
        
        if not company_check:
            raise HTTPException(status_code=404, detail="Company not found")
        
        company = company_check[0]
        
        if not company['is_active']:
            raise HTTPException(status_code=403, detail="Company account is not active")
        
        if not company['is_verified']:
            raise HTTPException(status_code=403, detail="Company account is not verified")
       
        if vacancyObj.salary <= 0:
            raise HTTPException(status_code=400, detail="Salary must be greater than 0")
        
        if vacancyObj.vacancy_count > vacancyObj.max_application_count:
            raise HTTPException(
                status_code=400, 
                detail="Vacancy count cannot exceed max application count"
            )
        
        if vacancyObj.vacancy_count <= 0:
            raise HTTPException(status_code=400, detail="Vacancy count must be greater than 0")
        
        if vacancyObj.max_application_count <= 0:
            raise HTTPException(status_code=400, detail="Max application count must be greater than 0")

        if len(vacancyObj.job_role_title) > 30:
            raise HTTPException(status_code=400, detail="Job title cannot exceed 30 characters")
        
        if not vacancyObj.job_location.strip():
            raise HTTPException(status_code=400, detail="Job location cannot be empty")
        
        if not vacancyObj.job_role_description.strip():
            raise HTTPException(status_code=400, detail="Job description cannot be empty")
        
        if not vacancyObj.eligibility.strip():
            raise HTTPException(status_code=400, detail="Eligibility criteria cannot be empty")
        
        if not vacancyObj.selection_flow.strip():
            raise HTTPException(status_code=400, detail="Selection process cannot be empty")

        insert_fields = {
            'job_role_title': vacancyObj.job_role_title,
            'job_role_description': vacancyObj.job_role_description,
            'job_type': vacancyObj.job_type.value,  
            'job_location': vacancyObj.job_location,
            'salary': vacancyObj.salary,
            'vacancy_count': vacancyObj.vacancy_count,
            'max_application_count': vacancyObj.max_application_count,
            'eligibility': vacancyObj.eligibility,
            'selection_flow': vacancyObj.selection_flow,
            'company_id': company_id,
        }
        
        columns = ", ".join(insert_fields.keys())
        placeholders = ", ".join(["%s"] * len(insert_fields))
        insert_query = f"INSERT INTO job_role ({columns}) VALUES ({placeholders})"
        
        params = tuple(insert_fields.values())
        
        db.query(insert_query, params=params, commit=True)
        
        return {
            "message": "Vacancy created successfully",
            "company_id": company_id,
            "job_role_title": vacancyObj.job_role_title
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating vacancy: {str(e)}")
    
def vacancy_vadidate(job_role_id, company_id, is_closed=None):
    vacancy_check = db.query(
        "SELECT company_id, is_posted FROM job_role WHERE job_role_id = %s",
        params=(job_role_id,)
    )
    
    if not vacancy_check:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    
    vacancy = vacancy_check[0]
    if vacancy['company_id'] != int(company_id):
        raise HTTPException(status_code=403, detail="You are not authorized to operate this this vacancy")
        
    if vacancy['is_posted'] == True and is_closed is None: # ensures only  is_closed can be updated
        raise HTTPException(status_code=403, detail="Vacancy is public can't be Changed or deleted, please close")
    
    return True


@app.put('/company/vacancy/{job_role_id}')
@require_roles('company')
@check_verification
def update_vacancy(request: Request, job_role_id: int, vacancyObj: JobRoleUpdate):
    try:
        payload = request.state.user
        company_id = payload.get('sub')
        
        
        if not vacancy_vadidate(job_role_id,company_id,vacancyObj.is_closed ):
            raise HTTPException
    
        update_fields = {}
        if vacancyObj.job_role_title is not None:
            if len(vacancyObj.job_role_title) > 60:
                raise HTTPException(status_code=400, detail="Job title cannot exceed 30 characters")
            update_fields['job_role_title'] = vacancyObj.job_role_title
        
        if vacancyObj.job_role_description is not None:
            if not vacancyObj.job_role_description.strip():
                raise HTTPException(status_code=400, detail="Job description cannot be empty")
            update_fields['job_role_description'] = vacancyObj.job_role_description
        
        if vacancyObj.job_type is not None:
            update_fields['job_type'] = vacancyObj.job_type.value
        
        if vacancyObj.job_location is not None:
            if not vacancyObj.job_location.strip():
                raise HTTPException(status_code=400, detail="Job location cannot be empty")
            update_fields['job_location'] = vacancyObj.job_location
        
        if vacancyObj.salary is not None:
            if vacancyObj.salary <= 0:
                raise HTTPException(status_code=400, detail="Salary must be greater than 0")
            update_fields['salary'] = vacancyObj.salary
        
        if vacancyObj.vacancy_count is not None:
            if vacancyObj.vacancy_count <= 0:
                raise HTTPException(status_code=400, detail="Vacancy count must be greater than 0")
            update_fields['vacancy_count'] = vacancyObj.vacancy_count
        
        if vacancyObj.max_application_count is not None:
            if vacancyObj.max_application_count <= 0:
                raise HTTPException(status_code=400, detail="Max application count must be greater than 0")
            update_fields['max_application_count'] = vacancyObj.max_application_count
        
        if vacancyObj.eligibility is not None:
            if not vacancyObj.eligibility.strip():
                raise HTTPException(status_code=400, detail="Eligibility criteria cannot be empty")
            update_fields['eligibility'] = vacancyObj.eligibility
        
        if vacancyObj.selection_flow is not None:
            if not vacancyObj.selection_flow.strip():
                raise HTTPException(status_code=400, detail="Selection process cannot be empty")
            update_fields['selection_flow'] = vacancyObj.selection_flow
        
        if vacancyObj.is_closed is not None:
            update_fields['is_closed'] = vacancyObj.is_closed
        
        if vacancyObj.date_of_interview is not None:
            update_fields['date_of_interview'] = vacancyObj.date_of_interview
        
        if vacancyObj.alloted_time is not None:
            update_fields['alloted_time'] = vacancyObj.alloted_time
        
        if vacancyObj.alloted_location is not None:
            update_fields['alloted_location'] = vacancyObj.alloted_location
        
        if vacancyObj.is_posted is not None and vacancyObj.is_posted != False:
            update_fields['is_posted'] = vacancyObj.is_posted
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        if 'vacancy_count' in update_fields and 'max_application_count' in update_fields:
            if update_fields['vacancy_count'] > update_fields['max_application_count']:
                raise HTTPException(
                    status_code=400,
                    detail="Vacancy count cannot exceed max application count"
                )
        
        # Build and execute update query
        set_clause = ", ".join([f"{k} = %s" for k in update_fields.keys()])
        update_query = f"UPDATE job_role SET {set_clause} WHERE job_role_id = %s"
        
        params = list(update_fields.values()) + [job_role_id]
        db.query(update_query, params=tuple(params), commit=True)
        
        return {
            "message": "Vacancy updated successfully",
            "job_role_id": job_role_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating vacancy: {str(e)}")


@app.delete('/company/vacancy/{job_role_id}')
@require_roles('company')
@check_verification
def delete_vacancy(request: Request, job_role_id: int):
    try:
        payload = request.state.user
        company_id = payload.get('sub')
        
        if not vacancy_vadidate(job_role_id,company_id):
            raise HTTPException
        
        delete_query = "DELETE FROM job_role WHERE job_role_id = %s AND company_id = %s"
        db.query(delete_query, params=(job_role_id, company_id), commit=True)
        
        return {
            "message": "Vacancy deleted successfully",
            "job_role_id": job_role_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting vacancy: {str(e)}")
    
    
@app.get('/company/job/applications')
@require_roles('company')
@check_verification
def get_company_job_applications(request:Request):
    try:
        payload = request.state.user
        company_id = payload.get('sub')

        applications = db.query(
            '''
            SELECT
                jr.*,
                ja.application_id,
                ja.candidate_id AS applicant_id,
                ja.is_applied,
                c.name AS candidate_name,
                c.university_name,
                crs.course_title,
                br.branch_title
            FROM job_role jr
            LEFT JOIN job_application ja
                ON ja.job_role_id = jr.job_role_id
                AND ja.is_applied = 1
            LEFT JOIN candidate c
                ON c.candidate_id = ja.candidate_id
            LEFT JOIN course crs
                ON crs.course_id = c.course_id
            LEFT JOIN branch br
                ON br.branch_id = c.branch_id
            WHERE jr.company_id = %s
            ORDER BY jr.is_closed ASC, jr.job_role_id DESC, ja.application_id DESC
            ''',
            params=(company_id, )
        )

        return applications or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching company applications: {str(e)}")


########################################### == University ############################

def create_random_token(length=16):
    all_chars = string.ascii_uppercase + string.digits+string.ascii_lowercase
    token = ''.join(random.choice(all_chars) for _ in range(length))
    return token

@app.get('/university/student-token')
@require_roles('university')
@check_verification
def create_token(request: Request):
    payload = request.state.user
    university_id = payload.get('sub')

    is_verified = db.query(
        'SELECT is_verified FROM university WHERE university_id = %s',
        params=(university_id, )
    )[0]['is_verified']
    
    if not bool(is_verified):
        raise HTTPException(status_code=401, detail='Not verified')
    token = create_random_token()
    db.query(
        'UPDATE university SET student_joining_token = %s WHERE university_id = %s',
        params=(token, university_id, ),
        commit=True
    )
    
    return {"msg": 'Token updated', "student_joining_token": token}

@app.get('/university/candidates')
@require_roles('university')
@check_verification
def get_univesity_candidates(request:Request):
    payload = request.state.user
    university_id = payload.get('sub')

    q = """
        SELECT
            c.candidate_id,
            c.name,
            c.date_of_birth,
            c.email,
            c.contact,
            c.is_active,
            c.city,
            c.state,
            crs.course_title,
            br.branch_title
        FROM university_candidate uc 
        join candidate c ON uc.candidate_id = c.candidate_id 
        join course crs ON c.course_id = crs.course_id
        join branch br ON br.branch_id = c.branch_id
        WHERE uc.university_id = %s;
        """
    university_candidate = db.query(q, params=(university_id, ))
    
    if not university_candidate:
        return []

    return university_candidate

@app.delete('/university/candidates/{candidate_id}')
@require_roles('university')
@check_verification
def delete_univesity_candidates(request:Request, candidate_id:int):
    payload = request.state.user
    university_id = payload.get('sub')

    membership = db.query(
        """
        SELECT candidate_id
        FROM university_candidate
        WHERE university_id = %s AND candidate_id = %s
        """,
        params=(university_id, candidate_id)
    )

    if not membership:
        raise HTTPException(status_code=404, detail="Candidate not found in your university group")

    db.query(
        """
        DELETE FROM university_candidate
        WHERE university_id = %s AND candidate_id = %s
        """,
        params=(university_id, candidate_id),
        commit=True
    )

    return {"message": "Candidate removed successfully", "candidate_id": candidate_id}

if __name__ == "__main__":
    uvicorn.run(app="main:app",host=host,port=port, reload=True)
 
