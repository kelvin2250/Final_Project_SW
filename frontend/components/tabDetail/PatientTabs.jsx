import { useState } from "react";
import PatientDetail from "../details/PatientDetail";
import PrescriptionDetail from "../details/PrescriptionDetail";
import InvoiceDetail from "../details/InvoiceDetail";

// Dummy data - bạn sẽ thay thế bằng dữ liệu thực
const dummyPrescriptions = [
    {
        id: 1,
        diagnosis: "Cảm cúm",
        medicines: [
            {
                code: "T01",
                name: "Paracetamol",
                registration: "VN123",
                quantity: 10,
                unit: "viên",
                usage: "2 viên/ngày",
            },
        ],
        note: "Nghỉ ngơi nhiều.",
    },
];

const dummyInvoices = [
    {
        prescriptionId: 1,
        items: [
            {
                name: "Paracetamol",
                unit: "viên",
                quantity: 10,
                price: 5000,
                total: 50000,
            },
        ],
        total: 50000,
    },
];

export default function PatientTabs({ patient }) {
    const [tab, setTab] = useState("info");

    return (
        <div>
            <div className="flex space-x-4 border-b mb-4 text-sm">
                <button
                    onClick={() => setTab("info")}
                    className={`pb-1 ${tab === "info" ? "font-semibold border-b-2 border-emerald-600" : ""
                        }`}
                >
                    Thông tin
                </button>
                <button
                    onClick={() => setTab("prescription")}
                    className={`pb-1 ${tab === "prescription"
                            ? "font-semibold border-b-2 border-emerald-600"
                            : ""
                        }`}
                >
                    Lịch sử đơn thuốc
                </button>
                <button
                    onClick={() => setTab("invoice")}
                    className={`pb-1 ${tab === "invoice"
                            ? "font-semibold border-b-2 border-emerald-600"
                            : ""
                        }`}
                >
                    Hóa đơn
                </button>
            </div>

            {/* Thông tin bệnh nhân */}
            {tab === "info" && <PatientDetail data={patient} />}

            {/* Lịch sử đơn thuốc */}
            {tab === "prescription" && (
                dummyPrescriptions.length > 0 ? (
                    dummyPrescriptions.map((pres, i) => (
                        <div key={i} className="mb-4">
                            <PrescriptionDetail data={pres} />
                        </div>
                    ))
                ) : (
                    <p className="text-sm italic text-gray-500">Chưa có đơn thuốc</p>
                )
            )}

            {/* Hóa đơn */}
            {tab === "invoice" && (
                dummyInvoices.length > 0 ? (
                    dummyInvoices.map((inv, i) => (
                        <div key={i} className="mb-4">
                            <InvoiceDetail data={inv} />
                        </div>
                    ))
                ) : (
                    <p className="text-sm italic text-gray-500">Chưa có hóa đơn</p>
                )
            )}
        </div>
    );
}