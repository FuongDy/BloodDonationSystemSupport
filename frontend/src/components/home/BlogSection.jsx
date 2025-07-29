import { ArrowRight, BookOpen, Calendar, User } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import blogPostService from '../../services/blogPostService';
import LoadingSpinner from '../common/LoadingSpinner';

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  const fetchLatestPosts = async () => {
    try {
      setIsLoading(true);
      const data = await blogPostService.getAllPublishedPosts(0, 3); // Lấy 3 bài mới nhất
      setBlogPosts(data.content || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Fallback to empty array nếu API lỗi
      setBlogPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize category color function
  const getCategoryColor = useCallback((category) => {
    const colors = {
      'Hướng dẫn': 'bg-red-100 text-red-800',
      'Sức khỏe': 'bg-green-100 text-green-800', 
      'Dinh dưỡng': 'bg-purple-100 text-purple-800',
      'Thông tin': 'bg-red-100 text-red-800',
      'Tin tức': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  }, []);

  // Memoize format date function
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return '';
    }
  }, []);

  // Memoize excerpt truncation
  const truncateExcerpt = useCallback((content, maxLength = 120) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-red-600 mr-2" />
              <h2 className="text-3xl font-bold text-gray-900">Kiến thức hữu ích</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cập nhật những thông tin và kiến thức mới nhất về hiến máu và sức khỏe
            </p>
          </div>
          <div className="flex justify-center">
            <LoadingSpinner size="8" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-red-600 mr-2" />
            <h2 className="text-3xl font-bold text-gray-900">Kiến thức hữu ích</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cập nhật những thông tin và kiến thức mới nhất về hiến máu và sức khỏe
          </p>
        </div>

        {blogPosts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">Chưa có bài viết nào</h3>
            <p className="text-gray-400">Các bài viết hữu ích sẽ được cập nhật sớm.</p>
            <Link 
              to="/blog" 
              className="inline-block mt-4 text-red-600 hover:text-red-700 font-medium"
            >
              Khám phá blog →
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {blogPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-video relative overflow-hidden">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 ${post.imageUrl ? 'hidden' : 'block'}`}
                      style={{ display: post.imageUrl ? 'none' : 'block' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-purple-500/20"></div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {post.category || 'Thông tin'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-4">{formatDate(post.createdAt)}</span>
                      <span>{post.readTime || '5 phút đọc'}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {truncateExcerpt(post.content)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{post.authorName || 'Tác giả'}</span>
                      </div>
                      
                      <Link 
                        to={`/blog/${post.id}`}
                        className="flex items-center text-red-600 hover:text-red-700 font-medium text-sm group-hover:translate-x-1 transition-transform"
                      >
                        Đọc thêm
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center">
              <Link 
                to="/blog"
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors inline-flex items-center"
              >
                Xem tất cả bài viết
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default React.memo(BlogSection);
