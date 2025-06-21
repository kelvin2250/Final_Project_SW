from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.db.dependency import get_db

router = APIRouter()

@router.post("/dvdt", response_model=schemas.DVDTOut)
def create_dvdt(dvdt: schemas.DVDTCreate, db: Session = Depends(get_db)):
    db_dvdt = models.DVDT(**dvdt.model_dump())
    db.add(db_dvdt)
    db.commit()
    db.refresh(db_dvdt)
    return db_dvdt

@router.get("/dvdt", response_model=list[schemas.DVDTOut])
def get_all_dvdt(db: Session = Depends(get_db)):
    return db.query(models.DVDT).all()

@router.get("/dvdt/{dvdt_id}", response_model=schemas.DVDTOut)
def get_dvdt_by_id(dvdt_id: int, db: Session = Depends(get_db)):
    dvdt = db.query(models.DVDT).filter(models.DVDT.MaDVDT == dvdt_id).first()
    if not dvdt:
        raise HTTPException(status_code=404, detail="Không tìm thấy dịch vụ")
    return dvdt

@router.put("/dvdt/{dvdt_id}", response_model=schemas.DVDTOut)
def update_dvdt(dvdt_id: int, updated: schemas.DVDTCreate, db: Session = Depends(get_db)):
    dvdt = db.query(models.DVDT).filter(models.DVDT.MaDVDT == dvdt_id).first()
    if not dvdt:
        raise HTTPException(status_code=404, detail="Không tìm thấy dịch vụ")
    for attr, value in updated.model_dump().items():
        setattr(dvdt, attr, value)
    db.commit()
    db.refresh(dvdt)
    return dvdt

@router.delete("/dvdt/{dvdt_id}")
def delete_dvdt(dvdt_id: int, db: Session = Depends(get_db)):
    dvdt = db.query(models.DVDT).filter(models.DVDT.MaDVDT == dvdt_id).first()
    if not dvdt:
        raise HTTPException(status_code=404, detail="Không tìm thấy dịch vụ")
    db.delete(dvdt)
    db.commit()
    return {"message": "Đã xóa dịch vụ điều trị"}
