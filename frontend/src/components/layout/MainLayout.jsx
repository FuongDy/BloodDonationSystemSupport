// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavbarWrapper from './NavbarWrapper';
import Footer from './Footer';

const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className='min-h-screen flex flex-col'>
      <NavbarWrapper />
      <main className='flex-1 pt-16'>
        <Outlet />
      </main>
      {isHomePage && <Footer />}
    </div>
  );
};

export default MainLayout;
