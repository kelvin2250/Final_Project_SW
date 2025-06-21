import React, { useState, useEffect } from 'react';
import Navbar from "../components/Layout/Navbar";
import {
    fetchBaoCao,
    generateDailyReport,
    generateMonthlyReport,
    getStatisticsOverview,
    deleteBaoCao,
    downloadMonthlyReportCSV
} from '../src/api';

export default function Reports() {
    const [reports, setReports] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form states for generating reports
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

    // Load data on component mount
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
        try {
            const data = await getStatisticsOverview(
                statisticsFilter.startDate || null,
                statisticsFilter.endDate || null
            );
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

    const handleDownloadMonthlyCSV = async () => {
        try {
            setLoading(true);
            await downloadMonthlyReportCSV(monthlyReportForm.year, monthlyReportForm.month);
            alert(`Tải xuống báo cáo CSV tháng ${monthlyReportForm.month}/${monthlyReportForm.year} thành công!`);
        } catch (err) {
            alert(`Lỗi khi tải xuống CSV: ${err.message}`);
        } finally {
            setLoading(false);
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

                    <div className="flex gap-4 mb-4">
                        <input
                            type="date"
                            value={statisticsFilter.startDate}
                            onChange={(e) => setStatisticsFilter({...statisticsFilter, startDate: e.target.value})}
                            className="border rounded px-3 py-2"
                            placeholder="Từ ngày"
                        />
                        <input
                            type="date"
                            value={statisticsFilter.endDate}
                            onChange={(e) => setStatisticsFilter({...statisticsFilter, endDate: e.target.value})}
                            className="border rounded px-3 py-2"
                            placeholder="Đến ngày"
                        />
                        <button
                            onClick={loadStatistics}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Lọc
                        </button>
                    </div>

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
                <div className="gap-8 mb-8">
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
                                        onChange={(e) => setMonthlyReportForm({...monthlyReportForm, year: parseInt(e.target.value)})}
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
                                        onChange={(e) => setMonthlyReportForm({...monthlyReportForm, month: parseInt(e.target.value)})}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        required
                                    >
                                        {Array.from({length: 12}, (_, i) => (
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
                                    onChange={(e) => setMonthlyReportForm({...monthlyReportForm, nguoiLap: e.target.value})}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="Nhập tên người lập"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400"
                                >
                                    {loading ? 'Đang tạo...' : 'Tạo báo cáo hàng tháng'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDownloadMonthlyCSV}
                                    disabled={loading}
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Tải CSV tháng {monthlyReportForm.month}/{monthlyReportForm.year}
                                </button>
                            </div>
                        </form>

                        {/* CSV Info Panel */}
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="text-sm font-semibold text-blue-800 mb-2">📊 Báo cáo CSV bao gồm:</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Thống kê tổng quan (số bệnh nhân, doanh thu, hóa đơn)</li>
                                <li>• Top 5 thuốc bán chạy nhất trong tháng</li>
                                <li>• Phân tích doanh thu theo từng ngày</li>
                                <li>• Chi tiết doanh thu thuốc và dịch vụ</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}