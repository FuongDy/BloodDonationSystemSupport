import React from 'react';
import { UserCog, Calendar, Heart, TestTube, ClipboardCheck, Activity } from 'lucide-react';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import DashboardHeader from '../../components/admin/DashboardHeader';
import AdminDonationRequestsPage from './AdminDonationRequestsPage';
import AdminAppointmentManagementPage from './AdminAppointmentManagementPage';
import AdminHealthCheckPage from './AdminHealthCheckPage';
import AdminBloodCollectionPage from './AdminBloodCollectionPage';
import AdminTestResultsPage from './AdminTestResultsPage';
import Tabs from '../../components/common/Tabs';
import { DonationProcessProvider, useDonationProcess } from '../../contexts/DonationProcessContext';

const DonationProcessContent = () => {
  const { activeTab, setActiveTab } = useDonationProcess();

  const TAB_LIST = [
    { key: 'donation-history', label: 'Đơn yêu cầu hiến máu', component: <AdminDonationRequestsPage /> },
    { key: 'appointments', label: 'Cuộc hẹn hiến máu', component: <AdminAppointmentManagementPage /> },
    { key: 'health-checks', label: 'Khám sức khỏe', component: <AdminHealthCheckPage /> },
    { key: 'blood-collection', label: 'Thu thập máu', component: <AdminBloodCollectionPage /> },
    { key: 'test-results', label: 'Kết quả xét nghiệm', component: <AdminTestResultsPage /> },
  ];

  const currentTab = TAB_LIST.find(tab => tab.key === activeTab);

  return (
    <AdminPageLayout>
      {/* Dashboard Header */}
      <DashboardHeader 
        title="Quy trình hiến máu"
        description="Quản lý toàn bộ quy trình hiến máu từ đăng ký, khám sức khỏe, thu thập máu đến xét nghiệm kết quả."
        variant="donation-process"
        showActivityFeed={false}
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

const AdminDonationProcessManagementPage = () => {
  return (
    <DonationProcessProvider>
      <DonationProcessContent />
    </DonationProcessProvider>
  );
};

export default AdminDonationProcessManagementPage; 