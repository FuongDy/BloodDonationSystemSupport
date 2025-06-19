
import React from 'react';
import { 
    Container, 
    Group, 
    Text, 
    Anchor, 
    Box, 
    SimpleGrid,
    Stack,
    ActionIcon,
    Divider
} from '@mantine/core';
import { 
    IconHeart, 
    IconMail, 
    IconPhone, 
    IconMapPin,
    IconBrandFacebook,
    IconBrandTwitter,
    IconBrandInstagram
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <Box component="footer" bg="dark.8" c="white">
            <Container size="xl" py="xl">
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
                    {/* Logo and Description */}
                    <Box span={{ base: 12, sm: 12, lg: 6 }}>
                        <Group mb="md">
                            <IconHeart size={32} color="#e03131" />
                            <Text size="xl" fw={700}>BloodConnect</Text>
                        </Group>
                        <Text c="gray.3" mb="md" size="sm">
                            Hệ thống quản lý hiến máu giúp kết nối yêu thương,
                            góp phần cứu sống nhiều sinh mạng quý báu.
                        </Text>
                        <Group gap="xs">
                            <ActionIcon variant="subtle" color="gray" size="lg" radius="xl">
                                <IconBrandFacebook size={20} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="gray" size="lg" radius="xl">
                                <IconBrandTwitter size={20} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="gray" size="lg" radius="xl">
                                <IconBrandInstagram size={20} />
                            </ActionIcon>
                        </Group>
                    </Box>

                    {/* Quick Links */}
                    <Box>
                        <Text fw={600} mb="md">Liên kết nhanh</Text>
                        <Stack gap="xs">
                            <Anchor component={Link} to="/" c="gray.3" size="sm">
                                Trang chủ
                            </Anchor>
                            <Anchor component={Link} to="/blood-compatibility" c="gray.3" size="sm">
                                Kiểm tra tương thích
                            </Anchor>
                            <Anchor component={Link} to="/register" c="gray.3" size="sm">
                                Đăng ký hiến máu
                            </Anchor>
                        </Stack>
                    </Box>

                    {/* Contact Info */}
                    <Box>
                        <Text fw={600} mb="md">Liên hệ</Text>
                        <Stack gap="xs">
                            <Group gap="xs">
                                <IconPhone size={16} color="#e03131" />
                                <Text c="gray.3" size="sm">+84 123 456 789</Text>
                            </Group>
                            <Group gap="xs">
                                <IconMail size={16} color="#e03131" />
                                <Text c="gray.3" size="sm">info@bloodconnect.vn</Text>
                            </Group>
                            <Group gap="xs">
                                <IconMapPin size={16} color="#e03131" />
                                <Text c="gray.3" size="sm">123 Đường ABC, Quận XYZ, TP.HCM</Text>
                            </Group>
                        </Stack>
                    </Box>
                </SimpleGrid>

                <Divider my="xl" color="dark.5" />
                
                <Text ta="center" c="gray.3" size="sm">
                    © 2024 BloodConnect System. Tất cả quyền được bảo lưu.
                </Text>
            </Container>
        </Box>
    );
};

export default Footer;