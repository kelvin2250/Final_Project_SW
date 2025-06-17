import { useState } from "react";

export default function DrugFormModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        MaThuoc: "",
        TenThuoc: "",
        SoDangKy: "",
        HoatChat: "",
        DonViTinh: "",
        NhomThuoc: "",
        GiaNhap: 0,
        GiaBan: 0,
        SoLuongMacDinh: 1,
        TonToiThieu: "",
        CachDung: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-[60%] max-w-[850px] shadow-lg">
                <h2 className="text-xl font-bold mb-6 text-teal-700">➕ Thêm thuốc</h2>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {[
                        { label: "Mã thuốc", name: "MaThuoc", type: "text" },
                        { label: "Chọn nhóm", name: "NhomThuoc", type: "text" },
                        { label: "Tên thuốc", name: "TenThuoc", type: "text" },
                        { label: "Giá bán", name: "GiaBan", type: "number" },
                        { label: "Số đăng ký", name: "SoDangKy", type: "text" },
                        { label: "Giá nhập", name: "GiaNhap", type: "number" },
                        { label: "SL mặc định", name: "SoLuongMacDinh", type: "number" },
                        { label: "Đơn vị tính", name: "DonViTinh", type: "text" },
                        { label: "Tồn tối thiểu", name: "TonToiThieu", type: "text" },
                    ].map(({ label, name, type }) => (
                        <div className="flex items-center" key={name}>
                            <label className="w-20 text-sm mr-4 text-right">{label}</label>
                            <input
                                name={name}
                                type={type}
                                value={formData[name]}
                                onChange={handleChange}
                                className="flex-1 border p-0.5 rounded text-sm"
                            />
                        </div>
                    ))}

                    {/* Cách dùng - full width dòng cuối */}
                    <div className="col-span-2 flex items-center">
                        <label className="w-20 text-sm text-right mr-4">Cách dùng</label>
                        <input
                            name="CachDung"
                            value={formData.CachDung}
                            onChange={handleChange}
                            className="flex-1 border rounded text-sm p-0.5"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition">Hoàn tất</button>
                    <button className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 transition" onClick={onClose}>Bỏ qua</button>
                </div>
            </div>
        </div>
    );
}
