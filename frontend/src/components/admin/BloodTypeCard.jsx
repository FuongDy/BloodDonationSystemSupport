// src/components/admin/BloodTypeCard.jsx
import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

import ActionButtonGroup from '../common/ActionButtonGroup';

const BloodTypeCard = ({ bloodType, onEdit, onDelete, canEdit = false }) => {
  const handleDelete = () => {
    const displayName = `${bloodType.bloodGroup} - ${bloodType.componentType}`;
    onDelete(bloodType.id, displayName);
  };

  const actions = [];

  if (canEdit) {
    actions.push(
      {
        label: 'Sửa',
        icon: Edit3,
        variant: 'outline',
        size: 'sm',
        onClick: () => onEdit(bloodType),
      },
      {
        label: 'Xóa',
        icon: Trash2,
        variant: 'danger-outline',
        size: 'sm',
        onClick: handleDelete,
      }
    );
  }

  return (
    <div className='flex flex-col md:flex-row items-start md:items-center justify-between p-3 gap-4 hover:bg-slate-50/50 rounded-lg border-b border-slate-100 last:border-b-0'>
      <div className='flex-grow'>
        <p className='text-base font-semibold text-slate-900'>
          {bloodType.componentType}
        </p>
        <p className='text-sm text-slate-600 italic mt-1'>
          {bloodType.description || 'Không có mô tả.'}
        </p>
      </div>
      <div className='flex items-center space-x-3 flex-shrink-0 self-end md:self-center'>
        {canEdit ? (
          <ActionButtonGroup actions={actions} />
        ) : (
          <span className='text-sm text-slate-500'>Không có quyền</span>
        )}
      </div>
    </div>
  );
};

export default BloodTypeCard;
