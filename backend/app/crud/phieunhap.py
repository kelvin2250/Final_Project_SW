from sqlalchemy.orm import Session
from app import models, schemas
from fastapi import HTTPException
from typing import List

def create_phieunhap(db: Session, data: schemas.PhieuNhapCreate):
    """Create drug import receipt with proper inventory management"""

    # Validate that we have drug details
    if not data.chi_tiet or len(data.chi_tiet) == 0:
        raise HTTPException(status_code=400, detail="Phiếu nhập phải có ít nhất một loại thuốc")

    # Validate all drugs exist and quantities are positive
    for ct_data in data.chi_tiet:
        # Validate required fields
        if not ct_data.SoLuongNhap or ct_data.SoLuongNhap <= 0:
            raise HTTPException(status_code=400, detail="Số lượng nhập phải lớn hơn 0")
        if not ct_data.GiaNhap or ct_data.GiaNhap <= 0:
            raise HTTPException(status_code=400, detail="Giá nhập phải lớn hơn 0")

        # If MaThuoc is provided, check if drug exists
        if ct_data.MaThuoc:
            thuoc = db.query(models.Thuoc).filter(
                models.Thuoc.MaThuoc == ct_data.MaThuoc,
                models.Thuoc.DaXoa == False
            ).first()
            if not thuoc:
                raise HTTPException(status_code=404, detail=f"Không tìm thấy thuốc với mã {ct_data.MaThuoc}")
        else:
            # If MaThuoc is not provided, TenThuoc and DonViTinh are required
            if not ct_data.TenThuoc or not ct_data.DonViTinh:
                raise HTTPException(status_code=400, detail="Tên thuốc và đơn vị tính là bắt buộc khi tạo thuốc mới")

    try:
        # Create phieu nhap - exclude NgayTao to let DB auto-generate
        phieu_nhap_data = data.model_dump(exclude={'chi_tiet', 'NgayTao'})
        phieu_nhap = models.PhieuNhap(**phieu_nhap_data)
        db.add(phieu_nhap)
        db.flush()  # Get ID without committing

        # Create chi tiet phieu nhap and update inventory
        for ct_data in data.chi_tiet:
            # Get or create the drug
            if ct_data.MaThuoc:
                # Use existing drug
                thuoc = db.query(models.Thuoc).filter(models.Thuoc.MaThuoc == ct_data.MaThuoc).first()
                if not thuoc:
                    raise HTTPException(status_code=404, detail=f"Không tìm thấy thuốc với mã {ct_data.MaThuoc}")
                ma_thuoc = thuoc.MaThuoc
            else:
                # Create new drug
                new_thuoc_data = {
                    'TenThuoc': ct_data.TenThuoc,
                    'DonViTinh': ct_data.DonViTinh,
                    'CachDung': ct_data.CachDung,
                    'SoDangKy': ct_data.SoDangKy,
                    'MaNhomThuoc': ct_data.MaNhomThuoc,
                    'TonKho': 0,  # Start with 0, will be updated below
                    'GiaBan': float(ct_data.GiaBan) if ct_data.GiaBan else 0.0,
                    'DaXoa': False
                }
                thuoc = models.Thuoc(**new_thuoc_data)
                db.add(thuoc)
                db.flush()  # Get ID without committing
                ma_thuoc = thuoc.MaThuoc

            # Create detail record
            ct_dict = {
                'MaPhieuNhap': phieu_nhap.MaPhieuNhap,
                'MaThuoc': ma_thuoc,
                'SoLuongNhap': int(ct_data.SoLuongNhap),
                'GiaNhap': float(ct_data.GiaNhap),
                'GiaBan': float(ct_data.GiaBan) if ct_data.GiaBan else None,
                'HanSuDung': ct_data.HanSuDung
            }
            ct_phieu_nhap = models.CT_PhieuNhap(**ct_dict)
            db.add(ct_phieu_nhap)

            # Update drug inventory and pricing
            current_stock = getattr(thuoc, 'TonKho', 0) or 0
            new_stock = current_stock + int(ct_data.SoLuongNhap)
            setattr(thuoc, 'TonKho', new_stock)

            # Update selling price if provided
            if ct_data.GiaBan and ct_data.GiaBan > 0:
                setattr(thuoc, 'GiaBan', float(ct_data.GiaBan))

        db.commit()
        db.refresh(phieu_nhap)
        return phieu_nhap

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        import traceback
        error_detail = f"Lỗi khi tạo phiếu nhập: {str(e)}\nTraceback: {traceback.format_exc()}"
        print(f"Database error: {error_detail}")
        raise HTTPException(status_code=500, detail=error_detail)

