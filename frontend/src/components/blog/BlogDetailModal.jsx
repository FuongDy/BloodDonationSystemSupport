// src/components/blog/BlogDetailModal.jsx
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import blogPostService from '../../services/blogPostService';
import Modal from '../common/Modal';
import BlogDetailContent from './BlogDetailContent';

const BlogDetailModal = ({ postId, isOpen, onClose, onStatusChange }) => {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId || !isOpen) return;
      
      setIsLoading(true);
      try {
        const response = await blogPostService.getPostById(postId);
        setPost(response);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        toast.error('Không thể tải thông tin bài viết.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, isOpen]);

  // Check permissions
  const isAuthor = user && post?.authorId === user.id;
  const isAdmin = user && user.role === 'Admin';
  const canEdit = isAuthor; // Chỉ tác giả mới có thể sửa
  const canDelete = isAuthor || isAdmin; // Tác giả hoặc Admin có thể xóa

  const handleDelete = async () => {
    if (!canDelete) {
      toast.error('Bạn không có quyền xóa bài viết này');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      setIsDeleting(true);
      try {
        await blogPostService.deletePost(postId);
        toast.success('Đã xóa bài viết thành công!');
        onClose(); // Đóng modal sau khi xóa
        if (onStatusChange) onStatusChange(); // Cập nhật lại danh sách bài viết
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Không thể xóa bài viết';
        toast.error(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết bài viết"
      size="2xl"
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700"></div>
        </div>
      ) : !post ? (
        <div className="text-center py-6 text-gray-500">
          Không tìm thấy thông tin bài viết hoặc bài viết không tồn tại.
        </div>
      ) : (
        <div className="max-h-[80vh] overflow-y-auto">
          <BlogDetailContent
            post={post}
            canEdit={canEdit}
            canDelete={canDelete}
            onDelete={handleDelete}
            isDeleting={isDeleting}
            onEditClick={() => onClose()} // Đóng modal khi người dùng click nút chỉnh sửa
          />
        </div>
      )}
    </Modal>
  );
};

export default BlogDetailModal;
