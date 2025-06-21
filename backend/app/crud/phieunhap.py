from sqlalchemy.orm import Session
from app import models, schemas
from fastapi import HTTPException
from typing import List

def create_phieunhap(db: Session, data: schemas.PhieuNhapCreate):
    # Tạo phiếu nhập
    phieu_nhap_data = data.model_dump(exclude={'chi_tiet'})
    phieu_nhap = models.PhieuNhap(**phieu_nhap_data)
    db.add(phieu_nhap)
    db.commit()
    db.refresh(phieu_nhap)

    # Tạo chi tiết phiếu nhập
    if data.chi_tiet:
        for ct_data in data.chi_tiet:
            ct_dict = ct_data.model_dump()
            ct_dict['MaPhieuNhap'] = phieu_nhap.MaPhieuNhap
            ct_phieu_nhap = models.CT_PhieuNhap(**ct_dict)
            db.add(ct_phieu_nhap)

            # Cập nhật tồn kho thuốc
            thuoc = db.query(models.Thuoc).filter(models.Thuoc.MaThuoc == ct_data.MaThuoc).first()
            if thuoc:
                thuoc.TonKho = (thuoc.TonKho or 0) + ct_data.SoLuongNhap
                if ct_data.GiaBan:
                    thuoc.GiaBan = ct_data.GiaBan

    db.commit()
    db.refresh(phieu_nhap)
    return phieu_nhap

def get_phieunhap(db: Session, id: int):
    return db.query(models.PhieuNhap).filter(models.PhieuNhap.MaPhieuNhap == id).first()

def get_all_phieunhap(db: Session):
    return db.query(models.PhieuNhap).all()

def update_phieunhap_byId(id: int, payload: schemas.PhieuNhapUpdate, db: Session):
    pn = db.query(models.PhieuNhap).filter(models.PhieuNhap.MaPhieuNhap == id).first()
    if not pn:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu nhập")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(pn, field, value)

    db.commit()
    db.refresh(pn)
    return pn

def delete_phieunhap_byID(id: int, db: Session):
    pn = db.query(models.PhieuNhap).filter(models.PhieuNhap.MaPhieuNhap == id).first()
    if not pn:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu nhập")

    # Xóa chi tiết phiếu nhập trước
    db.query(models.CT_PhieuNhap).filter(models.CT_PhieuNhap.MaPhieuNhap == id).delete()

    # Xóa phiếu nhập
    db.delete(pn)
    db.commit()
    return {"message": "Đã xóa phiếu nhập"}

def get_ct_phieunhap_by_phieunhap_id(db: Session, phieunhap_id: int):
    return db.query(models.CT_PhieuNhap).filter(models.CT_PhieuNhap.MaPhieuNhap == phieunhap_id).all()

def create_ct_phieunhap(db: Session, data: schemas.CTPhieuNhapCreate):
    obj = models.CT_PhieuNhap(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)

    # Cập nhật tồn kho
    thuoc = db.query(models.Thuoc).filter(models.Thuoc.MaThuoc == data.MaThuoc).first()
    if thuoc:
        thuoc.TonKho = (thuoc.TonKho or 0) + data.SoLuongNhap
        if data.GiaBan:
            thuoc.GiaBan = data.GiaBan
        db.commit()

    return obj
