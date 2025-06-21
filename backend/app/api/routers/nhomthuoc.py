from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.db.dependency import get_db

router = APIRouter(
    prefix="/nhomthuoc",
    tags=["Nhóm thuốc"]
)

# CREATE
@router.post("/", response_model=schemas.NhomThuocOut)
def create_nhomthuoc(data: schemas.NhomThuocCreate, db: Session = Depends(get_db)):
    item = models.NhomThuoc(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

# READ ALL (chỉ lấy chưa xóa nếu có DaXoa)
@router.get("/", response_model=list[schemas.NhomThuocOut])
def get_all_nhomthuoc(db: Session = Depends(get_db)):
    return db.query(models.NhomThuoc).filter(
        models.NhomThuoc.DaXoa != True if hasattr(models.NhomThuoc, "DaXoa") else True
    ).all()

# READ ONE
@router.get("/{id}", response_model=schemas.NhomThuocOut)
def get_nhomthuoc_by_id(id: int, db: Session = Depends(get_db)):
    item = db.query(models.NhomThuoc).filter(models.NhomThuoc.MaNhomThuoc == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhóm thuốc")
    return item

# UPDATE
@router.put("/{id}", response_model=schemas.NhomThuocOut)
def update_nhomthuoc(id: int, data: schemas.NhomThuocUpdate, db: Session = Depends(get_db)):
    item = db.query(models.NhomThuoc).filter(models.NhomThuoc.MaNhomThuoc == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhóm thuốc")
    for attr, value in data.model_dump().items():
        setattr(item, attr, value)
    db.commit()
    db.refresh(item)
    return item

# DELETE SOFT
@router.delete("/{id}")
def soft_delete_nhomthuoc(id: int, db: Session = Depends(get_db)):
    item = db.query(models.NhomThuoc).filter(models.NhomThuoc.MaNhomThuoc == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhóm thuốc")
    if hasattr(item, "DaXoa"):
        item.DaXoa = True
    else:
        db.delete(item)
    db.commit()
    return {"message": "Nhóm thuốc đã bị xoá"}
