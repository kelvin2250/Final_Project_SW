import { useEffect, useState } from "react";
import { cleanFormData } from "../../utils/cleanFormData";

export default function PatientFormModal({ isOpen, onClose, onSubmit, initialData = null, mode = "create" }) {
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

    useEffect(() => {
        if (initialData) {
            setFormData({
                HoTen: initialData.HoTen ?? "",
                GioiTinh: initialData.GioiTinh ?? "Nam",
                NamSinh: initialData.NamSinh ?? "",
                SoDienThoai: initialData.SoDienThoai ?? "",
                DiaChi: initialData.DiaChi ?? "",
                MaNgheNghiep: initialData.MaNgheNghiep ?? "",
                Nhom: initialData.Nhom ?? "Thứ tự chờ khám",
                CanNang: initialData.CanNang ?? "",
                ChieuCao: initialData.ChieuCao ?? "",
                Mach: initialData.Mach ?? "",
                NhietDo: initialData.NhietDo ?? "",
                HuyetAp: initialData.HuyetAp ?? "",
                TienSu: initialData.TienSu ?? "",
                NgayTao: initialData.NgayTao?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const cleanedData = cleanFormData(formData, [
            "NamSinh", "CanNang", "ChieuCao", "Mach", "NhietDo", "MaNgheNghiep"
        ]);
        onSubmit(cleanedData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-3xl shadow-lg w-[90%] max-w-5xl max-h-[95%] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-purple-700 flex items-center gap-2">
                    {mode === "edit" ? (
                        <>✏️ Cập nhật bệnh nhân <span className="text-blue-600">"{formData.HoTen}"</span></>
                    ) : (
                        <><span className="text-2xl">+</span> Thêm bệnh nhân</>
                    )}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <Input label="Tên bệnh nhân" name="HoTen" value={formData.HoTen} onChange={handleChange} />
                    <Input label="Năm sinh" name="NamSinh" type="number" value={formData.NamSinh} onChange={handleChange} />
                    <Select label="Giới tính" name="GioiTinh" value={formData.GioiTinh} onChange={handleChange} options={["Nam", "Nữ", "Khác"]} />
                    <Input label="Điện thoại" name="SoDienThoai" value={formData.SoDienThoai} onChange={handleChange} />
                    <Input label="Địa chỉ" name="DiaChi" value={formData.DiaChi} onChange={handleChange} />
                    <Select label="Nghề nghiệp" name="MaNgheNghiep" value={formData.MaNgheNghiep} onChange={handleChange} options={[
                        { value: "", label: "-- Chọn nghề nghiệp --" },
                        { value: "1", label: "Bác sĩ" },
                        { value: "2", label: "Lập trình viên" },
                        { value: "3", label: "Nông dân" },
                    ]} />
                    <Input label="Cân nặng" name="CanNang" type="number" value={formData.CanNang} onChange={handleChange} />
                    <Input label="Chiều cao" name="ChieuCao" type="number" value={formData.ChieuCao} onChange={handleChange} />
                    <Input label="Mạch" name="Mach" type="number" value={formData.Mach} onChange={handleChange} />
                    <Input label="Thân nhiệt" name="NhietDo" type="number" step="0.1" value={formData.NhietDo} onChange={handleChange} />
                    <Input label="Huyết áp" name="HuyetAp" value={formData.HuyetAp} onChange={handleChange} />
                    <Input label="Tiền sử" name="TienSu" value={formData.TienSu} onChange={handleChange} />
                    <Input label="Nhóm" name="Nhom" value={formData.Nhom} onChange={handleChange} />
                    <Input label="Ngày lập" name="NgayTao" type="date" value={formData.NgayTao} onChange={handleChange} />
                </div>

                <div className="flex justify-end mt-6 gap-3">
                    <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
                        {mode === "edit" ? "Cập nhật" : "Tạo mới"}
                    </button>
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Hủy</button>
                </div>
            </div>
        </div>
    );
}

function Input({ label, name, ...props }) {
    return (
        <div className="col-span-1">
            <label className="block font-semibold mb-1">{label}</label>
            <input
                {...props}
                name={name}
                className="w-full border px-2 py-1 rounded"
                value={props.value ?? ""}
            />
        </div>
    );
}

function Select({ label, name, value, onChange, options }) {
    return (
        <div className="col-span-1">
            <label className="block font-semibold mb-1">{label}</label>
            <select name={name} value={value ?? ""} onChange={onChange} className="w-full border px-2 py-1 rounded">
                {options.map(opt =>
                    typeof opt === "string"
                        ? <option key={opt} value={opt}>{opt}</option>
                        : <option key={opt.value} value={opt.value}>{opt.label}</option>
                )}
            </select>
        </div>
    );
}
