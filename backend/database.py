from mysql.connector import pooling

class Db:
    def __init__(self, host='localhost',user="root", password= "1qaz,xds", database:str=None):
        """
        Parameters:
            database: None | str
            host = "localhost" | str
            user = "root" | str
            password = "1qaz,xds" | str
        """
        self.__pool= pooling.MySQLConnectionPool(pool_name="mypool",pool_size=5,host=host, user=user, password=password, database=database)


    def query(self, Q:str)->list|None:
        conn = self.__pool.get_connection()
        cursor = conn.cursor()
        cursor.execute(Q)
        ls = cursor.fetchall()
        conn.close()
        cursor.close()

        if ls:
            return ls
        
