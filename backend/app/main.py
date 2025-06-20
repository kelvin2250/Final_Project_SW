from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import benhnhan, phieukham, dvdt, thuoc, hoadon, nhomthuoc

app = FastAPI()

# ✅ Đặt trước include_router
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # hoặc ["*"] nếu đang test
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