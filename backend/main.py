from fastapi import FastAPI
from database import Db
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from models import signUpRequest,completeSignup

app = FastAPI(debug=1,title="Job-Fair-System")
app.add_middleware(CORSMiddleware,allow_methods=["*"],allow_origins=["http://localhost:5173"])

db = Db(database='job_fair_sys')


"""
    get() - reading/Fetching from server
    post() - to add something 
    put() - To update the perticular data
    delete() - to delete the data
"""

@app.post("/signup")
def signup(data: signUpRequest):
    """First-step for signup: only signup details.

    candidate -> partial info (or guide to profile completion)
    university/company -> complete signup immediately.
    """
    user = data.model_dump()
    print('signup1:', user)

    match user["role"]:
        case "candidate":
            # otp send logic .......
            return {'status': "ok", 'msg': "Signup step 1 complete. Please complete basic profile."}
        case "university":
            return {'status': 'ok', 'msg': 'University account created.'}
        case "company":
            return {'status': 'ok', 'msg': 'Company account created.'}

    return {'status': 'error', 'msg': 'Invalid role'}

@app.post("/signup/complete")
def signup_complete(data: completeSignup):
    user = data.model_dump()
    print('signup complete:', user)

    match user['role']:
        case 'candidate':
            db.query(
                "INSERT INTO candidate (email, password, name, contact, university_name) VALUES (%s, %s, %s, %s, %s)",
                params=(
                    user['email'],
                    user['password'],
                    user['name'],
                    user['contact'],
                    user['university_name'],
                ),
                commit=True,
            )
            return {'status': 'ok', 'msg': 'Candidate signup complete.'}
        case 'university':
            
            return {'status': 'ok', 'msg': 'University profile complete.'}
        case 'company':
            
            return {'status': 'ok', 'msg': 'Company profile complete.'}

    return {'status': 'error', 'msg': 'Invalid role in completion path.'}


@app.post("/signup/university/{token}")
def signup_by_university_link(token:str,data):
    ls = []

if __name__ == "__main__":
    uvicorn.run('main:app', host='localhost', port=8000,reload=True)