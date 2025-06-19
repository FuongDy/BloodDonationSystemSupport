import React from 'react';
import { 
    Container, 
    Title, 
    Text, 
    Button, 
    Box, 
    Group,
    Stack,
    Overlay,
    BackgroundImage
} from '@mantine/core';
import { IconDroplet, IconHeart, IconCalendarPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
    return (
        <Box 
            h={600}
            pos="relative"
            style={{
                background: 'linear-gradient(135deg, #e03131 0%, #d6336c 100%)',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Container size="xl" style={{ position: 'relative', zIndex: 1 }}>
                <Stack align="center" gap="xl" ta="center">
                    <Group gap="sm" justify="center">
                        <IconDroplet size={48} color="white" />
                        <Title order={1} c="white" size="3.5rem" fw={900}>
                            BloodConnect
                        </Title>
                    </Group>
                    
                    <Title order={2} c="white" size="2rem" ta="center" maw={800}>
                        Kết nối yêu thương - Trao đi hạnh phúc
                    </Title>
                    
                    <Text c="red.1" size="lg" ta="center" maw={600}>
                        Tham gia cộng đồng hiến máu tình nguyện để cứu sống những sinh mạng quý báu. 
                        Mỗi giọt máu bạn hiến là một cơ hội cứu sống một con người.
                    </Text>
                    
                    <Group gap="md" justify="center">
                        <Button 
                            component={Link}
                            to="/register"
                            size="lg" 
                            variant="white" 
                            color="red"
                            leftSection={<IconHeart size={20} />}
                            radius="xl"
                        >
                            Đăng ký hiến máu
                        </Button>
                        <Button 
                            component={Link}
                            to="/request-donation"
                            size="lg" 
                            variant="outline" 
                            c="white"
                            leftSection={<IconCalendarPlus size={20} />}
                            radius="xl"
                            styles={{
                                root: {
                                    borderColor: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }
                            }}
                        >
                            Đặt lịch hiến máu
                        </Button>
                    </Group>
                </Stack>
            </Container>
        </Box>
    );
}
