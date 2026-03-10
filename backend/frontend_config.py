from fastapi.middleware.cors import CORSMiddleware

"""
Cross Origin Resource Sharing - CORS
USed when we share data accross the different sever which has diifferent ip, port . 
Used Specially when we Share data between react adnd Fastapi
"""

class Frontend(CORSMiddleware):
    def __init__(self,app,origins:tuple[str]=["localhost:5173"], methods:tuple[str]=["*"],headers:tuple[str]=["*"]):
        self.app = app
        self.allow_origins = origins
        self.allow_methods = methods
        self.allow_headers = headers