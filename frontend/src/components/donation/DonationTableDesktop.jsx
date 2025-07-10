// src/components/donation/DonationTableDesktop.jsx
import React from 'react';
import {
  Calendar,
  MapPin,
  Award,
  Activity,
  Droplets,
  Building2,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { getDonationStatusConfig } from './DonationStatusConfig';
import { formatDateTime } from '../../utils/formatters';
import { HOSPITAL_INFO } from '../../utils/constants';
import { getProcessBloodType } from '../../utils/bloodTypeUtils';

const DonationTableDesktop = ({ donationProcesses, user }) => {
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
                        <div className='flex items-center space-x-2'>
                          <span className='text-xl font-bold text-red-600'>
                            {getProcessBloodType(process, user)}
                          </span>
                          <Droplets className='w-4 h-4 text-red-500 fill-current' />
                        </div>
                        <StatusBadge 
                          status={process.status || 'PENDING_APPROVAL'} 
                          type="donation" 
                        />
                      </div>
                    </div>
                  </td>

                  {/* Donation Info */}
                  <td className='px-6 py-4'>
                    <div className='max-w-xs'>
                      {process.note && (
                        <p className='text-sm text-gray-700 line-clamp-2 mb-2'>
                          {process.note}
                        </p>
                      )}
                      {process.collectedVolumeMl && (
                        <div className='flex items-center text-sm text-green-600'>
                          <Droplets className='w-4 h-4 mr-1' />
                          <span className='font-semibold'>
                            {process.collectedVolumeMl}ml
                          </span>
                        </div>
                      )}
                    </div>
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
