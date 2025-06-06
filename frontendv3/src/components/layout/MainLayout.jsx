import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; //
import Footer from './Footer'; //

/**
 * MainLayout là bố cục chính cho các trang không phải trang quản trị.
 * Bao gồm Navbar, Footer và phần nội dung động được render thông qua <Outlet>.
 */
const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            {/* Thêm pt-16 (chiều cao của Navbar) để nội dung không bị Navbar che */}
            <main className="flex-grow pt-16">
                <Outlet /> {/* Các component con của route sẽ được render ở đây */}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;