from sqlalchemy.orm import Session
from app import models, schemas
from fastapi import APIRouter, Depends, HTTPException, Body

def create_benhnhan(db: Session, data: schemas.BenhNhanCreate):
    obj = models.BenhNhan(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
def get_benhnhan(db: Session, id: int):
    return db.query(models.BenhNhan).filter(models.BenhNhan.MaBenhNhan == id).first()
def get_all_benhnhan(db: Session):
    return db.query(models.BenhNhan).filter(models.BenhNhan.DaXoa == False).all()

def update_benhnhan_byId(id, payload, db):
    bn = db.query(models.BenhNhan).filter(models.BenhNhan.MaBenhNhan == id).first()
    if not bn:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh nhân")
    
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(bn, field, value)

    db.commit()
    db.refresh(bn)
    return bn



def delete_benhnhan_byID(id, db):
    bn = db.query(models.BenhNhan).filter(models.BenhNhan.MaBenhNhan == id).first()
    if not bn:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh nhân")
    bn.DaXoa = True
    db.commit()
    return {"message": "Đã xóa bệnh nhân (mềm)"}