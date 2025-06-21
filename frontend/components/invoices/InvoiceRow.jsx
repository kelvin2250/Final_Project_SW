import { useNavigate } from 'react-router-dom';

export default function InvoiceRow({ data, isSelected, onClick, onDelete }) {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/invoices/edit/${data.MaHoaDon}`);
    };

    return (
        <tr
            onClick={onClick}
            className={`text-center hover:bg-gray-100 cursor-pointer ${isSelected ? "bg-gray-200" : ""}`}
        >
            <td className="border px-2 py-1">
                <span className="text-xl">{isSelected ? "▼" : "▶"}</span>
            </td>
            <td className="border px-2 py-1 text-blue-600 font-medium hover:underline">{data.MaHoaDon}</td>
            <td className="border px-2 py-1">{data.benhnhan?.HoTen || "Khách lẻ"}</td>
            <td className="border px-2 py-1">{data.NguoiLap}</td>
            <td className="border px-2 py-1">{new Date(data.NgayLap).toLocaleDateString("vi-VN")}</td>
            <td className="border px-2 py-1 text-right">{data.TongTienThanhToan.toLocaleString()} ₫</td>
            <td className="border px-2 py-1 space-x-2">
                <button title="Sửa" onClick={(e) => { e.stopPropagation(); handleEdit(); }}>✏️</button>
                <button title="Xóa" onClick={(e) => { e.stopPropagation(); onDelete(); }}>🗑️</button>
            </td>
        </tr>
    );
}