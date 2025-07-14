// src/components/common/ActionButtonGroup.jsx
import React from 'react';
import Button from './Button';

const ActionButtonGroup = ({
  actions = [],
  className = '',
  size = 'sm',
  orientation = 'vertical', // 'vertical' | 'horizontal'
}) => {
  if (!actions.length) return null;

  const containerClass =
    orientation === 'vertical' ? 'space-y-2' : 'space-x-2 flex';

  return (
    <div className={`${containerClass} ${className}`}>
      {' '}
      {actions.map((action, index) => {
        const ButtonComponent = action.component || Button;
        const Icon = action.icon;
        const key = action.key || index;

        const buttonProps = {
          variant: action.variant || 'primary',
          size: action.size || size,
          className:
            action.className || (orientation === 'vertical' ? 'w-full' : ''),
          onClick: action.onClick,
          disabled: action.disabled,
          title: action.title || action.label,
          ...action.buttonProps, // Spread any additional button props
        }; // Handle Link components or other custom components
        if (action.component) {
          const componentProps = {
            to: action.to,
            href: action.href,
            target: action.target,
            rel: action.rel,
            ...action.componentProps, // Spread any additional component props
          };
          return (
            <ButtonComponent key={key} {...componentProps}>
              <Button {...buttonProps}>
                {Icon && <Icon className='w-4 h-4 mr-1' />}
                {action.label}
              </Button>
            </ButtonComponent>
          );
        }

        // Regular button
        return (
          <Button key={key} {...buttonProps}>
            {Icon && <Icon className='w-4 h-4 mr-1' />}
            {action.label}
          </Button>
        );
      })}
    </div>
  );
};

export default ActionButtonGroup;
