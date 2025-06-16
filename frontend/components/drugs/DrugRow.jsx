export default function DrugRow({ data, onEdit, onDelete }) {
    return (
        <tr className="text-center hover:bg-gray-50 border-t border-gray-300">
            <td className="border border-gray-300">{data.MaThuoc}</td>
            <td className="border border-gray-300 font-medium text-blue-700">{data.TenThuoc}</td>
            <td className="border border-gray-300">{data.DonViTinh}</td>
            <td className="border border-gray-300">{data.TonKho}</td>
            <td className="border border-gray-300">{data.GiaBan?.toLocaleString()} ₫</td>
            <td className="border border-gray-300">{data.CachDung}</td>
            <td className="border border-gray-300">{data.NgayTao?.slice(0, 10)}</td>
            <td className="space-x-2 border border-gray-300">
                <button title="Sửa" onClick={onEdit}>✏️</button>
                <button title="Xoá" onClick={onDelete}>🗑️</button>
            </td>
        </tr>
    );
}
