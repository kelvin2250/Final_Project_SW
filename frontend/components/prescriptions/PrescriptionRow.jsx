import { useNavigate } from "react-router-dom";

export default function PrescriptionRow({ data, index, isSelected, onToggle, onDeleted }) {
    const navigate = useNavigate();

    const handleDelete = async () => {
        const confirm = window.confirm(`Bạn có chắc muốn xoá phiếu khám #${data.MaPhieuKham}?`);
        if (!confirm) return;

        try {
            const res = await fetch(`http://localhost:8000/api/phieukham/${data.MaPhieuKham}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const err = await res.json();
                alert("❌ Lỗi xoá: " + (err.detail || "Không xác định"));
                return;
            }

            alert("🗑️ Đã xoá phiếu khám thành công");
            if (onDeleted) onDeleted(data.MaPhieuKham);
        } catch (err) {
            console.error("Lỗi xoá:", err);
            alert("❌ Không thể kết nối đến máy chủ");
        }
    };

    return (
        <tr className={`text-center hover:bg-gray-100 ${isSelected ? "bg-gray-200" : ""}`}>
            <td onClick={onToggle} className="border border-gray-300 cursor-pointer">
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
                <button onClick={() => navigate(`/prescriptions/edit/${data.MaPhieuKham}`)} title="Sửa">✏️</button>
                <button onClick={handleDelete} title="Xoá">🗑️</button>
            </td>
        </tr>
    );
}
