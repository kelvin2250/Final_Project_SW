import { useEffect, useState, Fragment } from "react";
import { fetchPatients } from "../../src/api"; // Đường dẫn đúng với file api bạn đặt
import PatientRow from "./PatientRow";
import PatientTabs from "../tabDetail/PatientTabs";

export default function PatientList({ filters }) {
    const [expandedId, setExpandedId] = useState(null);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatients()
            .then((data) => {
                console.log("✅ Dữ liệu bệnh nhân từ API:", data); // 👈 Thêm dòng này
                setPatients(data);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);
    

    const toggleExpand = (id) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const { keyword = "", fromDate = null, toDate = null } = filters || {};

    const filtered = patients.filter((p) => {
        const kw = keyword.toLowerCase();
        const matchKeyword =
            p.HoTen.toLowerCase().includes(kw) ||
            p.SoDienThoai.toLowerCase().includes(kw) ||
            p.DiaChi?.toLowerCase().includes(kw);

        const createdAtDate = new Date(p.NgayTao); // backend trả ISO 8601
        const matchFrom = !fromDate || createdAtDate >= new Date(fromDate);
        const matchTo = !toDate || createdAtDate <= new Date(toDate);

        return matchKeyword && matchFrom && matchTo;
    });

    return loading ? (
        <div>Đang tải danh sách bệnh nhân...</div>
    ) : (
        <div className="mt-3">
            <table className="w-full text-sm border border-gray-300 shadow-sm">
                <thead className="bg-emerald-100 text-gray-700 text-center">
                    <tr>
                        <th className="py-2 px-2 border">▶</th>
                        <th className="py-2 px-2 border">MÃ</th>
                        <th className="py-2 px-2 border">TÊN</th>
                        <th className="py-2 px-2 border">GIỚI TÍNH</th>
                        <th className="py-2 px-2 border">NĂM SINH</th>
                        <th className="py-2 px-2 border">ĐIỆN THOẠI</th>
                        <th className="py-2 px-2 border">ĐỊA CHỈ</th>
                        <th className="py-2 px-2 border">NGÀY LẬP</th>
                        <th className="py-2 px-2 border">CHỨC NĂNG</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((p) => (
                        <Fragment key={p.MaBenhNhan}>
                            <PatientRow
                                data={p}
                                isSelected={expandedId === p.MaBenhNhan}
                                onClick={() => toggleExpand(p.MaBenhNhan)}
                            />
                            {expandedId === p.MaBenhNhan && (
                                <tr className="border-t border-gray-200">
                                    <td colSpan="9" className="bg-gray-50 px-4 py-4">
                                        <PatientTabs
                                            patient={p}
                                            prescriptions={[]} // cập nhật sau
                                            invoices={[]} // cập nhật sau
                                        />
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
