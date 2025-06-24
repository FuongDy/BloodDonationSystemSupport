// src/pages/admin/AdminDashboardPage.jsx
import React from 'react';
import { Users, Droplet, Clock } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import StatsCard from '../../components/common/StatsCard';

const AdminDashboardPage = () => {
  const { user } = useAuth();

  return (
    <AdminPageLayout
      title="Admin Dashboard"
      description={`Chào mừng trở lại, ${user?.fullName || user?.email}! Đây là trang quản trị của Hệ thống Hỗ trợ Hiến Máu.`}
    >
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <StatsCard
          title="Người dùng"
          value="1,234"
          description="Tổng số người dùng đã đăng ký"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Lượt hiến máu"
          value="567"
          description="Trong tháng này"
          icon={Droplet}
          color="red"
        />
        <StatsCard
          title="Yêu cầu máu"
          value="89"
          description="Đang chờ xử lý"
          icon={Clock}
          color="yellow"
        />
      </div>
    </AdminPageLayout>
  );
};

export default AdminDashboardPage;

