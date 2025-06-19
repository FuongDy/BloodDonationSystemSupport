import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  AppShell,
  Burger,
  Button,
  Group,
  Text,
  UnstyledButton,
  Avatar,
  Menu,
  rem,
  Container,
  Flex,
  Box
} from '@mantine/core';
import {
  IconStethoscope,
  IconDroplet,
  IconLogout,
  IconUser,
  IconHome,
  IconBook,
  IconCalendarPlus,
  IconShield,
  IconExclamationTriangle,
  IconChevronDown
} from '@tabler/icons-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const isAuthenticated = !!user;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = user?.role === 'Admin';    const navLinks = [
        { to: '/', label: 'Trang chủ', icon: IconHome },
        { to: '/blood-compatibility', label: 'Cẩm nang', icon: IconBook },
        { to: '/blood-requests', label: 'Cần máu gấp', icon: IconExclamationTriangle },
        ...(isAuthenticated ? [{ to: '/request-donation', label: 'Đặt lịch hiến máu', icon: IconCalendarPlus }] : []),
        ...(isAdmin ? [{ to: '/admin', label: 'Quản trị', icon: IconShield, isAdmin: true }] : [])
    ];return (
        <Box
            component="nav"
            style={{
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid #e9ecef'
            }}
        >
            <Container size="xl">
                <Flex justify="space-between" align="center" h={64}>
                    {/* Logo */}
                    <UnstyledButton component={Link} to="/">
                        <Group gap="sm">
                            <IconDroplet size={32} color="#e03131" />
                            <Text size="xl" fw={700} c="#e03131">BloodConnect</Text>
                        </Group>
                    </UnstyledButton>

                    {/* Desktop Navigation */}
                    <Group gap="sm" visibleFrom="md">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Button
                                    key={link.to}
                                    component={Link}
                                    to={link.to}
                                    variant="subtle"
                                    leftSection={<Icon size={16} />}
                                    color={link.isAdmin ? "red" : "gray"}
                                    size="sm"
                                >
                                    {link.label}
                                </Button>
                            );
                        })}
                    </Group>

                    {/* User Menu / Auth Buttons */}
                    <Group gap="sm" visibleFrom="md">
                        {isAuthenticated ? (
                            <Menu shadow="md" width={200}>
                                <Menu.Target>
                                    <UnstyledButton>
                                        <Group gap="sm">
                                            <Avatar size="sm" color="red">
                                                <IconUser size={16} />
                                            </Avatar>
                                            <Text size="sm">{user.fullName || 'Hồ sơ'}</Text>
                                            <IconChevronDown size={14} />
                                        </Group>
                                    </UnstyledButton>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Item
                                        component={Link}
                                        to="/profile"
                                        leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}
                                    >
                                        Hồ sơ
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item
                                        color="red"
                                        leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                                        onClick={handleLogout}
                                    >
                                        Đăng xuất
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        ) : (
                            <Group gap="sm">
                                <Button component={Link} to="/login" variant="subtle" color="gray">
                                    Đăng nhập
                                </Button>
                                <Button component={Link} to="/register" color="red">
                                    Đăng ký
                                </Button>
                            </Group>
                        )}
                    </Group>

                    {/* Mobile Burger */}
                    <Burger
                        opened={isOpen}
                        onClick={() => setIsOpen(!isOpen)}
                        hiddenFrom="md"
                        size="sm"
                    />
                </Flex>

                {/* Mobile Navigation */}
                {isOpen && (
                    <Box hiddenFrom="md" pb="md">
                        <Group direction="column" gap="xs" align="stretch">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Button
                                        key={link.to}
                                        component={Link}
                                        to={link.to}
                                        variant="subtle"
                                        leftSection={<Icon size={16} />}
                                        color={link.isAdmin ? "red" : "gray"}
                                        justify="flex-start"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.label}
                                    </Button>
                                );
                            })}
                            
                            {isAuthenticated ? (
                                <>
                                    <Button
                                        component={Link}
                                        to="/profile"
                                        variant="subtle"
                                        leftSection={<IconUser size={16} />}
                                        justify="flex-start"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Hồ sơ
                                    </Button>
                                    <Button
                                        variant="subtle"
                                        color="red"
                                        leftSection={<IconLogout size={16} />}
                                        justify="flex-start"
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                    >
                                        Đăng xuất
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        component={Link}
                                        to="/login"
                                        variant="subtle"
                                        justify="flex-start"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Đăng nhập
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/register"
                                        color="red"
                                        justify="flex-start"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Đăng ký
                                    </Button>
                                </>
                            )}
                        </Group>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Navbar;