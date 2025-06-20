from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
class TinhBase(BaseModel):
    TenTinh: Optional[str]
class TinhOut(TinhBase):
    MaTinh: int
    class Config:
        orm_mode = True

class QuanBase(BaseModel):
    TenQuan: Optional[str]
    MaTinh: int
class QuanOut(QuanBase):
    MaQuan: int
    class Config:
        orm_mode = True

class NgheNghiepBase(BaseModel):
    TenNgheNghiep: Optional[str]
class NgheNghiepOut(NgheNghiepBase):
    MaNgheNghiep: int
    class Config:
        orm_mode = True

class BenhNhanBase(BaseModel):
    HoTen: str
    GioiTinh: Optional[str] = None
    NamSinh: Optional[int] = None
    SoDienThoai: Optional[str] = None
    DiaChi: Optional[str] = None
    MaNgheNghiep: Optional[int] = None
    Nhom: Optional[str] = None
    CanNang: Optional[float] = None
    ChieuCao: Optional[float] = None
    Mach: Optional[int] = None
    NhietDo: Optional[float] = None
    HuyetAp: Optional[str] = None
    TienSu: Optional[str] = None
    NgayTao: Optional[datetime] = None  # dùng datetime vì DB đang để datetime
    
    
class BenhNhanCreate(BenhNhanBase):
    pass
class BenhNhanOut(BenhNhanBase):
    MaBenhNhan: int
    NgayTao: datetime
    class Config:
        orm_mode = True
class BenhNhanUpdate(BenhNhanBase):
    pass

    class Config:
        orm_mode = True


from pydantic import BaseModel

class NhomThuocBase(BaseModel):
    MaNhomThuoc: Optional[int] = None  # Tự động tạo trong DB, không cần gửi khi tạo
    TenNhomThuoc: str  # Bắt buộc
    MoTaNhomThuoc: str  # Bắt buộc

class NhomThuocCreate(NhomThuocBase):
    pass

class NhomThuocUpdate(NhomThuocBase):
    pass


class NhomThuocOut(NhomThuocBase):
    MaNhomThuoc: int
    class Config:
        orm_mode = True


class ThuocBase(BaseModel):
    TenThuoc: str
    DonViTinh: Optional[str] = None
    GiaBan: Optional[float]= None
    TonKho: Optional[int]= None
    CachDung: Optional[str] = None
    SoDangKy: Optional[str]= None   
    MaNhomThuoc: Optional[int]
    DaXoa: Optional[bool] = False 
class ThuocCreate(ThuocBase):
    pass
class ThuocOut(ThuocBase):
    MaThuoc: int
    NgayTao: datetime
    class Config:
        orm_mode = True
class NhomDVDTBase(BaseModel):
    TenNhomDVDT: Optional[str]
    GhiChu: Optional[str]
class NhomDVDTOut(NhomDVDTBase):
    MaNhomDVDT: int
    class Config:
        orm_mode = True

class DVDTBase(BaseModel):
    TenDVDT: Optional[str]
    DonViTinh: Optional[str]
    DonGia: Optional[float]
    MoTa: Optional[str]
    MaNhomDVDT: Optional[int]
class DVDTCreate(DVDTBase):
    pass
class DVDTOut(DVDTBase):
    MaDVDT: int
    NgayTao: datetime
    class Config:
        orm_mode = True


class CTThuocBase(BaseModel):
    MaPhieuKham: int
    MaThuoc: int
    SoLuong: Optional[int]
class CTThuocCreate(BaseModel):
    MaThuoc: int
    SoLuong: Optional[int]
class CTThuocOut(CTThuocBase):
    MaCTThuoc: int
    class Config:
        orm_mode = True

class CTDVDTBase(BaseModel):
    MaPhieuKham: int
    MaDVDT: int
    GhiChu: Optional[str]
class CTDVDTCreate(BaseModel):
    MaDVDT: int
    GhiChu: Optional[str]

class CTDVDTOut(CTDVDTBase):
    MaCTDVDT: int
    class Config:
        orm_mode = True


