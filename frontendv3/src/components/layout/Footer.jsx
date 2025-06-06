import React from 'react';
import { Heart, Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Component Footer hiển thị chân trang chung cho toàn bộ trang web.
 */
const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <img src="/logo.png" alt="Logo BloodConnect" className="h-12 w-auto" />
                            <span className="text-xl font-bold text-gray-900">BloodConnect</span>
                        </Link>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Kết nối yêu thương, chia sẻ sự sống. Nền tảng kết nối người hiến máu với cộng đồng.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-red-600">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-red-600">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 tracking-wide uppercase">Liên kết nhanh</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/about" className="text-gray-600 hover:text-red-600">Về chúng tôi</Link></li>
                            <li><Link to="/donate-info" className="text-gray-600 hover:text-red-600">Hướng dẫn hiến máu</Link></li>
                            <li><Link to="/blog" className="text-gray-600 hover:text-red-600">Tin tức</Link></li>
                            <li><Link to="/faq" className="text-gray-600 hover:text-red-600">Câu hỏi thường gặp</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 tracking-wide uppercase">Hỗ trợ</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/contact" className="text-gray-600 hover:text-red-600">Liên hệ</Link></li>
                            <li><Link to="/privacy-policy" className="text-gray-600 hover:text-red-600">Chính sách bảo mật</Link></li>
                            <li><Link to="/terms" className="text-gray-600 hover:text-red-600">Điều khoản sử dụng</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 tracking-wide uppercase">Thông tin liên hệ</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start space-x-2">
                                <MapPin className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                                <span className="text-gray-600">TP. Hồ Chí Minh, Việt Nam</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-red-600" />
                                <a href="tel:+84123456789" className="text-gray-600 hover:text-red-600">+84 123 456 789</a>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-red-600" />
                                <a href="mailto:support@bloodconnect.vn" className="text-gray-600 hover:text-red-600">fpt@edu.vn</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-200 pt-8 text-center">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} BloodConnect <Heart className="inline w-4 h-4 text-red-500" />
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;