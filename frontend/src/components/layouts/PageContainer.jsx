import React from 'react';
import { Container } from '@mantine/core';

// Mantine version of PageContainer using Container component
const PageContainer = ({
    children,
    size = "xl",
    ...props
}) => {
    return (
        <Container size={size} {...props}>
            {children}
        </Container>
    );
};

export default PageContainer;