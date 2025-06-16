import { Fragment, useState, useEffect } from "react";
import { fetchPrescriptions } from "../../src/api"; // Đường dẫn đúng với file api bạn đặt
import PrescriptionTabs from "../tabDetail/PrescriptionTabs";
import PrescriptionRow from "./PrescriptionRow";

export default function PrescriptionList({ filters }) {
    const [phieuKhams, setPhieuKhams] = useState([]);
    const [phieuChon, setPhieuChon] = useState(null);
    const { keyword = "", fromDate = null, toDate = null } = filters || {};

    useEffect(() => {
        fetchPrescriptions().then(data => {
            console.log("✅ Dữ liệu phiếu khám:", data);
            setPhieuKhams(data);
        });
    }, []);

    const parseDate = (iso) => new Date(iso);

    const filtered = phieuKhams.filter((p) => {
        const kw = keyword.toLowerCase();
        const matchKeyword =
            p.ChanDoan?.toLowerCase().includes(kw) ||
            p.NguoiLap?.toLowerCase().includes(kw) ||
            String(p.MaPhieuKham).includes(kw);

        const createdAtDate = parseDate(p.NgayLap);
        const matchFrom = !fromDate || createdAtDate >= new Date(fromDate);
        const matchTo = !toDate || createdAtDate <= new Date(toDate);

        return matchKeyword && matchFrom && matchTo;
    });

    return (
        <div className="mt-3">
            <table className="w-full text-sm border border-gray-400 shadow-sm">
                <thead className="bg-emerald-100 text-gray-700 text-center">
                    <tr>
                        <th className="py-2 px-2 border">#</th>
                        <th className="py-2 px-2 border">Mã phiếu</th>
                        <th className="py-2 px-2 border">Bệnh nhân</th>
                        <th className="py-2 px-2 border">Chẩn đoán</th>
                        <th className="py-2 px-2 border">Người lập</th>
                        <th className="py-2 px-2 border">Ngày lập</th>
                        <th className="py-2 px-2 border">Chức năng</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((p, index) => (
                        <Fragment key={p.MaPhieuKham}>
                            <PrescriptionRow
                                data={p} // truyền nguyên dữ liệu gốc từ DB
                                index={index}
                                isSelected={phieuChon?.MaPhieuKham === p.MaPhieuKham}
                                onClick={() =>
                                    setPhieuChon(phieuChon?.MaPhieuKham === p.MaPhieuKham ? null : p)
                                }
                            />
                        </Fragment>
                    ))}
                </tbody>
            </table>

            {phieuChon && (
                <div className="mt-6">
                    <PrescriptionTabs
                        prescription={phieuChon}
                        patient={{ name: `Bệnh nhân #${phieuChon.MaBenhNhan}` }}
                        invoice={null}
                    />
                </div>
            )}
        </div>
    );
}
