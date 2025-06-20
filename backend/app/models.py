from sqlalchemy import Column,Boolean, Integer, String, Date, DateTime, Enum, Text, ForeignKey, Float
from app.db.base import Base
from datetime import datetime, timezone
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
class BenhNhan(Base):
    __tablename__ = "BENHNHAN"

    MaBenhNhan = Column(Integer, primary_key=True, autoincrement=True)
    HoTen = Column(String(100), nullable=False)
    GioiTinh = Column(String(10))  # hoặc Enum("Nam", "Nu", "Khac")
    NamSinh = Column(Integer)
    DiaChi = Column(Text)
    SoDienThoai = Column(String(15))
    NgayKham = Column(Date)

    MaTinh = Column(Integer, ForeignKey("TINH.MaTinh"))
    MaQuan = Column(Integer, ForeignKey("QUAN.MaQuan"))
    MaNgheNghiep = Column(Integer, ForeignKey("NGHENGHIEP.MaNgheNghiep"))

    NgayTao = Column(DateTime, server_default=func.current_timestamp())

    CanNang = Column(Float)
    ChieuCao = Column(Float)
    Mach = Column(Integer)
    NhietDo = Column(Float)
    HuyetAp = Column(String(20))
    TienSu = Column(Text)
    Nhom = Column(Text)
    DaXoa = Column(Boolean, default=False) 
class Tinh(Base):
    __tablename__ = "TINH"
    MaTinh = Column(Integer, primary_key=True, autoincrement=True)
    TenTinh = Column(String(100), nullable=True)

class Quan(Base):
    __tablename__ = "QUAN"
    MaQuan = Column(Integer, primary_key=True, autoincrement=True)
    MaTinh = Column(Integer, ForeignKey("TINH.MaTinh"))
    TenQuan = Column(String(100), nullable=True)

class NgheNghiep(Base):
    __tablename__ = "NGHENGHIEP"
    MaNgheNghiep = Column(Integer, primary_key=True, autoincrement=True)
    TenNgheNghiep = Column(String(100), nullable=True)

class NhomThuoc(Base):
    __tablename__ = "NHOMTHUOC"
    MaNhomThuoc = Column(Integer, primary_key=True, autoincrement=True)
    TenNhomThuoc = Column(String(100), nullable=False)  # Bắt buộc
    MoTaNhomThuoc = Column(Text, nullable=False)  # Bắt buộc


class Thuoc(Base):
    __tablename__ = "THUOC"
    MaThuoc = Column(Integer, primary_key=True, autoincrement=True)
    TenThuoc = Column(String(100), nullable=False)
    DonViTinh = Column(String(20), nullable=True)
    GiaBan = Column(Integer, nullable=True)
    TonKho = Column(Integer, nullable=True)
    CachDung = Column(Text, nullable=True)
    SoDangKy = Column(String(50), nullable=True)
    MaNhomThuoc = Column(Integer, ForeignKey("NHOMTHUOC.MaNhomThuoc"))
    NgayTao = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    DaXoa = Column(Boolean, default=False)  

class NhomDVDT(Base):
    __tablename__ = "NHOMDVDT"
    MaNhomDVDT = Column(Integer, primary_key=True, autoincrement=True)
    TenNhomDVDT = Column(String(100), nullable=True)
    GhiChu = Column(Text, nullable=True)

class DVDT(Base):
    __tablename__ = "DVDT"
    MaDVDT = Column(Integer, primary_key=True, autoincrement=True)
    TenDVDT = Column(String(100), nullable=True)
    DonViTinh = Column(String(20), nullable=True)
    DonGia = Column(Integer, nullable=True)
    MoTa = Column(Text, nullable=True)
    MaNhomDVDT = Column(Integer, ForeignKey("NHOMDVDT.MaNhomDVDT"))
    NgayTao = Column(DateTime, default=datetime.utcnow)

class PhieuKham(Base):
    __tablename__ = "PHIEUKHAM"
    MaPhieuKham = Column(Integer, primary_key=True, autoincrement=True)
    MaBenhNhan = Column(Integer, ForeignKey("BENHNHAN.MaBenhNhan"))
    ChanDoan = Column(Text, nullable=True)
    NgayLap = Column(Date, nullable=True)
    NguoiLap = Column(String(100), nullable=True)
    GhiChu = Column(Text, nullable=True)
    TaiKham = Column(Date, nullable=True)
    TrangThai = Column(Boolean, default=True)
    benhnhan = relationship("BenhNhan")

class CT_Thuoc(Base):
    __tablename__ = "CT_THUOC"
    MaCTThuoc = Column(Integer, primary_key=True, autoincrement=True)
    MaPhieuKham = Column(Integer, ForeignKey("PHIEUKHAM.MaPhieuKham"))
    MaThuoc = Column(Integer, ForeignKey("THUOC.MaThuoc"))
    SoLuong = Column(Integer, nullable=True)


class CT_DVDT(Base):
    __tablename__ = "CT_DVDT"
    MaCTDVDT = Column(Integer, primary_key=True, autoincrement=True)
    MaPhieuKham = Column(Integer, ForeignKey("PHIEUKHAM.MaPhieuKham"))
    MaDVDT = Column(Integer, ForeignKey("DVDT.MaDVDT"))
    GhiChu = Column(Text, nullable=True)

