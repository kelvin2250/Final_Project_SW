import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function FilterBar({
    showKeyword = true,
    showFromDate = true,
    showToDate = true,
    onSearch,
    extraButtons = null
}) {
    const [keyword, setKeyword] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [error, setError] = useState("");

    const handleSearch = () => {
        if (fromDate && toDate && toDate < fromDate) {
            setError("'Đến ngày' không được trước 'Từ ngày'");
            return;
        }
        setError("");
        onSearch?.({ keyword, fromDate, toDate });
    };

    return (
        <div className="w-full bg-teal-100 rounded-lg px-4 py-3">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-wrap gap-2 items-center">
                    {showKeyword && (
                        <input
                            type="text"
                            placeholder="Nhập từ khóa"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="px-4 py-1 rounded-full border border-gray-300 text-sm text-gray-700 placeholder-italic w-56"
                        />
                    )}

                    {showFromDate && (
                        <DatePicker
                            selected={fromDate}
                            onChange={(date) => {
                                setFromDate(date);
                                if (toDate && date && toDate < date) {
                                    setError("'Đến ngày' không được trước 'Từ ngày'");
                                } else {
                                    setError("");
                                }
                            }}
                            placeholderText="Từ ngày"
                            dateFormat="dd/MM/yyyy"
                            className="px-4 py-1 rounded-full border border-gray-300 text-sm text-gray-700 placeholder-italic w-36"
                            calendarClassName="shadow-lg rounded-md"
                            popperPlacement="bottom-start"
                            isClearable
                        />
                    )}

                    {showToDate && (
                        <DatePicker
                            selected={toDate}
                            onChange={(date) => {
                                setToDate(date);
                                if (fromDate && date && date < fromDate) {
                                    setError("'Đến ngày' không được trước 'Từ ngày'");
                                } else {
                                    setError("");
                                }
                            }}
                            placeholderText="Đến ngày"
                            dateFormat="dd/MM/yyyy"
                            className="px-4 py-1 rounded-full border border-gray-300 text-sm text-gray-700 placeholder-italic w-36"
                            calendarClassName="shadow-lg rounded-md"
                            popperPlacement="bottom-start"
                            isClearable
                        />
                    )}

                    <button
                        onClick={handleSearch}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1 rounded-full text-sm"
                    >
                        Tìm
                    </button>
                </div>

                {extraButtons && <div className="flex items-center gap-2">{extraButtons}</div>}
            </div>

            {/* Cảnh báo lỗi */}
            {error && (
                <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
            )}
        </div>
    );
}
