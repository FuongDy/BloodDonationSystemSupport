// src/components/blog/BlogManagementTabs.jsx
import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import TabNavigation from '../common/TabNavigation';

const BlogManagementTabs = ({ 
  activeTab, 
  onTabChange, 
  publishedCount = 0, 
  pendingCount = 0 
}) => {
  const tabs = [
    {
      key: 'published',
      label: `Đã xuất bản (${publishedCount})`,
      icon: CheckCircle,
    },
    {
      key: 'pending',
      label: `Chờ duyệt (${pendingCount})`,
      icon: Clock,
    },
  ];

  return (
    <TabNavigation
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
};

export default BlogManagementTabs;
