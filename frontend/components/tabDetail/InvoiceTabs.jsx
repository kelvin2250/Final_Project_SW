import { useState } from "react";
import InvoiceDetail from "../details/InvoiceDetail";
import PatientDetail from "../details/PatientDetail";

export default function InvoiceTabs({ invoice, patient }) {
    const [tab, setTab] = useState("invoice");

    return (
        <div>
            <div className="flex space-x-4 border-b mb-4 text-sm">
                <button
                    onClick={() => setTab("invoice")}
                    className={`pb-1 ${tab === "invoice" ? "font-semibold border-b-2 border-emerald-600" : ""}`}
                >
                    Chi tiết hóa đơn
                </button>
                <button
                    onClick={() => setTab("patient")}
                    className={`pb-1 ${tab === "patient" ? "font-semibold border-b-2 border-emerald-600" : ""}`}
                >
                    Thông tin bệnh nhân
                </button>
            </div>

            {/* Tab: Chi tiết hóa đơn */}
            {tab === "invoice" && (
                <>
                    <div className="mb-2 text-sm">
                        <p><strong>Ngày lập:</strong> {new Date(invoice.NgayLap).toLocaleDateString("vi-VN")}</p>
                        <p><strong>Người lập:</strong> {invoice.NguoiLap}</p>
                        <p><strong>Ghi chú:</strong> {invoice.GhiChu || "Không có"}</p>
                    </div>
                    <InvoiceDetail data={invoice} />
                </>
            )}

            {/* Tab: Thông tin bệnh nhân */}
            {tab === "patient" && (
                <div className="mt-2">
                    {invoice.benhnhan ? (
                        <PatientDetail data={invoice.benhnhan} />
                    ) : (
                        <p className="text-sm italic text-gray-600">Khách lẻ – không có thông tin chi tiết.</p>
                    )}
                </div>
            )}
        </div>
    );
}
