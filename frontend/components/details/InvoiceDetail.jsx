export default function InvoiceDetail({ data }) {
    if (!data || !Array.isArray(data.thuocs) || data.thuocs.length === 0) {
        return <p className="text-sm italic text-gray-500 px-2 py-1">Không có chi tiết thuốc trong hóa đơn.</p>;
    }

    return (
        <table className="w-full text-sm border">
            <thead className="bg-gray-100 text-left">
                <tr>
                    <th className="border px-2 py-1">#</th>
                    <th className="border px-2 py-1">Tên thuốc</th>
                    <th className="border px-2 py-1">Đơn vị</th>
                    <th className="border px-2 py-1 text-center">SL</th>
                    <th className="border px-2 py-1 text-right">Giá</th>
                    <th className="border px-2 py-1 text-right">Cộng</th>
                </tr>
            </thead>
            <tbody>
                {data.thuocs.map((t, i) => (
                    <tr key={t.MaCTHoaDonThuoc || i}>
                        <td className="border px-2 py-1 text-center">{i + 1}</td>
                        <td className="border px-2 py-1">{t.thuoc?.TenThuoc || "(Không rõ)"}</td>
                        <td className="border px-2 py-1">{t.thuoc?.DonViTinh || "-"}</td>
                        <td className="border px-2 py-1 text-center">{t.SoLuongBan}</td>
                        <td className="border px-2 py-1 text-right">{(t.GiaBan || 0).toLocaleString()} ₫</td>
                        <td className="border px-2 py-1 text-right">{(t.ThanhTienThuoc || 0).toLocaleString()} ₫</td>
                    </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                    <td colSpan="5" className="px-2 py-1 text-right border">Tổng cộng</td>
                    <td className="px-2 py-1 text-right border text-red-600">
                        {(data.TongTienThuoc || 0).toLocaleString()} ₫
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
