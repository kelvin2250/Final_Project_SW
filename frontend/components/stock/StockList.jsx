import { useState, Fragment } from 'react';

// ✅ Hàm parse ngày "dd-mm-yyyy"
const parseDate = (str) => {
    const [day, month, year] = str.split("-").map(Number);
    return new Date(year, month - 1, day);
};

// 🧪 Mock dữ liệu nhập kho
const mockEntries = [
    {
        id: "NK00000001",
        supplier: "Không khai báo",
        createdBy: "ThanhPhat",
        createdAt: "18-04-2025 15:15",
        total: 6300,
    },
];

export default function StockEntryList({ filters }) {
    const [expandedId, setExpandedId] = useState(null);
    const toggleExpand = (id) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const { keyword = "", fromDate = null, toDate = null } = filters || {};

    const filtered = mockEntries.filter((entry) => {
        const kw = keyword.toLowerCase();
        const matchKeyword =
            entry.id.toLowerCase().includes(kw) ||
            entry.supplier.toLowerCase().includes(kw) ||
            entry.createdBy.toLowerCase().includes(kw);

        const [dateStr] = entry.createdAt.split(" ");
        const createdAtDate = parseDate(dateStr);
        const matchFrom = !fromDate || createdAtDate >= new Date(fromDate);
        const matchTo = !toDate || createdAtDate <= new Date(toDate);

        return matchKeyword && matchFrom && matchTo;
    });

    return (
        <div className='mt-3'>
            <table className='w-full text-sm border border-gray-300 shadow-sm'>
                <thead className="bg-emerald-100 text-gray-700 text-center">
                    <tr>
                        <th className="py-2 px-2 border">☑</th>
                        <th className="py-2 px-2 border">MÃ SỐ</th>
                        <th className="py-2 px-2 border">NHÀ CUNG CẤP</th>
                        <th className="py-2 px-2 border">NGƯỜI LẬP</th>
                        <th className="py-2 px-2 border">NGÀY LẬP</th>
                        <th className="py-2 px-2 border">TỔNG HÓA ĐƠN</th>
                        <th className="py-2 px-2 border">CHỨC NĂNG</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((entry) => (
                        <Fragment key={entry.id}>
                            <tr className="text-center hover:bg-gray-50">
                                <td className="py-2 border">
                                    <input type="checkbox" />
                                </td>
                                <td className="py-2 border">{entry.id}</td>
                                <td className="py-2 border">{entry.supplier}</td>
                                <td className="py-2 border">{entry.createdBy}</td>
                                <td className="py-2 border">{entry.createdAt}</td>
                                <td className="py-2 border">{entry.total.toLocaleString()}</td>
                                <td className="py-2 border flex justify-center gap-2">
                                    <button className="text-yellow-600 hover:text-yellow-800">✏️</button>
                                    <button className="text-blue-600 hover:text-blue-800">🖨️</button>
                                    <button className="text-red-600 hover:text-red-800">🗑️</button>
                                </td>
                            </tr>
                            {expandedId === entry.id && (
                                <tr>
                                    <td colSpan="7" className="bg-gray-100 px-4 py-3">
                                        {/* Nội dung chi tiết nhập kho (có thể là tab chi tiết sau) */}
                                        <div>Chi tiết phiếu nhập kho đang được phát triển...</div>
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
