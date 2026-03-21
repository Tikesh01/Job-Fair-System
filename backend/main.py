from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from database import Db

app = FastAPI(title="Job-Fair-System",debug=True)
app.add_middleware(CORSMiddleware,allow_origins=["http://localhost:5173"],allow_methods=["*"])

@app.get("/")
def home():
    return "Sdfa"

if __name__ == "__main__":
    uvicorn.run(app="main:app",host='localhost', reload=True)