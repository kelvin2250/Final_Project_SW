from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.db.dependency import get_db

router = APIRouter(prefix="/thuoc", tags=["Thuốc"])

@router.post("/", response_model=schemas.ThuocOut)
def create_thuoc(thuoc: schemas.ThuocCreate, db: Session = Depends(get_db)):
    db_thuoc = models.Thuoc(**thuoc.model_dump())
    db.add(db_thuoc)
    db.commit()
    db.refresh(db_thuoc)
    return db_thuoc

@router.get("/", response_model=list[schemas.ThuocOut])
def get_all_thuoc(db: Session = Depends(get_db)):
    return db.query(models.Thuoc).filter(models.Thuoc.DaXoa != True).all()  # ✅ only active

@router.get("/{thuoc_id}", response_model=schemas.ThuocOut)
def get_thuoc_by_id(thuoc_id: int, db: Session = Depends(get_db)):
    thuoc = db.query(models.Thuoc).filter(
        models.Thuoc.MaThuoc == thuoc_id,
        models.Thuoc.DaXoa != True  # ✅ ignore deleted
    ).first()
    if not thuoc:
        raise HTTPException(status_code=404, detail="Không tìm thấy thuốc")
    return thuoc

@router.put("/{thuoc_id}", response_model=schemas.ThuocOut)
def update_thuoc(thuoc_id: int, updated: schemas.ThuocCreate, db: Session = Depends(get_db)):
    thuoc = db.query(models.Thuoc).filter(
        models.Thuoc.MaThuoc == thuoc_id,
        models.Thuoc.DaXoa != True
    ).first()
    if not thuoc:
        raise HTTPException(status_code=404, detail="Không tìm thấy thuốc")
    for attr, value in updated.model_dump().items():
        setattr(thuoc, attr, value)
    db.commit()
    db.refresh(thuoc)
    return thuoc

@router.delete("/{thuoc_id}")
def soft_delete_thuoc(thuoc_id: int, db: Session = Depends(get_db)):
    thuoc = db.query(models.Thuoc).filter(models.Thuoc.MaThuoc == thuoc_id).first()
    if not thuoc:
        raise HTTPException(status_code=404, detail="Không tìm thấy thuốc")
    thuoc.DaXoa = True
    db.commit()
    return {"message": "Thuốc đã được đánh dấu xoá (soft delete)"}

