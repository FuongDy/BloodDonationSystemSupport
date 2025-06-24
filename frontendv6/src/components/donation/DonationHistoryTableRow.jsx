// src/components/donation/DonationHistoryTableRow.jsx
import React from 'react';
import { Calendar, MapPin, Droplets, FileText, Building2, Award, Activity } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import DateTimeDisplay from '../common/DateTimeDisplay';
import { HOSPITAL_INFO } from '../../utils/constants';

const DonationHistoryTableRow = ({ process, statusConfig }) => {
  const StatusIcon = statusConfig.icon;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Status & Blood Type */}
      <td className="px-6 py-4 whitespace-nowrap">        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
            <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-red-600">
                {process.donor?.bloodType || 'N/A'}
              </span>
              <Droplets className="w-4 h-4 text-red-500 fill-current" />
            </div>
            <StatusBadge status={process.status} />
          </div>
        </div>
      </td>

      {/* Donation Info */}
      <td className="px-6 py-4">
        <div className="max-w-xs">
          {process.note && (
            <p className="text-sm text-gray-700 line-clamp-2 mb-2">
              {process.note}
            </p>
          )}
          {process.collectedVolumeMl && (
            <div className="flex items-center text-sm text-green-600">
              <Droplets className="w-4 h-4 mr-1" />
              <span className="font-semibold">{process.collectedVolumeMl}ml</span>
            </div>
          )}
        </div>
      </td>

      {/* Appointment */}
      <td className="px-6 py-4">
        <div className="space-y-1">
          {process.appointment ? (
            <>
              <div className="flex items-center text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                <DateTimeDisplay date={process.appointment.scheduledDate} />
              </div>              <div className="flex items-center text-sm text-gray-700">
                <Building2 className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                <span className="truncate">{HOSPITAL_INFO.FULL_NAME}</span>
              </div>
              {process.appointment.address && (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate text-xs">{process.appointment.address}</span>
                </div>
              )}
            </>
          ) : (
            <span className="text-sm text-gray-500">Chưa có lịch hẹn</span>
          )}
        </div>
      </td>

      {/* Results */}
      <td className="px-6 py-4">
        <div className="space-y-1">
          {process.status === 'COMPLETED' && process.collectedVolumeMl ? (
            <div className="flex items-center text-sm text-green-600">
              <Award className="w-4 h-4 mr-2" />
              <span>Thành công</span>
            </div>
          ) : process.status === 'CANCELLED' ? (
            <div className="flex items-center text-sm text-red-600">
              <Activity className="w-4 h-4 mr-2" />
              <span>Đã hủy</span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">-</span>
          )}
        </div>
      </td>

      {/* Creation Date */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-700">
          <Calendar className="w-4 h-4 inline mr-1" />
          <DateTimeDisplay date={process.createdAt} />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          ID: {process.id}
        </div>
      </td>
    </tr>
  );
};

export default DonationHistoryTableRow;


