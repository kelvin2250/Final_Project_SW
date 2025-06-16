from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.db.dependency import get_db

router = APIRouter()

@router.post("/thuoc", response_model=schemas.ThuocOut)
def create_thuoc(thuoc: schemas.ThuocCreate, db: Session = Depends(get_db)):
    db_thuoc = models.Thuoc(**thuoc.model_dump())
    db.add(db_thuoc)
    db.commit()
    db.refresh(db_thuoc)
    return db_thuoc

@router.get("/thuoc", response_model=list[schemas.ThuocOut])
def get_all_thuoc(db: Session = Depends(get_db)):
    return db.query(models.Thuoc).all()

@router.get("/thuoc/{thuoc_id}", response_model=schemas.ThuocOut)
def get_thuoc_by_id(thuoc_id: int, db: Session = Depends(get_db)):
    thuoc = db.query(models.Thuoc).filter(models.Thuoc.MaThuoc == thuoc_id).first()
    if not thuoc:
        raise HTTPException(status_code=404, detail="Không tìm thấy thuốc")
    return thuoc

@router.put("/thuoc/{thuoc_id}", response_model=schemas.ThuocOut)
def update_thuoc(thuoc_id: int, updated: schemas.ThuocCreate, db: Session = Depends(get_db)):
    thuoc = db.query(models.Thuoc).filter(models.Thuoc.MaThuoc == thuoc_id).first()
    if not thuoc:
        raise HTTPException(status_code=404, detail="Không tìm thấy thuốc")
    for attr, value in updated.model_dump().items():
        setattr(thuoc, attr, value)
    db.commit()
    db.refresh(thuoc)
    return thuoc

@router.delete("/thuoc/{thuoc_id}")
def delete_thuoc(thuoc_id: int, db: Session = Depends(get_db)):
    thuoc = db.query(models.Thuoc).filter(models.Thuoc.MaThuoc == thuoc_id).first()
    if not thuoc:
        raise HTTPException(status_code=404, detail="Không tìm thấy thuốc")
    db.delete(thuoc)
    db.commit()
    return {"message": "Đã xóa thuốc"}

@router.get("/nhomthuoc", response_model=list[schemas.NhomThuocOut])
def get_all_nhomthuoc(db: Session = Depends(get_db)):
    return db.query(models.NhomThuoc).all()
