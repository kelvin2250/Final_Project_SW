from sqlalchemy.orm import Session, joinedload
from app.models import PhieuKham, CT_Thuoc, CT_DVDT, Thuoc
from app.schemas import PhieuKhamCreate
from typing import List

def create_phieukham(db: Session, data: PhieuKhamCreate):
    phieu = PhieuKham(**data.model_dump(exclude={"thuocs", "dichvus"}))
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
    return (
        db.query(PhieuKham)
        .options(joinedload(PhieuKham.benhnhan))
        .all()
    )

def get_phieukham_by_id(db: Session, id: int):
    return (
        db.query(PhieuKham)
        .options(joinedload(PhieuKham.benhnhan)) 
        .filter(PhieuKham.MaPhieuKham == id)
        .first()
    )


def get_thuoc_by_phieu_kham(db: Session, ma_phieu_kham: int):
    results = (
        db.query(
            CT_Thuoc.SoLuong,
            CT_Thuoc.CachDung.label("CachDungChiTiet"),
            Thuoc.MaThuoc,
            Thuoc.TenThuoc,
            Thuoc.DonViTinh,
            Thuoc.SoDangKy
        )
        .join(Thuoc, CT_Thuoc.MaThuoc == Thuoc.MaThuoc)
        .filter(CT_Thuoc.MaPhieuKham == ma_phieu_kham)
        .all()
    )

    return [
        {
            "MaThuoc": row.MaThuoc,
            "TenThuoc": row.TenThuoc,
            "DonViTinh": row.DonViTinh,
            "SoDangKy": row.SoDangKy,
            "SoLuong": row.SoLuong,
            "CachDungChiTiet": row.CachDungChiTiet,
        }
        for row in results
    ]


