import { Fragment, useState } from "react";
import PatientRow from "./PatientRow";
import PatientTabs from "../tabDetail/PatientTabs";
import PatientFormModal from "./PatientFormModal";
import { updatePatient, deletePatient, fetchPrescriptionsByPatient, fetchInvoicesByPatient  } from "../../src/api";

export default function PatientList({ filters, patients, loading }) {
    const [expandedId, setExpandedId] = useState(null);
    const [editingPatient, setEditingPatient] = useState(null);
    const [prescriptionsMap, setPrescriptionsMap] = useState({});
    const [invoicesMap, setInvoicesMap] = useState({});
    const toggleExpand = async (id) => {
        if (expandedId === id) {
            setExpandedId(null);
            return;
        }

        if (!prescriptionsMap[id]) {
            const [pres, inv] = await Promise.all([
                fetchPrescriptionsByPatient(id),
                fetchInvoicesByPatient(id),
            ]);
            setPrescriptionsMap((prev) => ({ ...prev, [id]: pres }));
            setInvoicesMap((prev) => ({ ...prev, [id]: inv }));
        }

        setExpandedId(id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa bệnh nhân này?")) {
            await deletePatient(id);
            window.location.reload();
        }
    };

    const filtered = patients.filter((p) => {
        const kw = (filters?.keyword || "").toLowerCase();
        const matchKeyword =
            p.HoTen?.toLowerCase().includes(kw) ||
            p.SoDienThoai?.toLowerCase().includes(kw) ||
            p.DiaChi?.toLowerCase().includes(kw);

        const createdAt = new Date(p.NgayTao);
        const from = filters?.fromDate ? new Date(filters.fromDate) : null;
        const to = filters?.toDate ? new Date(filters.toDate) : null;

        const matchFrom = !from || createdAt >= from;
        const matchTo = !to || createdAt <= to;

        return matchKeyword && matchFrom && matchTo;
    });

    return (
        <>
            {loading ? (
                <div className="py-6 text-center text-gray-500">Đang tải danh sách bệnh nhân...</div>
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
                                        onEdit={() => setEditingPatient(p)}
                                        onDelete={() => handleDelete(p.MaBenhNhan)}
                                    />
                                    {expandedId === p.MaBenhNhan && (
                                        <tr className="border-t border-gray-200">
                                            <td colSpan="9" className="bg-gray-50 px-4 py-4">
                                                <PatientTabs
                                                    patient={p}
                                                    prescriptions={prescriptionsMap[p.MaBenhNhan] || []}
                                                    invoices={invoicesMap[p.MaBenhNhan] || []}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal nằm ngoài bảng */}
            {editingPatient && (
                <PatientFormModal
                    isOpen={true}
                    onClose={() => setEditingPatient(null)}
                    onSubmit={async (updatedData) => {
                        await updatePatient(editingPatient.MaBenhNhan, updatedData);
                        setEditingPatient(null);
                        window.location.reload(); // hoặc cập nhật danh sách bằng callback
                    }}
                    initialData={editingPatient}
                    mode="edit"
                />
            )}
        </>
    );
}
