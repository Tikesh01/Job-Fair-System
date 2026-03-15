from pydantic import BaseModel, EmailStr

class signUpRequest(BaseModel):
    email: EmailStr #naming thise fields must be same to the fields from frotend
    password: str   
    role: str

class completeSignup(signUpRequest, BaseModel):
    name: str
    contact: str
    university_name: str