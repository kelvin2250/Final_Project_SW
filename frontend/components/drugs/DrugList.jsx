import { useEffect, useState } from "react";
import DrugRow from "./DrugRow";
import DrugFormModal from "./DrugFormModal";

export default function DrugList({ filters, newDrug, setNewDrug }) {
    const [drugs, setDrugs] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDrug, setSelectedDrug] = useState(null);

    // Lấy dữ liệu ban đầu từ API
    useEffect(() => {
        fetch("http://localhost:8000/api/thuoc")
            .then(res => res.json())
            .then(data => {
                console.log("Dữ liệu thuốc:", data);
                setDrugs(data);
            })
            .catch(console.error);

        fetch("http://localhost:8000/api/nhomthuoc")
            .then(res => res.json())
            .then(data => {
                console.log("Dữ liệu nhóm thuốc:", data);
                setGroups(data);
            })
            .catch(console.error);
    }, []);

    // Cập nhật danh sách thuốc khi có thuốc mới
    useEffect(() => {
        if (newDrug) {
            setDrugs(prev => {
                // Kiểm tra xem thuốc đã tồn tại chưa để tránh trùng lặp
                if (!prev.some(drug => drug.MaThuoc === newDrug.MaThuoc)) {
                    return [...prev, newDrug];
                }
                return prev;
            });
            setNewDrug(null); // Xóa newDrug sau khi thêm
        }
    }, [newDrug, setNewDrug]);

    // Lọc thuốc theo nhóm và bộ lọc
    const filteredDrugs = drugs
        .filter(d => selectedGroup ? d.MaNhomThuoc === selectedGroup : true)
        .filter(d => {
            if (!filters.search) return true;
            return (
                d.TenThuoc.toLowerCase().includes(filters.search.toLowerCase()) ||
                d.SoDangKy.toLowerCase().includes(filters.search.toLowerCase())
            );
        });

    const handleDelete = (drugId) => {
        if (window.confirm("Bạn có chắc muốn xóa thuốc này?")) {
            fetch(`http://localhost:8000/api/thuoc/${drugId}`, {
                method: "DELETE",
            })
                .then(() => {
                    setDrugs(drugs.filter((drug) => drug.MaThuoc !== drugId));
                })
                .catch((err) => console.error("Xóa thuốc lỗi:", err));
        }
    };

    const handleEdit = (drug) => {
        if (!drug) {
            console.error("Dữ liệu thuốc không hợp lệ:", drug);
            return;
        }
        setIsEditing(true);
        setSelectedDrug(drug);
    };

    const handleSave = (updatedDrug) => {
        fetch(`http://localhost:8000/api/thuoc/${updatedDrug.MaThuoc}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedDrug),
        })
            .then((res) => res.json())
            .then((data) => {
                setDrugs(drugs.map(drug => drug.MaThuoc === data.MaThuoc ? data : drug));
                setIsEditing(false);
                setSelectedDrug(null);
            })
            .catch((err) => console.error("Cập nhật thuốc lỗi:", err));
    };

    return (
        <div className="grid grid-cols-5 gap-6 mt-4">
            <div className="col-span-1 bg-white rounded shadow p-4">
                <h2 className="font-bold text-teal-700 mb-2">📂 Nhóm thuốc</h2>
                <ul className="space-y-2 text-sm max-h-[500px] overflow-y-auto">
                    <li
                        onClick={() => setSelectedGroup(null)}
                        className={`cursor-pointer px-3 py-1 rounded ${selectedGroup === null ? "bg-emerald-600 text-white" : "hover:bg-gray-200"}`}
                    >
                        Tất cả
                    </li>
                    {groups.map((g) => (
                        <li
                            key={g.MaNhomThuoc}
                            onClick={() => setSelectedGroup(g.MaNhomThuoc)}
                            className={`cursor-pointer px-3 py-1 rounded ${selectedGroup === g.MaNhomThuoc ? "bg-emerald-600 text-white" : "hover:bg-gray-200"}`}
                        >
                            {g.TenNhomThuoc}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="col-span-4">
                <table className="w-full text-sm border border-gray-300 shadow-sm">
                    <thead className="bg-emerald-100 text-gray-700 text-center">
                        <tr>
                            <th className="py-2 px-2 border">MÃ</th>
                            <th className="py-2 px-2 border">SỐ ĐK</th>
                            <th className="py-2 px-2 border">TÊN</th>
                            <th className="py-2 px-2 border">ĐƠN VỊ</th>
                            <th className="py-2 px-2 border">GIÁ BÁN</th>
                            <th className="py-2 px-2 border">TỒN KHO</th>
                            <th className="py-2 px-2 border">CÁCH DÙNG</th>
                            <th className="py-2 px-2 border">CHỨC NĂNG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDrugs.length > 0 ? (
                            filteredDrugs.map((drug) => (
                                <DrugRow
                                    key={drug.MaThuoc}
                                    data={drug}
                                    onEdit={() => handleEdit(drug)}
                                    onDelete={() => handleDelete(drug.MaThuoc)}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="py-2 px-2 text-center">Không có dữ liệu thuốc</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isEditing && (
                <DrugFormModal
                    isOpen={isEditing}
                    onClose={() => {
                        setIsEditing(false);
                        setSelectedDrug(null);
                    }}
                    onSubmit={handleSave}
                    initialData={selectedDrug}
                />
            )}
        </div>
    );
}