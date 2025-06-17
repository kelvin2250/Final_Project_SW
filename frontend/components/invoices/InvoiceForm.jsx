import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPhieuKhamById, fetchChiTietThuoc, fetchChiTietDVDT, createInvoice } from "../../src/api";

export default function InvoiceForm() {
    const { MaPhieuKham } = useParams();
    const navigate = useNavigate();

    const [benhNhan, setBenhNhan] = useState(null);
    const [ghiChu, setGhiChu] = useState("");
    const [thuocList, setThuocList] = useState([]);
    const [dvdtList, setDvdtList] = useState([]);
    const [form, setForm] = useState({
        NgayLap: new Date().toISOString().slice(0, 10),
        NguoiLap: "ThanhPhat",
        GhiChu: "",
    });

    useEffect(() => {
        if (MaPhieuKham) {
            fetchPhieuKhamById(MaPhieuKham).then((phieu) => {
                setBenhNhan(phieu.benhnhan);
            });
            fetchChiTietThuoc(MaPhieuKham).then(setThuocList);
            fetchChiTietDVDT(MaPhieuKham).then(setDvdtList);
        } else {
            setBenhNhan({ HoTen: "Khách lẻ" });
        }
    }, [MaPhieuKham]);    

    const handleDrugChange = (index, field, value) => {
        const updated = [...thuocList];
        updated[index][field] = value;
        setThuocList(updated);
    };

    const totalThuoc = thuocList.reduce((sum, d) => sum + (d.SoLuong || 0) * (d.GiaBan || 0), 0);
    const totalDV = dvdtList.reduce((sum, d) => sum + (d.GiaDichVu || 0), 0);
    const total = totalThuoc + totalDV;

    const handleSubmit = async () => {
        const hoaDon = {
            MaBenhNhan: benhNhan?.MaBenhNhan || null,
            MaPhieuKham: MaPhieuKham || null,
            NgayLap: form.NgayLap,
            NguoiLap: form.NguoiLap,
            TongTienThuoc: totalThuoc,
            TongTienDichVu: totalDV,
            TongTienThanhToan: total,
            GhiChu: ghiChu,
        };

        const chiTietThuoc = thuocList.map((t) => ({
            MaThuoc: t.MaThuoc,
            SoLuongBan: t.SoLuong,
            GiaBan: t.GiaBan,
            ThanhTienThuoc: (t.SoLuong || 0) * (t.GiaBan || 0),
        }));

        const chiTietDV = dvdtList.map((d) => ({
            MaDVDT: d.MaDVDT,
            GiaDichVu: d.GiaDichVu,
            ThanhTienDichVu: d.GiaDichVu,
        }));

        try {
            await createInvoice(hoaDon, chiTietThuoc, chiTietDV);
            alert("✅ Đã lưu hóa đơn thành công!");
            navigate("/invoices");
        } catch (err) {
            console.error("❌ Lỗi khi lưu hóa đơn:", err);
            alert("Lỗi khi gửi dữ liệu.");
        }
    };

    return (
        <div className="mt-20 px-6">
            <div className="bg-white shadow rounded p-4 max-w-6xl mx-auto">
                <h2 className="text-lg font-bold mb-3 text-emerald-700">
                    🧾 Hóa đơn {MaPhieuKham ? "từ phiếu khám" : "khách lẻ"}
                </h2>

                <div className="mb-4">
                    <p><strong>Bệnh nhân:</strong> {benhNhan?.HoTen || "Khách lẻ"}</p>
                    <p><strong>Ngày lập:</strong> {form.NgayLap}</p>
                    <p><strong>Người lập:</strong> {form.NguoiLap}</p>
                </div>

                <h3 className="font-semibold text-emerald-600">📦 Danh sách thuốc</h3>
                <table className="w-full border mt-2 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-1">#</th>
                            <th className="border px-2 py-1">Tên thuốc</th>
                            <th className="border px-2 py-1">Số lượng</th>
                            <th className="border px-2 py-1">Đơn giá</th>
                            <th className="border px-2 py-1">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {thuocList.map((t, i) => (
                            <tr key={i} className="text-center">
                                <td className="border px-2 py-1">{i + 1}</td>
                                <td className="border px-2 py-1 text-left">{t.TenThuoc}</td>
                                <td className="border px-2 py-1">
                                    <input type="number" value={t.SoLuong} onChange={(e) => handleDrugChange(i, "SoLuong", Number(e.target.value))} className="w-16 border rounded px-1" />
                                </td>
                                <td className="border px-2 py-1">{t.GiaBan?.toLocaleString()}</td>
                                <td className="border px-2 py-1 text-red-600 font-semibold">
                                    {(t.SoLuong * t.GiaBan)?.toLocaleString() || 0}
                                </td>
                            </tr>
                        ))}
                        <tr className="font-semibold text-right bg-gray-50">
                            <td colSpan={4} className="px-2 py-2 border">Tổng tiền thuốc</td>
                            <td className="px-2 py-2 border text-red-600">{totalThuoc.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="mt-4">
                    <label className="block font-medium mb-1">📝 Ghi chú</label>
                    <textarea
                        className="w-full border rounded px-3 py-2"
                        rows={3}
                        placeholder="Ghi chú cho hóa đơn..."
                        value={ghiChu}
                        onChange={(e) => setGhiChu(e.target.value)}
                    />
                </div>

                <div className="flex justify-between items-center mt-6">
                    <div>
                        <button
                            onClick={() => navigate("/invoices")}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Hủy
                        </button>
                    </div>
                    <div className="text-right">
                        <div className="mb-1">
                            <strong>Tổng tiền:</strong> {total.toLocaleString()} ₫
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
                        >
                            Lưu hóa đơn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
