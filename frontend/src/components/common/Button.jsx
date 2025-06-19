import React from 'react';
import { Button as MantineButton } from '@mantine/core';
import { IconLoader } from '@tabler/icons-react';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'filled',
    size = 'md',
    color = 'red',
    disabled = false,
    loading = false,    leftSection,
    rightSection,
    ...props
}) => {
    return (
        <MantineButton
            type={type}
            onClick={onClick}
            variant={variant}
            size={size}
            color={color}
            disabled={disabled}
            loading={loading}
            leftSection={leftSection}
            rightSection={rightSection}
            {...props}
        >
            {children}
        </MantineButton>
    );
};

export default Button;