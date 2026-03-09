import mysql.connector

class Db:
    def __init__(self,database:str, host='localhost',user="root", password= "1qaz,xds"):
        """
        Parameters:
            database: None | str
            host = "localhost" | str
            user = "root" | str
            password = "1qaz,xds" | str
        """
        
        self.__host = host
        self.__user = user
        self.__password = password
        self.__database = database 
        
    
    def __get_cursor(self):
        db = mysql.connector.connect(host = self.__host, user = self.__user, password = self.__password, database = self.__database if self.__database != None else self.__database)
        
        return db.cursor()
    
    def query(self, Q:str):
        c = self.__get_cursor()
        c.execute(Q)
        ls = []
        for r in c:
            ls.append(r)
            
        return ls