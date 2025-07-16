// src/components/admin/donationHistory/DonationStatusActions.jsx
import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import Button from '../../common/Button';
import { DONATION_STATUS } from '../../../utils/constants';

const DonationStatusActions = ({ selectedDonation, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!selectedDonation) {
    return null;
  }

  const handleStatusUpdate = async (newStatus) => {
    if (!onStatusUpdate) return;
    
    setIsUpdating(true);
    try {
      await onStatusUpdate(selectedDonation.id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getAvailableActions = () => {
    const actions = [];
    
    switch (selectedDonation.status) {
      case DONATION_STATUS.PENDING:
        actions.push({
          label: 'Phê duyệt',
          status: DONATION_STATUS.APPROVED,
          icon: CheckCircle,
          variant: 'success',
          description: 'Phê duyệt yêu cầu hiến máu'
        });
        actions.push({
          label: 'Từ chối',
          status: DONATION_STATUS.REJECTED,
          icon: XCircle,
          variant: 'danger',
          description: 'Từ chối yêu cầu hiến máu'
        });
        break;
        
      case DONATION_STATUS.APPROVED:
        actions.push({
          label: 'Bắt đầu thu thập',
          status: DONATION_STATUS.IN_PROGRESS,
          icon: Clock,
          variant: 'primary',
          description: 'Chuyển sang trạng thái thu thập máu'
        });
        break;
        
      case DONATION_STATUS.IN_PROGRESS:
        actions.push({
          label: 'Hoàn thành',
          status: DONATION_STATUS.COMPLETED,
          icon: CheckCircle,
          variant: 'success',
          description: 'Đánh dấu đã hoàn thành'
        });
        actions.push({
          label: 'Tạm dừng',
          status: DONATION_STATUS.PAUSED,
          icon: AlertTriangle,
          variant: 'warning',
          description: 'Tạm dừng quá trình'
        });
        break;
        
      case DONATION_STATUS.PAUSED:
        actions.push({
          label: 'Tiếp tục',
          status: DONATION_STATUS.IN_PROGRESS,
          icon: Clock,
          variant: 'primary',
          description: 'Tiếp tục quá trình hiến máu'
        });
        actions.push({
          label: 'Hủy bỏ',
          status: DONATION_STATUS.CANCELLED,
          icon: XCircle,
          variant: 'danger',
          description: 'Hủy bỏ quá trình'
        });
        break;
        
      default:
        // Không có actions cho status completed, cancelled, rejected
        break;
    }
    
    return actions;
  };

  const availableActions = getAvailableActions();

  if (availableActions.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          Không có thao tác nào khả dụng cho trạng thái hiện tại
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Thao tác</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {availableActions.map((action) => {
          const IconComponent = action.icon;
          
          return (
            <div key={action.status} className="space-y-2">
              <Button
                variant={action.variant}
                size="sm"
                onClick={() => handleStatusUpdate(action.status)}
                disabled={isUpdating}
                className="w-full flex items-center justify-center gap-2"
              >
                <IconComponent className="w-4 h-4" />
                {action.label}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                {action.description}
              </p>
            </div>
          );
        })}
      </div>
      
      {isUpdating && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-700 text-center">
            Đang cập nhật trạng thái...
          </p>
        </div>
      )}
    </div>
  );
};

export default DonationStatusActions;
