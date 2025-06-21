import { useState } from "react";
import PrescriptionDetail from "../details/PrescriptionDetail";
import PatientDetail from "../details/PatientDetail";
import InvoiceDetail from "../details/InvoiceDetail";

export default function PrescriptionTabs({
    prescription,
    patient,
    invoices = [],
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
            {tab === "invoice" && (
                invoices.length > 0 ? (
                    invoices.map((inv, i) => (
                        <div key={inv.MaHoaDon || i} className="mb-6 border border-gray-300 rounded shadow-sm">
                            <div className="bg-gray-100 px-3 py-2 flex justify-between items-center">
                                <div>
                                    <strong>Ngày:</strong>{" "}
                                    {new Date(inv.NgayLap).toLocaleDateString("vi-VN")} —{" "}
                                    <strong>Người lập:</strong> {inv.NguoiLap}
                                </div>
                            </div>
                            <InvoiceDetail data={inv} />
                        </div>
                    ))
                ) : (
                    <p className="text-sm italic text-gray-500 px-2">Không có hóa đơn nào cho phiếu khám này.</p>
                )
            )}
        </div>
    );
}
