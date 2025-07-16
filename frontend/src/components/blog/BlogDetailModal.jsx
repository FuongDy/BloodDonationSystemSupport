// src/components/blog/BlogDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Calendar, 
  Eye, 
  Tag,
  Clock,
  CheckCircle,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

import blogPostService from '../../services/blogPostService';
import LoadingSpinner from '../common/LoadingSpinner';
import StatusBadge from '../common/StatusBadge';
import DateTimeDisplay from '../common/DateTimeDisplay';

const BlogDetailModal = ({ isOpen, onClose, postId }) => {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && postId) {
      fetchPostDetail();
    }
  }, [isOpen, postId]);

  const fetchPostDetail = async () => {
    setIsLoading(true);
    try {
      const data = await blogPostService.getPostById(postId);
      setPost(data);
    } catch (error) {
      toast.error('Không thể tải chi tiết bài viết');
      console.error('Error fetching post detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Đã xuất bản';
      case 'PENDING_APPROVAL':
        return 'Chờ duyệt';
      case 'DRAFT':
        return 'Bản nháp';
      case 'REJECTED':
        return 'Bị từ chối';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return CheckCircle;
      case 'PENDING_APPROVAL':
        return Clock;
      case 'DRAFT':
        return FileText;
      default:
        return Clock;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Chi tiết bài viết</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner size="12" />
              </div>
            ) : post ? (
              <div className="p-6">
                {/* Post Image */}
                {post.imageUrl && (
                  <div className="mb-6">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Post Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <StatusBadge
                      status={post.status}
                      text={getStatusText(post.status)}
                      icon={getStatusIcon(post.status)}
                    />
                    <span className="text-sm text-gray-500">ID: {post.id}</span>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {post.title}
                  </h1>

                  {/* Meta Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Tác giả:</span>
                      <span className="ml-1">{post.authorName || 'Chưa xác định'}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Ngày tạo:</span>
                      <span className="ml-1">
                        <DateTimeDisplay date={post.createdAt} />
                      </span>
                    </div>

                    {post.publishedAt && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Ngày xuất bản:</span>
                        <span className="ml-1">
                          <DateTimeDisplay date={post.publishedAt} />
                        </span>
                      </div>
                    )}

                    {post.updatedAt && post.updatedAt !== post.createdAt && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Cập nhật lần cuối:</span>
                        <span className="ml-1">
                          <DateTimeDisplay date={post.updatedAt} />
                        </span>
                      </div>
                    )}

                    {post.viewCount && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Eye className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Lượt xem:</span>
                        <span className="ml-1">{post.viewCount}</span>
                      </div>
                    )}

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-start text-sm text-gray-600 md:col-span-2">
                        <Tag className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                        <span className="font-medium">Tags:</span>
                        <div className="ml-2 flex flex-wrap gap-1">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <div className="prose prose-lg max-w-none">
                  <div 
                    className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ 
                      __html: post.content || 'Không có nội dung' 
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Không thể tải chi tiết bài viết</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {post && (
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailModal;
