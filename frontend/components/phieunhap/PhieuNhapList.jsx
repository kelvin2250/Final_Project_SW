import React, { useState, useEffect } from 'react';

const PhieuNhap = () => {
    const [phieuNhapList, setPhieuNhapList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        NhaCungCap: '',
        NgayNhap: new Date().toISOString().split('T')[0],
        NguoiLap: '',
        GhiChu: '',
        chi_tiet: []
    });

    // Fetch phieu nhap list
    const loadPhieuNhap = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8001/api/phieunhap/');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setPhieuNhapList(data);
        } catch (error) {
            console.error('Error loading phieu nhap:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPhieuNhap();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8001/api/phieunhap/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to create');

            alert('Tạo phiếu nhập thành công!');
            setShowForm(false);
            setFormData({
                NhaCungCap: '',
                NgayNhap: new Date().toISOString().split('T')[0],
                NguoiLap: '',
                GhiChu: '',
                chi_tiet: []
            });
            loadPhieuNhap();
        } catch (error) {
            alert('Lỗi: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa phiếu nhập này?')) return;

        try {
            const response = await fetch(`http://localhost:8001/api/phieunhap/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete');

            alert('Xóa phiếu nhập thành công!');
            loadPhieuNhap();
        } catch (error) {
            alert('Lỗi: ' + error.message);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Quản lý Phiếu Nhập</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Thêm Phiếu Nhập
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Tạo Phiếu Nhập Mới</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nhà cung cấp
                                </label>
                                <input
                                    type="text"
                                    value={formData.NhaCungCap}
                                    onChange={(e) => setFormData({...formData, NhaCungCap: e.target.value})}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày nhập
                                </label>
                                <input
                                    type="date"
                                    value={formData.NgayNhap}
                                    onChange={(e) => setFormData({...formData, NgayNhap: e.target.value})}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Người lập
                                </label>
                                <input
                                    type="text"
                                    value={formData.NguoiLap}
                                    onChange={(e) => setFormData({...formData, NguoiLap: e.target.value})}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ghi chú
                                </label>
                                <textarea
                                    value={formData.GhiChu}
                                    onChange={(e) => setFormData({...formData, GhiChu: e.target.value})}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    rows="3"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                >
                                    Tạo Phiếu Nhập
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mã PN
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nhà cung cấp
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày nhập
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Người lập
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
                            {phieuNhapList.map((phieu) => (
                                <tr key={phieu.MaPhieuNhap} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {phieu.MaPhieuNhap}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {phieu.NhaCungCap}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(phieu.NgayNhap)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {phieu.NguoiLap}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(phieu.NgayTao)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(phieu.MaPhieuNhap)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {phieuNhapList.length === 0 && !loading && (
                        <div className="text-center py-8 text-gray-500">
                            Chưa có phiếu nhập nào
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-8 text-gray-500">
                            Đang tải dữ liệu...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PhieuNhap;
