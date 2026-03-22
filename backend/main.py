from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from database import Db
from models import otpRequest, otpVerify, UserRegister
import random
import string
import re
from datetime import datetime, timedelta

app = FastAPI(title="Job-Fair-System",debug=True)
app.add_middleware(CORSMiddleware,allow_origins=["http://localhost:5173"],allow_methods=["*"])

db = Db(database="job_fair_sys")



def validate_email(email: str) -> bool:
    email_re = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
    if not email or len(email) > 254:
        return False
    return bool(email_re.fullmatch(email))

def validate_role(role:str) -> bool:
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

    if not role or not validate_email(email) or not verify_email_otp(email,otp):
        raise HTTPException(status_code=400, detail="Wrong Email, Role or OTP")
    
    if password != cnfm_password:
        raise HTTPException(status_code=400, detail="Passwords dont match")
    
    if isDuplicateUser(email) == True:
        raise HTTPException(status_code=429, detail="Email Already Exists")

    if not isStrongPass(password):
        raise HTTPException(status_code=400, detail="Password should be Stronger")
    
    q = "INSERT INTO "+role+"(email, password) VALUES(%s, %s)"

    db.query(Q=q,params=(email,password, ), commit=True)
    return {"message": "You are registered successfully"}

if __name__ == "__main__":
    uvicorn.run(app="main:app",host='localhost', reload=True)