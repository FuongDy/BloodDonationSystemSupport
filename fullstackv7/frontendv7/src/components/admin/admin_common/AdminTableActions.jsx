// src/components/admin/common/AdminTableActions.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../common/Button';

const AdminTableActions = ({ actions = [], isLoading = false }) => {
  return (
    <div className='flex flex-wrap gap-2'>
      {actions.map((action, index) => {
        const ActionComponent = action.component || Button;
        const commonProps = {
          key: index,
          variant: action.variant || 'secondary',
          disabled: action.disabled || isLoading,
          className: action.className || '',
          onClick: action.onClick,
        };

        // Handle different action types
        if (action.component === Link) {
          return (
            <ActionComponent {...commonProps} to={action.to}>
              {action.icon && <action.icon className='mr-2 h-4 w-4' />}
              {action.label}
            </ActionComponent>
          );
        }

        return (
          <ActionComponent {...commonProps}>
            {action.icon && <action.icon className='mr-2 h-4 w-4' />}
            {action.label}
          </ActionComponent>
        );
      })}
    </div>
  );
};

export default AdminTableActions;
