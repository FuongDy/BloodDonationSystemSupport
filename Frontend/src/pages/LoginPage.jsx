// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn as LogInIcon, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import logo from '/logo.png';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false); // Giữ lại nếu bạn muốn triển khai chức năng này

    const { login, isAuthenticated, loading: authLoading } = useAuth(); // Sử dụng hook useAuth
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
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
            const userData = await login(email, password); //
            toast.success(`Chào mừng ${userData.fullName || 'bạn'}!`, { id: toastId });

            if (userData.role === 'Admin') { //
                navigate('/admin', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } catch (err) {
            toast.error(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.", { id: toastId });
        }
    };

    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <Link to="/">
                            <img
                                className="mx-auto h-16 w-auto"
                                src={logo}
                                alt="BloodConnect Logo"
                            />
                        </Link>
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Chào mừng trở lại
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Chưa có tài khoản?{' '}
                            <Link to="/register" className="font-medium text-red-600 hover:text-red-500">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>

                    <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
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
                            // error={error.email} // Nếu có validation lỗi cụ thể cho email
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
                                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Ghi nhớ tôi
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-red-600 hover:text-red-500">
                                        Quên mật khẩu?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <Button type="submit" className="w-full" disabled={authLoading}>
                                    <LogInIcon className="mr-2 h-5 w-5" />
                                    {authLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                                </Button>
                            </div>
                        </form>
                    </div>
                     <p className="mt-6 text-center text-xs text-gray-500">
                        Bằng việc tiếp tục, bạn đồng ý với{' '}
                        <Link to="/terms" className="underline hover:text-gray-700">Điều khoản dịch vụ</Link> và{' '}
                        <Link to="/privacy" className="underline hover:text-gray-700">Chính sách bảo mật</Link> của chúng tôi.
                    </p>
                </div>
            </div>
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-red-600 to-rose-700 p-12 text-white relative overflow-hidden">
                {/* Animated background shapes */}
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob-spin"></div>
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-rose-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob-spin animation-delay-2000"></div>
                <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob-spin animation-delay-4000"></div>

                 <div className="relative z-10 text-center space-y-8">
                    <div className="relative w-48 h-48 mx-auto animate-float">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
                        <Heart size={80} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse"/>
                    </div>

                    <h1 className="text-4xl font-bold leading-tight tracking-wide text-shadow-lg">
                        Mỗi giọt máu cho đi,
                        <br />
                        Một cuộc đời ở lại.
                    </h1>
                    <div className="max-w-md mx-auto">
                        <p className="text-lg text-red-100 mb-6">
                            Cảm ơn bạn đã tham gia cộng đồng BloodConnect và góp phần mang lại hy vọng cho những người cần giúp đỡ.
                        </p>
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                            <p className="font-semibold text-white">
                                "Hành động nhỏ, ý nghĩa lớn. Hiến máu cứu người - một nghĩa cử cao đẹp."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;