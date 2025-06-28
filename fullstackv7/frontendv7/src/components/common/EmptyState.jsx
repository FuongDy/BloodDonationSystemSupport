import React from 'react';
import { Link } from 'react-router-dom';
import { FileX, Plus } from 'lucide-react';
import Button from './Button';
import EmptyIllustration from './EmptyIllustration';

const EmptyState = ({
  icon: Icon = FileX,
  type = 'default',
  title = 'Không có dữ liệu',
  description = 'Chưa có dữ liệu để hiển thị.',
  action,
  actionLabel = 'Thêm mới',
  onAction,
  className = '',
  illustrationSize = 'lg',
}) => {
  return (
    <div className={`col-span-full text-center py-12 ${className}`}>
      {' '}
      <div className='mx-auto mb-6'>
        {Icon && Icon !== FileX ? (
          <div className='mx-auto h-24 w-24 text-gray-400 mb-4'>
            <Icon size={96} className='mx-auto' />
          </div>
        ) : (
          <EmptyIllustration
            type={type}
            size={illustrationSize}
            className='mx-auto'
          />
        )}
      </div>
      <h3 className='text-lg font-medium text-gray-900 mb-2'>{title}</h3>
      <p className='text-gray-500 mb-6 max-w-md mx-auto'>{description}</p>{' '}
      {(action || onAction) && (
        <div>
          {action ? (
            action.href ? (
              <Link
                to={action.href}
                className='inline-flex items-center justify-center font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ease-in-out px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'
              >
                <Plus size={16} className='mr-2' />
                {action.label}
              </Link>
            ) : (
              <Button onClick={action.onClick || onAction} variant='primary'>
                <Plus size={16} className='mr-2' />
                {action.label || actionLabel}
              </Button>
            )
          ) : (
            <Button onClick={onAction} variant='primary'>
              <Plus size={16} className='mr-2' />
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