class PhieuNhap(Base):
    __tablename__ = "PHIEUNHAP"
    MaPhieuNhap = Column(Integer, primary_key=True, autoincrement=True)
    NhaCungCap = Column(String(100), nullable=True)
    NgayNhap = Column(Date, nullable=True)
    NguoiLap = Column(String(100), nullable=True)
    GhiChu = Column(Text, nullable=True)
    NgayTao = Column(DateTime, default=datetime.utcnow)

class CT_PhieuNhap(Base):
    __tablename__ = "CT_PHIEUNHAP"
    MaCTPhieuNhap = Column(Integer, primary_key=True, autoincrement=True)
    MaPhieuNhap = Column(Integer, ForeignKey("PHIEUNHAP.MaPhieuNhap"))
    MaThuoc = Column(Integer, ForeignKey("THUOC.MaThuoc"))
    SoLuongNhap = Column(Integer, nullable=True)
    GiaNhap = Column(Integer, nullable=True)
    GiaBan = Column(Integer, nullable=True)
    HanSuDung = Column(Date, nullable=True)

class PhieuXuat(Base):
    __tablename__ = "PHIEUXUAT"
    MaPhieuXuat = Column(Integer, primary_key=True, autoincrement=True)
    NgayXuat = Column(Date, nullable=True)
    NguoiLap = Column(String(100), nullable=True)
    GhiChu = Column(Text, nullable=True)
    NgayTao = Column(DateTime, default=datetime.utcnow)

class CT_PhieuXuat(Base):
    __tablename__ = "CT_PHIEUXUAT"
    MaCTPhieuXuat = Column(Integer, primary_key=True, autoincrement=True)
    MaPhieuXuat = Column(Integer, ForeignKey("PHIEUXUAT.MaPhieuXuat"))
    MaThuoc = Column(Integer, ForeignKey("THUOC.MaThuoc"))
    SoLuongXuat = Column(Integer, nullable=True)
    GiaBan = Column(Integer, nullable=True)

class HoaDon(Base):
    __tablename__ = "HOADON"
    MaHoaDon = Column(Integer, primary_key=True, autoincrement=True)
    MaBenhNhan = Column(Integer, ForeignKey("BENHNHAN.MaBenhNhan"))
    MaPhieuKham = Column(Integer, ForeignKey("PHIEUKHAM.MaPhieuKham"))
    NgayLap = Column(Date, nullable=True)
    TongTienThuoc = Column(Float, nullable=True)
    TongTienDichVu = Column(Float, nullable=True)
    TongTienThanhToan = Column(Float, nullable=True)
    TrangThai = Column(String(50), default='Đã thanh toán')
    NguoiLap = Column(String(100), nullable=True)
    GhiChu = Column(Text, nullable=True)
    NgayTao = Column(DateTime, default=datetime.utcnow)
    DaXoa = Column(Boolean, default=False) 


class CT_HoaDonThuoc(Base):
    __tablename__ = "CT_HOADON_THUOC"
    MaCTHoaDonThuoc = Column(Integer, primary_key=True, autoincrement=True)
    MaHoaDon = Column(Integer, ForeignKey("HOADON.MaHoaDon"))
    MaThuoc = Column(Integer, ForeignKey("THUOC.MaThuoc"))
    SoLuongBan = Column(Integer, nullable=True)
    GiaBan = Column(Float, nullable=True)
    ThanhTienThuoc = Column(Float, nullable=True)


class CT_HoaDonDVDT(Base):
    __tablename__ = "CT_HOADON_DVDT"
    MaCTHoaDonDVDT = Column(Integer, primary_key=True, autoincrement=True)
    MaHoaDon = Column(Integer, ForeignKey("HOADON.MaHoaDon"))
    MaDVDT = Column(Integer, ForeignKey("DVDT.MaDVDT"))
    GiaDichVu = Column(Float, nullable=True)
    ThanhTienDichVu = Column(Float, nullable=True)


class BaoCao(Base):
    __tablename__ = "BAOCAO"
    MaBaoCao = Column(Integer, primary_key=True, autoincrement=True)
    LoaiBaoCao = Column(String(100), nullable=True)
    ThoiGianBaoCao = Column(Date, nullable=True)
    NguoiLap = Column(String(100), nullable=True)
    GhiChu = Column(Text, nullable=True)
    NgayTao = Column(DateTime, default=datetime.utcnow)

class CT_BaoCao(Base):
    __tablename__ = "CT_BAOCAO"
    MaCTBaoCao = Column(Integer, primary_key=True, autoincrement=True)
    MaBaoCao = Column(Integer, ForeignKey("BAOCAO.MaBaoCao"))
    TongSoBenhNhan = Column(Integer, nullable=True)
    TongThuocBanRa = Column(Integer, nullable=True)
    TongTienThuoc = Column(Integer, nullable=True)
    TongTienDichVu = Column(Integer, nullable=True)
    TongDoanhThu = Column(Integer, nullable=True)
