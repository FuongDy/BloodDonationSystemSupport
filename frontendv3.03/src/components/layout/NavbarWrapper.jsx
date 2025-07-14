// src/components/layout/NavbarWrapper.jsx
import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '../../hooks/useAuth';

/**
 * Wrapper component for Navbar that handles auth context errors gracefully
 * This prevents the entire app from crashing if AuthContext is not available
 */
const NavbarWrapper = () => {
  try {
    // Test if AuthContext is available
    useAuth();
    return <Navbar />;
  } catch (error) {
    console.warn('AuthContext not available for Navbar, rendering fallback:', error.message);
    
    // Fallback navbar without auth features
    return (
      <nav className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-xl font-bold text-gray-900">BloodDonation</span>
              </a>
            </div>
            
            {/* Simple navigation */}
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium">
                Trang chủ
              </a>
              <a href="/login" className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700">
                Đăng nhập
              </a>
            </div>
          </div>
        </div>
      </nav>
    );
  }
};

export default NavbarWrapper;
