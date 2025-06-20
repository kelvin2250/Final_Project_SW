from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.db.dependency import get_db
from app.crud import benhnhan
from app import models, schemas
router = APIRouter(
    prefix="/benhnhan",
    tags=["Bệnh nhân"]
)

@router.post("/", response_model=schemas.BenhNhanOut)
def create_benhnhan(data: schemas.BenhNhanCreate, db: Session = Depends(get_db)):
    return benhnhan.create_benhnhan(db, data)

@router.get("/{id}", response_model=schemas.BenhNhanOut)
def get_benhnhan(id: int, db: Session = Depends(get_db)):
    bn = benhnhan.get_benhnhan(db, id)
    if not bn:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh nhân")
    return bn

@router.get("/", response_model=list[schemas.BenhNhanOut])
def list_benhnhan(db: Session = Depends(get_db)):
    return benhnhan.get_all_benhnhan(db)


@router.put("/{id}", response_model=schemas.BenhNhanOut)
def update_benhnhan(
    id: int,
    payload: schemas.BenhNhanUpdate = Body(...),  # 🔥 QUAN TRỌNG!
    db: Session = Depends(get_db)
):
    return benhnhan.update_benhnhan_byId(id, payload, db)



@router.delete("/{id}")
def soft_delete_benhnhan(id: int, db: Session = Depends(get_db)):
    return benhnhan.delete_benhnhan_byID(id, db)

@router.get("/{id}/phieukhams", response_model=list[schemas.PhieuKhamOut])
def get_phieukhams_by_patient(id: int, db: Session = Depends(get_db)):
    return db.query(models.PhieuKham).filter(
        models.PhieuKham.MaBenhNhan == id,
        models.PhieuKham.TrangThai != False
        ).all()

@router.get("/{id}/hoadons", response_model=list[schemas.HoaDonOut])
def get_invoices_by_patient(id: int, db: Session = Depends(get_db)):
    return db.query(models.HoaDon).filter(
        models.HoaDon.MaBenhNhan == id,
        models.HoaDon.DaXoa != True
        ).all()
