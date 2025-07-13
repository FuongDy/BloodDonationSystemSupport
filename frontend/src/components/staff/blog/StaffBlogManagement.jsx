// src/components/staff/blog/StaffBlogManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  Filter,
  RefreshCw,
  Calendar,
  User,
  Tag,
  Clock,
  Image,
  Save,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import staffService from '../../../services/staffService';
import LoadingSpinner from '../../common/LoadingSpinner';
import Button from '../../common/Button';
import { formatDateTime } from '../../../utils/formatters';
import StaffDashboardHeader from '../StaffDashboardHeader';

const StaffBlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for new/edit post
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    status: 'DRAFT',
    featuredImage: ''
  });

  // Mock data for blog posts
  const mockBlogData = [
    {
      id: 1,
      title: 'Tầm quan trọng của việc hiến máu trong cộng đồng',
      excerpt: 'Hiến máu không chỉ là việc làm tốt mà còn là trách nhiệm xã hội của mọi người...',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      category: 'Giáo dục',
      tags: ['hiến máu', 'sức khỏe', 'cộng đồng'],
      status: 'PUBLISHED',
      author: 'Staff User',
      createdAt: '2025-07-10T10:00:00',
      updatedAt: '2025-07-12T14:30:00',
      publishedAt: '2025-07-12T15:00:00',
      views: 1250,
      featuredImage: '/api/placeholder/400/200'
    },
    {
      id: 2,
      title: 'Quy trình hiến máu an toàn tại trung tâm',
      excerpt: 'Tìm hiểu các bước thực hiện hiến máu một cách an toàn và hiệu quả...',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      category: 'Hướng dẫn',
      tags: ['quy trình', 'an toàn', 'hiến máu'],
      status: 'DRAFT',
      author: 'Staff User',
      createdAt: '2025-07-08T09:15:00',
      updatedAt: '2025-07-08T09:15:00',
      publishedAt: null,
      views: 0,
      featuredImage: '/api/placeholder/400/200'
    },
    {
      id: 3,
      title: 'Câu chuyện cảm động về những người hiến máu tình nguyện',
      excerpt: 'Những câu chuyện thực tế về sự chia sẻ và tình người qua việc hiến máu...',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      category: 'Câu chuyện',
      tags: ['câu chuyện', 'tình nguyện', 'cảm động'],
      status: 'REVIEW',
      author: 'Staff User',
      createdAt: '2025-07-05T16:20:00',
      updatedAt: '2025-07-06T10:45:00',
      publishedAt: null,
      views: 0,
      featuredImage: '/api/placeholder/400/200'
    }
  ];

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true);
      // Try to fetch from API first
      const response = await staffService.getBlogPosts();
      if (response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Không thể tải danh sách bài viết. Hiển thị dữ liệu mẫu.');
      setPosts(mockBlogData);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      if (editingPost) {
        await staffService.updateBlogPost(editingPost.id, postForm);
        toast.success('Cập nhật bài viết thành công');
      } else {
        await staffService.createBlogPost(postForm);
        toast.success('Tạo bài viết thành công');
      }
      
      handleCloseModal();
      fetchBlogPosts();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error('Không thể lưu bài viết');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (postId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await staffService.deleteBlogPost(postId);
        toast.success('Xóa bài viết thành công');
        fetchBlogPosts();
      } catch (error) {
        console.error('Error deleting blog post:', error);
        toast.error('Không thể xóa bài viết');
      }
    }
  };

  // Handle status change
  const handleStatusChange = async (postId, newStatus) => {
    try {
      await staffService.updateBlogPostStatus(postId, newStatus);
      toast.success('Cập nhật trạng thái thành công');
      fetchBlogPosts();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  // Open edit modal
  const handleEdit = (post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags.join(', '),
      status: post.status,
      featuredImage: post.featuredImage
    });
    setShowCreateModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingPost(null);
    setPostForm({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      tags: '',
      status: 'DRAFT',
      featuredImage: ''
    });
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'PUBLISHED': return 'Đã xuất bản';
      case 'DRAFT': return 'Bản nháp';
      case 'REVIEW': return 'Chờ duyệt';
      case 'ARCHIVED': return 'Lưu trữ';
      default: return status;
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <StaffDashboardHeader 
        title="Quản lý Blog"
        description="Tạo và quản lý các bài viết, tin tức về hoạt động hiến máu"
        variant="reports"
        showTime={true}
        showWeather={true}
      />

      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{filteredPosts.length}</span> bài viết
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={fetchBlogPosts}
            variant="outline"
            className="flex items-center space-x-2 bg-white/80 hover:bg-white/90"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Làm mới</span>
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo bài viết
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tiêu đề, nội dung..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Tất cả</option>
              <option value="PUBLISHED">Đã xuất bản</option>
              <option value="DRAFT">Bản nháp</option>
              <option value="REVIEW">Chờ duyệt</option>
              <option value="ARCHIVED">Lưu trữ</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              variant="outline"
              className="w-full"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </div>

      {/* Blog Posts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <div 
            key={post.id}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img 
                  src={post.featuredImage} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                    {getStatusText(post.status)}
                  </span>
                </div>
              </div>
            )}

            <div className="p-6 space-y-4">
              {/* Header */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDateTime(post.createdAt, 'short')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </div>
                  {post.status === 'PUBLISHED' && (
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{post.views} lượt xem</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category & Tags */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1">
                  <Tag className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-medium text-purple-600">{post.category}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => handleEdit(post)}
                    variant="outline"
                    size="sm"
                    className="text-gray-600"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Sửa
                  </Button>
                  <Button
                    onClick={() => handleDelete(post.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Xóa
                  </Button>
                </div>

                {post.status === 'DRAFT' && (
                  <Button
                    onClick={() => handleStatusChange(post.id, 'REVIEW')}
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Gửi duyệt
                  </Button>
                )}
                {post.status === 'REVIEW' && (
                  <Button
                    onClick={() => handleStatusChange(post.id, 'PUBLISHED')}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Xuất bản
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có bài viết</h3>
            <p className="text-gray-500">Chưa có bài viết nào hoặc không tìm thấy kết quả phù hợp.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tóm tắt *
                </label>
                <textarea
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung *
                </label>
                <textarea
                  value={postForm.content}
                  onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Category & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục
                  </label>
                  <select
                    value={postForm.category}
                    onChange={(e) => setPostForm({...postForm, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Giáo dục">Giáo dục</option>
                    <option value="Hướng dẫn">Hướng dẫn</option>
                    <option value="Câu chuyện">Câu chuyện</option>
                    <option value="Tin tức">Tin tức</option>
                    <option value="Sự kiện">Sự kiện</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (cách nhau bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={postForm.tags}
                    onChange={(e) => setPostForm({...postForm, tags: e.target.value})}
                    placeholder="hiến máu, sức khỏe, cộng đồng"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={postForm.status}
                  onChange={(e) => setPostForm({...postForm, status: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="DRAFT">Bản nháp</option>
                  <option value="REVIEW">Chờ duyệt</option>
                  <option value="PUBLISHED">Xuất bản</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  onClick={handleCloseModal}
                  variant="outline"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Đang lưu...' : (editingPost ? 'Cập nhật' : 'Tạo bài viết')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffBlogManagement;
