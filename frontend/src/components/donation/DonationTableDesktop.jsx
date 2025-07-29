// src/components/donation/DonationTableDesktop.jsx
import {
  Activity,
  Award,
  Building2,
  Calendar,
  Droplets,
  MapPin,
} from 'lucide-react';
import { getProcessBloodType } from '../../utils/bloodTypeUtils';
import { HOSPITAL_INFO } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatters';
import DonationTypeBadge from '../common/DonationTypeBadge';
import StatusBadge from '../common/StatusBadge';
import { getDonationStatusConfig } from './DonationStatusConfig';

const BloodTypeDisplay = ({ process, user }) => {
  const bloodType = getProcessBloodType(process, user);
  const isUndetermined = bloodType === 'Chưa xác định nhóm máu';
  
  return (
    <div className='flex items-center space-x-2'>
      <span className={`text-lg font-bold ${isUndetermined ? 'text-gray-500' : 'text-red-600'}`}>
        {bloodType}
      </span>
      {!isUndetermined && (
        <Droplets className='w-4 h-4 text-red-500 fill-current' />
      )}
    </div>
  );
};

const DonationInfo = ({ process }) => {
  const hasNote = process.note && process.note.trim();
  const hasVolume = process.collectedVolumeMl && process.collectedVolumeMl > 0;
  
  return (
    <div className='max-w-xs'>
      {hasNote && (
        <p className='text-sm text-gray-700 line-clamp-2 mb-2'>
          {process.note}
        </p>
      )}
      {hasVolume && (
        <div className='flex items-center text-sm text-green-600'>
          <Droplets className='w-4 h-4 mr-1' />
          <span className='font-semibold'>
            {process.collectedVolumeMl}ml
          </span>
        </div>
      )}
      {!hasNote && !hasVolume && (
        <span className='text-sm text-gray-500 italic'>
          Chưa có thông tin
        </span>
      )}
    </div>
  );
};

const DonationTableDesktop = ({ donationProcesses, user, onViewDetails }) => {
  return (
    <div className='hidden lg:block'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50 border-b border-gray-200'>
            <tr>
              <th className='px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider'>
                Trạng thái & Nhóm máu
              </th>
              <th className='px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider'>
                Loại hiến máu
              </th>
              <th className='px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider'>
                Thông tin hiến máu
              </th>
              <th className='px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider'>
                Lịch hẹn
              </th>
              <th className='px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider'>
                Kết quả
              </th>
              <th className='px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider'>
                Ngày tạo đơn đăng ký
              </th>
              <th className='px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider'>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {donationProcesses.map(process => {
              const statusConfig = getDonationStatusConfig(process.status);
              const StatusIcon = statusConfig.icon;

              return (
                <tr
                  key={process.id}
                  className='hover:bg-gray-50 transition-colors'
                >
                  {/* Status & Blood Type */}
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center space-x-3'>
                      <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                        <StatusIcon
                          className={`w-5 h-5 ${statusConfig.color}`}
                        />
                      </div>
                      <div>
                        <BloodTypeDisplay process={process} user={user} />
                        <StatusBadge 
                          status={process.status || 'PENDING_APPROVAL'} 
                          type="donation" 
                        />
                      </div>
                    </div>
                  </td>

                  {/* Donation Type */}
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <DonationTypeBadge 
                      donationType={process.donationType || 'STANDARD'} 
                      size="normal"
                    />
                  </td>

                  {/* Donation Info */}
                  <td className='px-6 py-4'>
                    <DonationInfo process={process} />
                  </td>

                  {/* Appointment */}
                  <td className='px-6 py-4'>
                    <div className='space-y-1'>
                      {process.appointment ? (
                        <>
                          <div className='flex items-center text-sm text-gray-700'>
                            <Calendar className='w-4 h-4 text-blue-600 mr-2' />
                            <span>
                              {formatDateTime(process.appointment.scheduledDate)}
                            </span>
                          </div>
                          <div className='flex items-center text-sm text-gray-700'>
                            <Building2 className='w-4 h-4 text-green-600 mr-2 flex-shrink-0' />
                            <span className='truncate'>
                              {HOSPITAL_INFO.FULL_NAME}
                            </span>
                          </div>
                          {process.appointment.address && (
                            <div className='flex items-center text-sm text-gray-500'>
                              <MapPin className='w-4 h-4 mr-2 flex-shrink-0' />
                              <span className='truncate text-xs'>
                                {process.appointment.address}
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className='text-sm text-gray-500'>
                          Chưa có lịch hẹn
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Results */}
                  <td className='px-6 py-4'>
                    <div className='space-y-1'>
                      {process.status === 'COMPLETED' &&
                      process.collectedVolumeMl ? (
                        <div className='flex items-center text-sm text-green-600'>
                          <Award className='w-4 h-4 mr-2' />
                          <span>Thành công</span>
                        </div>
                      ) : process.status === 'CANCELLED' ? (
                        <div className='flex items-center text-sm text-red-600'>
                          <Activity className='w-4 h-4 mr-2' />
                          <span>Đã hủy</span>
                        </div>
                      ) : (
                        <span className='text-sm text-gray-500'>-</span>
                      )}
                    </div>
                  </td>

                  {/* Creation Date */}
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-700'>
                      <Calendar className='w-4 h-4 inline mr-1' />
                      {formatDateTime(process.createdAt)}
                    </div>
                    <div className='text-xs text-gray-500 mt-1'>
                      ID: {process.id}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <button
                      onClick={() => onViewDetails && onViewDetails(process)}
                      className='inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
                    >
                      <Activity className='w-4 h-4 mr-1' />
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationTableDesktop;
