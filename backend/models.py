from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date, time
from enum import Enum

class otpRequest(BaseModel):
    email: EmailStr
    role: str

class otpVerify(BaseModel):
    email: EmailStr
    otp: str

class userRegister(BaseModel):
    email: EmailStr
    otp:str
    role: str
    password: str
    cnfm_password: str

class loginRequest(BaseModel):
    role:str
    email:EmailStr
    password: str

class feedback(BaseModel):
    sender_name:str
    sender_email:EmailStr
    msg:str
    rating:int

class JobTypeEnum(str, Enum):
    INTERNSHIP = "Internship"
    FULL_TIME = "Full time"
    PART_TIME = "Part time"


class JobRoleCreate(BaseModel):
    job_role_title: str = Field(..., min_length=1, max_length=30)
    job_role_description: str = Field(..., min_length=1)
    job_type: JobTypeEnum
    job_location: str = Field(..., min_length=1)
    salary: float = Field(..., gt=0)
    vacancy_count: int = Field(..., gt=0)
    max_application_count: int = Field(..., gt=0)
    eligibility: str = Field(..., min_length=1)
    selection_flow: str = Field(..., min_length=1)
 

class JobRoleUpdate(BaseModel):
    job_role_title: Optional[str] = Field(None, min_length=1, max_length=30)
    job_role_description: Optional[str] = Field(None, min_length=1)
    job_type: Optional[JobTypeEnum] = None
    job_location: Optional[str] = Field(None, min_length=1)
    salary: Optional[float] = Field(None, gt=0)
    vacancy_count: Optional[int] = Field(None, gt=0)
    max_application_count: Optional[int] = Field(None, gt=0)
    eligibility: Optional[str] = Field(None, min_length=1)
    selection_flow: Optional[str] = Field(None, min_length=1)
    is_closed: Optional[bool] = None
    date_of_interview: Optional[date] = None
    alloted_time: Optional[time] = None
    alloted_location: Optional[str] = Field(None, max_length=20)
    is_posted: Optional[bool] = None



class JobRoleResponse(BaseModel):
    job_role_id: int
    job_role_title: str
    job_role_description: str
    job_type: JobTypeEnum
    job_location: str
    salary: float
    vacancy_count: int
    application_count: Optional[int]
    max_application_count: int
    eligibility: str
    selection_flow: str
    is_closed: bool
    date_of_interview: Optional[date]
    alloted_time: Optional[time]
    alloted_location: Optional[str]
    is_posted: bool
    company_id: int


class HrCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=30)
    email: EmailStr
    contact: str = Field(..., min_length=10, max_length=10)
    designation: str = Field(..., min_length=1, max_length=40)
    department: Optional[str] = Field(None, max_length=40)
    linkedin_url: Optional[str] = Field(None, max_length=255)
    is_primary: Optional[bool] = False


class HrUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=30)
    email: Optional[EmailStr] = None
    contact: Optional[str] = Field(None, min_length=10, max_length=10)
    designation: Optional[str] = Field(None, min_length=1, max_length=40)
    department: Optional[str] = Field(None, max_length=40)
    linkedin_url: Optional[str] = Field(None, max_length=255)
    is_primary: Optional[bool] = None


