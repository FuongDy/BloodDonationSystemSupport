// src/components/blog/BlogPostGrid.jsx
import { Edit, Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import blogPostService from '../../services/blogPostService';
import BlogPostCard from './BlogPostCard';

const BlogPostGrid = ({ 
  posts = [], 
  onStatusChange, 
  onDelete,
  showApproval = false,
  viewMode = 'cards',
  className = '',
  isAdminPage = false
}) => {
  if (viewMode === 'table') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bài viết
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tác giả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map(post => (
                <BlogPostTableRow 
                  key={post.id} 
                  post={post} 
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                  showApproval={showApproval}
                  isAdminPage={isAdminPage}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {posts.map(post => (
        <BlogPostCard
          key={post.id}
          post={post}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          showApproval={showApproval}
          isAdminPage={isAdminPage}
        />
      ))}
    </div>
  );
};

// Component cho table row
const BlogPostTableRow = ({ post, onStatusChange, onDelete, showApproval, isAdminPage = false }) => {
  const { user } = useAuth();
  
  // Check permissions
  const isAuthor = user && post.authorId === user.id;
  const isAdmin = user && user.role === 'Admin';
  const canEdit = isAuthor || (isAdmin && isAdminPage); // Tác giả hoặc Admin (trong admin page) có thể sửa
  const canDelete = isAuthor || isAdmin; // Tác giả hoặc Admin có thể xóa

  const getStatusBadge = (status) => {
    const colors = {
      'PUBLISHED': 'bg-green-100 text-green-800',
      'DRAFT': 'bg-gray-100 text-gray-800',
      'PENDING_APPROVAL': 'bg-yellow-100 text-yellow-800',
      'REJECTED': 'bg-red-100 text-red-800',
    };
    const labels = {
      'PUBLISHED': 'Đã xuất bản',
      'DRAFT': 'Bản nháp',
      'PENDING_APPROVAL': 'Chờ duyệt',
      'REJECTED': 'Bị từ chối',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const handleDelete = async () => {
    if (!canDelete) {
      toast.error('Bạn không có quyền xóa bài viết này');
      return;
    }
    
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      try {
        await blogPostService.deletePost(post.id);
        toast.success('Đã xóa bài viết thành công!');
        onDelete(); // Refresh the list
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Không thể xóa bài viết';
        toast.error(errorMessage);
      }
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center">
          {post.imageUrl && (
            <img src={post.imageUrl} alt={post.title} className="w-10 h-10 rounded object-cover mr-3" />
          )}
          <div>
            <div className="text-sm font-medium text-gray-900 line-clamp-1">
              {post.title || 'Tiêu đề không xác định'}
            </div>
            <div className="text-sm text-gray-500">
              ID: {post.id}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {post.authorName || 'Chưa xác định'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(post.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => post.onViewDetail && post.onViewDetail(post.id)}
            className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-200 border border-blue-200"
            title="Xem chi tiết"
          >
            <Eye className="w-3 h-3 mr-1" />
            Xem
          </button>
          {canEdit && (
            <a 
              href={isAdminPage ? `/admin/blog/${post.id}/edit` : `/blog/${post.id}/edit`}
              className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 transition-colors duration-200 border border-indigo-200"
              title="Chỉnh sửa bài viết"
            >
              <Edit className="w-3 h-3 mr-1" />
              Sửa
            </a>
          )}
          {canDelete && (
            <button 
              onClick={handleDelete}
              className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 transition-colors duration-200 border border-red-200"
              title="Xóa bài viết"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Xóa
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default BlogPostGrid;
