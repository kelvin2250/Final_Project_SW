from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.db.dependency import get_db
from app.crud import phieunhap
from app import models, schemas

router = APIRouter(
    prefix="/phieunhap",
    tags=["Phiếu nhập"]
)

@router.post("/", response_model=schemas.PhieuNhapOut)
def create_phieunhap(data: schemas.PhieuNhapCreate, db: Session = Depends(get_db)):
    """Tạo phiếu nhập mới"""
    return phieunhap.create_phieunhap(db, data)

@router.get("/{id}", response_model=schemas.PhieuNhapOut)
def get_phieunhap(id: int, db: Session = Depends(get_db)):
    """Lấy thông tin phiếu nhập theo ID"""
    pn = phieunhap.get_phieunhap(db, id)
    if not pn:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu nhập")
    return pn

@router.get("/", response_model=list[schemas.PhieuNhapOut])
def list_phieunhap(db: Session = Depends(get_db)):
    """Lấy danh sách tất cả phiếu nhập"""
    return phieunhap.get_all_phieunhap(db)

@router.put("/{id}", response_model=schemas.PhieuNhapOut)
def update_phieunhap(
    id: int,
    payload: schemas.PhieuNhapUpdate = Body(...),
    db: Session = Depends(get_db)
):
    """Cập nhật thông tin phiếu nhập"""
    return phieunhap.update_phieunhap_byId(id, payload, db)

@router.delete("/{id}")
def delete_phieunhap(id: int, db: Session = Depends(get_db)):
    """Xóa phiếu nhập"""
    return phieunhap.delete_phieunhap_byID(id, db)

@router.get("/{id}/chitiet", response_model=list[schemas.CTPhieuNhapOut])
def get_chitiet_phieunhap(id: int, db: Session = Depends(get_db)):
    """Lấy chi tiết phiếu nhập"""
    # Kiểm tra phiếu nhập có tồn tại không
    pn = phieunhap.get_phieunhap(db, id)
    if not pn:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu nhập")

    return phieunhap.get_ct_phieunhap_by_phieunhap_id(db, id)

@router.post("/{id}/chitiet", response_model=schemas.CTPhieuNhapOut)
def add_chitiet_phieunhap(
    id: int,
    data: schemas.CTPhieuNhapCreate = Body(...),
    db: Session = Depends(get_db)
):
    """Thêm chi tiết vào phiếu nhập"""
    # Kiểm tra phiếu nhập có tồn tại không
    pn = phieunhap.get_phieunhap(db, id)
    if not pn:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu nhập")

    # Thêm MaPhieuNhap vào data
    data.MaPhieuNhap = id
    return phieunhap.create_ct_phieunhap(db, data)

@router.get("/thuoc/{thuoc_id}/history")
def get_nhap_history_by_thuoc(thuoc_id: int, db: Session = Depends(get_db)):
    """Lấy lịch sử nhập của một loại thuốc"""
    history = db.query(models.CT_PhieuNhap).join(models.PhieuNhap).filter(
        models.CT_PhieuNhap.MaThuoc == thuoc_id
    ).order_by(models.PhieuNhap.NgayNhap.desc()).all()

    return [{
        "MaCTPhieuNhap": item.MaCTPhieuNhap,
        "MaPhieuNhap": item.MaPhieuNhap,
        "SoLuongNhap": item.SoLuongNhap,
        "GiaNhap": item.GiaNhap,
        "GiaBan": item.GiaBan,
        "HanSuDung": item.HanSuDung,
        "NgayNhap": item.phieunhap.NgayNhap if hasattr(item, 'phieunhap') else None,
        "NhaCungCap": item.phieunhap.NhaCungCap if hasattr(item, 'phieunhap') else None
    } for item in history]
