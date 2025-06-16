import { useState } from "react";

export default function PatientFormModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        HoTen: "",
        GioiTinh: "Nam",
        NamSinh: "",
        SoDienThoai: "",
        DiaChi: "",
        MaNgheNghiep: "",
        Nhom: "Thứ tự chờ khám",
        CanNang: "",
        ChieuCao: "",
        Mach: "",
        NhietDo: "",
        HuyetAp: "",
        TienSu: "",
        NgayTao: new Date().toISOString().slice(0, 10),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-3xl shadow-lg w-[90%] max-w-5xl max-h-[95%] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-purple-700 flex items-center gap-2">
                    <span className="text-2xl">+</span> Thêm bệnh nhân
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="col-span-1">
                        <label className="block font-semibold mb-1">Tên bệnh nhân</label>
                        <input name="HoTen" value={formData.HoTen} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                    </div>

                    <div className="col-span-1">
                        <label className="block font-semibold mb-1">Năm sinh</label>
                        <input name="NamSinh" value={formData.NamSinh} onChange={handleChange} type="number" className="w-full border px-2 py-1 rounded" />
                    </div>

                    <div className="col-span-1">
                        <label className="block font-semibold mb-1">Giới tính</label>
                        <select name="GioiTinh" value={formData.GioiTinh} onChange={handleChange} className="w-full border px-2 py-1 rounded">
                            <option>Nam</option>
                            <option>Nữ</option>
                            <option>Khác</option>
                        </select>
                    </div>

                    <div className="col-span-1">
                        <label className="block font-semibold mb-1">Điện thoại</label>
                        <input name="SoDienThoai" value={formData.SoDienThoai} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Địa chỉ</label>
                        <input name="DiaChi" value={formData.DiaChi} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Nghề nghiệp</label>
                        <select
                            name="MaNgheNghiep"
                            value={formData.MaNgheNghiep}
                            onChange={handleChange}
                            className="w-full border px-2 py-1 rounded"
                        >
                            <option value="">-- Chọn nghề nghiệp --</option>
                            <option value="1">Bác sĩ</option>
                            <option value="2">Lập trình viên</option>
                            <option value="3">Nông dân</option>
                            {/* Hoặc fetch từ API nghề nghiệp */}
                        </select>
                    </div>


                    <div>
                        <label className="block font-semibold mb-1">Cân nặng</label>
                        <input name="CanNang" value={formData.CanNang} onChange={handleChange} type="number" className="w-full border px-2 py-1 rounded" />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Chiều cao</label>
                        <input name="ChieuCao" value={formData.ChieuCao} onChange={handleChange} type="number" className="w-full border px-2 py-1 rounded" />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Mạch</label>
                        <input name="Mach" value={formData.Mach} onChange={handleChange} type="number" className="w-full border px-2 py-1 rounded" />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Thân nhiệt</label>
                        <input name="NhietDo" value={formData.NhietDo} onChange={handleChange} type="number" step="0.1" className="w-full border px-2 py-1 rounded" />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Huyết áp</label>
                        <input name="HuyetAp" value={formData.HuyetAp} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Tiền sử</label>
                        <input name="TienSu" value={formData.TienSu} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Nhóm</label>
                        <input name="Nhom" value={formData.Nhom} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Ngày lập</label>
                        <input name="NgayTao" value={formData.NgayTao} onChange={handleChange} type="date" className="w-full border px-2 py-1 rounded" />
                    </div>
                </div>

                <div className="flex justify-end mt-6 gap-3">
                    <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Skip</button>
                </div>
            </div>
        </div>
    );
}
