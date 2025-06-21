from sqlalchemy.orm import Session
from app import models, schemas
from fastapi import HTTPException
from datetime import date
from sqlalchemy import func

def create_baocao(db: Session, data: schemas.BaoCaoCreate):
    obj = models.BaoCao(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def get_baocao(db: Session, id: int):
    return db.query(models.BaoCao).filter(models.BaoCao.MaBaoCao == id).first()

def get_all_baocao(db: Session):
    return db.query(models.BaoCao).all()

def update_baocao_byId(id: int, payload: schemas.BaoCaoUpdate, db: Session):
    bc = db.query(models.BaoCao).filter(models.BaoCao.MaBaoCao == id).first()
    if not bc:
        raise HTTPException(status_code=404, detail="Không tìm thấy báo cáo")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(bc, field, value)

    db.commit()
    db.refresh(bc)
    return bc

def delete_baocao_byID(id: int, db: Session):
    bc = db.query(models.BaoCao).filter(models.BaoCao.MaBaoCao == id).first()
    if not bc:
        raise HTTPException(status_code=404, detail="Không tìm thấy báo cáo")
    db.delete(bc)
    db.commit()
    return {"message": "Đã xóa báo cáo"}

def create_ct_baocao(db: Session, data: schemas.CTBaoCaoCreate):
    obj = models.CT_BaoCao(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def get_ct_baocao_by_baocao_id(db: Session, baocao_id: int):
    return db.query(models.CT_BaoCao).filter(models.CT_BaoCao.MaBaoCao == baocao_id).first()

def generate_daily_report(db: Session, report_date: date, nguoi_lap: str):
    """Tạo báo cáo doanh thu theo ngày"""

    # Tính toán các thống kê
    tong_so_benhnhan = db.query(func.count(models.BenhNhan.MaBenhNhan)).filter(
        func.date(models.BenhNhan.NgayTao) == report_date
    ).scalar() or 0

    # Tổng thuốc bán ra trong ngày
    tong_thuoc_ban_ra = db.query(func.sum(models.CT_HoaDonThuoc.SoLuongBan)).join(
        models.HoaDon
    ).filter(
        func.date(models.HoaDon.NgayLap) == report_date
    ).scalar() or 0

    # Tổng tiền thuốc
    tong_tien_thuoc = db.query(func.sum(models.CT_HoaDonThuoc.ThanhTienThuoc)).join(
        models.HoaDon
    ).filter(
        func.date(models.HoaDon.NgayLap) == report_date
    ).scalar() or 0

    # Tổng tiền dịch vụ
    tong_tien_dichvu = db.query(func.sum(models.CT_HoaDonDVDT.ThanhTienDichVu)).join(
        models.HoaDon
    ).filter(
        func.date(models.HoaDon.NgayLap) == report_date
    ).scalar() or 0

    tong_doanh_thu = tong_tien_thuoc + tong_tien_dichvu

    # Tạo báo cáo
    baocao_data = schemas.BaoCaoCreate(
        LoaiBaoCao="Báo cáo doanh thu hàng ngày",
        ThoiGianBaoCao=report_date,
        NguoiLap=nguoi_lap,
        GhiChu=f"Báo cáo doanh thu ngày {report_date}"
    )

    baocao = create_baocao(db, baocao_data)

    # Tạo chi tiết báo cáo
    ct_baocao_data = schemas.CTBaoCaoCreate(
        MaBaoCao=getattr(baocao, 'MaBaoCao'),
        TongSoBenhNhan=tong_so_benhnhan,
        TongThuocBanRa=int(tong_thuoc_ban_ra),
        TongTienThuoc=float(tong_tien_thuoc),
        TongTienDichVu=float(tong_tien_dichvu),
        TongDoanhThu=float(tong_doanh_thu)
    )

    ct_baocao = create_ct_baocao(db, ct_baocao_data)

    return baocao, ct_baocao

def generate_monthly_report(db: Session, year: int, month: int, nguoi_lap: str):
    """Tạo báo cáo doanh thu theo tháng"""
    from sqlalchemy import extract

    # Tính toán các thống kê cho tháng
    tong_so_benhnhan = db.query(func.count(models.BenhNhan.MaBenhNhan)).filter(
        extract('year', models.BenhNhan.NgayTao) == year,
        extract('month', models.BenhNhan.NgayTao) == month,
        models.BenhNhan.DaXoa == False
    ).scalar() or 0

    # Tổng thuốc bán ra trong tháng
    tong_thuoc_ban_ra = db.query(func.sum(models.CT_HoaDonThuoc.SoLuongBan)).join(
        models.HoaDon
    ).filter(
        extract('year', models.HoaDon.NgayLap) == year,
        extract('month', models.HoaDon.NgayLap) == month,
        models.HoaDon.DaXoa == False
    ).scalar() or 0

    # Tổng tiền thuốc
    tong_tien_thuoc = db.query(func.sum(models.CT_HoaDonThuoc.ThanhTienThuoc)).join(
        models.HoaDon
    ).filter(
        extract('year', models.HoaDon.NgayLap) == year,
        extract('month', models.HoaDon.NgayLap) == month,
        models.HoaDon.DaXoa == False
    ).scalar() or 0

    # Tổng tiền dịch vụ
    tong_tien_dichvu = db.query(func.sum(models.CT_HoaDonDVDT.ThanhTienDichVu)).join(
        models.HoaDon
    ).filter(
        extract('year', models.HoaDon.NgayLap) == year,
        extract('month', models.HoaDon.NgayLap) == month,
        models.HoaDon.DaXoa == False
    ).scalar() or 0

    tong_doanh_thu = (tong_tien_thuoc or 0) + (tong_tien_dichvu or 0)

    # Tạo báo cáo
    report_date = date(year, month, 1)
    baocao_data = schemas.BaoCaoCreate(
        LoaiBaoCao="Báo cáo doanh thu hàng tháng",
        ThoiGianBaoCao=report_date,
        NguoiLap=nguoi_lap,
        GhiChu=f"Báo cáo doanh thu tháng {month}/{year}"
    )

    baocao = create_baocao(db, baocao_data)

    # Tạo chi tiết báo cáo
    ct_baocao_data = schemas.CTBaoCaoCreate(
        MaBaoCao=getattr(baocao, 'MaBaoCao'),
        TongSoBenhNhan=tong_so_benhnhan,
        TongThuocBanRa=int(tong_thuoc_ban_ra or 0),
        TongTienThuoc=int(tong_tien_thuoc or 0),
        TongTienDichVu=int(tong_tien_dichvu or 0),
        TongDoanhThu=int(tong_doanh_thu)
    )

    ct_baocao = create_ct_baocao(db, ct_baocao_data)

    return baocao, ct_baocao

def get_overview_statistics(db: Session, start_date=None, end_date=None):
    """Get overview statistics for the dashboard"""
    from sqlalchemy import func, and_, extract

    # Build date filters
    date_filters = []
    if start_date:
        date_filters.append(models.HoaDon.NgayLap >= start_date)
    if end_date:
        date_filters.append(models.HoaDon.NgayLap <= end_date)

    # Apply filters
    if date_filters:
        hoadon_query = db.query(models.HoaDon).filter(
            and_(*date_filters),
            models.HoaDon.DaXoa == False
        )
    else:
        hoadon_query = db.query(models.HoaDon).filter(models.HoaDon.DaXoa == False)

    # Total revenue
    tong_doanh_thu = hoadon_query.with_entities(
        func.sum(models.HoaDon.TongTienThanhToan)
    ).scalar() or 0

    # Total invoices
    tong_so_hoadon = hoadon_query.count()

    # Total patients
    tong_so_benhnhan = db.query(models.BenhNhan).filter(
        models.BenhNhan.DaXoa == False
    ).count()

    # Total drugs in stock
    tong_so_thuoc = db.query(models.Thuoc).filter(
        models.Thuoc.DaXoa == False
    ).count()

    # Average revenue per invoice
    doanh_thu_tb = tong_doanh_thu / tong_so_hoadon if tong_so_hoadon > 0 else 0

    return {
        "tong_doanh_thu": float(tong_doanh_thu),
        "tong_so_hoadon": tong_so_hoadon,
        "tong_so_benhnhan": tong_so_benhnhan,
        "tong_so_thuoc": tong_so_thuoc,
        "doanh_thu_trung_binh": float(doanh_thu_tb),
        "start_date": start_date,
        "end_date": end_date
    }
