// src/pages/ForgotPasswordPage.jsx
import { ArrowLeft, CheckCircle, Mail, Send } from 'lucide-react';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../store/appStore';
import { handleApiError } from '../utils/errorHandler';
import { forgotPasswordSchema } from '../utils/validationSchemas';

/**
 * ForgotPasswordPage Component
 *
 * Trang yêu cầu reset mật khẩu. Người dùng nhập email để nhận link reset mật khẩu.
 *
 * Features:
 * - Form validation với Yup
 * - Loading state và error handling
 * - Success confirmation
 * - Responsive design
 *
 * @returns {JSX.Element} ForgotPasswordPage component
 */
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { forgotPassword } = useAuth();
  const { setLoading } = useAppStore();

  /**
   * Xử lý submit form yêu cầu reset mật khẩu
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      // Validation
      await forgotPasswordSchema.validate({ email }, { abortEarly: false });

      setLoading(true);
      await forgotPassword(email);
      
      setIsSubmitted(true);
      toast.success('Link reset mật khẩu đã được gửi đến email của bạn!');
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setValidationErrors(errors);
      } else {
        handleApiError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [email, forgotPassword, setLoading]);

  /**
   * Xử lý thay đổi email input
   */
  const handleEmailChange = useCallback((e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Clear validation error khi user bắt đầu nhập
    if (validationErrors.email) {
      setValidationErrors(prev => ({ ...prev, email: null }));
    }
  }, [validationErrors.email]);

  /**
   * Render success state
   */
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email đã được gửi!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Chúng tôi đã gửi link reset mật khẩu đến email <strong>{email}</strong>. 
              Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn.
            </p>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Không nhận được email? Kiểm tra thư mục spam hoặc thử lại sau vài phút.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Gửi lại
                </button>
                
                <Link
                  to="/login"
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Quên mật khẩu?
            </h1>
            
            <p className="text-gray-600">
              Nhập email của bạn để nhận link reset mật khẩu
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`
                    w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors
                    ${validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                  placeholder="Nhập email của bạn"
                  autoComplete="email"
                  required
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Gửi link reset mật khẩu
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-red-600 hover:text-red-700 font-medium">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
