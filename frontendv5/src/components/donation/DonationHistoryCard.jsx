// src/components/donation/DonationHistoryCard.jsx
import React from 'react';
import { Calendar, MapPin, Droplets, Building2, Award, Activity, ChevronRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import DateTimeDisplay from '../common/DateTimeDisplay';
import { HOSPITAL_INFO } from '../../utils/constants';

const DonationHistoryCard = ({ process, statusConfig }) => {
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
            <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-red-600">
                {process.donor?.bloodType || 'N/A'}
              </span>
              <Droplets className="w-4 h-4 text-red-500 fill-current" />
            </div>
            <StatusBadge status={process.status} />
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Appointment Info */}
        {process.appointment && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center text-sm text-gray-700 mb-2">
              <Calendar className="w-4 h-4 text-blue-600 mr-2" />
              <DateTimeDisplay date={process.appointment.scheduledDate} />
            </div>            <div className="flex items-center text-sm text-gray-700 mb-1">
              <Building2 className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
              <span className="truncate">{HOSPITAL_INFO.FULL_NAME}</span>
            </div>
            {process.appointment.address && (
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate text-xs">{process.appointment.address}</span>
              </div>
            )}
          </div>
        )}

        {/* Donation Info */}
        {(process.note || process.collectedVolumeMl) && (
          <div>
            {process.note && (
              <p className="text-sm text-gray-700 mb-2 line-clamp-2">
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
        )}

        {/* Result Status */}
        <div className="flex items-center justify-between text-sm">
          <div>
            {process.status === 'COMPLETED' && process.collectedVolumeMl ? (
              <div className="flex items-center text-green-600">
                <Award className="w-4 h-4 mr-1" />
                <span>Thành công</span>
              </div>
            ) : process.status === 'CANCELLED' ? (
              <div className="flex items-center text-red-600">
                <Activity className="w-4 h-4 mr-1" />
                <span>Đã hủy</span>
              </div>
            ) : (
              <span className="text-gray-500">Đang xử lý</span>
            )}
          </div>
          <div className="text-gray-500 text-xs">
            <DateTimeDisplay date={process.createdAt} format="relative" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationHistoryCard;


