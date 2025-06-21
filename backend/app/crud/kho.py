from sqlalchemy.orm import Session
from app import models, schemas

def create_phieu_nhap(db: Session, data: schemas.PhieuNhapBase):
    obj = models.PhieuNhap(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def create_ct_phieu_nhap(db: Session, data: schemas.CTPhieuNhapBase):
    obj = models.CT_PhieuNhap(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def create_phieu_xuat(db: Session, data: schemas.PhieuXuatBase):
    obj = models.PhieuXuat(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def create_ct_phieu_xuat(db: Session, data: schemas.CTPhieuXuatBase):
    obj = models.CT_PhieuXuat(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def get_phieu_nhap_list(db: Session):
    return db.query(models.PhieuNhap).all()

def get_phieu_xuat_list(db: Session):
    return db.query(models.PhieuXuat).all()
