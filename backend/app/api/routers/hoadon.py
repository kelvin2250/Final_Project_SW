from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, schemas
from app.db.dependency import get_db

router = APIRouter(prefix="/hoadon", tags=["Hóa đơn"])

@router.post("/", response_model=schemas.HoaDonOut)
def tao_hoadon(data: schemas.HoaDonBase, db: Session = Depends(get_db)):
    hd = models.HoaDon(**data.dict())
    db.add(hd)
    db.commit()
    db.refresh(hd)
    return hd

@router.post("/thuoc", response_model=schemas.CTHoaDonThuocOut)
def ct_thuoc(data: schemas.CTHoaDonThuocBase, db: Session = Depends(get_db)):
    ct = models.CT_HoaDonThuoc(**data.dict())
    db.add(ct)
    db.commit()
    db.refresh(ct)
    return ct

@router.post("/dvdt", response_model=schemas.CTHoaDonDVDTOut)
def ct_dvdt(data: schemas.CTHoaDonDVDTBase, db: Session = Depends(get_db)):
    ct = models.CT_HoaDonDVDT(**data.dict())
    db.add(ct)
    db.commit()
    db.refresh(ct)
    return ct
