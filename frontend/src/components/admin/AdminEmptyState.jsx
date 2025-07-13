// src/components/admin/AdminEmptyState.jsx
import React from 'react';

const AdminEmptyState = ({
  message = 'Không có dữ liệu nào phù hợp.',
  title,
  description,
  icon: IconComponent,
  action,
  className = 'text-center text-gray-500 py-8',
  children,
}) => (
  <div className={className}>
    {IconComponent && (
      <IconComponent className='w-12 h-12 text-gray-400 mx-auto mb-4' />
    )}
    {title ? (
      <>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        {description && <div className="text-gray-600 mb-4">{description}</div>}
        {action && (
          <div className="mt-4">
            {action.component ? (
              <action.component
                to={action.to}
                href={action.href}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                {action.label}
              </action.component>
            ) : (
              <button
                onClick={action.onClick}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                {action.label}
              </button>
            )}
          </div>
        )}
      </>
    ) : (
      // Handle legacy message prop or React component
      typeof message === 'string' ? (
        <div className="text-gray-600">{message}</div>
      ) : (
        message
      )
    )}
    {children}
  </div>
);

export default AdminEmptyState;
