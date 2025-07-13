import React, { useState } from 'react';
import { UserCog, Calendar, Heart, TestTube, ClipboardCheck, Activity } from 'lucide-react';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import DashboardHeader from '../../components/admin/DashboardHeader';
import AdminDonationRequestsPage from './AdminDonationRequestsPage';
import AdminAppointmentManagementPage from './AdminAppointmentManagementPage';
import AdminHealthCheckPage from './AdminHealthCheckPage';
import AdminBloodCollectionPage from './AdminBloodCollectionPage';
import AdminTestResultsPage from './AdminTestResultsPage';
import Tabs from '../../components/common/Tabs';

const TAB_LIST = [
  { key: 'donation-history', label: 'Đơn yêu cầu hiến máu', component: <AdminDonationRequestsPage /> },
  { key: 'appointments', label: 'Cuộc hẹn hiến máu', component: <AdminAppointmentManagementPage /> },
  { key: 'health-checks', label: 'Khám sức khỏe', component: <AdminHealthCheckPage /> },
  { key: 'blood-collection', label: 'Thu thập máu', component: <AdminBloodCollectionPage /> },
  { key: 'test-results', label: 'Kết quả xét nghiệm', component: <AdminTestResultsPage /> },
];

const AdminDonationProcessManagementPage = () => {
  const [activeTab, setActiveTab] = useState(TAB_LIST[0].key);
  const currentTab = TAB_LIST.find(tab => tab.key === activeTab);

  // Mock stats for donation process
  const mockStats = {
    totalRequests: 456,
    appointments: 234,
    healthChecks: 198,
    collections: 167,
    testResults: 152
  };

  return (
    <AdminPageLayout>
      {/* Dashboard Header */}
      <DashboardHeader 
        title="Quy trình hiến máu"
        description="Quản lý toàn bộ quy trình hiến máu từ đăng ký, khám sức khỏe, thu thập máu đến xét nghiệm kết quả."
        variant="donation-process"
        showActivityFeed={false}
        stats={[
          {
            icon: <UserCog className="w-5 h-5 text-purple-300" />,
            value: mockStats.totalRequests,
            label: "Yêu cầu hiến"
          },
          {
            icon: <Calendar className="w-5 h-5 text-blue-300" />,
            value: mockStats.appointments,
            label: "Cuộc hẹn"
          },
          {
            icon: <ClipboardCheck className="w-5 h-5 text-green-300" />,
            value: mockStats.healthChecks,
            label: "Khám sức khỏe"
          },
          {
            icon: <Heart className="w-5 h-5 text-red-300" />,
            value: mockStats.collections,
            label: "Thu thập máu"
          }
        ]}
      />

      <div className="space-y-6">
        <Tabs tabs={TAB_LIST} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-6">
          {currentTab?.component}
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default AdminDonationProcessManagementPage; 