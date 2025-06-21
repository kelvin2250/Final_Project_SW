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

    const handleSearch = () => {
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
                            onChange={(date) => setFromDate(date)}
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
                            onChange={(date) => setToDate(date)}
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

                {/* Nút mở rộng bên phải */}
                {extraButtons && <div className="flex items-center gap-2">{extraButtons}</div>}

            </div>
        </div>
    );
}
