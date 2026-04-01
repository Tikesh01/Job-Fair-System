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
app.add_middleware(CORSMiddleware,allow_origins=[frontend_origin],allow_methods=["*"], allow_credentials=allow_credentials)

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
    result = db.query("SELECT id FROM otp WHERE email = %s", params=(email, ))
    return bool(len(result) < 5)

def verify_email_otp(email:str, otp:str):
    result = db.query("SELECT id,created_at FROM otp WHERE email = %s AND otp = %s ORDER BY id DESC", (email, otp, ))
    if not result:
        return False
    user = result[0]
    current_time = datetime.now()
    if current_time>=user['created_at'] +timedelta(minutes=10):
        return False
    return True

def check_user_exist(role, email, pw):
    q = f"SELECT {role}_id as user_id, email FROM {role} WHERE email=%s AND password=%s"
    result = db.query(q, params=(email,pw,))
    return result[0] if result else None

def create_access_token(payload: dict, expiry_minutes: timedelta ):
    to_encode = payload.copy()
    expire = datetime.now() + expiry_minutes
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=algorithm)
    return encoded_jwt

def require_roles(*allowed_roles):
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            try:
                token = request.cookies.get("token")
                if not token:
                    raise HTTPException(status_code=401, detail="Invalid or missing token")

                try:
                    payload = jwt.decode(token, secret_key, algorithms=[algorithm])
                except jwt.ExpiredSignatureError:
                    raise HTTPException(status_code=401, detail="Token expired")
                except jwt.InvalidTokenError:
                    raise HTTPException(status_code=401, detail="Invalid token")

                user_role = payload.get("role")
                if user_role not in allowed_roles:
                    raise HTTPException(status_code=403, detail="You are not Authorized")
                request.state.user = payload
            except Exception as e:
                raise HTTPException(status_code=401,detail="Need to Login")
            return func(request, *args, **kwargs)
        return wrapper
    return decorator


@app.post("/login")
def login(request:loginRequest):
    role = request.role
    email = request.email 
    pw = request.password
    
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
            db.query("INSERT INTO otp (email, otp) VALUES (%s, %s)", (email, otp,), commit=True)
            # send email 
            print(f"OTP for {request.email}: {otp}")  # For testing
            return {"message": "OTP sent successfully"}
        else:
            HTTPException(status_code=409, detail="Limit Accided")
    else:
        raise HTTPException(status_code=400, detail="Wrong Email or Role!")

@app.post("/verify/otp")
def verify_otp(request: otpVerify):
    email = request.email
    otp = request.otp
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
    companies = db.getTable('company')
    print(companies)
    return companies

if __name__ == "__main__":
    uvicorn.run(app="main:app",host=host,port=port, reload=True)