from sqlalchemy.orm import Session, joinedload
from app.models import PhieuKham, CT_Thuoc, CT_DVDT, Thuoc, DVDT
from app.schemas import PhieuKhamCreate
from typing import List

def create_phieukham(db: Session, data: PhieuKhamCreate):
    phieu = PhieuKham(**data.model_dump(exclude={"thuocs", "dichvus"}))
    db.add(phieu)
    db.commit()
    db.refresh(phieu)

    for item in data.thuocs:
        db.add(CT_Thuoc(
            MaPhieuKham=phieu.MaPhieuKham,
            MaThuoc=item.MaThuoc,
            SoLuong=item.SoLuong,
            CachDung=item.CachDung
        ))

    for item in data.dichvus:
        db.add(CT_DVDT(
            MaPhieuKham=phieu.MaPhieuKham,
            MaDVDT=item.MaDVDT,
            GhiChu=item.GhiChu
        ))

    db.commit()
    return phieu

def update_phieukham(db: Session, id: int, data: PhieuKhamCreate):
    phieu = db.query(PhieuKham).filter(PhieuKham.MaPhieuKham == id).first()
    if not phieu:
        return None

    for attr, value in data.model_dump(exclude={"thuocs", "dichvus"}).items():
        setattr(phieu, attr, value)

    db.query(CT_Thuoc).filter(CT_Thuoc.MaPhieuKham == id).delete()
    db.query(CT_DVDT).filter(CT_DVDT.MaPhieuKham == id).delete()

    for item in data.thuocs:
        db.add(CT_Thuoc(
            MaPhieuKham=id,
            MaThuoc=item.MaThuoc,
            SoLuong=item.SoLuong,
            CachDung=item.CachDung
        ))

    for item in data.dichvus:
        db.add(CT_DVDT(
            MaPhieuKham=id,
            MaDVDT=item.MaDVDT,
            GhiChu=item.GhiChu
        ))

    db.commit()
    db.refresh(phieu)
    return phieu

def get_all_phieukhams(db: Session):
    return (
        db.query(PhieuKham)
        .options(joinedload(PhieuKham.benhnhan))
        .filter(PhieuKham.TrangThai == True)  # chỉ lấy phiếu chưa bị xoá mềm
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
            Thuoc.MaThuoc,
            Thuoc.TenThuoc,
            Thuoc.DonViTinh,
            Thuoc.SoDangKy,
            Thuoc.GiaBan,
            Thuoc.CachDung.label("CachDung")  # ✅ đây
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
            "GiaBan": row.GiaBan,
            "SoLuong": row.SoLuong,
            "CachDung": row.CachDung,  # ✅ chỉ lấy từ THUOC
        }
        for row in results
    ]


def get_dvdt_by_phieu_kham(db: Session, ma_phieu_kham: int):
    results = (
        db.query(
            CT_DVDT.MaDVDT,
            CT_DVDT.GhiChu,
            DVDT.TenDVDT,
            DVDT.DonViTinh,
            DVDT.DonGia,
        )
        .join(DVDT, CT_DVDT.MaDVDT == DVDT.MaDVDT)
        .filter(CT_DVDT.MaPhieuKham == ma_phieu_kham)
        .all()
    )

    return [
        {
            "MaDVDT": row.MaDVDT,
            "TenDVDT": row.TenDVDT,
            "DonViTinh": row.DonViTinh,
            "GiaDichVu": row.DonGia,
            "GhiChu": row.GhiChu,
        }
        for row in results
    ]
def delete_phieukham(db: Session, id: int):
    phieu = db.query(PhieuKham).filter(PhieuKham.MaPhieuKham == id).first()
    if not phieu:
        return None

    phieu.TrangThai = False  # đánh dấu xoá mềm
    db.commit()
    db.refresh(phieu)
    return phieu
