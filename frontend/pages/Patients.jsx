import { useState } from "react";
import FilterBar from "../components/common/FilterBar";
import PatientList from "../components/patients/PatientList";
import PatientFormModal from "../components/patients/PatientFormModal";
export default function PatientsPage() {
    const [filters, setFilters] = useState({
        keyword: "",
        fromDate: null,
        toDate: null,
    });
    const [showModal, setShowModal] = useState(false);

    const handleAdd = async (data) => {
        try {
            const response = await fetch("http://localhost:8000/api/benhnhan/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                alert("❌ Lỗi: " + error.detail);
                return;
            }

            const newPatient = await response.json();
            console.log("✅ Bệnh nhân mới:", newPatient);

            setShowModal(false); // đóng modal

            // TODO: reload danh sách, ví dụ gọi lại API hoặc set state
        } catch (err) {
            console.error("Lỗi gửi dữ liệu:", err);
            alert("❌ Không thể kết nối tới máy chủ.");
        }
    };
    

    return (
        <div className="mt-20 px-6">
            <FilterBar
                onSearch={setFilters}
                extraButtons={
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-green-600 text-white text-sm px-3 py-0.5 rounded-full whitespace-nowrap"
                        >
                            + Thêm bệnh nhân
                        </button>

                        <button className="bg-blue-600 text-white text-sm px-3 py-0.5 rounded-full whitespace-nowrap">
                            ⬇ Xuất file excel
                        </button>
                    </div>
                }
            />
            <PatientList filters={filters} />
            <PatientFormModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleAdd}
            />
        </div>
    );
}
