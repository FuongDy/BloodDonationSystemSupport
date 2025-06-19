import React from 'react';
import { Container } from '@mantine/core';

//PageContainer using Container component
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