import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Users, Plus, RefreshCw } from 'lucide-react';
import userService from '../../services/userService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import UserManagementTable from '../../components/admin/UserManagementTable';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';

const AdminUserListPage = () => {
    const [usersPage, setUsersPage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    const fetchUsers = useCallback(async (page = 0) => {
        setIsLoading(true);
        try {
            const response = await userService.getAllUsers(page);
            setUsersPage(response);
        } catch (error) {
            toast.error(`Không thể tải danh sách người dùng: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage, fetchUsers]);

    const handleRefresh = () => {
        fetchUsers(currentPage);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Bạn có chắc muốn vô hiệu hóa người dùng này?')) {
            const toastId = toast.loading('Đang xử lý...');
            try {
                await userService.deleteUser(userId);
                toast.success('Vô hiệu hóa người dùng thành công.', { id: toastId });
                fetchUsers(currentPage);
            } catch (error) {
                toast.error(`Lỗi: ${error.message}`, { id: toastId });
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Users size={24} className="mr-3 text-red-600" />
                    Quản Lý Người Dùng
                </h1>
                <div className="flex items-center gap-2">
                    <Button onClick={handleRefresh} variant="secondary" className="p-2" title="Làm mới" disabled={isLoading}>
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </Button>
                    <Link to="/admin/users/create">
                        <Button>
                            <Plus size={18} className="mr-2" />
                            Thêm Người Dùng
                        </Button>
                    </Link>
                </div>
            </div>

            {isLoading && !usersPage ? (
                <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>
            ) : usersPage && usersPage.content.length > 0 ? (
                <>
                    <UserManagementTable users={usersPage.content} onDelete={handleDeleteUser} />
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={usersPage.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500 py-10">Không tìm thấy người dùng nào.</p>
            )}
        </div>
    );
};

export default AdminUserListPage;