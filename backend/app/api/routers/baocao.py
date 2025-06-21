<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException, Body, Query
from sqlalchemy.orm import Session
from app.db.dependency import get_db
from app.crud import baocao
from app import models, schemas
from datetime import date
from typing import Optional

router = APIRouter(
    prefix="/baocao",
    tags=["Báo cáo"]
)

@router.post("/", response_model=schemas.BaoCaoOut)
def create_baocao(data: schemas.BaoCaoCreate, db: Session = Depends(get_db)):
    """Tạo báo cáo mới"""
    return baocao.create_baocao(db, data)

@router.get("/{id}", response_model=schemas.BaoCaoOut)
def get_baocao(id: int, db: Session = Depends(get_db)):
    """Lấy thông tin báo cáo theo ID"""
    bc = baocao.get_baocao(db, id)
    if not bc:
        raise HTTPException(status_code=404, detail="Không tìm thấy báo cáo")
    return bc

@router.get("/", response_model=list[schemas.BaoCaoOut])
def list_baocao(db: Session = Depends(get_db)):
    """Lấy danh sách tất cả báo cáo"""
    return baocao.get_all_baocao(db)

@router.put("/{id}", response_model=schemas.BaoCaoOut)
def update_baocao(
    id: int,
    payload: schemas.BaoCaoUpdate = Body(...),
    db: Session = Depends(get_db)
):
    """Cập nhật thông tin báo cáo"""
    return baocao.update_baocao_byId(id, payload, db)

@router.delete("/{id}")
def delete_baocao(id: int, db: Session = Depends(get_db)):
    """Xóa báo cáo"""
    return baocao.delete_baocao_byID(id, db)

@router.get("/{id}/chitiet", response_model=schemas.CTBaoCaoOut)
def get_chitiet_baocao(id: int, db: Session = Depends(get_db)):
    """Lấy chi tiết báo cáo"""
    ct = baocao.get_ct_baocao_by_baocao_id(db, id)
    if not ct:
        raise HTTPException(status_code=404, detail="Không tìm thấy chi tiết báo cáo")
    return ct

@router.post("/{id}/chitiet", response_model=schemas.CTBaoCaoOut)
def create_chitiet_baocao(
    id: int,
    data: schemas.CTBaoCaoCreate = Body(...),
    db: Session = Depends(get_db)
):
    """Tạo chi tiết báo cáo"""
    # Kiểm tra báo cáo có tồn tại không
    bc = baocao.get_baocao(db, id)
    if not bc:
        raise HTTPException(status_code=404, detail="Không tìm thấy báo cáo")

    data.MaBaoCao = id
    return baocao.create_ct_baocao(db, data)

@router.post("/generate/daily")
def generate_daily_report(
    report_date: date = Query(..., description="Ngày tạo báo cáo (YYYY-MM-DD)"),
    nguoi_lap: str = Query(..., description="Tên người lập báo cáo"),
    db: Session = Depends(get_db)
):
    """Tạo báo cáo doanh thu hàng ngày tự động"""
    try:
        baocao_obj, ct_baocao = baocao.generate_daily_report(db, report_date, nguoi_lap)
        return {
            "message": "Tạo báo cáo doanh thu hàng ngày thành công",
            "baocao": baocao_obj,
            "chi_tiet": ct_baocao
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo báo cáo: {str(e)}")

@router.post("/generate/monthly")
def generate_monthly_report(
    year: int = Query(..., description="Năm"),
    month: int = Query(..., description="Tháng (1-12)"),
    nguoi_lap: str = Query(..., description="Tên người lập báo cáo"),
    db: Session = Depends(get_db)
):
    """Tạo báo cáo doanh thu hàng tháng tự động"""
    if month < 1 or month > 12:
        raise HTTPException(status_code=400, detail="Tháng phải từ 1 đến 12")

    try:
        baocao_obj, ct_baocao = baocao.generate_monthly_report(db, year, month, nguoi_lap)
        return {
            "message": "Tạo báo cáo doanh thu hàng tháng thành công",
            "baocao": baocao_obj,
            "chi_tiet": ct_baocao
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo báo cáo: {str(e)}")

@router.get("/statistics/overview")
def get_statistics_overview(
    start_date: Optional[date] = Query(None, description="Ngày bắt đầu"),
    end_date: Optional[date] = Query(None, description="Ngày kết thúc"),
    db: Session = Depends(get_db)
):
    """Lấy thống kê tổng quan doanh thu"""
    from sqlalchemy import func, and_

    # Điều kiện lọc theo ngày
    date_filter = []
    if start_date:
        date_filter.append(models.HoaDon.NgayLap >= start_date)
    if end_date:
        date_filter.append(models.HoaDon.NgayLap <= end_date)

    # Tổng doanh thu
    tong_doanh_thu = db.query(func.sum(models.HoaDon.TongTienThanhToan)).filter(
        and_(*date_filter) if date_filter else True
    ).scalar() or 0

    # Tổng số hóa đơn
    tong_so_hoadon = db.query(func.count(models.HoaDon.MaHoaDon)).filter(
        and_(*date_filter) if date_filter else True
    ).scalar() or 0

    # Tổng số bệnh nhân
    tong_so_benhnhan = db.query(func.count(models.BenhNhan.MaBenhNhan)).filter(
        models.BenhNhan.DaXoa == False
    ).scalar() or 0

    # Doanh thu trung bình mỗi hóa đơn
    doanh_thu_tb = tong_doanh_thu / tong_so_hoadon if tong_so_hoadon > 0 else 0

    return {
        "tong_doanh_thu": float(tong_doanh_thu),
        "tong_so_hoadon": tong_so_hoadon,
        "tong_so_benhnhan": tong_so_benhnhan,
        "doanh_thu_trung_binh": float(doanh_thu_tb),
        "start_date": start_date,
        "end_date": end_date
    }
=======
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, schemas
from app.db.dependency import get_db

router = APIRouter(prefix="/baocao", tags=["Báo cáo"])

@router.post("/", response_model=schemas.BaoCaoOut)
def tao_baocao(data: schemas.BaoCaoBase, db: Session = Depends(get_db)):
    bc = models.BaoCao(**data.dict())
    db.add(bc)
    db.commit()
    db.refresh(bc)
    return bc

@router.post("/ct", response_model=schemas.CTBaoCaoOut)
def ct_baocao(data: schemas.CTBaoCaoBase, db: Session = Depends(get_db)):
    ct = models.CT_BaoCao(**data.dict())
    db.add(ct)
    db.commit()
    db.refresh(ct)
    return ct
>>>>>>> 0824ee06917a38fbe8e1eaa30a6d29de0cfc6db7
