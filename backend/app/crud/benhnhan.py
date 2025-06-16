from sqlalchemy.orm import Session
from app import models, schemas


def create_benhnhan(db: Session, data: schemas.BenhNhanCreate):
    obj = models.BenhNhan(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
def get_benhnhan(db: Session, id: int):
    return db.query(models.BenhNhan).filter(models.BenhNhan.MaBenhNhan == id).first()
def get_all_benhnhan(db: Session):
    return db.query(models.BenhNhan).all()