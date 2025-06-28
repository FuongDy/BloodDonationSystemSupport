// src/components/blog/BlogActionBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import Button from '../common/Button';

const BlogActionBar = ({ canCreate = false }) => {
  if (!canCreate) return null;

  return (
    <div className='flex justify-end mb-8'>
      <Link to='/blog/create'>
        <Button variant='primary'>
          <PlusCircle className='w-5 h-5 mr-2' />
          Viết bài mới
        </Button>
      </Link>
    </div>
  );
};

export default BlogActionBar;
