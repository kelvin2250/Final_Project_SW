// 📁 src/components/tabDetail/PrescriptionTabs.jsx
import { useState } from "react";
import PrescriptionDetail from "../details/PrescriptionDetail";
import PatientDetail from "../details/PatientDetail";
import InvoiceDetail from "../details/InvoiceDetail";

// 🧪 Mock data mẫu
const mockPrescription = {
    id: "DT0001",
    date: "2025-04-24",
    diagnosis: "Viêm họng cấp",
    doctor: "BS. Trần Thị B",
    notes: "Uống nhiều nước, tránh nói lớn.",
    medicines: [
        { name: "Paracetamol", quantity: 10, unit: "viên", usage: "Uống sau ăn" },
        { name: "Alpha Choay", quantity: 5, unit: "viên", usage: "Ngậm tan trong miệng" }
    ]
};

const mockPatient = {
    id: "BN00000001",
    name: "Nguyễn Văn A",
    gender: "Nam",
    age: "35",
    phone: "0909123456",
    address: "123 Lê Lợi, Quận 1, TP.HCM",
    job: "Nhân viên văn phòng",
    history: "Không có tiền sử bệnh lý nghiêm trọng."
};

const mockInvoice = {
    id: "HD00000001",
    patientName: "Nguyễn Văn A",
    age: "35",
    createdBy: "BS. Trần Thị B",
    createdAt: "2025-04-24",
    total: 105000,
    items: [
        { name: "Paracetamol", unit: "viên", quantity: 10, price: 3000, total: 30000 },
        { name: "Alpha Choay", unit: "viên", quantity: 5, price: 5000, total: 25000 },
        { name: "Khám bệnh", unit: "lần", quantity: 1, price: 50000, total: 50000 },
    ],
};

export default function PrescriptionTabs({
    prescription = mockPrescription,
    patient = mockPatient,
    invoice = mockInvoice
}) {
    const [tab, setTab] = useState("prescription");

    return (
        <div>
            <div className="flex space-x-4 border-b mb-4 text-sm">
                <button
                    onClick={() => setTab("prescription")}
                    className={`pb-1 ${tab === "prescription" ? "font-semibold border-b-2 border-emerald-600" : ""}`}
                >
                    Thông tin đơn thuốc
                </button>
                <button
                    onClick={() => setTab("patient")}
                    className={`pb-1 ${tab === "patient" ? "font-semibold border-b-2 border-emerald-600" : ""}`}
                >
                    Thông tin bệnh nhân
                </button>
                <button
                    onClick={() => setTab("invoice")}
                    className={`pb-1 ${tab === "invoice" ? "font-semibold border-b-2 border-emerald-600" : ""}`}
                >
                    Thông tin hóa đơn
                </button>
            </div>

            {tab === "prescription" && <PrescriptionDetail data={prescription} />}
            {tab === "patient" && <PatientDetail data={patient} />}
            {tab === "invoice" && <InvoiceDetail data={invoice} />}
        </div>
    );
}
