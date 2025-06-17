// 📁 src/components/tabDetail/PrescriptionTabs.jsx
import { useState } from "react";
import PrescriptionDetail from "../details/PrescriptionDetail";
import PatientDetail from "../details/PatientDetail";
import InvoiceDetail from "../details/InvoiceDetail";
export default function PrescriptionTabs({
    prescription,
    patient,
    invoice 
}) {
    const [tab, setTab] = useState("prescription");
    console.log("đơn thuốc: ", prescription);
    console.log("bệnh nhân: ", patient);

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
