// src/utils/donationTypeUtils.js
import { AlertTriangle, Clock } from 'lucide-react';

/**
 * Cấu hình hiển thị cho các loại hiến máu
 */
export const DONATION_TYPE_CONFIG = {
  STANDARD: {
    label: 'Hiến máu định kỳ',
    description: 'Hiến máu tình nguyện theo lịch trình',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    badgeColor: 'bg-blue-100 text-blue-800',
    icon: Clock,
    priority: 'normal'
  },
  EMERGENCY: {
    label: 'Hiến máu khẩn cấp',
    description: 'Hiến máu đáp ứng yêu cầu khẩn cấp',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    badgeColor: 'bg-red-100 text-red-800',
    icon: AlertTriangle,
    priority: 'urgent'
  }
};

/**
 * Lấy cấu hình hiển thị cho loại hiến máu
 * @param {string} donationType - Loại hiến máu (STANDARD, EMERGENCY)
 * @returns {object} Cấu hình hiển thị
 */
export const getDonationTypeConfig = (donationType) => {
  return DONATION_TYPE_CONFIG[donationType] || DONATION_TYPE_CONFIG.STANDARD;
};

/**
 * Lấy nhãn tiếng Việt cho loại hiến máu
 * @param {string} donationType - Loại hiến máu
 * @returns {string} Nhãn tiếng Việt
 */
export const getDonationTypeLabel = (donationType) => {
  const config = getDonationTypeConfig(donationType);
  return config.label;
};

/**
 * Kiểm tra xem loại hiến máu có phải là khẩn cấp không
 * @param {string} donationType - Loại hiến máu
 * @returns {boolean} True nếu là khẩn cấp
 */
export const isEmergencyDonation = (donationType) => {
  return donationType === 'EMERGENCY';
};

/**
 * Lấy màu sắc ưu tiên cho loại hiến máu
 * @param {string} donationType - Loại hiến máu
 * @returns {string} Mức độ ưu tiên (normal, urgent)
 */
export const getDonationPriority = (donationType) => {
  const config = getDonationTypeConfig(donationType);
  return config.priority;
};
