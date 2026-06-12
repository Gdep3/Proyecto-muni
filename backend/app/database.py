from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
#from .env import DATABASE_URL

load_dotenv()

DATABASE_URL = "mysql+pymysql://ua60odoilfci2cag:MdPHTMmaMMxrKx3xkPAs@b9jd9bdq4cuuekljrvxe-mysql.services.clever-cloud.com:3306/b9jd9bdq4cuuekljrvxe"

engine = create_engine(DATABASE_URL, pool_size=2, max_overflow=2, pool_recycle=3600)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependencia para obtener la sesión de BD en cada request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()