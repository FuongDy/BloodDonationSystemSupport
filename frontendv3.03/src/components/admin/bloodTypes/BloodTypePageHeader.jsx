// src/components/admin/bloodTypes/BloodTypePageHeader.jsx
import { PlusCircle } from 'lucide-react';

const BloodTypePageHeader = ({ onAddNew, isAdmin, isLoading }) => {
  const headerActions = [
    ...(isAdmin
      ? [
          {
            label: 'Thêm mới',
            icon: PlusCircle,
            variant: 'primary',
            onClick: onAddNew,
            disabled: isLoading,
          },
        ]
      : []),
  ];

  return { headerActions };
};

export default BloodTypePageHeader;
