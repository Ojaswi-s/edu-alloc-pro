# EduAlloc Pro - FastAPI Backend

This is the backend server for the EduAlloc Pro application, providing real authentication, data persistence, and API endpoints for schools and teachers.

## Local Development

### 1. Requirements
- Python 3.9+
- pip

### 2. Setup
Navigate to the `backend` directory and install dependencies:
```bash
pip install -r requirements.txt
```

### 3. Run Locally
```bash
uvicorn main:app --reload
```
The server will start at `http://localhost:8000`. 
- **Swagger Documentation**: View the interactive API documentation at `http://localhost:8000/docs`

## Deployment to Render

1. **GitHub**: Push this repository to your GitHub.
2. **Render Dashboard**:
   - Create a new **Web Service**.
   - Connect your repository.
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
3. **Environment Variables**:
   - Add `SECRET_KEY` (any random string).
   
## Frontend Integration

Once deployed, update your **Vercel** environment variables:
- `VITE_API_BASE_URL`: Your Render Web Service URL (e.g., `https://edu-alloc-api.onrender.com`)
