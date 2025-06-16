import { useEffect, useState } from "react";
import DrugRow from "./DrugRow";

export default function DrugList() {
    const [drugs, setDrugs] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null); // null = tất cả

    useEffect(() => {
        fetch("http://localhost:8000/api/thuoc")
            .then(res => res.json())
            .then(setDrugs)
            .catch(console.error);

        fetch("http://localhost:8000/api/nhomthuoc")
            .then(res => res.json())
            .then(setGroups)
            .catch(console.error);
    }, []);

    const filteredDrugs = selectedGroup
        ? drugs.filter(d => d.MaNhomThuoc === selectedGroup)
        : drugs;

    return (
        <div className="grid grid-cols-5 gap-6 mt-4">
            {/* Sidebar nhóm thuốc */}
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

            {/* Danh sách thuốc */}
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
                        {filteredDrugs.map((drug) => (
                            <DrugRow
                                key={drug.MaThuoc}
                                data={drug}
                                onEdit={() => console.log("🛠️ Sửa", drug)}
                                onDelete={() => console.log("🗑️ Xóa", drug)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
