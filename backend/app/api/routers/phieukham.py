from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.dependency import get_db
from app.schemas import PhieuKhamCreate, PhieuKhamOut
from app.crud import phieukham as crud

router = APIRouter(prefix="/phieukham", tags=["Phiếu khám bệnh"])

@router.post("/", response_model=PhieuKhamOut)
def create(data: PhieuKhamCreate, db: Session = Depends(get_db)):
    return crud.create_phieukham(db, data)

@router.put("/{id}", response_model=PhieuKhamOut)
def update(id: int, data: PhieuKhamCreate, db: Session = Depends(get_db)):
    phieu = crud.update_phieukham(db, id, data)
    if not phieu:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu khám")
    return phieu

@router.get("/", response_model=list[PhieuKhamOut])
def get_all(db: Session = Depends(get_db)):
    return crud.get_all_phieukhams(db)

@router.get("/{id}", response_model=PhieuKhamOut)
def get_one(id: int, db: Session = Depends(get_db)):
    phieu = crud.get_phieukham_by_id(db, id)
    if not phieu:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu khám")
    return phieu

@router.get("/{maPK}/thuoc")
def get_ctthuoc(maPK: int, db: Session = Depends(get_db)):
    return crud.get_thuoc_by_phieu_kham(db, maPK)

@router.get("/{maPK}/dvdt")
def get_ctdvdt(maPK: int, db: Session = Depends(get_db)):
    return crud.get_dvdt_by_phieu_kham(db, maPK)
@router.delete("/{id}", response_model=PhieuKhamOut)

def delete(id: int, db: Session = Depends(get_db)):
    phieu = crud.delete_phieukham(db, id)
    if not phieu:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu khám để xoá")
    return phieu
