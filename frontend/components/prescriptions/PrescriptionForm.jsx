import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PrescriptionForm() {
    const { MaBenhNhan } = useParams();  // sẽ trả về "3"
    const navigate = useNavigate();
    console.log(MaBenhNhan)
    const [form, setForm] = useState({
        HoTen: "",
        NamSinh: "",
        Mach: "",
        NhietDo: "",
        HuyetAp: "",
        CanNang: "",
        ChanDoan: "",
        TaiKham: "",
        GhiChu: "",
        ThoiGianDungThuoc: "1 Ngày",
    });

    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [drugs, setDrugs] = useState([]);
    const [selectedDrugs, setSelectedDrugs] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8000/api/benhnhan/${MaBenhNhan}`)
            .then(res => res.json())
            .then(data => {
                setForm(prev => ({
                    ...prev,
                    HoTen: data.HoTen,
                    NamSinh: data.NamSinh,
                    Mach: data.Mach,
                    NhietDo: data.NhietDo,
                    HuyetAp: data.HuyetAp,
                    CanNang: data.CanNang,
                }));
            })
            .catch(err => {
                console.error("❌ Lỗi fetch bệnh nhân:", err);
                alert("Không thể tải thông tin bệnh nhân");
            });

        fetch("http://localhost:8000/api/nhomthuoc")
            .then(res => res.json())
            .then(setGroups)
            .catch(console.error);

        fetch("http://localhost:8000/api/thuoc")
            .then(res => res.json())
            .then(setDrugs)
            .catch(console.error);
    }, [MaBenhNhan]);

    const handleInputChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const addDrug = (drug) => {
        setSelectedDrugs((prev) => [
            ...prev,
            { ...drug, CachDung: "", SoLuong: 1 }
        ]);
    };

    const updateDrugField = (index, field, value) => {
        const updated = [...selectedDrugs];
        updated[index][field] = value;
        setSelectedDrugs(updated);
    };

    const totalCost = selectedDrugs.reduce(
        (sum, d) => sum + (d.SoLuong || 0) * (d.GiaBan || 0),
        0
    );

    const handleSubmit = async () => {
        const payload = {
            MaBenhNhan: parseInt(MaBenhNhan),
            ChanDoan: form.ChanDoan,
            NgayLap: new Date().toISOString().split("T")[0],
            NguoiLap: "ThanhPhat",
            TaiKham: form.TaiKham || null,
            GhiChu: form.GhiChu,
            thuocs: selectedDrugs.map(d => ({
                MaThuoc: d.MaThuoc,
                SoLuong: d.SoLuong,
                CachDung: d.CachDung
            })),
            dichvus: [],
        };

        try {
            console.log("📦 Payload gửi lên:", payload);

            const res = await fetch("http://localhost:8000/api/phieukham", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                console.error("🪵 Chi tiết lỗi từ backend:", err);

                if (Array.isArray(err.detail)) {
                    err.detail.forEach((e, i) => {
                        console.error(`🔍 [${i}] Field: ${e.loc?.join('.')}, Error: ${e.msg}`);
                    });
                }

                alert("❌ Lỗi: " + (err.detail || JSON.stringify(err)));
                return;
            }
            const result = await res.json();
            alert("✅ Đã lưu phiếu khám #" + result.MaPhieuKham);
            navigate("/prescriptions");
        } catch (err) {
            console.error("Lỗi khi gửi đơn:", err);
            alert("❌ Gửi không thành công");
        }
    };

    const InputLine = ({ field, value, placeholder, unit }) => (
        <div className="relative w-full">
            <input
                type="text"
                placeholder={placeholder}
                className="w-full bg-transparent border-b border-dotted outline-none px-1 text-sm text-gray-700 placeholder-gray-400"
                value={value}
                onChange={(e) => handleInputChange(field, e.target.value)}
            />
            {unit && <span className="absolute right-2 top-1 text-sm text-gray-500">{unit}</span>}
        </div>
    );

    return (
        <div className="mt-20 px-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Nhóm thuốc */}
                <div className="bg-white shadow rounded p-4 col-span-1">
                    <h2 className="font-semibold text-teal-700 mb-2">📁 Nhóm thuốc</h2>
                    <ul className="h-[500px] overflow-y-scroll space-y-2">
                        {groups.map((g) => (
                            <li
                                key={g.MaNhomThuoc}
                                className={`p-2 rounded cursor-pointer ${selectedGroup === g.MaNhomThuoc
                                    ? "bg-emerald-600 text-white"
                                    : "bg-gray-100 hover:bg-emerald-100"
                                    }`}
                                onClick={() => setSelectedGroup(g.MaNhomThuoc)}
                            >
                                {g.TenNhomThuoc}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Danh sách thuốc */}
                <div className="bg-white shadow rounded p-4 col-span-1">
                    <h2 className="font-semibold text-teal-700 mb-2">📋 Thuốc</h2>
                    <div className="h-[500px] overflow-y-auto space-y-2">
                        {drugs
                            .filter(d => d.MaNhomThuoc === selectedGroup)
                            .map((d) => (
                                <div
                                    key={d.MaThuoc}
                                    className="p-2 bg-gray-100 rounded hover:bg-emerald-100 cursor-pointer"
                                    onClick={() => addDrug(d)}
                                >
                                    {d.TenThuoc}
                                </div>
                            ))}
                    </div>
                </div>

                {/* Phiếu khám */}
                <div className="bg-white shadow rounded p-4 col-span-3">
                    <h2 className="text-lg font-bold mb-4">📝 Phiếu khám bệnh</h2>

                    {/* Thông tin */}
                    <div className="grid grid-cols-4 gap-x-6 gap-y-2">
                        <div className="col-span-2 flex items-center gap-2"><label className="w-24">Họ tên:</label><InputLine field="HoTen" value={form.HoTen} /></div>
                        <div className="col-span-2 flex items-center gap-2"><label className="w-24">Năm sinh:</label><InputLine field="NamSinh" value={form.NamSinh} /></div>
                        <div className="col-span-2 flex items-center gap-2"><label className="w-24">Mạch:</label><InputLine field="Mach" value={form.Mach} unit="l/p" /></div>
                        <div className="col-span-2 flex items-center gap-2"><label className="w-30">Thân nhiệt:</label><InputLine field="NhietDo" value={form.NhietDo} unit="°C" /></div>
                        <div className="col-span-2 flex items-center gap-2"><label className="w-24">Huyết áp:</label><InputLine field="HuyetAp" value={form.HuyetAp} unit="mmHg" /></div>
                        <div className="col-span-2 flex items-center gap-2"><label className="w-24">Cân nặng:</label><InputLine field="CanNang" value={form.CanNang} unit="Kg" /></div>
                        <div className="col-span-4 flex items-center gap-2"><label className="w-24">Chẩn đoán:</label><InputLine field="ChanDoan" value={form.ChanDoan} /></div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {["1 Ngày", "10 Ngày", "1 Tuần", "2 Tuần", "3 Tuần", "1 Tháng", "2 Tháng"].map((d) => (
                            <button
                                key={d}
                                onClick={() => handleInputChange("ThoiGianDungThuoc", d)}
                                className={`px-3 py-1 rounded ${form.ThoiGianDungThuoc === d ? "bg-teal-600 text-white" : "bg-gray-100"
                                    }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>

                    {/* Thuốc được chọn */}
                    <div className="mt-4">
                        {selectedDrugs.map((d, i) => (
                            <div key={i} className="flex items-center gap-2 border-b py-1">
                                <span className="w-5">{i + 1}.</span>
                                <span className="flex-1">{d.TenThuoc}</span>
                                <input className="border px-1 w-20" type="number" value={d.SoLuong} onChange={(e) => updateDrugField(i, "SoLuong", Number(e.target.value))} />
                                <span>{d.DonViTinh}</span>
                                <input className="border px-2 flex-1" placeholder="Cách dùng" value={d.CachDung} onChange={(e) => updateDrugField(i, "CachDung", e.target.value)} />
                            </div>
                        ))}
                    </div>

                    {/* Ghi chú */}
                    <div className="mt-4">
                        <label className="block font-medium">Lời dặn:</label>
                        <textarea rows={4} className="w-full border rounded px-2 py-1" value={form.GhiChu} onChange={(e) => handleInputChange("GhiChu", e.target.value)}></textarea>
                    </div>

                    {/* Tái khám và bác sĩ */}
                    <div className="mt-4 flex justify-between items-center">
                        <div>
                            Ngày tái khám:
                            <input type="date" className="ml-2 border px-2 py-1 rounded" value={form.TaiKham} onChange={(e) => handleInputChange("TaiKham", e.target.value)} />
                        </div>
                        <div className="text-right px-1.5">
                            <div className="italic">{new Date().toLocaleDateString()}</div>
                            <div className="font-semibold">BÁC SĨ</div>
                            <div className="mt-1">ThanhPhat</div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                        <button onClick={handleSubmit} className="bg-teal-600 text-white px-4 py-2 rounded">LƯU</button>
                        <div>
                            Tổng tiền thuốc: <span className="bg-gray-200 px-4 py-1 rounded">{totalCost.toLocaleString()} ₫</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
