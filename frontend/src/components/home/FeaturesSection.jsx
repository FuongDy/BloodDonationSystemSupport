// components/home/FeaturesSection.jsx
import { 
    Container, 
    Title, 
    Text, 
    SimpleGrid, 
    Card, 
    ThemeIcon, 
    Box, 
    Group,
    Stack
} from '@mantine/core';
import { 
    IconHeart, 
    IconUsers, 
    IconMapPin, 
    IconShield 
} from '@tabler/icons-react';

export default function FeaturesSection() {
    const features = [
        { 
            icon: IconHeart, 
            title: "Hiến máu dễ dàng", 
            description: "Đăng ký và đặt lịch hiến máu chỉ với vài thao tác đơn giản.", 
            color: "red" 
        },
        { 
            icon: IconUsers, 
            title: "Cộng đồng lớn mạnh", 
            description: "Kết nối với hàng ngàn người hiến máu tình nguyện trên cả nước.", 
            color: "blue" 
        },
        { 
            icon: IconMapPin, 
            title: "Tìm kiếm nhanh chóng", 
            description: "Dễ dàng tìm kiếm các địa điểm hiến máu hoặc người cần máu gần bạn.", 
            color: "green" 
        },
        { 
            icon: IconShield, 
            title: "An toàn & Bảo mật", 
            description: "Thông tin cá nhân của bạn được bảo vệ và bảo mật tuyệt đối.", 
            color: "violet" 
        },
    ];

    return (
        <Box bg="gray.0" py={80}>
            <Container size="xl">
                <Stack align="center" gap="xl" mb={60}>
                    <Title order={2} ta="center" size="h1">
                        Tại sao chọn BloodConnect?
                    </Title>
                    <Text size="lg" ta="center" maw={600} c="dimmed">
                        Chúng tôi cung cấp một nền tảng an toàn, minh bạch và tiện lợi để kết nối cộng đồng hiến máu.
                    </Text>
                </Stack>

                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
                    {features.map((feature, index) => (
                        <Card key={feature.title} p="xl" radius="md" className="hover-card">
                            <Stack align="center" gap="md">
                                <ThemeIcon 
                                    size={64} 
                                    radius="xl" 
                                    variant="light" 
                                    color={feature.color}
                                >
                                    <feature.icon size={32} />
                                </ThemeIcon>
                                <Title order={3} ta="center" size="h4">
                                    {feature.title}
                                </Title>
                                <Text ta="center" c="dimmed" size="sm">
                                    {feature.description}
                                </Text>
                            </Stack>
                        </Card>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
}
