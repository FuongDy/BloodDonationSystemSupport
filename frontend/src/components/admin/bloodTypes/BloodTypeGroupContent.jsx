// src/components/admin/bloodTypes/BloodTypeGroupContent.jsx
import React from 'react';
import BloodTypeCard from '../BloodTypeCard';
import AdminEmptyState from '../AdminEmptyState';

const BloodTypeGroupContent = ({ 
  bloodTypes, 
  onEdit, 
  onDelete, 
  canEdit,
  groupName 
}) => {
  if (!bloodTypes || bloodTypes.length === 0) {
    return (
      <AdminEmptyState
        title='Không có dữ liệu'
        description={`Không có loại máu nào trong nhóm ${groupName}.`}
      />
    );
  }

  return (
    <div className='divide-y divide-slate-100'>
      {bloodTypes.map(item => (
        <BloodTypeCard
          key={item.id}
          bloodType={item}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
};

export default BloodTypeGroupContent;