class PhieuKhamBase(BaseModel):
    MaBenhNhan: Optional[int] = None
    ChanDoan: Optional[str] = None
    NgayLap: Optional[date] = None
    NguoiLap: Optional[str] = None
    GhiChu: Optional[str] = None
    TaiKham: Optional[date] = None
    TrangThai: Optional[bool] = True


class PhieuKhamCreate(PhieuKhamBase):
    thuocs: Optional[list[CTThuocCreate]] = []
    dichvus: Optional[list[CTDVDTCreate]] = []

class PhieuKhamOut(PhieuKhamBase):
    MaPhieuKham: int
    benhnhan: Optional[BenhNhanOut]  
    class Config:
        orm_mode = True



class PhieuNhapBase(BaseModel):
    NhaCungCap: Optional[str]
    NgayNhap: Optional[date]
    NguoiLap: Optional[str]
    GhiChu: Optional[str]
class PhieuNhapOut(PhieuNhapBase):
    MaPhieuNhap: int
    NgayTao: datetime
    class Config:
        orm_mode = True

class CTPhieuNhapBase(BaseModel):
    MaPhieuNhap: int
    MaThuoc: int
    SoLuongNhap: Optional[int]
    GiaNhap: Optional[float]
    GiaBan: Optional[float]
    HanSuDung: Optional[date]
class CTPhieuNhapOut(CTPhieuNhapBase):
    MaCTPhieuNhap: int
    class Config:
        orm_mode = True

class PhieuXuatBase(BaseModel):
    NgayXuat: Optional[date]
    NguoiLap: Optional[str]
    GhiChu: Optional[str]
class PhieuXuatOut(PhieuXuatBase):
    MaPhieuXuat: int
    NgayTao: datetime
    class Config:
        orm_mode = True

class CTPhieuXuatBase(BaseModel):
    MaPhieuXuat: int
    MaThuoc: int
    SoLuongXuat: Optional[int]
    GiaBan: Optional[float]
class CTPhieuXuatOut(CTPhieuXuatBase):
    MaCTPhieuXuat: int
    class Config:
        orm_mode = True
class HoaDonBase(BaseModel):
    MaBenhNhan: int
    MaPhieuKham: Optional[int]
    NgayLap: Optional[date]
    TongTienThuoc: Optional[float]
    TongTienDichVu: Optional[float]
    TongTienThanhToan: Optional[float]
    TrangThai: Optional[str] = "Chưa thanh toán"
    NguoiLap: Optional[str]
    GhiChu: Optional[str]
    DaXoa: Optional[bool] = False

class HoaDonCreate(HoaDonBase):
    thuocs: list[CTThuocOut]
    dichvus: list[CTDVDTOut]
class HoaDonOut(HoaDonBase):
    MaHoaDon: int
    NgayTao: datetime
    class Config:
        orm_mode = True

class CTHoaDonThuocBase(BaseModel):
    MaHoaDon: int
    MaThuoc: int
    SoLuongBan: Optional[int]
    GiaBan: Optional[float]
    ThanhTienThuoc: Optional[float]
class CTHoaDonThuocOut(CTHoaDonThuocBase):
    MaCTHoaDonThuoc: int
    class Config:
        orm_mode = True

class CTHoaDonDVDTBase(BaseModel):
    MaHoaDon: int
    MaDVDT: int
    GiaDichVu: Optional[float]
    ThanhTienDichVu: Optional[float]
class CTHoaDonDVDTOut(CTHoaDonDVDTBase):
    MaCTHoaDonDVDT: int
    class Config:
        orm_mode = True
class BaoCaoBase(BaseModel):
    LoaiBaoCao: Optional[str]
    ThoiGianBaoCao: Optional[date]
    NguoiLap: Optional[str]
    GhiChu: Optional[str]
class BaoCaoOut(BaoCaoBase):
    MaBaoCao: int
    NgayTao: datetime
    class Config:
        orm_mode = True

class CTBaoCaoBase(BaseModel):
    MaBaoCao: int
    TongSoBenhNhan: Optional[int]
    TongThuocBanRa: Optional[int]
    TongTienThuoc: Optional[float]
    TongTienDichVu: Optional[float]
    TongDoanhThu: Optional[float]
class CTBaoCaoOut(CTBaoCaoBase):
    MaCTBaoCao: int
    class Config:
        orm_mode = True
