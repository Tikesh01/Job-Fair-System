from pydantic import BaseModel, EmailStr

class otpRequest(BaseModel):
    email: EmailStr
    role: str

class otpVerify(BaseModel):
    email: EmailStr
    otp: str

class UserRegister(BaseModel):
    email: EmailStr
    otp:str
    role: str
    password: str
    cnfm_password: str