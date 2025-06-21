import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterBar from "../components/common/FilterBar";
import PrescriptionList from "../components/prescriptions/PrescriptionList";

export default function PrescriptionsPage() {
    const [filters, setFilters] = useState({
        keyword: "",
        fromDate: null,
        toDate: null,
    });

    const navigate = useNavigate();

    return (
        <div className="mt-20 px-6">
            <FilterBar
                onSearch={setFilters}
                extraButtons={
                    <div className="flex gap-2 items-center">
                        <button
                            className="bg-green-700 text-white text-sm px-3 py-0.5 rounded-full whitespace-nowrap"
                            onClick={() => navigate("/prescriptions/create")}
                        >
                            + Thêm đơn mẫu
                        </button>
                        <button className="bg-blue-600 text-white text-sm px-3 py-0.5 rounded-full whitespace-nowrap">
                            ⬇ Xuất file excel
                        </button>
                    </div>
                }
            />
            <PrescriptionList filters={filters} />
        </div>
    );
}
