// src/hooks/useBloodTypePageLogic.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import bloodTypeService from '../services/bloodTypeService';

export const useBloodTypePageLogic = () => {
    // --- STATE MANAGEMENT ---
    const [bloodTypes, setBloodTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBloodType, setEditingBloodType] = useState(null);
    const [searchTerm] = useState('');
    const [activeTab, setActiveTab] = useState(null);

    // --- DATA FETCHING & PROCESSING ---
    const fetchBloodTypes = useCallback(async search => {
        setIsLoading(true);
        try {
            const data = await bloodTypeService.getAll(search);
            setBloodTypes(data || []);
        } catch (error) {
            toast.error(`Lỗi khi tải dữ liệu: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBloodTypes(searchTerm);
    }, [searchTerm, fetchBloodTypes]);

    const groupedBloodTypes = useMemo(() => {
        if (!bloodTypes) return {};
        return bloodTypes.reduce((acc, current) => {
            const group = current.bloodGroup;
            if (!acc[group]) acc[group] = [];
            acc[group].push(current);
            return acc;
        }, {});
    }, [bloodTypes]);

    // Effect để tự động chọn tab đầu tiên khi dữ liệu thay đổi
    useEffect(() => {
        const groups = Object.keys(groupedBloodTypes).sort();
        if (groups.length > 0) {
            if (!groups.includes(activeTab)) {
                setActiveTab(groups[0]);
            }
        } else {
            setActiveTab(null);
        }
    }, [groupedBloodTypes, activeTab]);

    // --- HANDLERS ---
    const handleOpenModal = (bloodType = null) => {
        setEditingBloodType(bloodType);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBloodType(null);
    };

    const handleSaveSuccess = () => {
        fetchBloodTypes(searchTerm);
        handleCloseModal();
    };

    const handleDelete = async(id, description) => {
        const displayName = description || `ID: ${id}`;
        const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa loại máu "${displayName}" không?`);

        if (confirmed) {
            const toastId = toast.loading('Đang xóa...');
            try {
                await bloodTypeService.delete(id);
                toast.success('Xóa thành công!', { id: toastId });
                fetchBloodTypes(searchTerm);
            } catch (error) {
                toast.error(`Lỗi khi xóa: ${error.message}`, { id: toastId });
            }
        }
    };

    return {
        // State
        bloodTypes,
        isLoading,
        isModalOpen,
        editingBloodType,
        activeTab,
        groupedBloodTypes,
        // Handlers
        handleOpenModal,
        handleCloseModal,
        handleSaveSuccess,
        handleDelete,
        setActiveTab,
    };
};