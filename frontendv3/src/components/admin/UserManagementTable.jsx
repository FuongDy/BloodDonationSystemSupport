// src/components/admin/UserManagementTable.jsx
import { Link } from 'react-router-dom';
import { USER_STATUS } from '../../constants/userStatus'; // FIX: Import constants

// FIX: Accept isDeleting and deletingUserId as props
const UserManagementTable = ({ users, onDelete, isDeleting, deletingUserId }) => {
    return (
        <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
                <tr>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Full Name</th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Role</th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Blood Type</th>
                    <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700">Status</th>
                    <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
            </thead>
            <tbody className="text-gray-700">
                {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-4 px-6">{user.fullName}</td>
                        <td className="py-4 px-6">{user.email}</td>
                        <td className="py-4 px-6">{user.role}</td>
                        <td className="py-4 px-6">{user.bloodTypeDescription || 'N/A'}</td>
                        <td className="py-4 px-6 text-center">
                            <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                    // FIX: Use constants for status
                                    user.status === USER_STATUS.ACTIVE
                                        ? 'bg-green-200 text-green-800'
                                        : 'bg-red-200 text-red-800'
                                    }`}
                            >
                                {user.status}
                            </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                            <Link to={`/admin/users/edit/${user.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                                Edit
                            </Link>
                            <button
                                onClick={() => onDelete(user.id)}
                                className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                                // FIX: Disable button and show loading text when this specific user is being deleted
                                disabled={isDeleting && deletingUserId === user.id}
                            >
                                {isDeleting && deletingUserId === user.id ? 'Deleting...' : 'Delete'}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UserManagementTable;