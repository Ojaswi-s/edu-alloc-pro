from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict

class Vacancies(BaseModel):
    PHY: int
    CHM: int
    MAT: int
    ENG: Optional[int] = 0
    HIN: Optional[int] = 0

class School(BaseModel):
    id: str
    udise: str
    name: str
    block: str
    village: str
    di: float
    level: str
    dvs: float
    vacancies: Vacancies
    totalVacancies: int
    rteViolation: bool
    pupils: int
    teachers: int
    ptr: int
    lat: float
    lng: float
    lastUpdated: str
    medium: str

class Teacher(BaseModel):
    id: str
    name: str
    subject: str
    experience: int
    currentPosting: str
    distance: float
    matchScore: float
    retentionScore: float
    languages: List[str]

class User(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    schoolId: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserSignup(BaseModel):
    email: str
    password: str
    role: str
