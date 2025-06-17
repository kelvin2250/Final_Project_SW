from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, schemas
from app.db.dependency import get_db
from app.schemas import CTHoaDonThuocBase, HoaDonCreate, HoaDonOut, CTHoaDonDVDTBase
from app.models import HoaDon, CT_HoaDonThuoc, CT_HoaDonDVDT
router = APIRouter(prefix="/hoadon", tags=["Hóa đơn"])

@router.post("/", response_model=HoaDonOut)
def create_invoice(payload: HoaDonCreate, db: Session = Depends(get_db)):
    # 1. Tạo hóa đơn
    hd_data = HoaDon(
        MaBenhNhan=payload.MaBenhNhan,
        MaPhieuKham=payload.MaPhieuKham,
        NgayLap=payload.NgayLap,
        NguoiLap=payload.NguoiLap,
        TongTienThuoc=payload.TongTienThuoc,
        TongTienDichVu=payload.TongTienDichVu,
        TongTienThanhToan=payload.TongTienThanhToan,
        TrangThai=payload.TrangThai,
        GhiChu=payload.GhiChu,
    )
    db.add(hd_data)
    db.commit()
    db.refresh(hd_data)

    # 2. Tạo chi tiết thuốc
    for item in payload.thuocs:
        ct_thuoc = CT_HoaDonThuoc(
            MaHoaDon=hd_data.MaHoaDon,
            MaThuoc=item.MaThuoc,
            SoLuongBan=item.SoLuongBan,
            GiaBan=item.GiaBan,
            ThanhTienThuoc=item.ThanhTienThuoc
        )
        db.add(ct_thuoc)

    # 3. Tạo chi tiết dịch vụ
    for item in payload.dichvus:
        ct_dv = CT_HoaDonDVDT(
            MaHoaDon=hd_data.MaHoaDon,
            MaDVDT=item.MaDVDT,
            GiaDichVu=item.GiaDichVu,
            ThanhTienDichVu=item.ThanhTienDichVu
        )
        db.add(ct_dv)

    db.commit()
    return hd_data

@router.get("/", response_model=list[HoaDonOut])
def get_all_invoices(db: Session = Depends(get_db)):
    return db.query(HoaDon).all()

@router.get("/phieukham/{ma_phieu}", response_model=list[HoaDonOut])
def get_by_phieukham(ma_phieu: int, db: Session = Depends(get_db)):
    return db.query(HoaDon).filter(HoaDon.MaPhieuKham == ma_phieu).all()
