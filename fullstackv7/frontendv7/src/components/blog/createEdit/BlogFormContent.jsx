// src/components/blog/createEdit/BlogFormContent.jsx
import React from 'react';

const BlogFormContent = ({ value, onChange, disabled }) => {
  return (
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
        value={value}
        onChange={onChange}
        placeholder='Chia sẻ câu chuyện, kinh nghiệm hoặc kiến thức của bạn về hiến máu...'
        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-vertical'
        required
        disabled={disabled}
      />
    </div>
  );
};

export default BlogFormContent;
