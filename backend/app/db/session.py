from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load biến môi trường từ .env
load_dotenv()

# Lấy URL từ .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Khởi tạo SQLAlchemy engine & session
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
