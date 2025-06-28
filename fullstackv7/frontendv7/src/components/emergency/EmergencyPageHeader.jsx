// src/components/emergency/EmergencyPageHeader.jsx
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import PageHeader from '../common/PageHeader';

const EmergencyPageHeader = ({ onRefresh }) => {
  const headerActions = [
    {
      label: 'Làm mới',
      icon: RefreshCw,
      onClick: onRefresh,
      variant: 'outline',
    },
  ];

  return (
    <PageHeader
      title='Yêu cầu máu khẩn cấp'
      description='Những yêu cầu cần hỗ trợ gấp từ các bệnh viện. Hãy cam kết hiến máu để cứu người!'
      icon={AlertTriangle}
      actions={headerActions}
    />
  );
};

export default EmergencyPageHeader;
