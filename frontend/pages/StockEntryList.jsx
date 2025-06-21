import { useState, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import PhieuNhapList from "../components/phieunhap/PhieuNhapList";

export default function StockEntriesPage() {
    const [activeTab, setActiveTab] = useState('phieunhap');
    const [phieuXuatList, setPhieuXuatList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch phieu xuat list
    const loadPhieuXuat = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8001/api/phieuxuat/');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setPhieuXuatList(data);
        } catch (error) {
            console.error('Error loading phieu xuat:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'phieuxuat') {
            loadPhieuXuat();
        }
    }, [activeTab]);

    const handleDeletePhieuXuat = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa phiếu xuất này?')) return;

        try {
            const response = await fetch(`http://localhost:8001/api/phieuxuat/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete');

            alert('Xóa phiếu xuất thành công!');
            loadPhieuXuat();
        } catch (error) {
            alert('Lỗi: ' + error.message);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Quản lý Kho</h1>

                {/* Tab Navigation */}
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('phieunhap')}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            activeTab === 'phieunhap'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Phiếu Nhập
                    </button>
                    <button
                        onClick={() => setActiveTab('phieuxuat')}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            activeTab === 'phieuxuat'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Phiếu Xuất
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'phieunhap' && <PhieuNhapList />}

                {activeTab === 'phieuxuat' && (
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-xl font-semibold">Danh sách Phiếu Xuất</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mã PX
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày xuất
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Người lập
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ghi chú
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày tạo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {phieuXuatList.map((phieu) => (
                                        <tr key={phieu.MaPhieuXuat} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {phieu.MaPhieuXuat}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(phieu.NgayXuat)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {phieu.NguoiLap}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {phieu.GhiChu || 'Không có'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(phieu.NgayTao)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleDeletePhieuXuat(phieu.MaPhieuXuat)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {phieuXuatList.length === 0 && !loading && (
                                <div className="text-center py-8 text-gray-500">
                                    Chưa có phiếu xuất nào
                                </div>
                            )}

                            {loading && (
                                <div className="text-center py-8 text-gray-500">
                                    Đang tải dữ liệu...
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
