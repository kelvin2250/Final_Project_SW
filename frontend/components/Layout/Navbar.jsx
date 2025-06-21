import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-10 bg-gradient-to-r from-[#61b6aa] to-[#3ac9b6] text-white px-6 py-5">
            <div className="flex flex-wrap justify-between items-center gap-y-2">
                {/* Logo + Menu */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <h1 className="text-xl sm:text-2xl font-bold">DeBruyne.vn</h1>
                    <div className="flex flex-wrap gap-x-4 text-sm sm:text-base">
                        <Link to="/patients">BỆNH NHÂN</Link>
                        <Link to="/prescriptions">PHIẾU KHÁM BỆNH</Link>
                        <Link to="/invoices">HÓA ĐƠN</Link>
                        <Link to="/drugs">THUỐC</Link>
                        <Link to="/stock">NHẬP KHO</Link>
                        <Link to="/reports">BÁO CÁO</Link>
                    </div>

                </div>

                {/* User info */}
                <div className="text-sm sm:text-base">
                    <span className="mr-4">Welcome: ThanhPhat</span>
                    <button className="hover:underline">Đăng xuất</button>
                </div>
            </div>
        </nav>
    );
}
