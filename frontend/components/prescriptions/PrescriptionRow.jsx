export default function PrescriptionRow({ data, index, isSelected, onClick }) {
    return (
        <tr
            className={`text-center hover:bg-gray-100 cursor-pointer ${isSelected ? "bg-gray-200" : ""}`}
        >
            <td onClick={onClick} className="border border-gray-300">
                <span className="text-xl">{isSelected ? "▼" : "▶"}</span>
            </td>
            <td className="border px-2 py-1 text-blue-600 font-medium hover:underline">
                {data.MaPhieuKham}
            </td>
            <td className="border px-2 py-1">
                {data.benhnhan?.HoTen || `Bệnh nhân #${data.MaBenhNhan}`}
            </td>
            <td className="border px-2 py-1">{data.ChanDoan}</td>
            <td className="border px-2 py-1">{data.NguoiLap}</td>
            <td className="border px-2 py-1">{new Date(data.NgayLap).toLocaleDateString("vi-VN")}</td>
            <td className="border px-2 py-1 space-x-2 text-lg">
                <button onClick={onClick} title="Chi tiết">👨‍⚕️</button>
                <button onClick={onClick} title="Sửa">✏️</button>
                <button title="Xóa">🗑️</button>
            </td>
        </tr>
    );
}
