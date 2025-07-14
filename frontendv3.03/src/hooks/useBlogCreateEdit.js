// src/hooks/useBlogCreateEdit.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import blogPostService from '../services/blogPostService';
import { useAuth } from './useAuth';

export const useBlogCreateEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    tags: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Bạn cần đăng nhập để viết bài.');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load post data if editing
  useEffect(() => {
    if (isEdit && id) {
      const fetchPost = async () => {
        setIsLoading(true);
        try {
          const post = await blogPostService.getPostById(id);
          setFormData({
            title: post.title || '',
            content: post.content || '',
            imageUrl: post.imageUrl || '',
            tags: post.tags ? post.tags.join(', ') : '',
          });
        } catch {
          toast.error('Không thể tải thông tin bài viết.');
          navigate('/blog');
        } finally {
          setIsLoading(false);
        }
      };

      fetchPost();
    }
  }, [isEdit, id, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Vui lòng nhập tiêu đề và nội dung bài viết.');
      return;
    }

    setIsSaving(true);
    try {
      const submitData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        imageUrl: formData.imageUrl.trim() || null,
        tags: formData.tags
          ? formData.tags
              .split(',')
              .map(tag => tag.trim())
              .filter(Boolean)
          : [],
      };

      let result;
      if (isEdit) {
        result = await blogPostService.updatePost(id, submitData);
        toast.success('Cập nhật bài viết thành công!');
      } else {
        result = await blogPostService.createPost(submitData);
        toast.success('Tạo bài viết thành công!');
      }

      navigate(`/blog/${result.id}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        (isEdit ? 'Không thể cập nhật bài viết.' : 'Không thể tạo bài viết.');
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const isFormValid = formData.title.trim() && formData.content.trim();

  return {
    // State
    formData,
    isLoading,
    isSaving,
    isEdit,
    
    // Computed
    isFormValid,
    
    // Handlers
    handleChange,
    handleSubmit,
    handleGoBack,
  };
};
