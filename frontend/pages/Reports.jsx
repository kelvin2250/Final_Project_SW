import React, { useState, useEffect } from 'react';
import Navbar from "../components/Layout/Navbar";
import {
    fetchBaoCao,
    generateDailyReport,
    generateMonthlyReport,
    getStatisticsOverview,
    deleteBaoCao
} from '../src/api';

export default function Reports() {
    const [reports, setReports] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dateError, setDateError] = useState(""); // ✅ NEW

    const [dailyReportForm, setDailyReportForm] = useState({
        reportDate: new Date().toISOString().split('T')[0],
        nguoiLap: ''
    });

    const [monthlyReportForm, setMonthlyReportForm] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        nguoiLap: ''
    });

    const [statisticsFilter, setStatisticsFilter] = useState({
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        loadReports();
        loadStatistics();
    }, []);

    const loadReports = async () => {
        try {
            setLoading(true);
            const data = await fetchBaoCao();
            setReports(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadStatistics = async () => {
        const { startDate, endDate } = statisticsFilter;
        if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            setDateError("'Đến ngày' không được nhỏ hơn 'Từ ngày'");
            return;
        }
        setDateError(""); // ✅ clear error

        try {
            const data = await getStatisticsOverview(startDate || null, endDate || null);
            setStatistics(data);
        } catch (err) {
            console.error('Error loading statistics:', err);
        }
    };

    const handleGenerateDailyReport = async (e) => {
        e.preventDefault();
        if (!dailyReportForm.nguoiLap.trim()) {
            alert('Vui lòng nhập tên người lập báo cáo');
            return;
        }

        try {
            setLoading(true);
            await generateDailyReport(dailyReportForm.reportDate, dailyReportForm.nguoiLap);
            alert('Tạo báo cáo hàng ngày thành công!');
            loadReports();
            setDailyReportForm({ ...dailyReportForm, nguoiLap: '' });
        } catch (err) {
            alert(`Lỗi: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateMonthlyReport = async (e) => {
        e.preventDefault();
        if (!monthlyReportForm.nguoiLap.trim()) {
            alert('Vui lòng nhập tên người lập báo cáo');
            return;
        }

        try {
            setLoading(true);
            await generateMonthlyReport(
                monthlyReportForm.year,
                monthlyReportForm.month,
                monthlyReportForm.nguoiLap
            );
            alert('Tạo báo cáo hàng tháng thành công!');
            loadReports();
            setMonthlyReportForm({ ...monthlyReportForm, nguoiLap: '' });
        } catch (err) {
            alert(`Lỗi: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReport = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa báo cáo này?')) return;

        try {
            await deleteBaoCao(id);
            alert('Xóa báo cáo thành công!');
            loadReports();
        } catch (err) {
            alert(`Lỗi: ${err.message}`);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Quản lý Báo cáo</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Statistics Overview */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Thống kê tổng quan</h2>

                    <div className="flex flex-wrap items-center gap-4 mb-2">
                        <input
                            type="date"
                            value={statisticsFilter.startDate}
                            onChange={(e) => setStatisticsFilter({ ...statisticsFilter, startDate: e.target.value })}
                            className="border rounded px-3 py-2"
                        />
                        <input
                            type="date"
                            value={statisticsFilter.endDate}
                            onChange={(e) => setStatisticsFilter({ ...statisticsFilter, endDate: e.target.value })}
                            className="border rounded px-3 py-2"
                        />
                        <button
                            onClick={loadStatistics}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Lọc
                        </button>
                    </div>

                    {dateError && (
                        <p className="text-red-600 text-sm font-medium mb-2">{dateError}</p>
                    )}

                    {statistics && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-blue-600">Tổng doanh thu</h3>
                                <p className="text-2xl font-bold text-blue-800">
                                    {formatCurrency(statistics.tong_doanh_thu)}
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-green-600">Tổng hóa đơn</h3>
                                <p className="text-2xl font-bold text-green-800">
                                    {statistics.tong_so_hoadon}
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-purple-600">Tổng bệnh nhân</h3>
                                <p className="text-2xl font-bold text-purple-800">
                                    {statistics.tong_so_benhnhan}
                                </p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-yellow-600">Doanh thu TB/HĐ</h3>
                                <p className="text-2xl font-bold text-yellow-800">
                                    {formatCurrency(statistics.doanh_thu_trung_binh)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                {/* Generate Reports Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Daily Report Form */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Tạo báo cáo hàng ngày</h2>
                        <form onSubmit={handleGenerateDailyReport}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày báo cáo
                                </label>
                                <input
                                    type="date"
                                    value={dailyReportForm.reportDate}
                                    onChange={(e) => setDailyReportForm({ ...dailyReportForm, reportDate: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Người lập báo cáo
                                </label>
                                <input
                                    type="text"
                                    value={dailyReportForm.nguoiLap}
                                    onChange={(e) => setDailyReportForm({ ...dailyReportForm, nguoiLap: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="Nhập tên người lập"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
                            >
                                {loading ? 'Đang tạo...' : 'Tạo báo cáo hàng ngày'}
                            </button>
                        </form>
                    </div>

                    {/* Monthly Report Form */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Tạo báo cáo hàng tháng</h2>
                        <form onSubmit={handleGenerateMonthlyReport}>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Năm
                                    </label>
                                    <input
                                        type="number"
                                        value={monthlyReportForm.year}
                                        onChange={(e) => setMonthlyReportForm({ ...monthlyReportForm, year: parseInt(e.target.value) })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        min="2020"
                                        max="2030"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tháng
                                    </label>
                                    <select
                                        value={monthlyReportForm.month}
                                        onChange={(e) => setMonthlyReportForm({ ...monthlyReportForm, month: parseInt(e.target.value) })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        required
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                Tháng {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Người lập báo cáo
                                </label>
                                <input
                                    type="text"
                                    value={monthlyReportForm.nguoiLap}
                                    onChange={(e) => setMonthlyReportForm({ ...monthlyReportForm, nguoiLap: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="Nhập tên người lập"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400"
                            >
                                {loading ? 'Đang tạo...' : 'Tạo báo cáo hàng tháng'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Reports List */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-xl font-semibold">Danh sách báo cáo</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mã BC
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Loại báo cáo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thời gian BC
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
                                {reports.map((report) => (
                                    <tr key={report.MaBaoCao} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {report.MaBaoCao}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {report.LoaiBaoCao}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(report.ThoiGianBaoCao)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {report.NguoiLap}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(report.NgayTao)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleDeleteReport(report.MaBaoCao)}
                                                className="text-red-600 hover:text-red-900 mr-3"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {reports.length === 0 && !loading && (
                            <div className="text-center py-8 text-gray-500">
                                Chưa có báo cáo nào
                            </div>
                        )}

                        {loading && reports.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                Đang tải dữ liệu...
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </>
    );
}
