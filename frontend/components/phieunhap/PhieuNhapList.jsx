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

    // Add drug to import details
    const addDrugToImport = () => {
        setFormData({
            ...formData,
            chi_tiet: [...formData.chi_tiet, {
                TenThuoc: '',
                DonViTinh: '',
                SoLuongNhap: '',
                GiaNhap: '',
                GiaBan: '',
                HanSuDung: '',
                MaNhomThuoc: '',
                CachDung: '',
                SoDangKy: ''
            }]
        });
    };

    // Remove drug from import details
    const removeDrugFromImport = (index) => {
        const newChiTiet = formData.chi_tiet.filter((_, i) => i !== index);
        setFormData({...formData, chi_tiet: newChiTiet});
    };

    // Update drug import detail
    const updateDrugDetail = (index, field, value) => {
        const newChiTiet = [...formData.chi_tiet];
        newChiTiet[index][field] = value;
        setFormData({...formData, chi_tiet: newChiTiet});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.NhaCungCap || !formData.NgayNhap || !formData.NguoiLap) {
            alert('Vui lòng điền đầy đủ thông tin phiếu nhập');
            return;
        }

        if (formData.chi_tiet.length === 0) {
            alert('Vui lòng thêm ít nhất một loại thuốc');
            return;
        }

        // Validate drug details
        for (let i = 0; i < formData.chi_tiet.length; i++) {
            const detail = formData.chi_tiet[i];
            if (!detail.TenThuoc || !detail.DonViTinh) {
                alert(`Vui lòng điền đầy đủ thông tin thuốc ở dòng ${i + 1} (Tên thuốc và đơn vị tính là bắt buộc)`);
                return;
            }
            const soLuong = parseInt(detail.SoLuongNhap);
            const giaNhap = parseFloat(detail.GiaNhap);
            if (!soLuong || soLuong <= 0) {
                alert(`Số lượng nhập phải lớn hơn 0 ở dòng ${i + 1}`);
                return;
            }
            if (!giaNhap || giaNhap <= 0) {
                alert(`Giá nhập phải lớn hơn 0 ở dòng ${i + 1}`);
                return;
            }
        }

        try {
            // Clean and prepare the data
            const cleanedFormData = {
                ...formData,
                chi_tiet: formData.chi_tiet.map(detail => ({
                    TenThuoc: detail.TenThuoc || null,
                    DonViTinh: detail.DonViTinh || null,
                    SoLuongNhap: parseInt(detail.SoLuongNhap) || 0,
                    GiaNhap: parseFloat(detail.GiaNhap) || 0,
                    GiaBan: detail.GiaBan ? parseFloat(detail.GiaBan) : null,
                    HanSuDung: detail.HanSuDung || null,
                    CachDung: detail.CachDung || null,
                    SoDangKy: detail.SoDangKy || null,
                    MaNhomThuoc: detail.MaNhomThuoc ? parseInt(detail.MaNhomThuoc) : null
                }))
            };

            console.log('Sending data:', JSON.stringify(cleanedFormData, null, 2));

            const response = await fetch('http://localhost:8001/api/phieunhap/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanedFormData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error:', errorData);

                // Handle validation errors (422)
                if (response.status === 422 && errorData.detail) {
                    if (Array.isArray(errorData.detail)) {
                        // Pydantic validation errors
                        const errorMessages = errorData.detail.map(err =>
                            `${err.loc.join('.')}: ${err.msg}`
                        ).join('\n');
                        throw new Error(`Lỗi validation:\n${errorMessages}`);
                    } else {
                        throw new Error(errorData.detail);
                    }
                } else {
                    throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
                }
            }

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
            console.error('Error creating phieu nhap:', error);
            alert(`Lỗi: ${error.message || error.toString()}`);
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
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">Tạo Phiếu Nhập Mới</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nhà cung cấp *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.NhaCungCap}
                                        onChange={(e) => setFormData({...formData, NhaCungCap: e.target.value})}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ngày nhập *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.NgayNhap}
                                        onChange={(e) => setFormData({...formData, NgayNhap: e.target.value})}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Người lập *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.NguoiLap}
                                        onChange={(e) => setFormData({...formData, NguoiLap: e.target.value})}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ghi chú
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.GhiChu}
                                        onChange={(e) => setFormData({...formData, GhiChu: e.target.value})}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>
                            </div>

                            {/* Drug Import Details */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium">Chi tiết thuốc nhập</h3>
                                    <button
                                        type="button"
                                        onClick={addDrugToImport}
                                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                                    >
                                        + Thêm thuốc
                                    </button>
                                </div>

                                {formData.chi_tiet.map((detail, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-medium">Thuốc {index + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeDrugFromImport(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Tên thuốc *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={detail.TenThuoc}
                                                    onChange={(e) => updateDrugDetail(index, 'TenThuoc', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                    required
                                                    placeholder="Nhập tên thuốc"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Đơn vị tính *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={detail.DonViTinh}
                                                    onChange={(e) => updateDrugDetail(index, 'DonViTinh', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                    required
                                                    placeholder="VD: Viên, Hộp, Chai..."
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Số lượng nhập *
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={detail.SoLuongNhap}
                                                    onChange={(e) => updateDrugDetail(index, 'SoLuongNhap', parseInt(e.target.value))}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Giá nhập (VND) *
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={detail.GiaNhap}
                                                    onChange={(e) => updateDrugDetail(index, 'GiaNhap', parseInt(e.target.value))}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Giá bán (VND)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={detail.GiaBan}
                                                    onChange={(e) => updateDrugDetail(index, 'GiaBan', parseInt(e.target.value))}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Hạn sử dụng
                                                </label>
                                                <input
                                                    type="date"
                                                    value={detail.HanSuDung}
                                                    onChange={(e) => updateDrugDetail(index, 'HanSuDung', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Cách dùng
                                                </label>
                                                <input
                                                    type="text"
                                                    value={detail.CachDung}
                                                    onChange={(e) => updateDrugDetail(index, 'CachDung', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                    placeholder="VD: Uống sau ăn"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Số đăng ký
                                                </label>
                                                <input
                                                    type="text"
                                                    value={detail.SoDangKy}
                                                    onChange={(e) => updateDrugDetail(index, 'SoDangKy', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                    placeholder="Số đăng ký thuốc"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {formData.chi_tiet.length === 0 && (
                                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                                        Chưa có thuốc nào. Nhấn "Thêm thuốc" để bắt đầu.
                                    </div>
                                )}
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
                                    Số loại thuốc
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
                                        {phieu.chi_tiet?.length || 0} loại
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