def get_phieunhap(db: Session, id: int):
    """Get phieu nhap with its details"""
    return db.query(models.PhieuNhap).filter(models.PhieuNhap.MaPhieuNhap == id).first()

def get_all_phieunhap(db: Session):
    """Get all phieu nhap with their details"""
    return db.query(models.PhieuNhap).all()

def update_phieunhap_byId(id: int, payload: schemas.PhieuNhapUpdate, db: Session):
    """Update phieu nhap basic info (not the drug details)"""
    pn = db.query(models.PhieuNhap).filter(models.PhieuNhap.MaPhieuNhap == id).first()
    if not pn:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu nhập")

    # Only allow updating basic info, not the drug details
    # Changing drug quantities after import would mess up inventory
    updatable_fields = ['NhaCungCap', 'NgayNhap', 'NguoiLap', 'GhiChu']
    for field, value in payload.dict(exclude_unset=True).items():
        if field in updatable_fields:
            setattr(pn, field, value)

    db.commit()
    db.refresh(pn)
    return pn

def delete_phieunhap_byID(id: int, db: Session):
    """Delete phieu nhap and reverse inventory changes"""
    pn = db.query(models.PhieuNhap).filter(models.PhieuNhap.MaPhieuNhap == id).first()
    if not pn:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu nhập")

    try:
        # Get all details to reverse inventory changes
        chi_tiet_list = db.query(models.CT_PhieuNhap).filter(
            models.CT_PhieuNhap.MaPhieuNhap == id
        ).all()

        # Reverse inventory changes
        for ct in chi_tiet_list:
            thuoc = db.query(models.Thuoc).filter(models.Thuoc.MaThuoc == ct.MaThuoc).first()
            if thuoc:
                # Check if we have enough stock to reverse
                current_stock = getattr(thuoc, 'TonKho', 0) or 0
                import_quantity = getattr(ct, 'SoLuongNhap', 0) or 0
                if current_stock < import_quantity:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Không thể xóa phiếu nhập: Tồn kho thuốc {thuoc.TenThuoc} không đủ để hoàn tác"
                    )
                setattr(thuoc, 'TonKho', current_stock - import_quantity)

        # Delete chi tiet first (foreign key constraint)
        db.query(models.CT_PhieuNhap).filter(models.CT_PhieuNhap.MaPhieuNhap == id).delete()

        # Delete phieu nhap
        db.delete(pn)
        db.commit()

        return {"message": "Đã xóa phiếu nhập và hoàn tác tồn kho"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi khi xóa phiếu nhập: {str(e)}")

def get_ct_phieunhap_by_phieunhap_id(db: Session, phieunhap_id: int):
    """Get chi tiet phieu nhap with drug information"""
    return db.query(models.CT_PhieuNhap).filter(
        models.CT_PhieuNhap.MaPhieuNhap == phieunhap_id
    ).all()

def get_import_history_by_drug(db: Session, drug_id: int, limit: int = 10):
    """Get import history for a specific drug"""
    return db.query(models.CT_PhieuNhap).join(models.PhieuNhap).filter(
        models.CT_PhieuNhap.MaThuoc == drug_id
    ).order_by(models.PhieuNhap.NgayNhap.desc()).limit(limit).all()

def get_low_stock_drugs(db: Session, min_quantity: int = 10):
    """Get drugs with low stock levels"""
    return db.query(models.Thuoc).filter(
        models.Thuoc.TonKho <= min_quantity,
        models.Thuoc.DaXoa == False
    ).all()

def get_drugs_need_reorder(db: Session):
    """Get drugs that need to be reordered (stock level analysis)"""
    # This is a simplified version - in real business you'd have
    # reorder points, lead times, safety stock, etc.
    return get_low_stock_drugs(db, 5)
