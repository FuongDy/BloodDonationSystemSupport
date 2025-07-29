// src/components/emergency/EmergencyRequestCard.jsx
import { AlertTriangle, Bed, Clock } from 'lucide-react';
import { getBloodCompatibilityInfo } from '../../utils/bloodCompatibility';
import { HOSPITAL_INFO } from '../../utils/constants';
import PledgeButton from '../blood/PledgeButton';
import DateTimeDisplay from '../common/DateTimeDisplay';
import UrgencyBadge from '../common/UrgencyBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const EmergencyRequestCard = ({ request, onPledgeSuccess }) => {
  const pledgeCount = request.pledgeCount || request.pledges?.length || 0;
  const requiredPledges = (request.quantityInUnits || 1) ;
  const progressPercentage = Math.min(
    (pledgeCount / requiredPledges) * 100,
    100
  );

  // Lấy thông tin nhóm máu và tương thích
  const recipientBloodType = request.bloodType?.bloodGroup || request.bloodType;
  const compatibilityInfo = getBloodCompatibilityInfo(recipientBloodType);

  return (
    <Card className='hover:shadow-lg transition-shadow border-l-4 border-l-red-500'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg text-red-600 flex items-center'>
            <AlertTriangle className='w-5 h-5 mr-2' />
            Cần máu #{request.id}
          </CardTitle>
          <UrgencyBadge urgency={request.urgency} />
        </div>
        
        {/* Hiển thị các nhóm máu có thể hiến */}
        {compatibilityInfo.compatibleDonors.length > 0 && (
          <div className='mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200'>
            <div className='flex flex-wrap gap-1'>
              {compatibilityInfo.compatibleDonors.map((bloodType, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-2xs font-medium ${
                    bloodType === recipientBloodType
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : bloodType === 'O-'
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}
                  title={
                    bloodType === recipientBloodType
                      ? 'Nhóm máu trùng khớp'
                      : bloodType === 'O-'
                      ? 'Nhóm máu vạn năng'
                      : 'Nhóm máu tương thích'
                  }
                >
                  {bloodType}
                  {bloodType === recipientBloodType && ' ✓'}
                  {bloodType === 'O-' && ' 🌟'}
                </span>
              ))}
            </div>
            <p className='text-2xs text-blue-600 mt-2'>
              {compatibilityInfo.isUniversalRecipient 
                ? '🎯 Người nhận vạn năng - có thể nhận từ tất cả nhóm máu'
                : compatibilityInfo.hasUniversalDonor
                ? '🌟 O- ( Nhóm máu vạn năng )'
                : `💡 Có ${compatibilityInfo.donorCount} nhóm máu tương thích`
              }
            </p>
          </div>
        )}
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
          {/* Thông tin vị trí */}
          {(request.roomNumber || request.bedNumber) && (
            <div className='flex justify-between'>
              <span className='text-sm font-medium text-gray-600 flex items-center'>
                <Bed className='w-4 h-4 mr-1' />
                Số phòng - giường:
              </span>
              <span className=' bg-green-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium'>
                {request.roomNumber && `P.${request.roomNumber}`}
                {request.roomNumber && request.bedNumber && ' - '}
                {request.bedNumber && `G.${request.bedNumber}`}
              </span>
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
            {HOSPITAL_INFO.NAME} trong vòng 24 giờ để hoàn thành hiến máu.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyRequestCard;
