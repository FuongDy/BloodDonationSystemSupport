// src/components/blood/BloodRequestCard.jsx
import React from 'react';
import { MapPin, Clock, User, Droplet, AlertTriangle } from 'lucide-react';

import PledgeButton from './PledgeButton';
import StatusBadge from '../common/StatusBadge';

const BloodRequestCard = ({
  request,
  onPledgeSuccess,
  showPledgeButton = true,
}) => {
  const _formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'EMERGENCY':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'URGENT':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'NORMAL':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = priority => {
    switch (priority) {
      case 'EMERGENCY':
        return 'Khẩn cấp';
      case 'URGENT':
        return 'Gấp';
      case 'NORMAL':
        return 'Bình thường';
      default:
        return priority;
    }
  };

  const isEmergency = request.priority === 'EMERGENCY';
  const isUrgent = request.priority === 'URGENT';

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
        isEmergency
          ? 'border-red-500'
          : isUrgent
            ? 'border-orange-500'
            : 'border-blue-500'
      } hover:shadow-lg transition-shadow`}
    >
      <div className='p-6'>
        {/* Header */}
        <div className='flex justify-between items-start mb-4'>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-2'>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}
              >
                {(isEmergency || isUrgent) && (
                  <AlertTriangle className='w-3 h-3 mr-1' />
                )}
                {getPriorityText(request.priority)}
              </span>
              <StatusBadge status={request.status} />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-1'>
              Cần nhóm máu: {request.bloodTypeRequired}
            </h3>
            {request.description && (
              <p className='text-gray-600 text-sm mb-3'>
                {request.description}
              </p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className='space-y-3 mb-4'>
          {request.quantityNeeded && (
            <div className='flex items-center text-sm text-gray-600'>
              <Droplet className='w-4 h-4 mr-2 text-red-500' />
              <span>
                Số lượng cần: <strong>{request.quantityNeeded} đơn vị</strong>
              </span>
            </div>
          )}

          {request.requesterName && (
            <div className='flex items-center text-sm text-gray-600'>
              <User className='w-4 h-4 mr-2' />
              <span>Người yêu cầu: {request.requesterName}</span>
            </div>
          )}

          {request.location && (
            <div className='flex items-center text-sm text-gray-600'>
              <MapPin className='w-4 h-4 mr-2' />
              <span>Địa điểm: {request.location}</span>
            </div>
          )}

          {request.neededBy && (
            <div className='flex items-center text-sm text-gray-600'>
              <Clock className='w-4 h-4 mr-2' />
              <span>Thời hạn: {_formatDate(request.neededBy)}</span>
            </div>
          )}

          {request.createdAt && (
            <div className='flex items-center text-sm text-gray-500'>
              <Clock className='w-4 h-4 mr-2' />
              <span>Đăng lúc: {_formatDate(request.createdAt)}</span>
            </div>
          )}
        </div>

        {/* Contact Information */}
        {(request.contactPhone || request.contactEmail) && (
          <div className='bg-gray-50 rounded-lg p-3 mb-4'>
            <h4 className='text-sm font-medium text-gray-900 mb-2'>
              Thông tin liên hệ:
            </h4>
            <div className='space-y-1'>
              {request.contactPhone && (
                <p className='text-sm text-gray-600'>
                  Điện thoại:{' '}
                  <a
                    href={`tel:${request.contactPhone}`}
                    className='text-blue-600 hover:underline'
                  >
                    {request.contactPhone}
                  </a>
                </p>
              )}
              {request.contactEmail && (
                <p className='text-sm text-gray-600'>
                  Email:{' '}
                  <a
                    href={`mailto:${request.contactEmail}`}
                    className='text-blue-600 hover:underline'
                  >
                    {request.contactEmail}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Pledge section */}
        {showPledgeButton && request.status === 'ACTIVE' && (
          <PledgeButton request={request} onPledgeSuccess={onPledgeSuccess} />
        )}
      </div>
    </div>
  );
};

export default BloodRequestCard;


