export default function InvoiceDetail({ data }) {
    if (!data || !Array.isArray(data.items)) {
        return <p className="text-sm italic text-gray-500">Không có dữ liệu hóa đơn.</p>;
    }

    return (
        <table className="w-full text-sm border">
            <thead className="bg-gray-100">
                <tr>
                    <th className="border px-2 py-1">#</th>
                    <th className="border px-2 py-1">Tên thuốc</th>
                    <th className="border px-2 py-1">Đơn vị</th>
                    <th className="border px-2 py-1">SL</th>
                    <th className="border px-2 py-1">Giá</th>
                    <th className="border px-2 py-1">Cộng</th>
                </tr>
            </thead>
            <tbody>
                {data.items.map((item, i) => (
                    <tr key={i}>
                        <td className="border px-2 py-1 text-center">{i + 1}</td>
                        <td className="border px-2 py-1">{item.name}</td>
                        <td className="border px-2 py-1">{item.unit}</td>
                        <td className="border px-2 py-1 text-center">{item.quantity}</td>
                        <td className="border px-2 py-1 text-right">{item.price.toLocaleString()} ₫</td>
                        <td className="border px-2 py-1 text-right">{item.total.toLocaleString()} ₫</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
