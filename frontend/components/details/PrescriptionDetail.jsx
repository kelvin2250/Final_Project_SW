// 📁 src/components/details/PrescriptionDetail.jsx
import { FaFilePrescription } from "react-icons/fa";

export default function PrescriptionDetail({ data }) {
    if (!data) return <p>Không có đơn thuốc.</p>;

    const { diagnosis, notes, medicines = [] } = data;

    const totalQuantity = medicines.reduce(
        (sum, med) => sum + (med.quantity || 0),
        0
    );

    return (
        <div className="text-sm border rounded p-4 bg-white">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                <FaFilePrescription /> Thông tin đơn thuốc
            </h2>

            {/* Bảng thuốc */}
            <table className="w-full text-left border mb-3">
                <thead className="bg-gray-100 text-xs uppercase">
                    <tr>
                        <th className="border px-2 py-1">#</th>
                        <th className="border px-2 py-1">Mã thuốc</th>
                        <th className="border px-2 py-1">Số đăng ký</th>
                        <th className="border px-2 py-1">Tên thuốc</th>
                        <th className="border px-2 py-1">Số lượng</th>
                        <th className="border px-2 py-1">Đơn vị</th>
                        <th className="border px-2 py-1">Cách dùng</th>
                    </tr>
                </thead>
                <tbody>
                    {medicines.map((med, idx) => (
                        <tr key={idx} className="text-sm">
                            <td className="border px-2 py-1 text-center">{idx + 1}</td>
                            <td className="border px-2 py-1">{med.code || `TH${idx + 1}`}</td>
                            <td className="border px-2 py-1">{med.registration || "-"}</td>
                            <td className="border px-2 py-1 font-medium">{med.name}</td>
                            <td className="border px-2 py-1 text-center">{med.quantity}</td>
                            <td className="border px-2 py-1">{med.unit}</td>
                            <td className="border px-2 py-1">{med.usage}</td>
                        </tr>
                    ))}
                    <tr className="font-semibold">
                        <td colSpan="4" className="border px-2 py-1 text-right">
                            Tổng số lượng
                        </td>
                        <td className="border px-2 py-1 text-center">{totalQuantity}</td>
                        <td colSpan="2" className="border px-2 py-1"></td>
                    </tr>
                </tbody>
            </table>

            {/* Chẩn đoán & lời dặn */}
            <div className="mb-4">
                <p className="mb-1">
                    <span className="font-medium">🔎 Chẩn đoán:</span> {diagnosis || "Không có"}
                </p>
                <p>
                    <span className="font-medium">📝 Lời dặn:</span> {notes || "Không có"}
                </p>
            </div>

            {/* Các nút chức năng */}
            <div className="flex flex-wrap gap-2">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded">
                    COPY
                </button>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded">
                    LẬP HÓA ĐƠN
                </button>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                    THAY ĐỔI
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    XÓA
                </button>
            </div>
        </div>
    );
}
