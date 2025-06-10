// src/pages/admin/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Users, Droplets, Clock, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import DashboardWidget from '../../components/admin/DashboardWidget';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import apiClient from '../../services/apiClient'; // Sử dụng apiClient trực tiếp cho đơn giản
import toast from 'react-hot-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get('/admin/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                toast.error("Không thể tải dữ liệu dashboard.");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
    }

    if (!stats) {
        return <div className="text-center p-8">Không có dữ liệu để hiển thị.</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h1>

            {/* Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardWidget Icon={Users} title="Tổng Người Dùng" value={stats.totalUsers} colorClass="bg-blue-500" />
                <DashboardWidget Icon={Droplets} title="Đơn Vị Máu Trong Kho" value={stats.totalBloodUnits} colorClass="bg-red-500" />
                <DashboardWidget Icon={Clock} title="Yêu Cầu Đang Chờ" value={stats.pendingRequests} colorClass="bg-yellow-500" />
            </div>

            {/* Charts */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <PieChartIcon size={20} className="mr-2" />
                    Thống Kê Kho Máu
                </h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={stats.inventoryStats}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {stats.inventoryStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name) => [`${value} đơn vị`, name]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;