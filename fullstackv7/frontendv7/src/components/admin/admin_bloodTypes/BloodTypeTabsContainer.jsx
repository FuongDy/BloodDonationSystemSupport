// src/components/admin/bloodTypes/BloodTypeTabsContainer.jsx
import React from 'react';
import TabNavigation from '../../common/TabNavigation';
import BloodTypeGroupContent from './BloodTypeGroupContent';
import AdminContentWrapper from '../AdminContentWrapper';
import AdminEmptyState from '../AdminEmptyState';

const BloodTypeTabsContainer = ({ 
  groupedBloodTypes, 
  activeTab, 
  onTabChange, 
  onEdit, 
  onDelete, 
  canEdit,
  isLoading 
}) => {
  const tabs = Object.keys(groupedBloodTypes)
    .sort()
    .map(groupName => ({
      key: groupName,
      label: groupName,
      icon: null,
    }));

  if (tabs.length === 0) {
    return (
      <AdminContentWrapper
        isLoading={isLoading}
        isEmpty={true}
        emptyStateComponent={
          <AdminEmptyState
            title='Không có dữ liệu'
            description='Không có loại máu nào phù hợp với tìm kiếm của bạn.'
          />
        }
      />
    );
  }

  return (
    <div className='bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200'>
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        variant='underline'
      />

      <div className='p-2 md:p-4'>
        {activeTab && groupedBloodTypes[activeTab] ? (
          <BloodTypeGroupContent
            bloodTypes={groupedBloodTypes[activeTab]}
            onEdit={onEdit}
            onDelete={onDelete}
            canEdit={canEdit}
            groupName={activeTab}
          />
        ) : (
          <AdminEmptyState
            title='Không có dữ liệu'
            description='Không có loại máu nào phù hợp với tìm kiếm của bạn.'
          />
        )}
      </div>
    </div>
  );
};

export default BloodTypeTabsContainer;
