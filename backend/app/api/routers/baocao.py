from fastapi import APIRouter, Depends, HTTPException, Body, Query
from fastapi.responses import StreamingResponse
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
    return baocao.get_overview_statistics(db, start_date, end_date)

@router.get("/generate/monthly-csv")
def generate_monthly_csv_report(
    year: int = Query(..., description="Năm"),
    month: int = Query(..., description="Tháng (1-12)"),
    db: Session = Depends(get_db)
):
    """Tạo báo cáo doanh thu hàng tháng dưới dạng CSV"""
    from sqlalchemy import func, extract
    import io
    import csv
    from datetime import datetime

    if month < 1 or month > 12:
        raise HTTPException(status_code=400, detail="Tháng phải từ 1 đến 12")

    try:
        # Tổng số bệnh nhân trong tháng
        tong_so_benhnhan = db.query(func.count(models.BenhNhan.MaBenhNhan)).filter(
            extract('year', models.BenhNhan.NgayTao) == year,
            extract('month', models.BenhNhan.NgayTao) == month,
            models.BenhNhan.DaXoa == False
        ).scalar() or 0

        # Tổng số hóa đơn trong tháng
        tong_so_hoadon = db.query(func.count(models.HoaDon.MaHoaDon)).filter(
            extract('year', models.HoaDon.NgayLap) == year,
            extract('month', models.HoaDon.NgayLap) == month,
            models.HoaDon.DaXoa == False
        ).scalar() or 0

        # Tổng doanh thu trong tháng
        tong_doanh_thu = db.query(func.sum(models.HoaDon.TongTienThanhToan)).filter(
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

        # Tổng số thuốc bán ra
        tong_thuoc_ban_ra = db.query(func.sum(models.CT_HoaDonThuoc.SoLuongBan)).join(
            models.HoaDon
        ).filter(
            extract('year', models.HoaDon.NgayLap) == year,
            extract('month', models.HoaDon.NgayLap) == month,
            models.HoaDon.DaXoa == False
        ).scalar() or 0

        # Top 5 thuốc bán chạy nhất
        top_thuoc = db.query(
            models.Thuoc.TenThuoc,
            func.sum(models.CT_HoaDonThuoc.SoLuongBan).label('total_sold'),
            func.sum(models.CT_HoaDonThuoc.ThanhTienThuoc).label('total_revenue')
        ).join(models.CT_HoaDonThuoc).join(models.HoaDon).filter(
            extract('year', models.HoaDon.NgayLap) == year,
            extract('month', models.HoaDon.NgayLap) == month,
            models.HoaDon.DaXoa == False
        ).group_by(models.Thuoc.MaThuoc, models.Thuoc.TenThuoc).order_by(
            func.sum(models.CT_HoaDonThuoc.SoLuongBan).desc()
        ).limit(5).all()

        # Thống kê theo ngày trong tháng
        daily_stats = db.query(
            func.date(models.HoaDon.NgayLap).label('ngay'),
            func.count(models.HoaDon.MaHoaDon).label('so_hoadon'),
            func.sum(models.HoaDon.TongTienThanhToan).label('doanh_thu')
        ).filter(
            extract('year', models.HoaDon.NgayLap) == year,
            extract('month', models.HoaDon.NgayLap) == month,
            models.HoaDon.DaXoa == False
        ).group_by(func.date(models.HoaDon.NgayLap)).order_by(
            func.date(models.HoaDon.NgayLap)
        ).all()

        # Tạo CSV content
        output = io.StringIO()
        writer = csv.writer(output)

        # Header thông tin báo cáo
        writer.writerow([f'BÁO CÁO DOANH THU THÁNG {month}/{year}'])
        writer.writerow([f'Ngày tạo: {datetime.now().strftime("%d/%m/%Y %H:%M:%S")}'])
        writer.writerow([''])

        # Thống kê tổng quan
        writer.writerow(['THỐNG KÊ TỔNG QUAN'])
        writer.writerow(['Chỉ số', 'Giá trị'])
        writer.writerow(['Tổng số bệnh nhân', tong_so_benhnhan])
        writer.writerow(['Tổng số hóa đơn', tong_so_hoadon])
        writer.writerow(['Tổng doanh thu (VNĐ)', f'{tong_doanh_thu:,.0f}'])
        writer.writerow(['Tổng tiền thuốc (VNĐ)', f'{tong_tien_thuoc:,.0f}'])
        writer.writerow(['Tổng tiền dịch vụ (VNĐ)', f'{tong_tien_dichvu:,.0f}'])
        writer.writerow(['Tổng số thuốc bán ra', tong_thuoc_ban_ra])
        writer.writerow(['Doanh thu trung bình/hóa đơn (VNĐ)', f'{(tong_doanh_thu/tong_so_hoadon if tong_so_hoadon > 0 else 0):,.0f}'])
        writer.writerow([''])

        # Top thuốc bán chạy
        writer.writerow(['TOP 5 THUỐC BÁN CHẠY NHẤT'])
        writer.writerow(['Tên thuốc', 'Số lượng bán', 'Doanh thu (VNĐ)'])
        for thuoc in top_thuoc:
            writer.writerow([thuoc.TenThuoc, thuoc.total_sold, f'{thuoc.total_revenue:,.0f}'])
        writer.writerow([''])

        # Thống kê theo ngày
        writer.writerow(['THỐNG KÊ THEO NGÀY'])
        writer.writerow(['Ngày', 'Số hóa đơn', 'Doanh thu (VNĐ)'])
        for stat in daily_stats:
            writer.writerow([stat.ngay.strftime('%d/%m/%Y'), stat.so_hoadon, f'{stat.doanh_thu:,.0f}'])

        output.seek(0)

        # Tạo response
        filename = f"bao_cao_thang_{month}_{year}.csv"
        response = StreamingResponse(
            io.BytesIO(output.getvalue().encode('utf-8-sig')),
            media_type='text/csv',
            headers={'Content-Disposition': f'attachment; filename="{filename}"'}
        )

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo báo cáo CSV: {str(e)}")
