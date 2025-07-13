// src/components/blog/createEdit/BlogFormImage.jsx
import React from 'react';
import InputField from '../../common/InputField';

const BlogFormImage = ({ imageUrl, onChange, disabled }) => {
  return (
    <div>
      <InputField
        label='URL hình ảnh (tùy chọn)'
        name='imageUrl'
        value={imageUrl}
        onChange={onChange}
        placeholder='https://example.com/image.jpg'
        disabled={disabled}
      />
      
      {/* Image Preview */}
      {imageUrl && (
        <div className='mt-2'>
          <img
            src={imageUrl}
            alt='Preview'
            className='w-full h-48 object-cover rounded-lg'
            onError={e => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BlogFormImage;
