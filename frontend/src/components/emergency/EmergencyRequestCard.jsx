// src/components/emergency/EmergencyRequestCard.jsx
import React from 'react';
import { AlertTriangle, Clock, Bed } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import UrgencyBadge from '../common/UrgencyBadge';
import DateTimeDisplay from '../common/DateTimeDisplay';
import PledgeButton from '../blood/PledgeButton';
import { HOSPITAL_INFO } from '../../utils/constants';

const EmergencyRequestCard = ({ request, onPledgeSuccess }) => {
  const pledgeCount = request.pledgeCount || request.pledges?.length || 0;
  const requiredPledges = (request.quantityInUnits || 1) + 1; // N+1 rule
  const progressPercentage = Math.min(
    (pledgeCount / requiredPledges) * 100,
    100
  );

  return (
    <Card className='hover:shadow-lg transition-shadow border-l-4 border-l-red-500'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg text-red-600 flex items-center'>
            <AlertTriangle className='w-5 h-5 mr-2' />
            Cần máu {request.bloodType?.bloodGroup}
          </CardTitle>
          <UrgencyBadge urgency={request.urgency} />
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Patient and Hospital Info */}
        <div className='space-y-2'>
          <div className='flex justify-between'>
            <span className='text-sm font-medium text-gray-600'>
              Bệnh nhân:
            </span>
            <span className='text-sm text-gray-900 font-medium'>
              {request.patientName}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm font-medium text-gray-600'>
              Bệnh viện:
            </span>
            <span className='text-sm text-gray-900'>{request.hospital}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm font-medium text-gray-600'>Số lượng:</span>{' '}
            <span className='text-sm font-semibold text-red-600'>
              {request.quantityInUnits} đơn vị
            </span>
          </div>
          {/* Thông tin phòng và giường */}
          {(request.roomNumber || request.bedNumber) && (
            <div className='pt-2 border-t border-gray-100'>
              <div className='grid grid-cols-2 gap-2'>
                {request.roomNumber && (
                  <div className='flex justify-between'>
                    <span className='text-sm font-medium text-gray-600'>Phòng:</span>
                    <span className='text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium'>
                      Phòng {request.roomNumber}
                    </span>
                  </div>
                )}
                {request.bedNumber && (
                  <div className='flex justify-between'>
                    <span className='text-sm font-medium text-gray-600'>Giường:</span>
                    <span className='text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'>
                      Giường {request.bedNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Tiến độ cam kết:</span>
            <span className='font-medium'>
              {pledgeCount}/{requiredPledges} người
            </span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-red-500 h-2 rounded-full transition-all duration-300'
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Time info */}
        <div className='flex items-center text-sm text-gray-500'>
          <Clock className='w-4 h-4 mr-1' />
          <span>Tạo lúc: </span>
          <DateTimeDisplay date={request.createdAt} format='relative' />
        </div>

        {/* Pledge Button */}
        <div className='pt-2'>
          <PledgeButton request={request} onPledgeSuccess={onPledgeSuccess} />
        </div>

        {/* Instructions */}
        <div className='mt-4 p-3 bg-blue-50 rounded-md'>
          <p className='text-xs text-blue-700'>
            💡 <strong>Sau khi cam kết:</strong> Vui lòng đến{' '}
            {HOSPITAL_INFO.NAME} trong vòng 24-48 giờ để hoàn thành hiến máu.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyRequestCard;
