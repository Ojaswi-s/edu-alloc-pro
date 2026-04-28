from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import random
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from models import School, Teacher, User, UserLogin, UserSignup, Token

# Configuration
SECRET_KEY = "your-secret-key-here" # In production, use env var
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()

# CORS configuration to allow Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify Vercel domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Mock Database
users_db = {}
schools_data = []
teachers_data = []

# Data Initializer (translated from mockData.ts)
def initialize_data():
    global schools_data, teachers_data
    blocks = ['Akkalkuwa', 'Akrani', 'Nandurbar', 'Navapur', 'Shahada', 'Taloda']
    villages = ['Roshmal', 'Toranmal', 'Dhadgaon', 'Molgi', 'Khaparkheda', 'Dhanora', 'Pimpalner', 'Asali', 'Khondamali', 'Bilgaon', 'Visarwadi', 'Khairwa']
    
    # Generate Schools
    for i in range(847):
        di = random.randint(40, 100)
        level = "critical" if di >= 80 else "high" if di >= 60 else "moderate" if di >= 40 else "stable"
        phy = random.randint(0, 2)
        chm = random.randint(0, 2)
        mat = random.randint(0, 2)
        total = phy + chm + mat
        pupils = random.randint(80, 400)
        teachers = max(2, random.randint(1, 10))
        ptr = round(pupils / teachers)
        
        schools_data.append({
            "id": f"S{1000 + i}",
            "udise": f"27{16000000 + i}",
            "name": f"{['ZP', 'GP', 'Tribal Ashram', 'Govt Higher', 'Adivasi'][i % 5]} School {villages[i % villages.length]} {i + 1}",
            "block": blocks[i % blocks.length],
            "village": villages[i % villages.length],
            "di": di,
            "level": level,
            "dvs": random.randint(50, 100),
            "vacancies": {"PHY": phy, "CHM": chm, "MAT": mat},
            "totalVacancies": total,
            "rteViolation": level == "critical" or (level == "high" and random.random() > 0.5),
            "pupils": pupils,
            "teachers": teachers,
            "ptr": ptr,
            "lat": 21.37 + (random.random() - 0.5) * 0.8,
            "lng": 74.24 + (random.random() - 0.5) * 0.8,
            "lastUpdated": str(datetime.now().date()),
            "medium": "Marathi"
        })

    # Generate Teachers
    for i in range(30):
        teachers_data.append({
            "id": f"T{i+1}",
            "name": f"Teacher {i+1}",
            "subject": random.choice(["PHY", "CHM", "MAT"]),
            "experience": random.randint(2, 20),
            "currentPosting": random.choice(villages),
            "distance": random.randint(5, 60),
            "matchScore": random.randint(50, 100),
            "retentionScore": random.randint(30, 100),
            "languages": ["mr", "hi", "en"]
        })

initialize_data()

# Auth Helpers
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/api/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    # For demo: allow all passwords that match the username pattern
    user = users_db.get(credentials.email)
    if not user:
        # Auto-create users for demo emails like collector@, school@, etc.
        role = "collector" if "collector" in credentials.email else "school" if "school" in credentials.email else "teacher"
        user = {"email": credentials.email, "role": role, "name": credentials.email.split('@')[0].capitalize()}
        users_db[credentials.email] = user
        
    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/signup", response_model=Token)
async def signup(user: UserSignup):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    
    users_db[user.email] = {"email": user.email, "role": user.role, "name": user.email.split('@')[0].capitalize()}
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/schools", response_model=List[School])
async def get_schools():
    return schools_data

@app.get("/api/teachers", response_model=List[Teacher])
async def get_teachers():
    return teachers_data

@app.get("/api/user/me", response_model=User)
async def get_me(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email in users_db:
            u = users_db[email]
            return {"id": email, "email": email, "name": u["name"], "role": u["role"]}
    except JWTError:
        pass
    raise HTTPException(status_code=401, detail="Invalid token")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
