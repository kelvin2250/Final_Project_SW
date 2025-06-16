import { useState } from "react";

export default function StockEntryForm({ onSave, onCancel }) {
    const [entries, setEntries] = useState([
        { name: "", unit: "", quantity: 1, price: 0, sale: 0, expiry: "", total: 0 },
    ]);
    const [note, setNote] = useState("");
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

    const updateField = (i, field, value) => {
        const updated = [...entries];
        updated[i][field] = value;
        updated[i].total = updated[i].quantity * updated[i].price;
        setEntries(updated);
    };

    const addRow = () => {
        setEntries([...entries, { name: "", unit: "", quantity: 1, price: 0, sale: 0, expiry: "", total: 0 }]);
    };

    const removeRow = (i) => {
        const updated = [...entries];
        updated.splice(i, 1);
        setEntries(updated);
    };

    const total = entries.reduce((sum, e) => sum + Number(e.total || 0), 0);

    const handleSubmit = () => {
        onSave({ entries, note, date });
    };

    return (
        <div className="bg-white shadow rounded p-4 mt-6">
            <h2 className="text-lg font-semibold mb-4">📦 Phiếu nhập kho</h2>

            <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-2 py-1">#</th>
                        <th className="border px-2 py-1">THUỐC</th>
                        <th className="border px-2 py-1">ĐVT</th>
                        <th className="border px-2 py-1">SỐ LƯỢNG</th>
                        <th className="border px-2 py-1">GIÁ NHẬP</th>
                        <th className="border px-2 py-1">GIÁ BÁN</th>
                        <th className="border px-2 py-1">HẾT HẠN</th>
                        <th className="border px-2 py-1">TỔNG CỘNG</th>
                        <th className="border px-2 py-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((item, i) => (
                        <tr key={i}>
                            <td className="border px-2 py-1 text-center">{i + 1}</td>
                            <td className="border px-2 py-1">
                                <input className="w-full" value={item.name} onChange={(e) => updateField(i, "name", e.target.value)} />
                            </td>
                            <td className="border px-2 py-1">
                                <input className="w-full" value={item.unit} onChange={(e) => updateField(i, "unit", e.target.value)} />
                            </td>
                            <td className="border px-2 py-1">
                                <input type="number" className="w-full" value={item.quantity} onChange={(e) => updateField(i, "quantity", e.target.value)} />
                            </td>
                            <td className="border px-2 py-1">
                                <input type="number" className="w-full" value={item.price} onChange={(e) => updateField(i, "price", e.target.value)} />
                            </td>
                            <td className="border px-2 py-1">
                                <input type="number" className="w-full" value={item.sale} onChange={(e) => updateField(i, "sale", e.target.value)} />
                            </td>
                            <td className="border px-2 py-1">
                                <input type="date" className="w-full" value={item.expiry} onChange={(e) => updateField(i, "expiry", e.target.value)} />
                            </td>
                            <td className="border px-2 py-1 text-right">{item.total.toLocaleString()}</td>
                            <td className="border px-2 py-1 text-center">
                                <button className="text-red-500" onClick={() => removeRow(i)}>✕</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 text-right text-sm">
                <strong className="text-red-600">Tổng hoá đơn nhập:</strong> {total.toLocaleString()} ₫
                <button onClick={addRow} className="ml-4 text-sm text-gray-600">+ Thêm dòng</button>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <div>
                    <label className="text-sm font-medium mr-2">Ngày nhập:</label>
                    <input type="date" className="border px-2 py-1 rounded" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="text-sm text-gray-700">
                    <label className="font-medium mr-2">Ghi chú:</label>
                    <textarea className="border px-2 py-1 rounded w-96" value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
                </div>
            </div>

            <div className="mt-6 flex gap-3">
                <button className="bg-teal-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>LƯU</button>
                <button className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>Huỷ</button>
            </div>
        </div>
    );
}
