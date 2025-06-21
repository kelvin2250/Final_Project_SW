from sqlalchemy.orm import Session
from app import models, schemas

def create_baocao(db: Session, data: schemas.BaoCaoBase):
    obj = models.BaoCao(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def create_ct_baocao(db: Session, data: schemas.CTBaoCaoBase):
    obj = models.CT_BaoCao(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def get_baocao_list(db: Session):
    return db.query(models.BaoCao).all()

def get_ct_baocao_list(db: Session, ma_baocao: int):
    return db.query(models.CT_BaoCao).filter(models.CT_BaoCao.MaBaoCao == ma_baocao).all()
