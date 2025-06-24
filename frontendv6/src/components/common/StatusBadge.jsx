import React from 'react';
import { Badge } from '../ui/Badge';
import {
  STATUS_COLORS,
  USER_STATUSES,
  DONATION_STATUS,
  REQUEST_STATUS,
  INVENTORY_STATUS,
} from '../../utils/constants';

const StatusBadge = ({ status, type = 'user', className, ...props }) => {
  const getStatusText = (status, type) => {
    switch (type) {      case 'user':
        switch (status) {
          case USER_STATUSES.ACTIVE:
            return 'Hoạt động';
          case USER_STATUSES.SUSPENDED:
            return 'Tạm khóa';
          case USER_STATUSES.DEACTIVATED:
            return 'Đã vô hiệu hóa';
          default:
            return status;
        }

      case 'donation':
        switch (status) {
          case DONATION_STATUS.PENDING_APPROVAL:
            return 'Chờ duyệt';
          case DONATION_STATUS.REJECTED:
            return 'Từ chối';
          case DONATION_STATUS.APPOINTMENT_PENDING:
            return 'Chờ lịch hẹn';          case DONATION_STATUS.APPOINTMENT_SCHEDULED:
            return 'Đã lên lịch';
          case DONATION_STATUS.RESCHEDULE_REQUESTED:
            return 'Yêu cầu đổi lịch';
          case DONATION_STATUS.HEALTH_CHECK_PASSED:
            return 'Khám đạt';
          case DONATION_STATUS.HEALTH_CHECK_FAILED:
            return 'Khám không đạt';
          case DONATION_STATUS.BLOOD_COLLECTED:
            return 'Đã lấy máu';
          case DONATION_STATUS.TESTING_PASSED:
            return 'Xét nghiệm đạt';
          case DONATION_STATUS.TESTING_FAILED:
            return 'Xét nghiệm không đạt';
          case DONATION_STATUS.COMPLETED:
            return 'Hoàn thành';
          case DONATION_STATUS.CANCELLED:
            return 'Đã hủy';
          default:
            return status;
        }

      case 'request':        switch (status) {
          case REQUEST_STATUS.PENDING:
            return 'Chờ xử lý';
          case REQUEST_STATUS.FULFILLED:
            return 'Đã hoàn thành';
          case REQUEST_STATUS.CANCELLED:
            return 'Đã hủy';
          default:
            return status;
        }

      case 'inventory':
        switch (status) {
          case INVENTORY_STATUS.AVAILABLE:
            return 'Có sẵn';
          case INVENTORY_STATUS.EXPIRED:
            return 'Hết hạn';
          case INVENTORY_STATUS.USED:
            return 'Đã sử dụng';
          case INVENTORY_STATUS.RESERVED:
            return 'Đã đặt chỗ';
          default:
            return status;
        }

      default:
        return status;
    }
  };

  const variant = STATUS_COLORS[status] || 'default';
  const text = getStatusText(status, type);

  return (
    <Badge variant={variant} className={className} {...props}>
      {text}
    </Badge>
  );
};

export default StatusBadge;

