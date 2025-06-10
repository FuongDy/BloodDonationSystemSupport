// src/components/admin/UserManagementTable.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Edit3, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import userService from '../../services/userService';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useAuth } from '../../hooks/useAuth';

const StatusBadge = ({ status }) => {
    const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
    const statusClasses = status === 'Active'
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";
    return (
        <span className={`${baseClasses} ${statusClasses}`}>
            {status === 'Active' ? 'Hoạt động' : 'Vô hiệu hóa'}
        </span>
    );
};

const RoleBadge = ({ role }) => {
    let colorClass = '';
    switch (role) {
        case 'Admin': colorClass = 'bg-indigo-100 text-indigo-800'; break;
        case 'Staff': colorClass = 'bg-yellow-100 text-yellow-800'; break;
        case 'Member': colorClass = 'bg-gray-100 text-gray-800'; break;
        default: colorClass = 'bg-gray-100 text-gray-800';
    }
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
            {role}
        </span>
    );
};


const UserManagementTable = ({ users, onUserDeleted, onSort, renderSortIcon }) => { // SỬA: Nhận props sort
    const { user: currentUser } = useAuth();
    const [userToDelete, setUserToDelete] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const openDeleteConfirmation = (user) => {
        setUserToDelete(user);
        setIsConfirmModalOpen(true);
    };

    const closeDeleteConfirmation = () => {
        setIsConfirmModalOpen(false);
        setUserToDelete(null);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            await userService.deleteUser(userToDelete.id);
            toast.success(`Đã xóa người dùng ${userToDelete.fullName}`);
            onUserDeleted(userToDelete.id); // Callback để cập nhật UI
        } catch (error) {
            console.error("Failed to delete user:", error);
            toast.error("Xóa người dùng thất bại.");
        } finally {
            setIsDeleting(false);
            closeDeleteConfirmation();
        }
    };

    // THÊM: Component cho header có thể sort
    const SortableHeader = ({ field, children }) => (
        <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
            onClick={() => onSort && onSort(field)}
        >
            <div className="flex items-center space-x-1">
                <span>{children}</span>
                {renderSortIcon && renderSortIcon(field)}
            </div>
        </th>
    );

    return (
        <>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* SỬA: Sử dụng SortableHeader */}
                            <SortableHeader field="id">ID</SortableHeader>
                            <SortableHeader field="fullName">Họ và Tên</SortableHeader>
                            <SortableHeader field="email">Email / Tên đăng nhập</SortableHeader>
                            <SortableHeader field="role">Vai trò</SortableHeader>
                            <SortableHeader field="status">Trạng thái</SortableHeader>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.fullName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email || user.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <RoleBadge role={user.role} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <StatusBadge status={user.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link to={`/admin/users/${user.id}`} className="text-blue-600 hover:text-blue-800" title="Xem chi tiết">
                                                <Eye size={18} />
                                            </Link>
                                            <Link to={`/admin/users/edit/${user.id}`} className="text-yellow-600 hover:text-yellow-800" title="Chỉnh sửa">
                                                <Edit3 size={18} />
                                            </Link>
                                            <button
                                                onClick={() => openDeleteConfirmation(user)}
                                                disabled={currentUser.id === user.id}
                                                className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                title={currentUser.id === user.id ? "Không thể xóa chính mình" : "Xóa"}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                    Không tìm thấy người dùng nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isConfirmModalOpen}
                onClose={closeDeleteConfirmation}
                title="Xác nhận xóa"
            >
                <p>Bạn có chắc chắn muốn xóa người dùng <strong>{userToDelete?.fullName}</strong> không? Hành động này không thể hoàn tác.</p>
                <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="secondary" onClick={closeDeleteConfirmation} disabled={isDeleting}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDeleteUser} isLoading={isDeleting}>
                        {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default UserManagementTable;