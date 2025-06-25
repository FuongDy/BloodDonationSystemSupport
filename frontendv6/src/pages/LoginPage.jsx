// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  LogIn as LogInIcon,
  Heart,
  Shield,
  Users,
  Mail,
  Lock,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../store/appStore';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import { userLoginSchema } from '../utils/validationSchemas';
import { handleApiError } from '../utils/errorHandler';

/**
 * LoginPage Component
 *
 * Trang đăng nhập với form validation sử dụng Yup schema và global state management
 * với Zustand. Xử lý authentication flow và error handling toàn diện.
 *
 * Features:
 * - Form validation với Yup
 * - Global state management với Zustand
 * - Auto-redirect dựa trên role
 * - Loading state và error handling
 * - Password visibility toggle
 *
 * @returns {JSX.Element} LoginPage component
 */
const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { login, user, isAuthenticated, loading: authLoading } = useAuth();
  const { setLoading } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  /**
   * Effect để xử lý auto-redirect sau khi đăng nhập thành công
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user?.role;
      toast.success(
        `Đăng nhập thành công! Chào mừng ${user?.fullName || 'bạn'}.`
      );

      // Use setTimeout to ensure state updates are complete
      setTimeout(() => {
        if (userRole === 'Admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }, 100);
    }
  }, [isAuthenticated, user, navigate, from]);

  /**
   * Xử lý thay đổi input với validation real-time
   * @param {Event} e - Input change event
   */
  const handleChange = async e => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));

    // Clear validation error cho field hiện tại
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    } // Validate field hiện tại
    try {
      await userLoginSchema.validateAt(name, { [name]: value });
    } catch (validationError) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: validationError.message,
      }));
    }
  };

  /**
   * Xử lý submit form với full validation
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Validate toàn bộ form
      await userLoginSchema.validate(credentials, { abortEarly: false });
      setValidationErrors({});

      setLoading(true);
      await login(credentials);
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Xử lý validation errors
        const errors = {};
        error.inner.forEach(err => {
          errors[err.path] = error.message;
        });
        setValidationErrors(errors);
        toast.error('Vui lòng kiểm tra lại thông tin đăng nhập.');
      } else {
        // Xử lý API errors
        handleApiError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated, show loading or redirect immediately
  if (isAuthenticated && user) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center'>
        <div className='text-center bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <Heart className='w-8 h-8 text-red-600 animate-pulse' />
          </div>
          <div className='w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Đang chuyển hướng...
          </h3>
          <p className='text-gray-600 text-sm'>Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50'>
      {/* Background Pattern */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-32 w-80 h-80 bg-red-100 rounded-full opacity-30 blur-3xl'></div>
        <div className='absolute -bottom-40 -left-32 w-80 h-80 bg-pink-100 rounded-full opacity-30 blur-3xl'></div>
      </div>

      <div className='relative min-h-screen flex'>
        {/* Left Side - Hero Section */}
        <div className='hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-red-600 to-pink-600 text-white p-12'>
          <div className='max-w-md text-center'>
            <div className='flex items-center justify-center mb-8'>
              <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
                <Heart className='w-10 h-10 text-white' />
              </div>
            </div>
            <h1 className='text-4xl font-bold mb-6'>Chào mừng trở lại!</h1>
            <p className='text-xl text-red-100 mb-8 font-light'>
              Tiếp tục hành trình ý nghĩa cứu người của bạn
            </p>

            {/* Features */}
            <div className='space-y-4'>
              <div className='flex items-center space-x-3'>
                <Shield className='w-5 h-5 text-red-200' />
                <span className='text-red-100'>
                  Bảo mật thông tin tuyệt đối
                </span>
              </div>
              <div className='flex items-center space-x-3'>
                <Users className='w-5 h-5 text-red-200' />
                <span className='text-red-100'>
                  Cộng đồng hiến máu lớn nhất VN
                </span>
              </div>
              <div className='flex items-center space-x-3'>
                <Heart className='w-5 h-5 text-red-200' />
                <span className='text-red-100'>
                  Mỗi giọt máu cứu một cuộc đời
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
          <div className='max-w-2xl w-full'>
            {/* Mobile Hero */}
            <div className='lg:hidden text-center mb-6'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4'>
                <Heart className='w-8 h-8 text-red-600' />
              </div>
              <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                Đăng nhập
              </h1>
              <p className='text-gray-600'>
                Chào mừng bạn trở lại hệ thống hiến máu
              </p>
            </div>

            {/* Desktop Header */}
            <div className='hidden lg:block text-center mb-6'>
              <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                Đăng nhập tài khoản
              </h2>
              <p className='text-gray-600'>
                Vui lòng nhập thông tin để tiếp tục
              </p>
            </div>

            {/* Login Form */}
            <div className='bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Email Field */}
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700 flex items-center'>
                    <Mail className='w-4 h-4 mr-2 text-gray-500' />
                    Địa chỉ Email
                  </label>
                  <div className='relative'>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      value={credentials.email}
                      onChange={handleChange}
                      placeholder='your.email@example.com'
                      required
                      disabled={authLoading}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                        validationErrors.email
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 bg-white'
                      } ${authLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    {validationErrors.email && (
                      <p className='mt-1 text-xs text-red-600'>
                        {validationErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Field */}
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700 flex items-center'>
                    <Lock className='w-4 h-4 mr-2 text-gray-500' />
                    Mật khẩu
                  </label>
                  <div className='relative'>
                    <input
                      id='password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder='••••••••••••'
                      required
                      disabled={authLoading}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                        validationErrors.password
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 bg-white'
                      } ${authLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={authLoading}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                    >
                      {showPassword ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                    {validationErrors.password && (
                      <p className='mt-1 text-xs text-red-600'>
                        {validationErrors.password}
                      </p>
                    )}
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className='flex items-center justify-between'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      className='w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500'
                    />
                    <span className='ml-2 text-sm text-gray-600'>
                      Ghi nhớ đăng nhập
                    </span>
                  </label>
                  <Link
                    to='/forgot-password'
                    className='text-sm text-red-600 hover:text-red-500 font-medium'
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={
                    authLoading ||
                    Object.keys(validationErrors).some(
                      key => validationErrors[key]
                    )
                  }
                  className={`w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    authLoading ? 'cursor-wait' : ''
                  }`}
                >
                  <div className='flex items-center justify-center'>
                    {authLoading ? (
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                    ) : (
                      <LogInIcon className='w-5 h-5 mr-2' />
                    )}
                    {authLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </div>
                </button>

                {/* Divider */}
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-300'></div>
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='px-2 bg-white text-gray-500'>Hoặc</span>
                  </div>
                </div>

                {/* Register Link */}
                <div className='text-center'>
                  <p className='text-sm text-gray-600'>
                    Chưa có tài khoản?{' '}
                    <Link
                      to='/register'
                      className='font-medium text-red-600 hover:text-red-500 inline-flex items-center group'
                    >
                      Đăng ký ngay
                      <ArrowRight className='w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform' />
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Footer Note */}
            <div className='mt-6 text-center'>
              <p className='text-xs text-gray-500'>
                Bằng việc đăng nhập, bạn đồng ý với{' '}
                <Link to='/terms' className='text-red-600 hover:underline'>
                  Điều khoản sử dụng
                </Link>{' '}
                và{' '}
                <Link to='/privacy' className='text-red-600 hover:underline'>
                  Chính sách bảo mật
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
