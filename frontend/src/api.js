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
        const res = await fetch("http://localhost:8000/api/phieukham");
        if (!res.ok) throw new Error("Lỗi khi tải phiếu khám");
        return await res.json();
    } catch (err) {
        console.error("❌ Lỗi fetchPrescriptions:", err);
        return [];
    }
}
