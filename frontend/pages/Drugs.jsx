import { useState } from "react";
import FilterBar from "../components/common/FilterBar";
import DrugList from "../components/drugs/DrugList";
import DrugFormModal from "../components/drugs/DrugFormModal";

export default function DrugsPage() {
    const [filters, setFilters] = useState({});
    const [showForm, setShowForm] = useState(false);

    const handleAdd = async (drug) => {
        try {
            const res = await fetch("http://localhost:8000/api/thuoc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(drug),
            });
            const result = await res.json();
            console.log("✅ Thêm thuốc:", result);
            setShowForm(false);
        } catch (err) {
            console.error("❌ Lỗi:", err);
        }
    };

    return (
        <div className="mt-20 px-6">
            <FilterBar
                onSearch={setFilters}
                extraButtons={
                    <button
                        className="bg-green-700 text-white px-3 py-1 rounded"
                        onClick={() => setShowForm(true)}
                    >
                        + Thêm thuốc
                    </button>
                }
            />
            <DrugList filters={filters} />
            <DrugFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSubmit={handleAdd} />
        </div>
    );
}
