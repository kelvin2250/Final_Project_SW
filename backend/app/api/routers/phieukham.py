from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.dependency import get_db
import app.crud.phieukham as crud
from app.schemas import PhieuKhamCreate, PhieuKhamOut

router = APIRouter(
    prefix="/phieukham",
    tags=["Phiếu khám bệnh"]
)

@router.post("/", response_model=PhieuKhamOut)
def create(data: PhieuKhamCreate, db: Session = Depends(get_db)):
    return crud.create_phieukham(db, data)

@router.get("/", response_model=list[PhieuKhamOut])
def get_all(db: Session = Depends(get_db)):
    return crud.get_all_phieukhams(db)

@router.get("/{id}", response_model=PhieuKhamOut)
def get_one(id: int, db: Session = Depends(get_db)):
    phieu = crud.get_phieukham_by_id(db, id)
    if not phieu:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu khám")
    return phieu
