import { useNavigate } from "react-router-dom";

export default function PatientRow({ data, isSelected, onClick, onEdit, onDelete }) {
    const navigate = useNavigate();

    return (
        <tr className={`text-center hover:bg-gray-50 border-t border-gray-300 ${isSelected ? "bg-gray-100" : ""}`}>
            <td onClick={onClick} className="border border-gray-300">
                <span className="text-xl">{isSelected ? "▼" : "▶"}</span>
            </td>
            <td className="text-blue-700 font-semibold border border-gray-300">{data.MaBenhNhan}</td>
            <td className="border border-gray-300">{data.HoTen}</td>
            <td className="border border-gray-300">{data.GioiTinh}</td>
            <td className="border border-gray-300">{data.NamSinh}</td>
            <td className="border border-gray-300">{data.SoDienThoai}</td>
            <td className="border border-gray-300">{data.DiaChi}</td>
            <td className="border border-gray-300">{new Date(data.NgayTao).toLocaleDateString("vi-VN")}</td>
            <td className="space-x-2 border border-gray-300">
                <button onClick={() => navigate(`/prescriptions/create/${data.MaBenhNhan}`)} title="Khám">👨‍⚕️</button>
                <button onClick={onEdit} title="Sửa">✏️</button>
                <button onClick={onDelete} title="Xoá">🗑️</button>
            </td>
        </tr>
    );
}
