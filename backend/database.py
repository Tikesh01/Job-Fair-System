from mysql.connector import pooling, Error

class Db:
    def __init__(self, host:str,port:int, user:str, password:str, database: str):
        """
        Parameters:
            database: None | str
            host = "localhost" | str
            user = "root" | str
            password = "1qaz,xds" | str
        """
        self.__pool = pooling.MySQLConnectionPool(
            pool_name='mypool',
            pool_size=5,
            host=host,
            user=user,
            password=password,
            database=database,
        )
    
    def query(self, Q: str, params: tuple | dict | None = None, commit: bool = False) -> list:
        """Execute a parameterized query safely.

        - Use `params` for values to avoid SQL injection.
        - `commit=True` for INSERT/UPDATE/DELETE statements.
        - Returns list (possibly empty) for SELECT.
        """
        conn = None
        cursor = None

        try:
            conn = self.__pool.get_connection()
            cursor = conn.cursor(dictionary=True)

            cursor.execute(Q, params)

            if commit:
                conn.commit()

            if cursor.description:
                return cursor.fetchall() or []

            return []

        except Error as e:
            if conn is not None:
                conn.rollback()
            raise

        finally:
            if cursor is not None:
                cursor.close()
            if conn is not None:
                conn.close()

    def getTable(self, table:str,columns:tuple=(), where:str='', limit:int=None):
        s = ','.join(columns)
        if len(columns) == 0:
            s = '*'

        q = f'SELECT {s} FROM {table}'

        if where:
            q+= " WHERE "+where
        if limit:
            q += f' LIMIT {limit}'  

        q += ';'
        return self.query(q)

        
