import {
  AlertTriangle,
  BookOpen,
  CalendarPlus,
  ChevronDown,
  Droplet,
  Heart,
  Home,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import RoleBadge from '../common/RoleBadge';

// Custom hook để xử lý việc click bên ngoài element
const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = event => {
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

  // Click outside để đóng dropdown - Improved version
  useEffect(() => {
    const handleClickOutside = event => {
      // Kiểm tra cả ref và class selector
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        !event.target.closest('.user-dropdown-container')
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const isAuthenticated = !!user;
  // const isAdmin = user?.role === 'Admin';
  // const isStaff = user?.role === 'Staff';

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleUserDropdownToggle = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsUserDropdownOpen(prev => !prev);
  };

  // Các liên kết điều hướng chính
  const navLinks = (
    <>
      <Link
        to='/'
        className='flex items-center text-gray-700 hover:text-red-500 hover:bg-white/30 transition-all duration-300 px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm border border-transparent hover:border-white/40 hover:shadow-md group'
      >
        <Home className='w-4 h-4 mr-1.5 group-hover:drop-shadow-sm' />
        <span className='drop-shadow-sm'>Trang chủ</span>
      </Link>
      <Link
        to='/blood-compatibility'
        className='flex items-center text-gray-700 hover:text-red-500 hover:bg-white/30 transition-all duration-300 px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm border border-transparent hover:border-white/40 hover:shadow-md group'
      >
        <BookOpen className='w-4 h-4 mr-1.5 group-hover:drop-shadow-sm' />
        <span className='drop-shadow-sm'>Cẩm nang</span>
      </Link>
      <Link
        to='/blood-requests'
        className='flex items-center text-gray-700 hover:text-red-500 hover:bg-white/30 transition-all duration-300 px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm border border-transparent hover:border-white/40 hover:shadow-md group'
      >
        <AlertTriangle className='w-4 h-4 mr-1.5 group-hover:drop-shadow-sm' />
        <span className='drop-shadow-sm'>Cần máu gấp</span>
      </Link>
      <Link
        to='/find-donors'
        className='flex items-center text-gray-700 hover:text-red-500 hover:bg-white/30 transition-all duration-300 px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm border border-transparent hover:border-white/40 hover:shadow-md group'
      >
        <Search className='w-4 h-4 mr-1.5 group-hover:drop-shadow-sm' />
        <span className='drop-shadow-sm'>Tìm người hiến</span>
      </Link>
      <Link
        to='/request-donation'
        className='flex items-center text-gray-700 hover:text-red-500 hover:bg-white/30 transition-all duration-300 px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm border border-transparent hover:border-white/40 hover:shadow-md group'
      >
        <CalendarPlus className='w-4 h-4 mr-1.5 group-hover:drop-shadow-sm' />
        <span className='drop-shadow-sm'>Đặt lịch hiến máu</span>
      </Link>
      <Link
        to='/blog'
        className='flex items-center text-gray-700 hover:text-red-500 hover:bg-white/30 transition-all duration-300 px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm border border-transparent hover:border-white/40 hover:shadow-md group'
      >
        <BookOpen className='w-4 h-4 mr-1.5 group-hover:drop-shadow-sm' />
        <span className='drop-shadow-sm'>Blog</span>
      </Link>
      {/* {(isAdmin || isStaff) && (
        <Link
          to='/admin'
          className='flex items-center text-purple-600 hover:text-purple-700 hover:bg-white/30 transition-all duration-300 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm border border-transparent hover:border-purple-200 hover:shadow-md group'
        >
          <ShieldCheck className='w-4 h-4 mr-1.5 group-hover:drop-shadow-sm' />
          <span className='drop-shadow-sm'>{isAdmin ? 'Quản trị' : 'Staff Panel'}</span>
        </Link>
      )} */}
    </>
  );

  // Badge "Staff Panel" cho Staff
  // const staffBadge = null;

  // Các liên kết trong dropdown của người dùng
  // const userLinks = (
  //   <div className='py-1'>
  //     <div className='px-4 py-3 border-b border-gray-200'>
  //       <div className='flex items-center justify-between'>
  //         <div>
  //           <p className='text-sm font-medium text-gray-900 truncate'>
  //             {user?.fullName || 'Người dùng'}
  //           </p>
  //           <p className='text-sm text-gray-500 truncate'>{user?.email}</p>
  //         </div>
  //         <RoleBadge role={user?.role} size="sm" />
  //       </div>
  //     </div>

  //     <Link
  //       to='/profile'
  //       className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
  //       onClick={() => setIsUserDropdownOpen(false)}
  //     >
  //       <User className='w-4 h-4 mr-2' />
  //       Hồ sơ
  //     </Link>

  //     <Link
  //       to='/my-donation-history'
  //       className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
  //       onClick={() => setIsUserDropdownOpen(false)}
  //     >
  //       <Heart className='w-4 h-4 mr-2' />
  //       Lịch sử hiến máu
  //     </Link>

  //     <Link
  //       to='/my-appointments'
  //       className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
  //       onClick={() => setIsUserDropdownOpen(false)}
  //     >
  //       <CalendarPlus className='w-4 h-4 mr-2' />
  //       Lịch hẹn của tôi
  //     </Link>

  //     <div className='border-t border-gray-200'>
  //       <button
  //         onClick={handleLogout}
  //         className='flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
  //       >
  //         <LogOut className='w-4 h-4 mr-2' />
  //         Đăng xuất
  //       </button>
  //     </div>
  //   </div>
  // );

  // Các liên kết cho menu mobile (bao gồm cả các link của user nếu đã đăng nhập)
  // const mobileNavLinks = (
  //    <>
  //     <Link to="/" className="flex items-center text-gray-700 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"><Home className="w-5 h-5 mr-3" />Trang chủ</Link>
  //     <Link to="/blood-compatibility" className="flex items-center text-gray-700 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"><BookOpen className="w-5 h-5 mr-3" />Cẩm nang</Link>
  //     <Link to="/blood-requests" className="flex items-center text-gray-700 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"><AlertTriangle className="w-5 h-5 mr-3" />Cần máu gấp</Link>
  //     <Link to="/find-donors" className="flex items-center text-gray-700 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"><Search className="w-5 h-5 mr-3" />Tìm người hiến</Link>
  //     <Link to="/request-donation" className="flex items-center text-gray-700 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"><CalendarPlus className="w-5 h-5 mr-3" />Đặt lịch hiến máu</Link>
  //     <Link to="/blog" className="flex items-center text-gray-700 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"><BookOpen className="w-5 h-5 mr-3" />Blog</Link>
  //      {(isAdmin || isStaff) && (
  //       <Link
  //         to='/admin'
  //         className='flex items-center text-purple-600 px-3 py-2 rounded-md text-base font-bold hover:bg-gray-50'
  //       >
  //         <ShieldCheck className='w-5 h-5 mr-3' />
  //         {isAdmin ? 'Quản trị' : 'Staff Panel'}
  //       </Link>
  //     )}
  //    </>
  // )

  return (
    <nav className='fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-white/80 via-white/90 to-red-50/80 backdrop-blur-md border-b border-white/20 shadow-lg overflow-visible'>
      {/* Glass Background */}
      <div className='absolute inset-0 bg-gradient-to-r from-red-50/30 to-pink-50/30'></div>
      <div className='absolute inset-0 bg-white/10 backdrop-blur-sm'></div>

      {/* Floating Elements */}
      <div className='absolute top-0 left-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl'></div>
      <div className='absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-xl'></div>

      <div className='relative max-w-full mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>

            <Link
              to='/'
              className='flex-shrink-0 flex items-center'
            >
              <div
                className='w-14 h-14 bg-no-repeat bg-center bg-contain rounded-full'
                style={{
                  backgroundImage: 'url(/logo.png)',
                }}
              ></div>

              <span className='ml-2 text-xl font-bold text-gray-800 drop-shadow-sm group-hover:text-red-600 transition-colors duration-300'>
                HiBlood
              </span>
            </Link>
          </div>
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-1'>
              {navLinks}
            </div>
          </div>
          <div className='hidden md:flex items-center space-x-4 relative'>
            {isAuthenticated ? (
              <div
                className='relative ml-4 user-dropdown-container'
                ref={userDropdownRef}
              >
                <button
                  onClick={handleUserDropdownToggle}
                  className='flex items-center p-2 rounded-xl text-gray-700 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/40 hover:shadow-md group relative z-50'
                  type='button'
                  aria-expanded={isUserDropdownOpen}
                  aria-haspopup='true'
                >
                  {/* <span className="sr-only">Mở menu người dùng</span> */}
                  <div className='w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg mr-2'>
                    <User className='w-4 h-4 text-white' />
                  </div>
                  <span className='hidden sm:block text-sm font-medium text-gray-800 mr-1'>
                    {user?.fullName?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div
                    className='fixed top-16 right-4 w-80 z-[9999] transform transition-all duration-300 ease-out opacity-100 translate-y-0 pointer-events-auto scale-100'
                    style={{
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                    }}
                  >
                    <div className='bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 overflow-hidden ring-1 ring-black/5'>
                      {/* Glassmorphism overlay */}
                      <div className='absolute inset-0 bg-gradient-to-br from-purple-50/30 via-white/20 to-pink-50/30 pointer-events-none'></div>

                      <div className='relative'>
                        {/* Header */}
                        <div className='px-5 py-4 border-b border-white/30'>
                          <div className='flex items-center space-x-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg'>
                              <User className='w-5 h-5 text-white' />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <p className='text-sm font-bold text-gray-900 truncate'>
                                {user?.fullName || 'Người dùng'}
                              </p>
                              <p className='text-xs text-gray-600 truncate'>
                                {user?.email}
                              </p>
                            </div>
                            <RoleBadge role={user?.role} size='sm' />
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className='py-2'>
                          <Link
                            to='/profile'
                            className='flex items-center px-5 py-3 text-sm text-gray-800 hover:bg-white/50 hover:text-purple-700 transition-all duration-200 group'
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <div className='w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors'>
                              <User className='w-4 h-4 text-purple-600' />
                            </div>
                            <span className='font-medium'>Hồ sơ cá nhân</span>
                          </Link>

                          <Link
                            to='/my-appointments'
                            className='flex items-center px-5 py-3 text-sm text-gray-800 hover:bg-white/50 hover:text-purple-700 transition-all duration-200 group'
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors'>
                              <CalendarPlus className='w-4 h-4 text-blue-600' />
                            </div>
                            <span className='font-medium'>
                              Lịch hẹn của tôi
                            </span>
                          </Link>

                          <Link
                            to='/my-donation-history'
                            className='flex items-center px-5 py-3 text-sm text-gray-800 hover:bg-white/50 hover:text-purple-700 transition-all duration-200 group'
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <div className='w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors'>
                              <Heart className='w-4 h-4 text-red-600' />
                            </div>
                            <span className='font-medium'>
                              Lịch sử hiến máu
                            </span>
                          </Link>

                          <div className='border-t border-white/30 mt-2 pt-2'>
                            <button
                              onClick={handleLogout}
                              className='flex items-center w-full px-5 py-3 text-sm text-gray-800 hover:bg-red-50/80 hover:text-red-700 transition-all duration-200 group'
                            >
                              <div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-100 transition-colors'>
                                <LogOut className='w-4 h-4 text-gray-600 group-hover:text-red-600' />
                              </div>
                              <span className='font-medium'>Đăng xuất</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex items-center space-x-3 ml-4'>
                <Link
                  to='/login'
                  className='text-gray-700 hover:text-red-500 hover:bg-white/30 transition-all duration-300 px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm border border-transparent hover:border-white/40 hover:shadow-md group'
                >
                  <span className='drop-shadow-sm'>Đăng nhập</span>
                </Link>
                <Link
                  to='/register'
                  className='bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm border border-red-400/30 group'
                >
                  <span className='drop-shadow-sm group-hover:drop-shadow-md'>
                    Đăng ký
                  </span>
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
              {isMobileMenuOpen ? (
                <X className='block h-6 w-6' />
              ) : (
                <Menu className='block h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* {isMobileMenuOpen && (
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
      )} */}
    </nav>
  );
};

export default Navbar;
