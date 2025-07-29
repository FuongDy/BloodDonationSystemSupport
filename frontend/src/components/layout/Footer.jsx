// src/components/layout/Footer.jsx
import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import React, { useMemo } from 'react';

const Footer = () => {
  // Memoize static data
  const footerData = useMemo(() => ({
    company: {
      name: 'HiBlood',
      description: 'Hệ thống quản lý hiến máu giúp kết nối người hiến máu và những người cần máu, góp phần cứu sống nhiều sinh mạng quý báu.'
    },
    quickLinks: [
      { href: '/', label: 'Trang chủ' },
      { href: '/blood-compatibility', label: 'Kiểm tra tương thích' },
      { href: '/request-donation', label: 'Đăng ký hiến máu' },
      { href: '/blog', label: 'Blog' }
    ],
    contact: [
      { icon: Phone, text: '+84 123 456 789' },
      { icon: Mail, text: 'info@HiBlood.vn' },
      { icon: MapPin, text: 'Bệnh Viện Huyết Học FPT Hồ Chí Minh' }
    ]
  }), []);

  return (
    <footer className='bg-gray-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Logo and Description */}
          <div className='col-span-1 md:col-span-2'>
            <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
              <div className='flex items-center space-x-2 mb-4'>
                <div className='w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center'>
                  <Heart className='h-6 w-6 text-white' />
                </div>
                <span className='text-xl font-bold'>{footerData.company.name}</span>
              </div>
              <p className='text-gray-300 mb-4 leading-relaxed'>
                {footerData.company.description}
              </p>
              
              {/* Social Links */}
              <div className='flex space-x-4'>
                <a href='#' className='w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-gray-600 transition-colors'>
                  {/* Facebook icon */}
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                     <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.342v21.316C0 23.4.6 24 1.342 24h11.494v-9.294H9.691v-3.622h3.145V8.413c0-3.118 1.903-4.815 4.683-4.815 1.331 0 2.476.099 2.81.143v3.26l-1.928.001c-1.511 0-1.804.718-1.804 1.77v2.319h3.607l-.47 3.622h-3.137V24h6.146C23.4 24 24 23.4 24 22.658V1.342C24 .6 23.4 0 22.675 0z"/>
                  </svg>
                </a>
                <a href='#' className='w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-gray-600 transition-colors'>
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z' />
                  </svg>
                </a>
                <a href='#' className='w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-gray-600 transition-colors'>
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z' />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className='bg-gray-800 rounded-xl p-6 border border-gray-700 h-full'>
              <h3 className='text-lg font-semibold mb-4'>Liên kết nhanh</h3>
              <ul className='space-y-3'>
                {footerData.quickLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className='text-gray-300 hover:text-red-400 transition-colors'>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <div className='bg-gray-800 rounded-xl p-6 border border-gray-700 h-full'>
              <h3 className='text-lg font-semibold mb-4'>Liên hệ</h3>
              <div className='space-y-4'>
                {footerData.contact.map((item, index) => (
                  <div key={index} className='flex items-center space-x-3'>
                    <div className='w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center'>
                      <item.icon size={16} className='text-red-400' />
                    </div>
                    <span className='text-gray-300'>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='mt-8'>
          <div className='bg-gray-800 rounded-xl p-6 border border-gray-700 text-center'>
            <p className='text-gray-300'>
              © 2024 HiBlood System. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
