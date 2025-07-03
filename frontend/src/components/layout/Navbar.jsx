import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Droplet,
  LogOut,
  User,
  Menu,
  X,
  Home,
  BookOpen,
  CalendarPlus,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Search,
  ChevronDown,
} from 'lucide-react';

// Custom hook để xử lý việc click bên ngoài element
const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const userDropdownRef = useRef(null);
  useOutsideClick(userDropdownRef, () => setIsUserDropdownOpen(false));

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'Admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Các liên kết điều hướng chính
  const navLinks = (
    <>
      <Link
        to='/'
        className='flex items-center text-gray-600 hover:text-red-500 transition-colors px-3 py-2 rounded-md text-sm font-medium'
      >
        <Home className='w-4 h-4 mr-1.5' />
        Trang chủ
      </Link>
      <Link
        to='/blood-compatibility'
        className='flex items-center text-gray-600 hover:text-red-500 transition-colors px-3 py-2 rounded-md text-sm font-medium'
      >
        <BookOpen className='w-4 h-4 mr-1.5' />
        Cẩm nang
      </Link>
      <Link
        to='/blood-requests'
        className='flex items-center text-gray-600 hover:text-red-500 transition-colors px-3 py-2 rounded-md text-sm font-medium'
      >
        <AlertTriangle className='w-4 h-4 mr-1.5' />
        Cần máu gấp
      </Link>
      <Link
        to='/find-donors'
        className='flex items-center text-gray-600 hover:text-red-500 transition-colors px-3 py-2 rounded-md text-sm font-medium'
      >
        <Search className='w-4 h-4 mr-1.5' />
        Tìm người hiến
      </Link>
      <Link
        to='/request-donation'
        className='flex items-center text-gray-600 hover:text-red-500 transition-colors px-3 py-2 rounded-md text-sm font-medium'
      >
        <CalendarPlus className='w-4 h-4 mr-1.5' />
        Đặt lịch hiến máu
      </Link>
      <Link
        to='/blog'
        className='flex items-center text-gray-600 hover:text-red-500 transition-colors px-3 py-2 rounded-md text-sm font-medium'
      >
        <BookOpen className='w-4 h-4 mr-1.5' />
        Blog
      </Link>
      {isAdmin && (
        <Link
          to='/admin'
          className='flex items-center text-red-600 hover:text-red-700 transition-colors px-3 py-2 rounded-md text-sm font-bold'
        >
          <ShieldCheck className='w-4 h-4 mr-1.5' />
          Quản trị
        </Link>
      )}
    </>
  );

  // Các liên kết trong dropdown của người dùng
  const userLinks = (
    <>
      <div className='px-4 py-3 border-b'>
        <p className='text-sm font-medium text-gray-900 truncate'>
          {user?.fullName || 'Người dùng'}
        </p>
        <p className='text-sm text-gray-500 truncate'>{user?.email}</p>
      </div>
      <div className='py-1'>
        <Link
          to='/profile'
          className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
          onClick={() => setIsUserDropdownOpen(false)}
        >
          <User className='w-4 h-4 mr-2' />
          Hồ sơ
        </Link>
        <Link
          to='/my-donation-history'
          className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
          onClick={() => setIsUserDropdownOpen(false)}
        >
          <Heart className='w-4 h-4 mr-2' />
          Lịch sử hiến máu
        </Link>
        <Link
          to='/my-appointments'
          className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
          onClick={() => setIsUserDropdownOpen(false)}
        >
          <CalendarPlus className='w-4 h-4 mr-2' />
          Lịch hẹn của tôi
        </Link>
      </div>
      <div className='py-1 border-t'>
        <button
          onClick={handleLogout}
          className='flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
        >
          <LogOut className='w-4 h-4 mr-2' />
          Đăng xuất
        </button>
      </div>
    </>
  );
  
  // Các liên kết cho menu mobile (bao gồm cả các link của user nếu đã đăng nhập)
  const mobileNavLinks = (
     <>
      <Link to="/" className="flex items-center text-gray-700 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"><Home className="w-5 h-5 mr-3" />Trang chủ</Link>
      <Link to="/blood-compatibility" className="flex items-center text-gray-700 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"><BookOpen className="w-5 h-5 mr-3" />Cẩm nang</Link>
      <Link to="/blood-requests" className="flex items-center text-gray-700 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"><AlertTriangle className="w-5 h-5 mr-3" />Cần máu gấp</Link>
      <Link to="/find-donors" className="flex items-center text-gray-700 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"><Search className="w-5 h-5 mr-3" />Tìm người hiến</Link>
      <Link to="/request-donation" className="flex items-center text-gray-700 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"><CalendarPlus className="w-5 h-5 mr-3" />Đặt lịch hiến máu</Link>
      <Link to="/blog" className="flex items-center text-gray-700 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"><BookOpen className="w-5 h-5 mr-3" />Blog</Link>
       {isAdmin && (
        <Link
          to='/admin'
          className='flex items-center text-red-600 block px-3 py-2 rounded-md text-base font-bold hover:bg-gray-50'
        >
          <ShieldCheck className='w-5 h-5 mr-3' />
          Quản trị
        </Link>
      )}
     </>
  )


  return (
    <nav className='bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <Link to='/' className='flex-shrink-0 flex items-center text-red-600'>
              <Droplet className='w-8 h-8' />
              <span className='ml-2 text-xl font-bold'>BloodConnect</span>
            </Link>
          </div>
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-1'>{navLinks}</div>
          </div>
          <div className='hidden md:block'>
            {isAuthenticated ? (
              <div className='relative ml-4' ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className='flex items-center p-2 rounded-full text-gray-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                >
                   <span className="sr-only">Mở menu người dùng</span>
                  <User className='w-6 h-6' />
                  <ChevronDown className='w-5 h-5 ml-1' />
                </button>
                {isUserDropdownOpen && (
                  <div className='absolute right-0 mt-2 w-64 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    {userLinks}
                  </div>
                )}
              </div>
            ) : (
              <div className='flex items-center space-x-2 ml-4'>
                <Link
                  to='/login'
                  className='text-gray-600 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium'
                >
                  Đăng nhập
                </Link>
                <Link
                  to='/register'
                  className='bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600'
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
          <div className='-mr-2 flex md:hidden'>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-red-600 focus:outline-none'
            >
              <span className='sr-only'>Mở menu</span>
              {isMobileMenuOpen ? <X className='block h-6 w-6' /> : <Menu className='block h-6 w-6' />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className='md:hidden bg-white border-t border-gray-200'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>{mobileNavLinks}</div>
          <div className='pt-4 pb-3 border-t border-gray-200'>
            {isAuthenticated ? (
              <div className='px-2'>{userLinks}</div>
            ) : (
              <div className='px-2 space-y-1'>
                <Link
                  to='/login'
                  className='block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-red-600'
                >
                  Đăng nhập
                </Link>
                <Link
                  to='/register'
                  className='block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-red-600'
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;