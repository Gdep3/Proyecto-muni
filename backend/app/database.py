from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DB_HOST     = os.getenv("DB_HOST")
DB_USER     = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME     = os.getenv("DB_NAME")
DB_PORT     = os.getenv("DB_PORT", "3306")

#DATABASE_URL = "mysql+pymysql://admin:admin123@mysql:3306/proyecto"
#DATABASE_URL = "mysql+pymysql://ua60odoilfci2cag:MdPHTMmaMMxrKx3xkPAs@b9jd9bdq4cuuekljrvxe-mysql.services.clever-cloud.com:3306/b9jd9bdq4cuuekljrvxe"
if DB_HOST and DB_USER and DB_PASSWORD and DB_NAME:
    DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
else:
    DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://admin:admin123@mysql:3306/proyecto")

engine = create_engine(DATABASE_URL, pool_size=2, max_overflow=2, pool_recycle=3600)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()