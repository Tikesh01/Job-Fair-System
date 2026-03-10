from fastapi import FastAPI
from database import Db
import uvicorn
from frontend_config import Frontend

app = FastAPI(debug=1,title="Job-Fair-System")
frontend = Frontend(app)
app.add_middleware(Frontend)

db = Db(database='company')


"""
get() - reading/Fetching from server
post() - to add something 
put() - To update the perticural data
delete() - to delete the data
"""

@app.get("/")
def home():
    ls = db.query('Select * from employees;')
    return ls

if __name__ == "__main__":
    uvicorn.run('main:app', host='localhost', port=8000,reload=True)