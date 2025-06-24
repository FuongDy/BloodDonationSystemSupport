// src/components/blood/PledgeButton.jsx
import React, { useState } from 'react';
import { Heart, Users } from 'lucide-react';
import toast from 'react-hot-toast';

import bloodRequestService from '../../services/bloodRequestService';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import useAuthRedirect from '../../hooks/useAuthRedirect';

const PledgeButton = ({ request, onPledgeSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { requireAuth } = useAuthRedirect();

  // Check if user has already pledged
  const hasUserPledged = request.pledges?.some(
    pledge => pledge.donor?.id === user?.id
  );

  const handlePledge = async () => {
    // Use requireAuth to handle authentication check and redirect
    const canProceed = requireAuth(null, 'Vui lòng đăng nhập để đăng ký hiến máu.');
    if (!canProceed) return;

    if (hasUserPledged) {
      toast.error('Bạn đã đăng ký hiến máu cho yêu cầu này rồi.');
      return;
    }

    setIsLoading(true);    try {
      await bloodRequestService.pledgeForRequest(request.id);
      toast.success(
        'Đăng ký hiến máu thành công! Vui lòng đến bệnh viện trong 24-48 giờ để hoàn thành hiến máu.',
        { duration: 6000 }
      );
      onPledgeSuccess?.();
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('Bạn đã đăng ký hiến máu cho yêu cầu này rồi.');
      } else {
        toast.error('Không thể đăng ký hiến máu. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const pledgeCount = request.pledgeCount || request.pledges?.length || 0;
  const requiredPledges = (request.quantityInUnits || request.quantityNeeded || 1) + 1; // N+1 rule
  const isUrgent = request.urgency === 'URGENT';
  const isCritical = request.urgency === 'CRITICAL';

  return (
    <div className='space-y-3'>      {/* Pledge count display */}
      <div className='flex items-center justify-between text-sm'>
        <div className='flex items-center text-gray-600'>
          <Users className='w-4 h-4 mr-1' />
          <span>{pledgeCount}/{requiredPledges} người đã đăng ký hiến</span>
        </div>
        <div className='text-gray-500'>
          Cần: {request.quantityInUnits || request.quantityNeeded || 1} đơn vị
        </div>
      </div>

      {/* Pledge button */}
      <Button
        onClick={handlePledge}
        disabled={isLoading || hasUserPledged || !isAuthenticated}        variant={
          hasUserPledged
            ? 'outline'
            : isCritical
              ? 'danger'
              : isUrgent
                ? 'warning'
                : 'primary'
        }
        className='w-full flex items-center justify-center'
      >
        <Heart
          className={`w-4 h-4 mr-2 ${hasUserPledged ? 'fill-current' : ''}`}
        />
        {isLoading
          ? 'Đang xử lý...'
          : hasUserPledged
            ? 'Đã đăng ký hiến máu'
            : 'Đăng ký hiến máu'}
      </Button>

      {!isAuthenticated && (
        <p className='text-xs text-gray-500 text-center'>
          Vui lòng đăng nhập để đăng ký hiến máu
        </p>
      )}

      {hasUserPledged && (
        <p className='text-xs text-green-600 text-center'>
          ✓ Cảm ơn bạn đã đăng ký hiến máu cho yêu cầu này
        </p>
      )}
    </div>
  );
};

export default PledgeButton;

