from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.dependency import get_db
from app import schemas
from app.crud import benhnhan

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
