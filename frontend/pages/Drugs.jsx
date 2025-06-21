import { useState } from "react";
import FilterBar from "../components/common/FilterBar";
import DrugList from "../components/drugs/DrugList";
import DrugFormModal from "../components/drugs/DrugFormModal";

export default function DrugsPage() {
    const [filters, setFilters] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [newDrug, setNewDrug] = useState(null); // Thêm state để lưu thuốc mới

    const handleAdd = async (drug) => {
        try {
            const res = await fetch("http://localhost:8000/api/thuoc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(drug),
            });
            if (!res.ok) {
                throw new Error("Lỗi khi thêm thuốc");
            }
            const result = await res.json();
            console.log("✅ Thêm thuốc:", result);
            setNewDrug(result); // Lưu thuốc mới để truyền cho DrugList
            setShowForm(false);
            return result; // Trả về thuốc mới
        } catch (err) {
            console.error("❌ Lỗi:", err);
            alert("Lỗi khi thêm thuốc: " + err.message);
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
            <DrugList filters={filters} newDrug={newDrug} setNewDrug={setNewDrug} />
            <DrugFormModal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                onSubmit={handleAdd}
            />
        </div>
    );
}