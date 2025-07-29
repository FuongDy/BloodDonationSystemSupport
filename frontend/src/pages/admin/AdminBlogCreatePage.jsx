// src/pages/admin/AdminBlogCreatePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import AdminPageLayout from '../../components/admin/AdminPageLayout';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import blogPostService from '../../services/blogPostService';

// Validation schema theo backend requirements
const validationSchema = Yup.object({
  title: Yup.string()
    .required('Tiêu đề là bắt buộc')
    .min(5, 'Tiêu đề phải có ít nhất 5 ký tự')
    .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
  content: Yup.string()
    .required('Nội dung là bắt buộc')
    .min(50, 'Nội dung phải có ít nhất 50 ký tự'),
  imageUrl: Yup.string()
    .url('URL hình ảnh không hợp lệ')
    .nullable()
});

// Initial values
const initialValues = {
  title: '',
  content: '',
  imageUrl: '',
};

const AdminBlogCreatePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Tối ưu toast với duration ngắn và dismiss cũ
  const showToast = (type, message) => {
    toast.dismiss(); // Dismiss all existing toasts
    toast[type](message, {
      duration: 1500, 
      position: 'top-center',
    });
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsLoading(true);
    setSubmitting(true);

    try {
      // Chuẩn bị dữ liệu theo backend schema
      const submitData = {
        title: values.title.trim(),
        content: values.content.trim(),
      };

      // Chỉ thêm imageUrl nếu có giá trị
      if (values.imageUrl?.trim()) {
        submitData.imageUrl = values.imageUrl.trim();
      }

      await blogPostService.createPost(submitData);
      
      showToast('success', 'Bài viết đã được tạo thành công!');
      navigate('/admin/blog-management');
    } catch (error) {
      // Handle specific validation errors from backend
      if (error.response?.status === 400) {
        const backendErrors = error.response.data;
        
        // Map backend field errors to form fields
        if (backendErrors.title) {
          setFieldError('title', backendErrors.title);
        }
        if (backendErrors.content) {
          setFieldError('content', backendErrors.content);
        }
        if (backendErrors.imageUrl) {
          setFieldError('imageUrl', backendErrors.imageUrl);
        }
        
        // Only show general error if no specific field errors
        if (!backendErrors.title && !backendErrors.content && !backendErrors.imageUrl) {
          showToast('error', backendErrors.message || 'Dữ liệu không hợp lệ');
        }
      } else {
        showToast('error', 'Có lỗi xảy ra khi tạo bài viết');
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const getHeaderActions = (isSubmitting, submitForm) => [
    {
      label: 'Quay lại',
      icon: ArrowLeft,
      variant: 'outline',
      onClick: () => navigate('/admin/blog-management'),
      disabled: isSubmitting,
    },
    {
      label: 'Tạo bài viết',
      icon: FileText,
      variant: 'primary',
      onClick: submitForm,
      disabled: isLoading || isSubmitting,
    },
  ];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting, submitForm }) => (
        <AdminPageLayout
          title="Tạo bài viết mới"
          description="Tạo bài viết blog mới cho hệ thống hiến máu"
          headerActions={getHeaderActions(isSubmitting, submitForm)}
        >
          <Form className="max-w-4xl mx-auto space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin cơ bản
              </h3>
              
              <div className="space-y-4">
                <div>
                  <InputField
                    label="Tiêu đề bài viết"
                    placeholder="Nhập tiêu đề bài viết (5-255 ký tự)..."
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && errors.title}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputField
                      label="URL hình ảnh (tùy chọn)"
                      placeholder="https://example.com/image.jpg"
                      name="imageUrl"
                      value={values.imageUrl}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.imageUrl && errors.imageUrl}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Nội dung bài viết
              </h3>
              
              <div>
                <InputField
                  label="Nội dung"
                  placeholder="Nhập nội dung bài viết (tối thiểu 50 ký tự)..."
                  name="content"
                  value={values.content}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.content && errors.content}
                  as="textarea"
                  rows={15}
                  required
                />
              </div>
            </div>

            {/* Preview Section */}
            {values.imageUrl && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Xem trước hình ảnh
                </h3>
                <img 
                  src={values.imageUrl} 
                  alt="Preview" 
                  className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    showToast('error', 'Không thể tải hình ảnh từ URL này');
                  }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/blog-management')}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading || isSubmitting}
                icon={FileText}
              >
                {isSubmitting ? 'Đang tạo...' : 'Tạo bài viết'}
              </Button>
            </div>
          </Form>
        </AdminPageLayout>
      )}
    </Formik>
  );
};

export default AdminBlogCreatePage;
