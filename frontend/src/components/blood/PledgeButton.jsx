// src/components/blood/PledgeButton.jsx
import { Heart, Users } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { useAuth } from '../../hooks/useAuth';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import bloodRequestService from '../../services/bloodRequestService';
import { isBloodTypeCompatible } from '../../utils/bloodCompatibility';
import Button from '../common/Button';

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
    const canProceed = requireAuth(
      null,
      'Vui lòng đăng nhập để đăng ký hiến máu.'
    );
    if (!canProceed) return;

    if (hasUserPledged) {
      toast.error('Bạn chỉ có thể đăng kí hiến máu 1 lần trong vòng 90 ngày');
      return;
    }

    // Kiểm tra tương thích nhóm máu
    const userBloodType = user?.bloodType;
    const requiredBloodType = request.bloodType?.bloodGroup || request.bloodType;
    
    // Cho phép nếu:
    // 1. Người dùng chưa có nhóm máu (hiến máu lần đầu)
    // 2. Người dùng có nhóm máu tương thích
    if (userBloodType && !isBloodTypeCompatible(userBloodType, requiredBloodType)) {
      toast.error(
        `Rất tiếc, nhóm máu ${userBloodType} của bạn không phù hợp với yêu cầu nhóm máu ${requiredBloodType}. Cảm ơn bạn đã quan tâm!`,
        { duration: 1500 }
      );
      return;
    }

    setIsLoading(true);
    try {
      // Pledge for the blood request (this automatically creates emergency donation process)
      await bloodRequestService.pledgeForRequest(request.id);
      
      toast.success(
        'Đăng ký hiến máu thành công! Vui lòng đến bệnh viện trong 24-48 giờ để hoàn thành hiến máu.',
        { duration: 1500 }
      );
      onPledgeSuccess?.();
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('Bạn chỉ có thể đăng kí hiến máu 1 lần trong vòng 90 ngày');
      } else {
        toast.error('Không thể đăng ký hiến máu. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const pledgeCount = request.pledgeCount || request.pledges?.length || 0;
  const requiredPledges =
    (request.quantityInUnits || request.quantityNeeded || 1);
  const isUrgent = request.urgency === 'URGENT';
  const isCritical = request.urgency === 'CRITICAL';

  // Kiểm tra tương thích nhóm máu
  const userBloodType = user?.bloodType;
  const requiredBloodType = request.bloodType?.bloodGroup || request.bloodType;
  const isFirstTimeDonor = !userBloodType; // Chưa có thông tin nhóm máu
  const isCompatible = !userBloodType || isBloodTypeCompatible(userBloodType, requiredBloodType);
  const showIncompatibleWarning = userBloodType && !isCompatible;

  return (
    <div className='space-y-3'>
      {' '}
      {/* Pledge count display */}
      <div className='flex items-center justify-between text-sm'>
        <div className='flex items-center text-gray-600'>
          <Users className='w-4 h-4 mr-1' />
          <span>
            {pledgeCount}/{requiredPledges} người đã đăng ký hiến
          </span>
        </div>
        <div className='text-gray-500'>
          Cần: {request.quantityInUnits || request.quantityNeeded || 1} đơn vị
        </div>
      </div>
      {/* Pledge button */}
      <Button
        onClick={handlePledge}
        disabled={isLoading || hasUserPledged || !isAuthenticated || showIncompatibleWarning}
        variant={
          hasUserPledged
            ? 'outline'
            : showIncompatibleWarning
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
            : showIncompatibleWarning
              ? 'Nhóm máu không phù hợp'
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
      
      {/* Hiển thị thông tin tương thích nhóm máu */}
      {isAuthenticated && isFirstTimeDonor && (
        <p className='text-xs text-blue-600 text-center'>
          ℹ️ Chúng tôi sẽ xác định nhóm máu của bạn trong quá trình hiến máu
        </p>
      )}
      
      {isAuthenticated && userBloodType && isCompatible && !hasUserPledged && (
        <p className='text-xs text-green-600 text-center'>
          ✓ Nhóm máu {userBloodType} của bạn phù hợp với yêu cầu này
        </p>
      )}
      
      {showIncompatibleWarning && (
        <p className='text-xs text-orange-600 text-center'>
          ⚠️ Nhóm máu {userBloodType} của bạn không phù hợp với yêu cầu nhóm máu {requiredBloodType}
        </p>
      )}
    </div>
  );
};

export default PledgeButton;
