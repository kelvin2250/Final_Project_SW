import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

const API_URL = "http://localhost:8000/api";

export default function InvoiceForm() {
    const { MaPhieuKham, MaHoaDon } = useParams();
    const navigate = useNavigate();
    const isKhachLe = !MaPhieuKham && !MaHoaDon;

    const [benhNhan, setBenhNhan] = useState(null);
    const [ghiChu, setGhiChu] = useState("");
    const [thuocList, setThuocList] = useState([]);
    const [allDrugs, setAllDrugs] = useState([]);
    const [form, setForm] = useState({
        NgayLap: new Date().toISOString().slice(0, 10),
        NguoiLap: "ThanhPhat",
        GhiChu: "",
    });

    useEffect(() => {
        if (MaHoaDon) {
            fetch(`${API_URL}/hoadon/${MaHoaDon}`)
                .then(res => res.json())
                .then(data => {
                    setBenhNhan({ HoTen: data.benhnhan?.HoTen || "Khách lẻ", MaBenhNhan: data.MaBenhNhan });
                    setForm({ NgayLap: new Date(data.NgayLap).toISOString().slice(0, 10), NguoiLap: data.NguoiLap });
                    setGhiChu(data.GhiChu || "");
                    setThuocList(data.thuocs.map(t => ({
                        MaThuoc: t.MaThuoc,
                        TenThuoc: t.thuoc?.TenThuoc || "Unknown",
                        SoLuong: t.SoLuongBan,
                        GiaBan: t.GiaBan,
                    })));
                });
        } else if (MaPhieuKham) {
            Promise.all([
                fetch(`${API_URL}/phieukham/${MaPhieuKham}`).then(res => res.json()),
                fetch(`${API_URL}/phieukham/${MaPhieuKham}/thuoc`).then(res => res.json())
            ]).then(([phieu, thuocs]) => {
                setBenhNhan(phieu.benhnhan);
                setThuocList(thuocs.map(t => ({
                    MaThuoc: t.MaThuoc,
                    TenThuoc: t.TenThuoc || "Unknown",
                    SoLuong: t.SoLuong,
                    GiaBan: t.GiaBan || 0,
                })));
            });
        } else {
            setBenhNhan({ HoTen: "Khách lẻ", MaBenhNhan: null });
            fetch(`${API_URL}/thuoc`)
                .then(res => res.json())
                .then(setAllDrugs);
        }
    }, [MaPhieuKham, MaHoaDon]);

    const handleDrugChange = (index, field, value) => {
        const updated = [...thuocList];
        updated[index][field] = value;
        setThuocList(updated);
    };

    const handleSelectDrug = (option) => {
        const drug = option.data;
        if (!thuocList.some(t => t.MaThuoc === drug.MaThuoc)) {
            setThuocList([...thuocList, { ...drug, SoLuong: 1 }]);
        }
    };

    const totalThuoc = thuocList.reduce((sum, t) => sum + (t.SoLuong || 0) * (t.GiaBan || 0), 0);

    const handleSubmit = async () => {
        if (thuocList.length === 0 || thuocList.every(t => !t.SoLuong || t.SoLuong <= 0)) {
            alert("Vui lòng chọn ít nhất một thuốc.");
            return;
        }
        const payload = {
            MaBenhNhan: benhNhan?.MaBenhNhan ?? null,
            MaPhieuKham: MaPhieuKham ?? null,
            NgayLap: form.NgayLap,
            NguoiLap: form.NguoiLap,
            GhiChu: ghiChu,
            TrangThai: "Chưa thanh toán",
            TongTienThuoc: totalThuoc,
            TongTienDichVu: 0,
            TongTienThanhToan: totalThuoc,
            thuocs: thuocList.map(t => ({
                MaThuoc: t.MaThuoc,
                SoLuongBan: t.SoLuong,
                GiaBan: t.GiaBan,
                ThanhTienThuoc: t.GiaBan * t.SoLuong
            })),
            dichvus: [],
        };

        const url = `${API_URL}/hoadon${MaHoaDon ? `/${MaHoaDon}` : ""}`;
        const method = MaHoaDon ? "PUT" : "POST";

        try {
            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            alert(`✅ ${MaHoaDon ? "Cập nhật" : "Tạo"} hóa đơn thành công!`);
            navigate("/invoices");
        } catch (err) {
            alert("Lỗi khi lưu hóa đơn");
            console.error(err);
        }
    };

    const drugOptions = allDrugs.map(d => ({
        value: d.MaThuoc,
        label: `${d.TenThuoc} - ${d.GiaBan.toLocaleString()}₫`,
        data: d
    }));

    return (
        <div className="mt-20 px-6">
            <div className="bg-white shadow rounded p-4 max-w-6xl mx-auto">
                <h2 className="text-lg font-bold mb-3 text-emerald-700">🧾 {MaHoaDon ? "Chỉnh sửa hóa đơn" : isKhachLe ? "Hóa đơn khách lẻ" : "Hóa đơn từ phiếu khám"}</h2>
                <p><strong>Bệnh nhân:</strong> {benhNhan?.HoTen}</p>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <input type="date" className="border px-2 py-1 rounded" value={form.NgayLap} onChange={e => setForm({ ...form, NgayLap: e.target.value })} />
                    <input type="text" className="border px-2 py-1 rounded" value={form.NguoiLap} onChange={e => setForm({ ...form, NguoiLap: e.target.value })} placeholder="Người lập" />
                </div>

                <h3 className="mt-4 font-semibold text-emerald-600">📦 Danh sách thuốc</h3>
                <table className="w-full text-sm border mt-2">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-1">#</th>
                            <th className="border px-2 py-1">Tên thuốc</th>
                            <th className="border px-2 py-1">SL</th>
                            <th className="border px-2 py-1">Giá</th>
                            <th className="border px-2 py-1">Tổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {thuocList.map((t, i) => (
                            <tr key={t.MaThuoc}>
                                <td className="border px-2 py-1">{i + 1}</td>
                                <td className="border px-2 py-1">{t.TenThuoc}</td>
                                <td className="border px-2 py-1">
                                    <input type="number" min="1" value={t.SoLuong} onChange={e => handleDrugChange(i, "SoLuong", Number(e.target.value))} className="w-16 border rounded px-1" />
                                </td>
                                <td className="border px-2 py-1">{t.GiaBan.toLocaleString()}</td>
                                <td className="border px-2 py-1">{(t.GiaBan * t.SoLuong).toLocaleString()}</td>
                            </tr>
                        ))}
                        <tr className="font-semibold bg-gray-50 text-right">
                            <td colSpan={4} className="px-2 py-2 border">Tổng tiền</td>
                            <td className="px-2 py-2 border text-red-600">{totalThuoc.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>

                {isKhachLe && (
                    <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">➕ Tìm thuốc để thêm</h4>
                        <Select
                            options={drugOptions}
                            onChange={handleSelectDrug}
                            isSearchable
                            placeholder="Tìm theo tên thuốc..."
                        />
                    </div>
                )}

                <textarea className="w-full mt-4 border rounded px-3 py-2" rows={3} value={ghiChu} onChange={e => setGhiChu(e.target.value)} placeholder="Ghi chú" />

                <div className="flex justify-between items-center mt-6">
                    <button onClick={() => navigate("/invoices")} className="bg-gray-500 text-white px-4 py-2 rounded">Hủy</button>
                    <button onClick={handleSubmit} className="bg-emerald-600 text-white px-4 py-2 rounded">💾 {MaHoaDon ? "Cập nhật" : "Lưu hóa đơn"}</button>
                </div>
            </div>
        </div>
    );
}
