import apiClient from './apiClient';

const bloodTypeService = {
    // ĐÃ LOẠI BỎ LOGIC FILTER KHỎI HÀM NÀY
    getAll: async (page = 0, size = 10, sort = ['id', 'asc'], search = '') => {
        const sortParams = sort.join(',');
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';

        // Đã xóa logic của filterParams
        const response = await apiClient.get(`/blood-types?page=${page}&size=${size}&sort=${sortParams}${searchParam}`);
        return response.data;
    },
    
    // Các hàm còn lại giữ nguyên
    getById: async (id) => {
        const response = await apiClient.get(`/blood-types/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/blood-types', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/blood-types/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        await apiClient.delete(`/blood-types/${id}`);
    },
};

export default bloodTypeService;