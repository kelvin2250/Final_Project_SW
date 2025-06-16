import { useState } from "react";
import FilterBar from "../components/common/FilterBar";
import StockEntryList from "../components/stock/StockList";
import StockEntryForm from "../components/stock/StockEntryForm";

export default function StockEntriesPage() {
    const [filters, setFilters] = useState({ keyword: "", fromDate: null, toDate: null });
    const [showForm, setShowForm] = useState(false);

    const handleAdd = (data) => {
        console.log("📝 Phiếu nhập mới:", data);
        // TODO: gửi lên backend sau này
        setShowForm(false);
    };

    return (
        <div className="mt-20 px-6">
            {!showForm ? (
                <>
                    <FilterBar
                        onSearch={setFilters}
                        extraButtons={
                            <div className="flex gap-2 items-center">
                                <button
                                    className="bg-green-700 text-white text-sm px-3 py-0.5 rounded-full whitespace-nowrap"
                                    onClick={() => setShowForm(true)}
                                >
                                    + Thêm phiếu nhập
                                </button>
                                <button className="bg-blue-600 text-white text-sm px-3 py-0.5 rounded-full whitespace-nowrap">
                                    ⬇ Xuất file excel
                                </button>
                            </div>
                        }
                    />
                    <StockEntryList filters={filters} />
                </>
            ) : (
                <StockEntryForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
            )}
        </div>
    );
}
