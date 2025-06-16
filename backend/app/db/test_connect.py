from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from app.db.session import engine
from dotenv import load_dotenv
import os

load_dotenv()

def test_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("[✅] Kết nối thành công:", result.scalar())
    except SQLAlchemyError as e:
        print("[❌] Lỗi kết nối database:", str(e))

if __name__ == "__main__":
    print("🔍 Đang kiểm tra kết nối MySQL...")
    test_connection()
