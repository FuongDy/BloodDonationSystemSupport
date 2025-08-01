// src/components/blog/BlogDetailMeta.jsx
import { Clock, Edit, Trash2, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const BlogDetailMeta = ({ 
  post, 
  canEdit, 
  canDelete, 
  onDelete, 
  isDeleting,
  onEditClick
}) => {
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='flex items-center justify-between mb-6'>
      <div className='flex items-center text-gray-500 text-sm'>
        <User className='w-4 h-4 mr-1' />
        <span className='mr-4'>{post.authorName}</span>
        <Clock className='w-4 h-4 mr-1' />
        <span>{formatDate(post.createdAt)}</span>
        {post.updatedAt && post.updatedAt !== post.createdAt && (
          <span className='ml-2 text-xs'>(Đã chỉnh sửa)</span>
        )}
      </div>

      {/* Action Buttons */}
      {(canEdit || canDelete) && (
        <div className='flex items-center space-x-3'>
          {canEdit && (
            <Link to={`/blog/${post.id}/edit`} onClick={onEditClick}>
              <Button variant='outline' size='sm'>
                <Edit className='w-4 h-4 mr-2' />
                Chỉnh sửa
              </Button>
            </Link>
          )}
          {canDelete && (
            <Button
              variant='danger-outline'
              size='sm'
              onClick={onDelete}
              disabled={isDeleting}
              isLoading={isDeleting}
            >
              <Trash2 className='w-4 h-4 mr-2' />
              Xóa
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogDetailMeta;
