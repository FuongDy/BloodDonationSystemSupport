// src/services/bloodTypeService.js
import apiClient from './apiClient';

const bloodTypeService = {
    getAll: async (search = '', filters = {}) => {
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';

        const filterParams = Object.entries(filters)
            .filter(([, value]) => value)
            .map(([key, value]) => `&${key}=${encodeURIComponent(value)}`)
            .join('');

        const response = await apiClient.get(`/blood-types?${searchParam}${filterParams}`);
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(`/blood-types/${id}`);
        return response.data;
    },
    create: async (data) => {
        // Data: { bloodGroup, componentType, description, shelfLifeDays, storageTempMin, storageTempMax, volumeMl }
        // bloodGroup là string dạng "A+", "O-"
        // componentType là string (display name của enum)
        const response = await apiClient.post('/blood-types', data);
        return response.data;
    },
    update: async (id, data) => {
        // Data hiện tại backend chỉ chấp nhận: { description }
        // Nếu backend UpdateBloodTypeRequest được mở rộng, data gửi đi cũng cần thay đổi
        const response = await apiClient.put(`/blood-types/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        await apiClient.delete(`/blood-types/${id}`);
    },
};

export default bloodTypeService;