// src/components/admin/common/AdminTableActions.jsx
import Button from '../../common/Button';
import LinkButton from '../../common/LinkButton';

const AdminTableActions = ({ actions = [], isLoading = false }) => {
  return (
    <div className='flex flex-wrap gap-2'>
      {actions.map((action, index) => {
        // If action has 'to' prop, use LinkButton, otherwise use Button
        const ActionComponent = action.to ? LinkButton : Button;
        
        const commonProps = {
          variant: action.variant || 'secondary',
          disabled: action.disabled || isLoading,
          className: action.className || '',
          onClick: action.onClick,
          ...(action.to && { to: action.to }),
        };

        return (
          <ActionComponent key={index} {...commonProps}>
            {action.icon && <action.icon className='mr-2 h-4 w-4' />}
            {action.label}
          </ActionComponent>
        );
      })}
    </div>
  );
};

export default AdminTableActions;
