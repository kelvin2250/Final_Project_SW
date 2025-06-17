const API_URL = "http://localhost:8000/api"; // địa chỉ backend

export async function fetchPatients() {
    const res = await fetch(`${API_URL}/benhnhan/`);
    if (!res.ok) throw new Error("Không thể tải danh sách bệnh nhân");
    return res.json();
}

export async function createPatient(patient) {
    const res = await fetch(`${API_URL}/benhnhan/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient),
    });
    if (!res.ok) throw new Error("Không thể tạo bệnh nhân");
    return res.json();
}

// 📁 src/api.js
export async function fetchPrescriptions() {
    try {
        const res = await fetch(`${API_URL}/phieukham`);
        if (!res.ok) throw new Error("Lỗi khi tải phiếu khám");
        return await res.json();
    } catch (err) {
        console.error("❌ Lỗi fetchPrescriptions:", err);
        return [];
    }
}

export async function fetchChiTietThuoc(maPhieuKham) {
    try {
        const res = await fetch(`${API_URL}/phieukham/${maPhieuKham}/thuoc`);
        if (!res.ok) throw new Error("Lỗi khi tải chi tiết thuốc");
        return await res.json();
    } catch (err) {
        console.error("❌ Lỗi fetchChiTietThuoc:", err);
        return [];
    }
}


export async function getPatientByMaBenhNhan(maBenhNhan) {
    try {
        const res = await fetch(`${API_URL}/benhnhan/${maBenhNhan}`);
        if (!res.ok) throw new Error("Không thể lấy dữ liệu bệnh nhân");
        return await res.json();
    } catch (err) {
        console.error("❌ Lỗi fetchPatiendsByMa:", err);
        return [];
    }
    
}

/**
 * Tạo hóa đơn mới kèm theo chi tiết thuốc và dịch vụ
 * @param {Object} hoaDon - Thông tin hóa đơn
 * @param {Array} thuocList - Danh sách thuốc (chi tiết hóa đơn thuốc)
 * @param {Array} dvdtList - Danh sách dịch vụ (chi tiết hóa đơn dịch vụ điều trị)
 */
export async function createInvoice(hoaDon, thuocList, dvdtList) {
    try {
        const res = await fetch(`${API_URL}/hoadon/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                hoadon: hoaDon,
                thuocs: thuocList,
                dichvus: dvdtList,
            }),
        });

        if (!res.ok) {
            const err = await res.json();
            console.error("❌ API trả lỗi khi tạo hóa đơn:", err);
            throw new Error("Không thể tạo hóa đơn");
        }

        return await res.json();
    } catch (err) {
        console.error("❌ Lỗi trong createInvoice():", err);
        throw err;
    }
}



export async function fetchChiTietDVDT(MaPhieuKham) {
    try {
        const res = await fetch(`${API_URL}/phieukham/${MaPhieuKham}/dvdt`);
        if (!res.ok) throw new Error("Lỗi khi tải chi tiết dịch vụ điều trị");
        return await res.json();
    } catch (err) {
        console.error("❌ Lỗi fetchChiTietDVDT:", err);
        return [];
    }
}

export async function fetchPhieuKhamById(maPhieuKham) {
    try {
        const res = await fetch(`${API_URL}/phieukham/${maPhieuKham}`);
        if (!res.ok) throw new Error("Không thể lấy thông tin phiếu khám");
        return await res.json();
    } catch (err) {
        console.error("❌ Lỗi fetchPhieuKhamById:", err);
        return null;
    }
}
