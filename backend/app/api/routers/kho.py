from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, schemas, services
from app.db.dependency import get_db

router = APIRouter(prefix="/kho", tags=["Kho"])

@router.post("/nhap", response_model=schemas.PhieuNhapOut)
def tao_phieu_nhap(data: schemas.PhieuNhapBase, db: Session = Depends(get_db)):
    return services.create_phieu_nhap_service(db, data)

@router.post("/nhap/ct", response_model=schemas.CTPhieuNhapOut)
def ct_phieu_nhap(data: schemas.CTPhieuNhapBase, db: Session = Depends(get_db)):
    return services.create_ct_phieu_nhap_service(db, data)

@router.post("/xuat", response_model=schemas.PhieuXuatOut)
def tao_phieu_xuat(data: schemas.PhieuXuatBase, db: Session = Depends(get_db)):
    return services.create_phieu_xuat_service(db, data)

@router.post("/xuat/ct", response_model=schemas.CTPhieuXuatOut)
def ct_phieu_xuat(data: schemas.CTPhieuXuatBase, db: Session = Depends(get_db)):
    return services.create_ct_phieu_xuat_service(db, data)

@router.get("/nhap", response_model=list[schemas.PhieuNhapOut])
def list_phieu_nhap(db: Session = Depends(get_db)):
    return services.get_phieu_nhap_list_service(db)

@router.get("/xuat", response_model=list[schemas.PhieuXuatOut])
def list_phieu_xuat(db: Session = Depends(get_db)):
    return services.get_phieu_xuat_list_service(db)
