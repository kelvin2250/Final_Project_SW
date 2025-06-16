import { useState } from "react";

export default function InvoiceForm({ onSave, onCancel }) {
    const [items, setItems] = useState([
        { id: 1, name: "", doctor: "", quantity: 1, price: 0, total: 0 },
    ]);
    const [note, setNote] = useState("");

    const handleChange = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = field === "quantity" || field === "price" ? parseInt(value || 0) : value;
        updated[index].total = updated[index].quantity * updated[index].price;
        setItems(updated);
    };

    const handleAddRow = () => {
        setItems([...items, { id: Date.now(), name: "", doctor: "", quantity: 1, price: 0, total: 0 }]);
    };

    const handleRemoveRow = (index) => {
        const updated = [...items];
        updated.splice(index, 1);
        setItems(updated);
    };

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    const handleSubmit = () => {
        const invoiceData = {
            patientName: "Khách lẻ",
            items,
            total: totalAmount,
            note,
        };
        onSave(invoiceData);
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold text-lg mb-4">Thông tin bệnh nhân: <span className="text-emerald-600">Khách lẻ</span></h2>

            <table className="w-full border text-sm mb-4">
                <thead className="bg-emerald-100 text-gray-700">
                    <tr>
                        <th className="border p-1">#</th>
                        <th className="border p-1">THUỐC</th>
                        <th className="border p-1">BÁC SĨ</th>
                        <th className="border p-1">SỐ LƯỢNG</th>
                        <th className="border p-1">ĐƠN GIÁ</th>
                        <th className="border p-1">TỔNG CỘNG</th>
                        <th className="border p-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                        <tr key={item.id}>
                            <td className="border p-1 text-center">{idx + 1}</td>
                            <td className="border p-1">
                                <input value={item.name} onChange={(e) => handleChange(idx, "name", e.target.value)} className="w-full" />
                            </td>
                            <td className="border p-1">
                                <select
                                    value={item.doctor}
                                    onChange={(e) => handleChange(idx, "doctor", e.target.value)}
                                    className="w-full"
                                >
                                    <option value="">-- Bác sĩ --</option>
                                    <option value="ThanhPhat">ThanhPhat</option>
                                    <option value="HoangNam">HoangNam</option>
                                </select>
                            </td>
                            <td className="border p-1">
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleChange(idx, "quantity", e.target.value)}
                                    className="w-full text-center"
                                />
                            </td>
                            <td className="border p-1">
                                <input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => handleChange(idx, "price", e.target.value)}
                                    className="w-full text-center"
                                />
                            </td>
                            <td className="border p-1 text-right pr-2 text-red-600">
                                {item.total.toLocaleString()}
                            </td>
                            <td className="border p-1 text-center">
                                <button className="text-red-500" onClick={() => handleRemoveRow(idx)}>x</button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={6} className="border text-right p-2 text-sm">
                            <strong>Tổng hóa đơn thuốc</strong>
                        </td>
                        <td className="border text-right p-2 text-red-600 font-bold">{totalAmount.toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>

            <div className="mb-4">
                <label className="font-semibold mb-1 inline-block">📝 Ghi chú</label>
                <textarea
                    rows={3}
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="Ghi chú cho hóa đơn..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                ></textarea>
            </div>

            <div className="flex justify-between">
                <button onClick={handleAddRow} className="bg-emerald-200 px-3 py-1 rounded">+ Thêm dòng</button>
                <div className="space-x-2">
                    <button onClick={onCancel} className="bg-gray-200 px-4 py-1 rounded">Hủy</button>
                    <button onClick={handleSubmit} className="bg-emerald-600 text-white px-4 py-1 rounded">Lưu</button>
                </div>
            </div>
        </div>
    );
}