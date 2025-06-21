from sqlalchemy.orm import Session
from app import models, schemas
from fastapi import HTTPException
from typing import List

def create_phieuxuat(db: Session, data: schemas.PhieuXuatCreate):
    # Tạo phiếu xuất
    phieu_xuat_data = data.model_dump(exclude={'chi_tiet'})
    phieu_xuat = models.PhieuXuat(**phieu_xuat_data)
    db.add(phieu_xuat)
    db.commit()
    db.refresh(phieu_xuat)

    # Tạo chi tiết phiếu xuất
    if data.chi_tiet:
        for ct_data in data.chi_tiet:
            ct_dict = ct_data.model_dump()
            ct_dict['MaPhieuXuat'] = phieu_xuat.MaPhieuXuat
            ct_phieu_xuat = models.CT_PhieuXuat(**ct_dict)
            db.add(ct_phieu_xuat)

            # Trừ tồn kho thuốc
            thuoc = db.query(models.Thuoc).filter(models.Thuoc.MaThuoc == ct_data.MaThuoc).first()
            if thuoc:
                if (thuoc.TonKho or 0) >= ct_data.SoLuongXuat:
                    thuoc.TonKho = (thuoc.TonKho or 0) - ct_data.SoLuongXuat
                else:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Không đủ tồn kho cho thuốc {thuoc.TenThuoc}. Tồn kho hiện tại: {thuoc.TonKho}, yêu cầu xuất: {ct_data.SoLuongXuat}"
                    )

    db.commit()
    db.refresh(phieu_xuat)
    return phieu_xuat

def get_phieuxuat(db: Session, id: int):
    return db.query(models.PhieuXuat).filter(models.PhieuXuat.MaPhieuXuat == id).first()

def get_all_phieuxuat(db: Session):
    return db.query(models.PhieuXuat).all()

def update_phieuxuat_byId(id: int, payload: schemas.PhieuXuatUpdate, db: Session):
    px = db.query(models.PhieuXuat).filter(models.PhieuXuat.MaPhieuXuat == id).first()
    if not px:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu xuất")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(px, field, value)

    db.commit()
    db.refresh(px)
    return px

def delete_phieuxuat_byID(id: int, db: Session):
    px = db.query(models.PhieuXuat).filter(models.PhieuXuat.MaPhieuXuat == id).first()
    if not px:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu xuất")

    # Xóa chi tiết phiếu xuất trước
    db.query(models.CT_PhieuXuat).filter(models.CT_PhieuXuat.MaPhieuXuat == id).delete()

    # Xóa phiếu xuất
    db.delete(px)
    db.commit()
    return {"message": "Đã xóa phiếu xuất"}

def get_ct_phieuxuat_by_phieuxuat_id(db: Session, phieuxuat_id: int):
    return db.query(models.CT_PhieuXuat).filter(models.CT_PhieuXuat.MaPhieuXuat == phieuxuat_id).all()

def create_ct_phieuxuat(db: Session, data: schemas.CTPhieuXuatCreate):
    # Kiểm tra tồn kho trước khi tạo
    thuoc = db.query(models.Thuoc).filter(models.Thuoc.MaThuoc == data.MaThuoc).first()
    if thuoc and (thuoc.TonKho or 0) < data.SoLuongXuat:
        raise HTTPException(
            status_code=400,
            detail=f"Không đủ tồn kho cho thuốc {thuoc.TenThuoc}. Tồn kho hiện tại: {thuoc.TonKho}, yêu cầu xuất: {data.SoLuongXuat}"
        )

    obj = models.CT_PhieuXuat(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)

    # Trừ tồn kho
    if thuoc:
        thuoc.TonKho = (thuoc.TonKho or 0) - data.SoLuongXuat
        db.commit()

    return obj
