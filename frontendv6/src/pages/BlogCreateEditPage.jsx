// src/pages/BlogCreateEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

import blogPostService from '../services/blogPostService';
import { useAuth } from '../hooks/useAuth';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BlogCreateEditPage = () => {
  const { id } = useParams(); // id exists if editing
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

  if (isLoading) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex justify-center items-center py-20'>
          <LoadingSpinner size='12' />
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <button
            onClick={handleGoBack}
            className='inline-flex items-center text-gray-600 hover:text-gray-900 mb-4'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Quay lại
          </button>
          <h1 className='text-3xl font-bold text-gray-900'>
            {isEdit ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className='bg-white rounded-lg shadow-lg'>
        <form onSubmit={handleSubmit} className='p-8 space-y-6'>
          {/* Title */}
          <InputField
            label='Tiêu đề bài viết'
            name='title'
            value={formData.title}
            onChange={handleChange}
            placeholder='Nhập tiêu đề hấp dẫn...'
            required
            disabled={isSaving}
          />

          {/* Image URL */}
          <InputField
            label='URL hình ảnh (tùy chọn)'
            name='imageUrl'
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder='https://example.com/image.jpg'
            disabled={isSaving}
          />

          {/* Image Preview */}
          {formData.imageUrl && (
            <div className='mt-2'>
              <img
                src={formData.imageUrl}
                alt='Preview'
                className='w-full h-48 object-cover rounded-lg'
                onError={e => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Content */}
          <div>
            <label
              htmlFor='content'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Nội dung bài viết *
            </label>
            <textarea
              id='content'
              name='content'
              rows={15}
              value={formData.content}
              onChange={handleChange}
              placeholder='Chia sẻ câu chuyện, kinh nghiệm hoặc kiến thức của bạn về hiến máu...'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-vertical'
              required
              disabled={isSaving}
            />
          </div>

          {/* Tags */}
          <InputField
            label='Thẻ tag (tùy chọn)'
            name='tags'
            value={formData.tags}
            onChange={handleChange}
            placeholder='hiến máu, sức khỏe, tình nguyện (phân cách bằng dấu phẩy)'
            disabled={isSaving}
            helpText='Phân cách các tag bằng dấu phẩy'
          />

          {/* Actions */}
          <div className='flex items-center justify-end space-x-4 pt-6 border-t border-gray-200'>
            <Button
              type='button'
              variant='outline'
              onClick={handleGoBack}
              disabled={isSaving}
            >
              Hủy
            </Button>
            <Button
              type='submit'
              variant='primary'
              disabled={
                isSaving || !formData.title.trim() || !formData.content.trim()
              }
              isLoading={isSaving}
            >
              <Save className='w-4 h-4 mr-2' />
              {isEdit ? 'Cập nhật' : 'Đăng bài'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogCreateEditPage;
