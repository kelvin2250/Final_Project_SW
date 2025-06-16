import { useState, Fragment } from 'react';
import InvoiceRow from './InvoiceRow';
import InvoiceTabs from '../tabDetail/InvoiceTabs';

// ✅ Hàm chuyển chuỗi "dd-mm-yyyy" → Date object
const parseDate = (str) => {
    const [day, month, year] = str.split('-').map(Number);
    return new Date(year, month - 1, day);
};

// 🧪 Mock data hóa đơn
const mockInvoice = [
    {
        id: "HD00000001",
        patientName: "Killed Silve",
        age: "2003211",
        createdBy: "ThanhPhat",
        createdAt: "18-04-2025",
        total: 24400,
        items: [ // ✅ thêm vào đây
            { name: "Mobic 7.5mg", unit: "viên", quantity: 2, price: 11000, total: 22000 },
            { name: "Panagal Plus", unit: "viên", quantity: 1, price: 0, total: 0 },
            { name: "Tylenol", unit: "viên", quantity: 2, price: 1200, total: 2400 },
        ],
    },
];


// ✅ Component chính
export default function InvoiceList({ filters }) {
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const { keyword = "", fromDate = null, toDate = null } = filters || {};

    const filtered = mockInvoice.filter((inv) => {
        const kw = keyword.toLowerCase();
        const matchKeyword =
            inv.patientName.toLowerCase().includes(kw) ||
            inv.id.toLowerCase().includes(kw) ||
            inv.createdBy.toLowerCase().includes(kw);

        const createdAtDate = parseDate(inv.createdAt);
        const matchFrom = !fromDate || createdAtDate >= new Date(fromDate);
        const matchTo = !toDate || createdAtDate <= new Date(toDate);

        return matchKeyword && matchFrom && matchTo;
    });

    return (
        <div className='mt-3'>
            <table className='w-full text-sm border border-gray-300 shadow-sm'>
                <thead className="bg-emerald-100 text-gray-700 text-center">
                    <tr>
                        <th className="py-2 px-2 border">▶</th>
                        <th className="py-2 px-2 border">MÃ SỐ</th>
                        <th className="py-2 px-2 border">BỆNH NHÂN</th>
                        <th className="py-2 px-2 border">TUỔI</th>
                        <th className="py-2 px-2 border">NGƯỜI LẬP</th>
                        <th className="py-2 px-2 border">NGÀY LẬP</th>
                        <th className="py-2 px-2 border">TỔNG HÓA ĐƠN</th>
                        <th className="py-2 px-2 border">CHỨC NĂNG</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((inv) => (
                        <Fragment key={inv.id}>
                            <InvoiceRow
                                data={inv}
                                isSelected={expandedId === inv.id}
                                onClick={() => toggleExpand(inv.id)}
                            />
                            {expandedId === inv.id && (
                                <tr className="border-t border-gray-200">
                                    <td colSpan="8" className="bg-gray-50 px-4 py-4">
                                        <InvoiceTabs invoice={inv} patient={{ name: inv.patientName, age: inv.age }} />
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
