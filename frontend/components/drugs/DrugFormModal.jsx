import { useState, useEffect } from "react";

export default function DrugFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
    const [formData, setFormData] = useState({
        MaThuoc: "",
        TenThuoc: "",
        DonViTinh: "",
        GiaBan: 0,
        TonKho: 0,
        CachDung: "",
        SoDangKy: "",
        MaNhomThuoc: "",
    });
    const [nhomThuocList, setNhomThuocList] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/nhomthuoc")
            .then((res) => res.json())
            .then((data) => {
                console.log("Dữ liệu nhóm thuốc trong modal:", data);
                setNhomThuocList(data);
            })
            .catch((err) => console.error("Lỗi khi lấy nhóm thuốc:", err));

        if (initialData) {
            setFormData({
                MaThuoc: initialData.MaThuoc ?? "",
                TenThuoc: initialData.TenThuoc ?? "",
                DonViTinh: initialData.DonViTinh ?? "",
                GiaBan: initialData.GiaBan ?? 0,
                TonKho: initialData.TonKho ?? 0,
                CachDung: initialData.CachDung ?? "",
                SoDangKy: initialData.SoDangKy ?? "",
                MaNhomThuoc: initialData.MaNhomThuoc ?? "",
            });
            return;
        }
        setFormData({
            MaThuoc: "",
            TenThuoc: "",
            DonViTinh: "",
            GiaBan: 0,
            TonKho: 0,
            CachDung: "",
            SoDangKy: "",
            MaNhomThuoc: "",
        });
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "GiaBan" || name === "TonKho" ? Number(value) : value,
        }));
    };

    const handleSubmit = () => {
        if (!formData.TenThuoc || !formData.MaNhomThuoc) {
            alert("Vui lòng điền đầy đủ Tên thuốc và Nhóm thuốc");
            return;
        }
        onSubmit(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-[60%] max-w-[850px] shadow-lg">
                <h2 className="text-xl font-bold mb-6 text-teal-700">
                    {formData.MaThuoc ? "✏️ Cập nhật thuốc" : "➕ Thêm thuốc"}
                </h2>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {[
                        { label: "Tên thuốc", name: "TenThuoc", type: "text" },
                        { label: "Đơn vị tính", name: "DonViTinh", type: "text" },
                        { label: "Cách dùng", name: "CachDung", type: "text" },
                        { label: "Số đăng ký", name: "SoDangKy", type: "text" },
                    ].map(({ label, name, type }) => (
                        <div className="flex items-center" key={name}>
                            <label className="w-32 text-sm mr-4 text-right">{label}</label>
                            <input
                                name={name}
                                type={type}
                                value={formData[name]}
                                onChange={handleChange}
                                className="flex-1 border p-0.5 rounded text-sm"
                            />
                        </div>
                    ))}

                    <div className="flex items-center">
                        <label className="w-32 text-sm mr-4 text-right">Giá bán</label>
                        <input
                            name="GiaBan"
                            type="number"
                            value={formData.GiaBan}
                            onChange={handleChange}
                            className="flex-1 border p-0.5 rounded text-sm"
                            placeholder="Nhập giá bán"
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="w-32 text-sm mr-4 text-right">Tồn kho</label>
                        <input
                            name="TonKho"
                            type="number"
                            value={formData.TonKho}
                            onChange={handleChange}
                            className="flex-1 border p-0.5 rounded text-sm"
                            placeholder="Nhập tồn kho"
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="w-32 text-sm mr-4 text-right">Nhóm thuốc</label>
                        <select
                            name="MaNhomThuoc"
                            value={formData.MaNhomThuoc}
                            onChange={handleChange}
                            className="flex-1 border p-0.5 rounded text-sm"
                        >
                            <option value="">Chọn nhóm thuốc</option>
                            {nhomThuocList.map((nhom) => (
                                <option key={nhom.MaNhomThuoc} value={nhom.MaNhomThuoc}>
                                    {nhom.TenNhomThuoc}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
                    >
                        {formData.MaThuoc ? "Cập nhật" : "Hoàn tất"}
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 transition"
                    >
                        Bỏ qua
                    </button>
                </div>
            </div>
        </div>
    );
}