// src/components/donation/DonationStatusConfig.js
import { Heart, Calendar, Clock, Activity } from 'lucide-react';

export const getDonationStatusConfig = (status) => {
  switch (status) {
    case 'COMPLETED':
      return {
        icon: Heart,
        color: 'text-green-700',
        bg: 'bg-green-100',
        badge: 'bg-green-500 text-white',
        displayText: 'Hoàn thành',
      };
    case 'SCHEDULED':
      return {
        icon: Calendar,
        color: 'text-blue-700',
        bg: 'bg-blue-100',
        badge: 'bg-blue-500 text-white',
        displayText: 'Đã lên lịch',
      };
    case 'PENDING':
      return {
        icon: Clock,
        color: 'text-yellow-700',
        bg: 'bg-yellow-100',
        badge: 'bg-yellow-500 text-white',
        displayText: 'Chờ xử lý',
      };
    case 'CANCELLED':
      return {
        icon: Activity,
        color: 'text-red-700',
        bg: 'bg-red-100',
        badge: 'bg-red-500 text-white',
        displayText: 'Đã hủy',
      };
    case 'IN_PROGRESS':
      return {
        icon: Activity,
        color: 'text-purple-700',
        bg: 'bg-purple-100',
        badge: 'bg-purple-500 text-white',
        displayText: 'Đang thực hiện',
      };
    default:
      return {
        icon: Clock,
        color: 'text-gray-700',
        bg: 'bg-gray-100',
        badge: 'bg-gray-500 text-white',
        displayText: 'Chưa xác định',
      };
  }
};
