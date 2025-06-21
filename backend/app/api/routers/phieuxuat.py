from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.db.dependency import get_db
from app.crud import phieuxuat
from app import models, schemas

router = APIRouter(
    prefix="/phieuxuat",
    tags=["Phiếu xuất"]
)

@router.post("/", response_model=schemas.PhieuXuatOut)
def create_phieuxuat(data: schemas.PhieuXuatCreate, db: Session = Depends(get_db)):
    """Tạo phiếu xuất mới"""
    return phieuxuat.create_phieuxuat(db, data)

@router.get("/{id}", response_model=schemas.PhieuXuatOut)
def get_phieuxuat(id: int, db: Session = Depends(get_db)):
    """Lấy thông tin phiếu xuất theo ID"""
    px = phieuxuat.get_phieuxuat(db, id)
    if not px:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu xuất")
    return px

@router.get("/", response_model=list[schemas.PhieuXuatOut])
def list_phieuxuat(db: Session = Depends(get_db)):
    """Lấy danh sách tất cả phiếu xuất"""
    return phieuxuat.get_all_phieuxuat(db)

@router.put("/{id}", response_model=schemas.PhieuXuatOut)
def update_phieuxuat(
    id: int,
    payload: schemas.PhieuXuatUpdate = Body(...),
    db: Session = Depends(get_db)
):
    """Cập nhật thông tin phiếu xuất"""
    return phieuxuat.update_phieuxuat_byId(id, payload, db)

@router.delete("/{id}")
def delete_phieuxuat(id: int, db: Session = Depends(get_db)):
    """Xóa phiếu xuất"""
    return phieuxuat.delete_phieuxuat_byID(id, db)

@router.get("/{id}/chitiet", response_model=list[schemas.CTPhieuXuatOut])
def get_chitiet_phieuxuat(id: int, db: Session = Depends(get_db)):
    """Lấy chi tiết phiếu xuất"""
    # Kiểm tra phiếu xuất có tồn tại không
    px = phieuxuat.get_phieuxuat(db, id)
    if not px:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu xuất")

    return phieuxuat.get_ct_phieuxuat_by_phieuxuat_id(db, id)

@router.post("/{id}/chitiet", response_model=schemas.CTPhieuXuatOut)
def add_chitiet_phieuxuat(
    id: int,
    data: schemas.CTPhieuXuatCreate = Body(...),
    db: Session = Depends(get_db)
):
    """Thêm chi tiết vào phiếu xuất"""
    # Kiểm tra phiếu xuất có tồn tại không
    px = phieuxuat.get_phieuxuat(db, id)
    if not px:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu xuất")

    # Tạo chi tiết với MaPhieuXuat
    ct_data = data.model_dump()
    ct_data['MaPhieuXuat'] = id
    ct_schema = schemas.CTPhieuXuatCreate(**ct_data)

    return phieuxuat.create_ct_phieuxuat(db, ct_schema)

@router.get("/thuoc/{thuoc_id}/history")
def get_xuat_history_by_thuoc(thuoc_id: int, db: Session = Depends(get_db)):
    """Lấy lịch sử xuất của một loại thuốc"""
    history = db.query(models.CT_PhieuXuat).join(models.PhieuXuat).filter(
        models.CT_PhieuXuat.MaThuoc == thuoc_id
    ).order_by(models.PhieuXuat.NgayXuat.desc()).all()

    return [{
        "MaCTPhieuXuat": item.MaCTPhieuXuat,
        "MaPhieuXuat": item.MaPhieuXuat,
        "SoLuongXuat": item.SoLuongXuat,
        "GiaBan": item.GiaBan,
        "NgayXuat": item.phieuxuat.NgayXuat if hasattr(item, 'phieuxuat') else None,
        "NguoiLap": item.phieuxuat.NguoiLap if hasattr(item, 'phieuxuat') else None
    } for item in history]

@router.get("/tonkho/warning")
def get_low_stock_warning(min_quantity: int = 10, db: Session = Depends(get_db)):
    """Cảnh báo thuốc sắp hết hàng"""
    low_stock_drugs = db.query(models.Thuoc).filter(
        models.Thuoc.TonKho <= min_quantity,
        models.Thuoc.DaXoa == False
    ).all()

    return [{
        "MaThuoc": drug.MaThuoc,
        "TenThuoc": drug.TenThuoc,
        "TonKho": drug.TonKho,
        "DonViTinh": drug.DonViTinh,
        "GiaBan": drug.GiaBan
    } for drug in low_stock_drugs]
