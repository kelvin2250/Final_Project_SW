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
