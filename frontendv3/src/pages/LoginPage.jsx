// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn as LogInIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const { login, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        if (isAuthenticated) {
            // Nếu người dùng đã đăng nhập, chuyển hướng họ đi
            // Nếu là admin, họ sẽ được chuyển đến /admin từ lần đăng nhập trước
            // Nếu là user thường, họ sẽ được chuyển đến trang họ đang muốn vào
            const user = JSON.parse(localStorage.getItem('user'));
            if (user?.role === 'Admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        }
    }, [isAuthenticated, navigate, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Vui lòng nhập đầy đủ email và mật khẩu.");
            return;
        }

        const toastId = toast.loading("Đang đăng nhập...");

        try {
            // Hàm login sẽ trả về thông tin người dùng sau khi đăng nhập thành công
            const userData = await login(email, password);
            toast.success(`Chào mừng ${userData.fullName || 'bạn'}!`, { id: toastId });

            // === PHẦN LOGIC ĐƯỢC THÊM VÀO ===
            // Kiểm tra vai trò của người dùng
            if (userData.role === 'Admin') {
                // Nếu là Admin, chuyển hướng tới trang /admin
                navigate('/admin', { replace: true });
            } else {
                // Nếu không phải Admin, chuyển hướng tới trang họ định vào hoặc trang chủ
                navigate(from, { replace: true });
            }
        } catch (err) {
            toast.error(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.", { id: toastId });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <LogInIcon className="mx-auto h-12 w-auto text-red-600" />
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Đăng nhập tài khoản
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Hoặc{' '}
                            <Link to="/register" className="font-medium text-red-600 hover:text-red-500">
                                tạo tài khoản mới
                            </Link>
                        </p>
                    </div>

                    <div className="bg-white py-8 px-6 shadow-xl rounded-xl sm:px-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <InputField
                                label="Địa chỉ Email"
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                disabled={authLoading}
                            />

                            <InputField
                                label="Mật khẩu"
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                disabled={authLoading}
                                hasIcon={true}
                                icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                onIconClick={() => setShowPassword(!showPassword)}
                            />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                        disabled={authLoading}
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Ghi nhớ tôi
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <Link to="/forgot-password" className="font-medium text-red-600 hover:text-red-500">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={authLoading}
                                isLoading={authLoading}
                                variant="primary"
                                size="lg"
                            >
                                Đăng nhập
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LoginPage;