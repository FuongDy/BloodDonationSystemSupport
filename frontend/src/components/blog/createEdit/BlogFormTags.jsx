// src/components/blog/createEdit/BlogFormTags.jsx
import React from 'react';
import InputField from '../../common/InputField';

const BlogFormTags = ({ value, onChange, disabled }) => {
  return (
    <div>
      <InputField
        label='Thẻ tag (tùy chọn)'
        name='tags'
        value={value}
        onChange={onChange}
        placeholder='hiến máu, sức khỏe, tình nguyện (phân cách bằng dấu phẩy)'
        disabled={disabled}
      />
      <p className="text-xs text-gray-500 mt-1">
        Phân cách các tag bằng dấu phẩy
      </p>
    </div>
  );
};

export default BlogFormTags;
