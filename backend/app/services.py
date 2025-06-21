from sqlalchemy.orm import Session
from app import models, schemas
from app.crud import baocao, kho

# BaoCao services
def create_baocao_service(db: Session, data: schemas.BaoCaoBase):
    return baocao.create_baocao(db, data)

def create_ct_baocao_service(db: Session, data: schemas.CTBaoCaoBase):
    return baocao.create_ct_baocao(db, data)

def get_baocao_list_service(db: Session):
    return baocao.get_baocao_list(db)

def get_ct_baocao_list_service(db: Session, ma_baocao: int):
    return baocao.get_ct_baocao_list(db, ma_baocao)

# Kho services
def create_phieu_nhap_service(db: Session, data: schemas.PhieuNhapBase):
    return kho.create_phieu_nhap(db, data)

def create_ct_phieu_nhap_service(db: Session, data: schemas.CTPhieuNhapBase):
    return kho.create_ct_phieu_nhap(db, data)

def create_phieu_xuat_service(db: Session, data: schemas.PhieuXuatBase):
    return kho.create_phieu_xuat(db, data)

def create_ct_phieu_xuat_service(db: Session, data: schemas.CTPhieuXuatBase):
    return kho.create_ct_phieu_xuat(db, data)

def get_phieu_nhap_list_service(db: Session):
    return kho.get_phieu_nhap_list(db)

def get_phieu_xuat_list_service(db: Session):
    return kho.get_phieu_xuat_list(db)

