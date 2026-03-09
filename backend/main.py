from fastapi import FastAPI
from database import Db

app = FastAPI(debug=True, title="Job-Fair-System")

"""
get() - reading/Fetching from server
post() - to add something 
put() - To update the perticural data
delete() - to delete the data
"""

@app.get("/")
def home():
   
    return "hoioo"

# @app.post("/sdf")
# @app.put()
# @app.delete()