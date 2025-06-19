import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Container, 
    Title, 
    Text, 
    Button, 
    Group, 
    Box,
    Stack,
    ThemeIcon
} from '@mantine/core';
import { IconShield, IconHome, IconArrowLeft } from '@tabler/icons-react';

const ForbiddenPage = () => {
    return (
        <Box mih="100vh" bg="gray.0" style={{ display: 'flex', alignItems: 'center' }}>
            <Container size="sm">
                <Stack align="center" gap="xl" ta="center">                    <ThemeIcon size={80} radius="xl" variant="light" color="red">
                        <IconShield size={48} />
                    </ThemeIcon>
                    
                    <Title order={1} size="3rem" fw={700} c="dark.7">
                        403 - Truy cập bị từ chối
                    </Title>
                    
                    <Text size="lg" c="dimmed" maw={400}>
                        Rất tiếc, bạn không có quyền truy cập vào trang này.
                    </Text>
                    
                    <Group gap="md" justify="center">
                        <Button
                            component={Link}
                            to="/"
                            size="lg"
                            leftSection={<IconHome size={20} />}
                            radius="md"
                        >
                            Về trang chủ
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            leftSection={<IconArrowLeft size={20} />}
                            onClick={() => window.history.back()}
                            radius="md"
                        >
                            Quay lại trang trước
                        </Button>
                    </Group>
                </Stack>
            </Container>
        </Box>
    );
};

export default ForbiddenPage;