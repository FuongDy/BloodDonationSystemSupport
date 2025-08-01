// src/components/admin/DonationProcessTable.jsx
import { Calendar, MapPin, User } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import DataTable from '../common/DataTable';
import DateTimeDisplay from '../common/DateTimeDisplay';
import DonationTypeBadge from '../common/DonationTypeBadge';
import StatusBadge from '../common/StatusBadge';
import DonationProcessActions from './DonationProcessActions';

const DonationProcessTable = ({ processes, isLoading, onActionClick }) => {
  const columns = [
    {
      key: 'id',
      title: 'ID',
      sortable: true,
      render: value => `#${value}`,
    },
    {
      key: 'donor',
      title: 'Người hiến',
      render: value => (
        <div className='flex items-center space-x-2'>
          <User size={16} className='text-gray-400' />
          <div>
            <div className='font-medium'>{value?.fullName || 'N/A'}</div>
            <div className='text-sm text-gray-500'>{value?.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'donationType',
      title: 'Loại đơn',
      render: value => <DonationTypeBadge donationType={value} size="small" />,
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: value => <StatusBadge status={value} />,
    },
    {
      key: 'createdAt',
      title: 'Ngày đăng ký',
      sortable: true,
      render: value => <DateTimeDisplay dateTime={value} />,
    },
    {
      key: 'appointment',
      title: 'Lịch hẹn',
      render: value =>
        value ? (
          <div className='text-sm'>
            <div className='flex items-center space-x-1'>
              <Calendar size={14} />
              <span>{formatDateTime(value.appointmentDateTime)}</span>
            </div>
            <div className='flex items-center space-x-1 text-gray-500'>
              <MapPin size={14} />
              <span>{value.location}</span>
            </div>
          </div>
        ) : (
          <span className='text-gray-400'>Chưa có</span>
        ),
    },
    {
      key: 'collectedVolumeMl',
      title: 'Thể tích (ml)',
      render: value => (value ? `${value} ml` : '-'),
    },
    {
      key: 'actions',
      title: 'Hành động',
      render: (_, process) => (
        <DonationProcessActions
          process={process}
          onActionClick={onActionClick}
        />
      ),
    },
  ];

  return <DataTable data={processes} columns={columns} loading={isLoading} />;
};

export default DonationProcessTable;
