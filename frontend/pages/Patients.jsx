import { useEffect, useState } from "react";
import FilterBar from "../components/common/FilterBar";
import PatientList from "../components/patients/PatientList";
import PatientFormModal from "../components/patients/PatientFormModal";
import { fetchPatients } from "../src/api"; 

export default function PatientsPage() {
    const [filters, setFilters] = useState({
        keyword: "",
        fromDate: null,
        toDate: null,
    });

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Gọi API khi filters thay đổi hoặc sau khi thêm mới
    const loadPatients = async () => {
        try {
            setLoading(true);
            const data = await fetchPatients();
            setPatients(data);
        } catch (err) {
            console.error("❌ Lỗi khi tải danh sách bệnh nhân:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPatients();
    }, []);

    const handleAdd = async (data) => {
        try {
            const response = await fetch("http://localhost:8000/api/benhnhan/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                alert(" ❌ Vui lòng nhập đầy đủ các trường");
                console.log(error);
                return;
            }

            const newPatient = await response.json();
            console.log("✅ Bệnh nhân mới:", newPatient);
            alert("✅ Create bệnh nhân mới thành công")
            // Cập nhật danh sách
            setPatients(prev =>
                [...prev, newPatient].sort((a, b) => a.MaBenhNhan - b.MaBenhNhan)
            );
              

            setShowModal(false);
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

            {/* PatientList nhận dữ liệu đã load */}
            <PatientList filters={filters} patients={patients} loading={loading} />

            <PatientFormModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleAdd}
            />
        </div>
    );
}
