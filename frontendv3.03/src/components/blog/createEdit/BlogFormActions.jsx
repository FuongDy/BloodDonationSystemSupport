// src/components/blog/createEdit/BlogFormActions.jsx
import React from 'react';
import { Save } from 'lucide-react';
import Button from '../../common/Button';

const BlogFormActions = ({ 
  isEdit, 
  isSaving, 
  isFormValid, 
  onGoBack, 
  onSubmit 
}) => {
  return (
    <div className='flex items-center justify-end space-x-4 pt-6 border-t border-gray-200'>
      <Button
        type='button'
        variant='outline'
        onClick={onGoBack}
        disabled={isSaving}
      >
        Hủy
      </Button>
      <Button
        type='submit'
        variant='primary'
        disabled={isSaving || !isFormValid}
        isLoading={isSaving}
        onClick={onSubmit}
      >
        <Save className='w-4 h-4 mr-2' />
        {isEdit ? 'Cập nhật' : 'Đăng bài'}
      </Button>
    </div>
  );
};

export default BlogFormActions;
