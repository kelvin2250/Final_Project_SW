/**
 * Làm sạch dữ liệu form trước khi gửi đến backend:
 * - Chuyển "" hoặc undefined → null
 * - Ép kiểu số cho các trường được chỉ định
 *
 * @param {Object} formData - Dữ liệu form gốc
 * @param {string[]} numberFields - Danh sách các field cần ép kiểu số
 * @returns {Object} - Dữ liệu đã làm sạch
 */
export function cleanFormData(formData, numberFields = []) {
    const cleaned = { ...formData };

    for (const key in cleaned) {
        const value = cleaned[key];

        // Nếu chuỗi rỗng hoặc undefined/null → null
        if (value === "" || value === undefined) {
            cleaned[key] = null;
            continue;
        }

        // Nếu là trường cần ép số
        if (numberFields.includes(key)) {
            const parsed = Number(value);
            cleaned[key] = isNaN(parsed) ? null : parsed;
        }
    }

    return cleaned;
}
