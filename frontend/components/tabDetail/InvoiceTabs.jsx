// 📁 src/components/tabDetail/InvoiceTabs.jsx
import { useState } from "react";
import InvoiceDetail from "../details/InvoiceDetail";
import PatientDetail from "../details/PatientDetail";

// 🧪 Mock data mẫu (nếu chưa truyền props thực tế)
// const mockInvoice = [
//     {
//         id: "HD00000001",
//         patientName: "Killed Silve",
//         age: "2003211",
//         createdBy: "ThanhPhat",
//         createdAt: "18-04-2025",
//         total: 24400,
//         items: [ // ✅ thêm vào đây
//             { name: "Mobic 7.5mg", unit: "viên", quantity: 2, price: 11000, total: 22000 },
//             { name: "Panagal Plus", unit: "viên", quantity: 1, price: 0, total: 0 },
//             { name: "Tylenol", unit: "viên", quantity: 2, price: 1200, total: 2400 },
//         ],
//     },
// ];


const mockPatient = {
    id: "BN00000001",
    name: "Killed Silve",
    gender: "Nam",
    age: "2003211",
    phone: "0939393939",
    address: "Quận 5, TP.HCM",
    created_at: "18-04-2025",
};

export default function InvoiceTabs({ invoice = mockInvoice, patient = mockPatient }) {
    const [tab, setTab] = useState("invoice");

    return (
        <div>
            <div className="flex space-x-4 border-b mb-4 text-sm">
                <button
                    onClick={() => setTab("invoice")}
                    className={`pb-1 ${tab === "invoice" ? "font-semibold border-b-2 border-emerald-600" : ""
                        }`}
                >
                    Thông tin hóa đơn
                </button>
                <button
                    onClick={() => setTab("patient")}
                    className={`pb-1 ${tab === "patient" ? "font-semibold border-b-2 border-emerald-600" : ""
                        }`}
                >
                    Thông tin bệnh nhân
                </button>
            </div>

            {tab === "invoice" && <InvoiceDetail data={invoice} />}
            {tab === "patient" && <PatientDetail data={patient} />}
        </div>
    );
}
