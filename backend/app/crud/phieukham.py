from sqlalchemy.orm import Session
from app.models import PhieuKham, CT_Thuoc, CT_DVDT
from app.schemas import PhieuKhamCreate
from typing import List

def create_phieukham(db: Session, data: PhieuKhamCreate):
    phieu = PhieuKham(**data.dict(exclude={"thuocs", "dichvus"}))
    db.add(phieu)
    db.commit()
    db.refresh(phieu)

    # Thêm thuốc
    for item in data.thuocs:
        db.add(CT_Thuoc(
            MaPhieuKham=phieu.MaPhieuKham,
            MaThuoc=item.MaThuoc,
            SoLuong=item.SoLuong,
            CachDung=item.CachDung
        ))

    # Thêm dịch vụ
    for item in data.dichvus:
        db.add(CT_DVDT(
            MaPhieuKham=phieu.MaPhieuKham,
            MaDVDT=item.MaDVDT,
            GhiChu=item.GhiChu
        ))

    db.commit()
    return phieu

def get_all_phieukhams(db: Session):
    return db.query(PhieuKham).all()

def get_phieukham_by_id(db: Session, id: int):
    return db.query(PhieuKham).filter(PhieuKham.MaPhieuKham == id).first()
