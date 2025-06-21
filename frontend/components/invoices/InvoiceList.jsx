import { useState, useEffect, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import InvoiceRow from './InvoiceRow';
import InvoiceTabs from '../tabDetail/InvoiceTabs';

export default function InvoiceList({ filters }) {
    const [invoices, setInvoices] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    const toggleExpand = (id) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/hoadon");
            const basicList = await res.json();

            const detailed = await Promise.all(
                basicList.map((inv) =>
                    fetch(`http://localhost:8000/api/hoadon/${inv.MaHoaDon}`).then(r => r.json())
                )
            );

            setInvoices(detailed);
        } catch (err) {
            console.error("Lỗi khi tải hóa đơn:", err);
            alert("Không thể tải danh sách hóa đơn.");
        } finally {
            setIsLoading(false);
        }
    };
    

    useEffect(() => {
        fetchInvoices();
    }, []);

    // Cập nhật danh sách khi có hóa đơn mới từ InvoiceForm
    useEffect(() => {
        if (location.state?.newInvoice) {
            setInvoices((prev) => {
                if (!prev.some(inv => inv.MaHoaDon === location.state.newInvoice.MaHoaDon)) {
                    return [...prev, location.state.newInvoice];
                }
                return prev;
            });
        }
    }, [location.state]);

    const handleDelete = async (maHoaDon) => {
        if (window.confirm("Bạn có chắc muốn xóa hóa đơn này?")) {
            try {
                await fetch(`http://localhost:8000/api/hoadon/${maHoaDon}`, {
                    method: "DELETE",
                });
                setInvoices(invoices.filter((inv) => inv.MaHoaDon !== maHoaDon));
                alert("✅ Đã xóa hóa đơn thành công!");
            } catch (err) {
                console.error("Lỗi khi xóa hóa đơn:", err);
                alert("Không thể xóa hóa đơn.");
            }
        }
    };

    const { keyword = "", fromDate = null, toDate = null } = filters || {};

    const filteredInvoices = invoices.filter((inv) => {
        const kw = keyword.toLowerCase();
        const matchKeyword =
            (inv.benhnhan?.HoTen || "").toLowerCase().includes(kw) ||
            inv.MaHoaDon.toString().toLowerCase().includes(kw) ||
            (inv.NguoiLap || "").toLowerCase().includes(kw);

        const createdAtDate = new Date(inv.NgayLap);
        const matchFrom = !fromDate || createdAtDate >= new Date(fromDate);
        const matchTo = !toDate || createdAtDate <= new Date(toDate);

        return matchKeyword && matchFrom && matchTo;
    });

    if (isLoading) {
        return <div className="mt-3 text-center">Đang tải hóa đơn...</div>;
    }

    return (
        <div className='mt-3'>
            <table className='w-full text-sm border border-gray-300 shadow-sm'>
                <thead className="bg-emerald-100 text-gray-700 text-center">
                    <tr>
                        <th className="py-2 px-2 border">▶</th>
                        <th className="py-2 px-2 border">MÃ SỐ</th>
                        <th className="py-2 px-2 border">BỆNH NHÂN</th>
                        <th className="py-2 px-2 border">NGƯỜI LẬP</th>
                        <th className="py-2 px-2 border">NGÀY LẬP</th>
                        <th className="py-2 px-2 border">TỔNG HÓA ĐƠN</th>
                        <th className="py-2 px-2 border">CHỨC NĂNG</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInvoices.length > 0 ? (
                        filteredInvoices.map((inv) => (
                            <Fragment key={inv.MaHoaDon}>
                                <InvoiceRow
                                    data={inv}
                                    isSelected={expandedId === inv.MaHoaDon}
                                    onClick={() => toggleExpand(inv.MaHoaDon)}
                                    onDelete={() => handleDelete(inv.MaHoaDon)}
                                />
                                {expandedId === inv.MaHoaDon && (
                                    <tr className="border-t border-gray-200">
                                        <td colSpan="7" className="bg-gray-50 px-4 py-4">
                                            <InvoiceTabs
                                                invoice={inv}
                                                patient={{ name: inv.benhnhan?.HoTen || "Khách lẻ" }}
                                            />
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="py-2 px-2 text-center">Không có hóa đơn nào.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}