export default function PatientDetail({ data }) {
    if (!data) return <p>Không có dữ liệu bệnh nhân.</p>;
    return (
        <div className="bg-white border p-4 shadow rounded text-sm">
            <h2 className="text-lg font-semibold mb-2">🧍 Thông tin bệnh nhân</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div><strong>Mã bệnh nhân:</strong> {data.MaBenhNhan}</div>
                <div><strong>Tên:</strong> {data.HoTen}</div>
                <div><strong>Giới tính:</strong> {data.GioiTinh}</div>
                <div><strong>Năm Sinh:</strong> {data.NamSinh}</div>
                <div><strong>Điện thoại:</strong> {data.SoDienThoai}</div>
                <div><strong>Địa chỉ:</strong> {data.DiaChi}</div>
                <div><strong>Nghề nghiệp:</strong> {data.MaNgheNghiep}</div>
                <div><strong>Tiền sử:</strong> {data.TienSu}</div>
            </div>
            <div className="mt-2 text-sm">
                <strong>Sinh hiệu:</strong> Mạch: {data.Mach}, Thân nhiệt: {data.NhietDo}°C, Huyết áp: {data.HuyetAp}, Cân nặng: {data.CanNang}
            </div>
        </div>
    );
}
