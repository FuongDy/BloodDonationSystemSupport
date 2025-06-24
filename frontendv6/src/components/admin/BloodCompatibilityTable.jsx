// src/components/admin/BloodCompatibilityTable.jsx
import React from 'react';
import { Edit3, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Button from '../common/Button';

const BloodCompatibilityTable = ({ 
  rules, 
  onEdit, 
  onDelete, 
  formatBloodTypeDisplay,
  user 
}) => {
  return (    <div className='bg-white shadow-md rounded-lg overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'><thead className='bg-gray-50'><tr>{['ID','Loại máu cho','Loại máu nhận','Tương thích','Ghi chú','Hành động'].map(header => (
              <th
                key={header}
                scope='col'
                className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                {header}
              </th>
            ))}</tr></thead><tbody className='bg-white divide-y divide-gray-200'>
          {rules.map(rule => (
            <tr key={rule.id} className='hover:bg-gray-50'><td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
                {rule.id}
              </td><td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700'>
                {formatBloodTypeDisplay(rule.donorBloodType)}
              </td><td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700'>
                {formatBloodTypeDisplay(rule.recipientBloodType)}
              </td><td className='px-4 py-4 whitespace-nowrap text-sm text-center'>
                {rule.isCompatible ? (
                  <CheckCircle
                    className='text-green-500 mx-auto'
                    size={20}
                  />
                ) : (
                  <XCircle className='text-red-500 mx-auto' size={20} />                )}
              </td><td className='px-4 py-4 text-sm text-gray-500 max-w-xs truncate'>
                {rule.notes || '-'}
              </td><td className='px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
                {user?.role === 'Admin' && (
                  <>
                    <Button
                      onClick={() => onEdit(rule)}
                      variant='outline'
                      size='sm'
                    >
                      <Edit3 size={16} className='mr-1' />
                      Sửa
                    </Button>
                    <Button
                      onClick={() => onDelete(rule.id)}
                      variant='danger'
                      size='sm'
                    >
                      <Trash2 size={16} className='mr-1' />
                      Xóa
                    </Button>
                  </>                )}
              </td></tr>))}
        </tbody></table>
    </div>
  );
};

export default BloodCompatibilityTable;

