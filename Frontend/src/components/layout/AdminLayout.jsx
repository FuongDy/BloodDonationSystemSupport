// src/components/layout/AdminLayout.jsx
import React, { useState } from 'react'; // Import useState
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Manage sidebar state here

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1 pt-16">
                <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> {/* Pass state and toggle function */}
                <main 
                    className="flex-1 p-6 bg-gray-50 transition-all duration-300 ease-in-out" 
                    style={{ marginLeft: isSidebarOpen ? '16rem' : '5rem' }} // Dynamic margin: w-64 is 16rem, w-20 is 5rem
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;