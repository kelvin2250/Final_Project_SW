import { useState } from "react";

export default function DrugFormModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        TenThuoc: "",
        DonViTinh: "",
        TonKho: 0,
        GiaBan: 0,
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
            <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-lg">
                <h2 className="text-lg font-bold mb-4 text-purple-700">➕ Thêm thuốc mới</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input name="TenThuoc" placeholder="Tên thuốc" className="border p-2 rounded" value={formData.TenThuoc} onChange={handleChange} />
                    <input name="DonViTinh" placeholder="Đơn vị tính" className="border p-2 rounded" value={formData.DonViTinh} onChange={handleChange} />
                    <input name="TonKho" type="number" placeholder="Tồn kho" className="border p-2 rounded" value={formData.TonKho} onChange={handleChange} />
                    <input name="GiaBan" type="number" placeholder="Giá bán" className="border p-2 rounded" value={formData.GiaBan} onChange={handleChange} />
                    <textarea name="CachDung" placeholder="Cách dùng" className="col-span-2 border p-2 rounded" value={formData.CachDung} onChange={handleChange}></textarea>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button className="bg-green-600 text-white px-4 py-1 rounded" onClick={handleSubmit}>Lưu</button>
                    <button className="bg-gray-500 text-white px-4 py-1 rounded" onClick={onClose}>Huỷ</button>
                </div>
            </div>
        </div>
    );
}
