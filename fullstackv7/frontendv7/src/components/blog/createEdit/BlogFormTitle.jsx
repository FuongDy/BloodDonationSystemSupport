// src/components/blog/createEdit/BlogFormTitle.jsx
import React from 'react';
import InputField from '../../common/InputField';

const BlogFormTitle = ({ value, onChange, disabled }) => {
  return (
    <InputField
      label='Tiêu đề bài viết'
      name='title'
      value={value}
      onChange={onChange}
      placeholder='Nhập tiêu đề hấp dẫn...'
      required
      disabled={disabled}
    />
  );
};

export default BlogFormTitle;
