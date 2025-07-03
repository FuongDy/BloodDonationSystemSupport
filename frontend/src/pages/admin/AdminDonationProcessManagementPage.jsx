import React, { useState } from 'react';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
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

  return (
    <AdminPageLayout title="Quy trình hiến máu" description="Quản lý toàn bộ quy trình hiến máu theo từng bước">
      <Tabs tabs={TAB_LIST} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-6">
        {currentTab?.component}
      </div>
    </AdminPageLayout>
  );
};

export default AdminDonationProcessManagementPage; 