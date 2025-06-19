// components/home/StatsSection.jsx
import { 
    Container, 
    SimpleGrid, 
    Box, 
    Text, 
    Title, 
    ThemeIcon,
    Stack
} from '@mantine/core';
import { 
    IconUsers, 
    IconDroplet, 
    IconHeart 
} from '@tabler/icons-react';

export default function StatsSection() {
    const stats = [
        { number: "10,000+", label: "Người hiến máu", icon: IconUsers },
        { number: "5,000+", label: "Lượt hiến máu thành công", icon: IconDroplet },
        { number: "50+", label: "Bệnh viện & Đối tác", icon: IconHeart }
    ];

    return (
        <Box 
            bg="red.6" 
            py={80}
            style={{
                background: 'linear-gradient(135deg, #e03131 0%, #d6336c 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Container size="xl" style={{ position: 'relative', zIndex: 1 }}>
                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                    {stats.map((stat, index) => (
                        <Stack key={stat.label} align="center" gap="md">
                            <ThemeIcon 
                                size={60} 
                                radius="xl" 
                                variant="light" 
                                color="rgba(255, 255, 255, 0.2)"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                            >
                                <stat.icon size={32} color="white" />
                            </ThemeIcon>
                            <Title order={2} c="white" ta="center" size="3rem">
                                {stat.number}
                            </Title>
                            <Text c="red.1" ta="center" size="lg" fw={500}>
                                {stat.label}
                            </Text>
                        </Stack>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
}
