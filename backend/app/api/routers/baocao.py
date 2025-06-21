from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, schemas, services
from app.db.dependency import get_db

router = APIRouter(prefix="/baocao", tags=["Báo cáo"])

@router.post("/", response_model=schemas.BaoCaoOut)
def tao_baocao(data: schemas.BaoCaoBase, db: Session = Depends(get_db)):
    return services.create_baocao_service(db, data)

@router.post("/ct", response_model=schemas.CTBaoCaoOut)
def ct_baocao(data: schemas.CTBaoCaoBase, db: Session = Depends(get_db)):
    return services.create_ct_baocao_service(db, data)

@router.get("/", response_model=list[schemas.BaoCaoOut])
def list_baocao(db: Session = Depends(get_db)):
    return services.get_baocao_list_service(db)

@router.get("/ct/{ma_baocao}", response_model=list[schemas.CTBaoCaoOut])
def list_ct_baocao(ma_baocao: int, db: Session = Depends(get_db)):
    return services.get_ct_baocao_list_service(db, ma_baocao)
