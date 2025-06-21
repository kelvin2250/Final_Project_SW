const API_URL = "http://localhost:8000/api";

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
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Không thể tạo bệnh nhân");
    }
    return res.json();
}

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

export async function getPatientByMaBenhNhan(maBenhNhan) {
    try {
        const res = await fetch(`${API_URL}/benhnhan/${maBenhNhan}`);
        if (!res.ok) throw new Error("Không thể lấy dữ liệu bệnh nhân");
        return await res.json();
    } catch (err) {
        console.error("❌ Lỗi getPatientByMa:", err);
        return null;
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

export const updatePatient = async (id, data) => {
    const res = await fetch(`${API_URL}/benhnhan/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Không thể cập nhật bệnh nhân");
    }
    return res.json();
}

export const deletePatient = async (id) => {
    const res = await fetch(`${API_URL}/benhnhan/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Không thể xóa bệnh nhân");
    }
    return res.json();
};

export async function fetchPrescriptionsByPatient(patientId) {
    try {
        const res = await fetch(`${API_URL}/benhnhan/${patientId}/phieukhams`);
        if (!res.ok) throw new Error("Không thể tải đơn thuốc");
        return await res.json();
    } catch (err) {
        console.error("❌ Lỗi fetchPrescriptionsByPatient:", err);
        return [];
    }
}

export async function fetchInvoicesByPatient(patientId) {
    const res = await fetch(`${API_URL}/benhnhan/${patientId}/hoadons`);
    if (!res.ok) throw new Error("Không thể tải danh sách hóa đơn");

    const invoices = await res.json();

    // Lấy chi tiết từng hóa đơn
    const details = await Promise.all(
        invoices.map(inv =>
            fetch(`${API_URL}/hoadon/${inv.MaHoaDon}`).then(r => r.json())
        )
    );

    return details;
}

async function fetchInvoiceByPhieuKham(maPhieuKham) {
    const res = await fetch(`http://localhost:8000/api/hoadon/phieukham/${maPhieuKham}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    // Gọi chi tiết 1 hóa đơn đầu tiên (nếu có nhiều)
    const detail = await fetch(`http://localhost:8000/api/hoadon/${data[0].MaHoaDon}`);
    return await detail.json();
}

export async function fetchInvoicesByPhieuKham(maPhieuKham) {
    const res = await fetch(`http://localhost:8000/api/phieukham/${maPhieuKham}/hoadons`);
    if (!res.ok) return [];

    const basicList = await res.json();
    const detailed = await Promise.all(
        basicList.map((inv) =>
            fetch(`http://localhost:8000/api/hoadon/${inv.MaHoaDon}`).then((r) => r.json())
        )
    );

    return detailed;
}




export const createInvoice = async (hoaDon) => {
    const response = await fetch(`${API_URL}/hoadon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hoaDon),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData.detail) || "Lỗi khi tạo hóa đơn");
    }
    return response.json();
}

export const updateInvoice = async (maHoaDon, hoaDon) => {
    const response = await fetch(`${API_URL}/hoadon/${maHoaDon}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hoaDon),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData.detail) || "Lỗi khi cập nhật hóa đơn");
    }
    return response.json();
}

export const deleteInvoice = async (maHoaDon) => {
    const response = await fetch(`${API_URL}/hoadon/${maHoaDon}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData.detail) || "Lỗi khi xóa hóa đơn");
    }
    return response.json();
}