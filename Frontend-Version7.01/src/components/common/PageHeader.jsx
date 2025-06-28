// src/components/common/PageHeader.jsx
import React from 'react';
import Button from './Button';

const PageHeader = ({ title, description, actions = [], className = '' }) => {
  return (
    <div className={`flex justify-between items-center mb-8 ${className}`}>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>{title}</h1>
        {description && <p className='text-gray-600 mt-2'>{description}</p>}
      </div>

      {actions.length > 0 && (
        <div className='flex space-x-3'>
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || 'outline'}
              size={action.size || 'md'}
              disabled={action.disabled}
              className={action.className}
            >
              {action.icon && <action.icon className='w-4 h-4 mr-2' />}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
