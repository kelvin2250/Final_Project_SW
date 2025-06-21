import { useState } from "react";
import PatientDetail from "../details/PatientDetail";
import PrescriptionDetail from "../details/PrescriptionDetail";
import InvoiceDetail from "../details/InvoiceDetail";

export default function PatientTabs({ patient, prescriptions = [], invoices = [] }) {
    const [tab, setTab] = useState("info");

    return (
        <div>
            <div className="flex space-x-4 border-b mb-4 text-sm">
                <button
                    onClick={() => setTab("info")}
                    className={`pb-1 ${tab === "info" ? "font-semibold border-b-2 border-emerald-600" : ""}`}
                >
                    Thông tin
                </button>
                <button
                    onClick={() => setTab("prescription")}
                    className={`pb-1 ${tab === "prescription" ? "font-semibold border-b-2 border-emerald-600" : ""}`}
                >
                    Lịch sử đơn thuốc
                </button>
                <button
                    onClick={() => setTab("invoice")}
                    className={`pb-1 ${tab === "invoice" ? "font-semibold border-b-2 border-emerald-600" : ""}`}
                >
                    Hóa đơn
                </button>
            </div>

            {tab === "info" && <PatientDetail data={patient} />}

            {tab === "prescription" &&
                (prescriptions.length > 0 ? (
                    prescriptions.map((pres, i) => (
                        <div key={i} className="mb-4">
                            <PrescriptionDetail data={pres} />
                        </div>
                    ))
                ) : (
                    <p className="text-sm italic text-gray-500">Chưa có đơn thuốc</p>
                ))}

            {tab === "invoice" &&
                (invoices.length > 0 ? (
                    invoices.map((inv, i) => (
                        <div key={i} className="mb-6 border border-gray-200 rounded shadow-sm">
                            <div className="bg-gray-100 px-3 py-2 flex justify-between items-center">
                                <div>
                                    <strong>Ngày:</strong>{" "}
                                    {new Date(inv.NgayLap).toLocaleDateString("vi-VN")} —{" "}
                                    <strong>Người lập:</strong> {inv.NguoiLap}
                                </div>
                                <div className="text-red-600 font-semibold">
                                    {inv.TongTienThanhToan?.toLocaleString()} ₫
                                </div>
                            </div>
                            <InvoiceDetail data={inv} />
                        </div>
                    ))
                ) : (
                    <p className="text-sm italic text-gray-500">Chưa có hóa đơn</p>
                ))}
        </div>
    );
}
