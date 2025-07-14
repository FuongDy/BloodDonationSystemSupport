// src/hooks/useBlogDetail.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import blogPostService from '../services/blogPostService';
import { useAuth } from './useAuth';
import { BLOG_PERMISSIONS } from '../utils/constants';

export const useBlogDetail = (postId) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await blogPostService.getPostById(postId);
        setPost(data);
      } catch {
        toast.error('Không thể tải bài viết.');
        navigate('/blog');
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, navigate]);

  const handleDelete = async () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await blogPostService.deletePost(postId);
      toast.success('Xóa bài viết thành công!');
      navigate('/blog');
    } catch {
      toast.error('Không thể xóa bài viết.');
    } finally {
      setIsDeleting(false);
    }
  };

  const canEdit = user && BLOG_PERMISSIONS.canEditBlog(user.role, post?.authorId, user.id);
  const canDelete = user && BLOG_PERMISSIONS.canDeleteBlog(user.role, post?.authorId, user.id);

  return {
    post,
    isLoading,
    isDeleting,
    canEdit,
    canDelete,
    handleDelete,
  };
};
