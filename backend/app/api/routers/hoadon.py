from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app import models, schemas
from app.db.dependency import get_db
from app.schemas import CTHoaDonThuocBase, HoaDonCreate, HoaDonOut, CTHoaDonDVDTBase
from app.models import HoaDon, CT_HoaDonThuoc, CT_HoaDonDVDT
router = APIRouter(prefix="/hoadon", tags=["Hóa đơn"])

@router.post("/", response_model=HoaDonOut)
def create_invoice(payload: HoaDonCreate, db: Session = Depends(get_db)):
    if not payload.thuocs or all(t.SoLuongBan <= 0 for t in payload.thuocs):
        raise HTTPException(status_code=400, detail="Phải có ít nhất một thuốc với số lượng lớn hơn 0")

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

    for item in payload.thuocs:
        ct_thuoc = CT_HoaDonThuoc(
            MaHoaDon=hd_data.MaHoaDon,
            MaThuoc=item.MaThuoc,
            SoLuongBan=item.SoLuongBan,
            GiaBan=item.GiaBan,
            ThanhTienThuoc=item.ThanhTienThuoc
        )
        db.add(ct_thuoc)

    for item in payload.dichvus or []:
        ct_dv = CT_HoaDonDVDT(
            MaHoaDon=hd_data.MaHoaDon,
            MaDVDT=item.MaDVDT,
            GiaDichVu=item.GiaDichVu,
            ThanhTienDichVu=item.ThanhTienDichVu
        )
        db.add(ct_dv)

    db.commit()
    db.refresh(hd_data)
    return hd_data

@router.get("/", response_model=list[HoaDonOut])
def get_all_invoices(db: Session = Depends(get_db)):
    return db.query(HoaDon)\
    .options(
        joinedload(HoaDon.thuocs).joinedload(CT_HoaDonThuoc.thuoc),
        joinedload(HoaDon.dichvus),
        joinedload(HoaDon.benhnhan)
    )\
    .filter(HoaDon.DaXoa == False)\
    .all()

@router.get("/{ma_hoa_don}", response_model=HoaDonOut)
def get_invoice(ma_hoa_don: int, db: Session = Depends(get_db)):
    invoice = db.query(HoaDon).filter(HoaDon.MaHoaDon == ma_hoa_don, HoaDon.DaXoa == False).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Hóa đơn không tồn tại")
    return invoice

@router.put("/{ma_hoa_don}", response_model=HoaDonOut)
def update_invoice(ma_hoa_don: int, payload: HoaDonCreate, db: Session = Depends(get_db)):
    invoice = db.query(HoaDon).filter(HoaDon.MaHoaDon == ma_hoa_don, HoaDon.DaXoa == False).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Hóa đơn không tồn tại")

    if not payload.thuocs or all(t.SoLuongBan <= 0 for t in payload.thuocs):
        raise HTTPException(status_code=400, detail="Phải có ít nhất một thuốc với số lượng lớn hơn 0")

    for attr, value in payload.dict(exclude={"thuocs", "dichvus"}).items():
        setattr(invoice, attr, value)

    db.query(CT_HoaDonThuoc).filter(CT_HoaDonThuoc.MaHoaDon == ma_hoa_don).delete()
    for item in payload.thuocs:
        ct_thuoc = CT_HoaDonThuoc(
            MaHoaDon=ma_hoa_don,
            MaThuoc=item.MaThuoc,
            SoLuongBan=item.SoLuongBan,
            GiaBan=item.GiaBan,
            ThanhTienThuoc=item.ThanhTienThuoc
        )
        db.add(ct_thuoc)

    db.query(CT_HoaDonDVDT).filter(CT_HoaDonDVDT.MaHoaDon == ma_hoa_don).delete()
    for item in payload.dichvus or []:
        ct_dv = CT_HoaDonDVDT(
            MaHoaDon=ma_hoa_don,
            MaDVDT=item.MaDVDT,
            GiaDichVu=item.GiaDichVu,
            ThanhTienDichVu=item.ThanhTienDichVu
        )
        db.add(ct_dv)

    db.commit()
    db.refresh(invoice)
    return invoice

@router.delete("/{ma_hoa_don}")
def delete_invoice(ma_hoa_don: int, db: Session = Depends(get_db)):
    invoice = db.query(HoaDon).filter(HoaDon.MaHoaDon == ma_hoa_don, HoaDon.DaXoa == False).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Hóa đơn không tồn tại")
    invoice.DaXoa = True
    db.commit()
