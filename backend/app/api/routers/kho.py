from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, schemas
from app.db.dependency import get_db

router = APIRouter(prefix="/kho", tags=["Kho"])

@router.post("/nhap", response_model=schemas.PhieuNhapOut)
def tao_phieu_nhap(data: schemas.PhieuNhapBase, db: Session = Depends(get_db)):
    pn = models.PhieuNhap(**data.dict())
    db.add(pn)
    db.commit()
    db.refresh(pn)
    return pn

@router.post("/nhap/ct", response_model=schemas.CTPhieuNhapOut)
def ct_phieu_nhap(data: schemas.CTPhieuNhapBase, db: Session = Depends(get_db)):
    ct = models.CT_PhieuNhap(**data.dict())
    db.add(ct)
    db.commit()
    db.refresh(ct)
    return ct

@router.post("/xuat", response_model=schemas.PhieuXuatOut)
def tao_phieu_xuat(data: schemas.PhieuXuatBase, db: Session = Depends(get_db)):
    px = models.PhieuXuat(**data.dict())
    db.add(px)
    db.commit()
    db.refresh(px)
    return px

@router.post("/xuat/ct", response_model=schemas.CTPhieuXuatOut)
def ct_phieu_xuat(data: schemas.CTPhieuXuatBase, db: Session = Depends(get_db)):
    ct = models.CT_PhieuXuat(**data.dict())
    db.add(ct)
    db.commit()
    db.refresh(ct)
    return ct
