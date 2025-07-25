// src/pages/profile/UserProfileViewPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Edit3,
  Mail,
  Phone,
  UserCircle,
  MapPin,
  Heart,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  AlertTriangle,
} from 'lucide-react';

import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatFullDateTime } from '../../utils/formatters';
import { getCCCDVerificationStatus } from '../../utils/cccvVerification';

const UserProfileViewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Component hiển thị chi tiết
  const DetailItem = ({ icon: IconComponent, label, value, highlight = false }) => {
    return (
      <div className='py-3 sm:grid sm:grid-cols-3 sm:gap-4'>
        <dt className='text-sm font-medium text-gray-500 flex items-center'>
          {IconComponent && <IconComponent size={16} className='mr-2 text-red-600' />}
          {label}
        </dt>
        <dd
          className={`mt-1 text-sm ${highlight ? 'font-semibold text-red-700' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}
        >
          {value !== null && value !== undefined && value !== '' ? (
            value
          ) : (
            <span className='italic text-gray-400'>Chưa có thông tin</span>
          )}
        </dd>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoadingSpinner size='12' />
      </div>
    );
  }

  if (!user) {
    return (
      <div className='text-center py-10'>
        Không thể tải thông tin người dùng.
      </div>
    );
  }

  const bloodTypeDesc = user?.bloodType?.bloodGroup || user?.bloodType || 'Chưa cập nhật';
  const cccvStatus = getCCCDVerificationStatus(user);

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='bg-white shadow-xl rounded-lg overflow-hidden'>
        <div className='bg-gray-50 px-6 py-5 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold text-gray-800'>
                Hồ sơ cá nhân: {user?.fullName || 'Người dùng'}
              </h1>
              <p className='text-sm text-gray-500'>
                <span className='font-semibold'>{user?.email}</span>
              </p>
            </div>
            <div className='flex space-x-2'>
              <Button
                onClick={() => navigate('/profile/edit')}
                variant='outline'
              >
                <Edit3 size={16} className='mr-2' /> Chỉnh sửa
              </Button>
            </div>
          </div>
        </div>

        <div className='px-6 py-5'>
          <dl className='divide-y divide-gray-200'>
            <h3 className='text-lg font-semibold text-gray-700 my-3'>
              Thông tin liên hệ
            </h3>
            <DetailItem icon={Mail} label='Email' value={user?.email} />
            <DetailItem icon={Phone} label='Số điện thoại' value={user?.phone} />
            <DetailItem icon={MapPin} label='Địa chỉ' value={user?.address || 'Chưa cập nhật'} />
            <DetailItem
              icon={UserCircle}
              label='Vai trò'
              value={user?.role}
              highlight={true}
            />

            <h3 className='text-lg font-semibold text-gray-700 pt-5 my-3'>
              Thông tin cá nhân & Y tế
            </h3>
            <DetailItem
              icon={CalendarDays}
              label='Ngày sinh'
              value={user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
            />
            <DetailItem 
              icon={UserCircle} 
              label='Giới tính' 
              value={user?.gender === 'Male' ? 'Nam' : user?.gender === 'Female' ? 'Nữ' : 'Chưa cập nhật'} 
            />
            <DetailItem
              icon={Heart}
              label='Nhóm máu'
              value={bloodTypeDesc}
              highlight={bloodTypeDesc !== 'Chưa cập nhật'}
            />
            <DetailItem
              icon={UserCircle}
              label='Tình trạng bệnh lý'
              value={user?.medicalConditions || 'Không có'}
            />
            <DetailItem
              icon={CalendarDays}
              label='Lần hiến máu cuối'
              value={user?.lastDonationDate ? new Date(user.lastDonationDate).toLocaleDateString('vi-VN') : 'Chưa hiến máu'}
            />
            {/* <DetailItem
              icon={user.isReadyToDonate ? CheckCircle : XCircle}
              label='Sẵn sàng hiến máu'
              value={user.isReadyToDonate ? 'Có' : 'Không'}
              highlight={user.isReadyToDonate === true}
            /> */}

            <h3 className='text-lg font-semibold text-gray-700 pt-5 my-3'>
              Thông tin tài khoản
            </h3>
            <DetailItem
              icon={CheckCircle}
              label='Email đã xác thực'
              value={user.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
            />
            {/* <DetailItem
              icon={CheckCircle}
              label='SĐT đã xác thực'
              value={user.phoneVerified ? 'Đã xác thực' : 'Chưa xác thực'}
            /> */}
            <DetailItem
              icon={cccvStatus.isVerified ? Shield : AlertTriangle}
              label='Xác minh CCCD/CMND'
              value={cccvStatus.message}
              highlight={cccvStatus.isVerified}
            />
            <DetailItem
              icon={UserCircle}
              label='Vai trò'
              value={user.role}
            />
            <DetailItem
              icon={UserCircle}
              label='Trạng thái tài khoản'
              value={user.status}
            />
            <DetailItem
              icon={Clock}
              label='Ngày tạo tài khoản'
              value={formatFullDateTime(user.createdAt)}
            />
            <DetailItem
              icon={Clock}
              label='Ngày cập nhật gần nhất'
              value={formatFullDateTime(user.updatedAt)}
            />
          </dl>
        </div>
      </div>
    </div>
  );
};

export default UserProfileViewPage;
