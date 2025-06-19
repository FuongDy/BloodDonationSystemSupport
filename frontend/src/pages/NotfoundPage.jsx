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
import { IconAlertTriangle, IconHome, IconArrowLeft } from '@tabler/icons-react';

const NotFoundPage = () => {
    return (
        <Box mih="100vh" bg="gray.0" style={{ display: 'flex', alignItems: 'center' }}>
            <Container size="sm">
                <Stack align="center" gap="xl" ta="center">                    <ThemeIcon size={80} radius="xl" variant="light" color="yellow">
                        <IconAlertTriangle size={48} />
                    </ThemeIcon>
                    
                    <Title order={1} size="6rem" fw={900} c="dark.7">
                        404
                    </Title>
                    
                    <Title order={2} size="2rem" fw={600} c="dark.6">
                        Oops! Trang không tồn tại.
                    </Title>
                    
                    <Text size="md" c="dimmed" maw={400}>
                        Có vẻ như trang bạn đang tìm kiếm đã bị di chuyển, xóa hoặc không bao giờ tồn tại.
                        Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
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
                            radius="md"                        >
                            Quay lại trang trước
                        </Button>
                    </Group>
                </Stack>
            </Container>
        </Box>
    );
};

export default NotFoundPage;