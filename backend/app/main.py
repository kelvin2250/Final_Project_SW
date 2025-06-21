from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import benhnhan, phieukham, dvdt, thuoc, hoadon, nhomthuoc, baocao, phieunhap, phieuxuat

app = FastAPI()

# ✅ Đặt trước include_router
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # hoặc ["*"] nếu đang test
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Sau đó mới include router
app.include_router(benhnhan.router, prefix="/api")
app.include_router(phieukham.router, prefix="/api")
app.include_router(thuoc.router, prefix="/api")
app.include_router(nhomthuoc.router, prefix="/api")
app.include_router(dvdt.router, prefix="/api")
app.include_router(hoadon.router, prefix="/api")
app.include_router(baocao.router, prefix="/api")
app.include_router(phieunhap.router, prefix="/api")
app.include_router(phieuxuat.router, prefix="/api")
