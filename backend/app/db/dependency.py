from .session import SessionLocal
from sqlalchemy.orm import Session
from typing import Generator
# Generator[YieldType, SendType, ReturnType]
def get_db() -> Generator[Session, None, None]: 
    # tạo một phiên làm việc với db
    db = SessionLocal()
    try:
        yield db
        # yield db không phải return một lần rồi xong.
        #  Nó trao quyền kiểm soát cho route đang dùng nó.
    # sau khi route dùng xong db thì đóng session
    finally:
        db.close()
