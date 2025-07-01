// src/pages/profile/UserProfileViewPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
} from 'lucide-react';

import userService from '../../services/userService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UserProfileViewPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const userData = await userService.getProfile();
      setUser(userData);
    } catch (error) {
      // console.error(error);
      toast.error(`Không thể tải thông tin: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Component hiển thị chi tiết
  const DetailItem = ({ icon: IconComponent, label, value, highlight = false }) => {
    return (
      <div className='py-3 sm:grid sm:grid-cols-3 sm:gap-4'>
        <dt className='text-sm font-medium text-gray-500 flex items-center'>
          <IconComponent size={16} className='mr-2 text-red-600' />
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

  const bloodTypeDesc = user.bloodTypeDescription || 'Chưa cập nhật';

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='bg-white shadow-xl rounded-lg overflow-hidden'>
        <div className='bg-gray-50 px-6 py-5 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold text-gray-800'>
                Hồ sơ cá nhân: {user.fullName}
              </h1>
              <p className='text-sm text-gray-500'>
                <span className='font-semibold'>{user.email}</span>
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
            <DetailItem icon={Mail} label='Email' value={user.email} />
            <DetailItem icon={Phone} label='Số điện thoại' value={user.phone} />
            <DetailItem icon={MapPin} label='Địa chỉ' value={user.address} />
            {/* <DetailItem icon={MapPin} label='Vĩ độ' value={user.latitude} />
            <DetailItem icon={MapPin} label='Kinh độ ' value={user.longitude} /> */}
            <DetailItem
              icon={UserCircle}
              label='Liên hệ khẩn cấp'
              value={user.emergencyContact}
            />

            <h3 className='text-lg font-semibold text-gray-700 pt-5 my-3'>
              Thông tin cá nhân & Y tế
            </h3>
            <DetailItem
              icon={CalendarDays}
              label='Ngày sinh'
              value={
                user.dateOfBirth
                  ? new Date(user.dateOfBirth).toLocaleDateString()
                  : null
              }
            />
            <DetailItem icon={UserCircle} label='Giới tính' value={user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : 'Khác'} />
            <DetailItem
              icon={Heart}
              label='Nhóm máu'
              value={bloodTypeDesc}
              highlight={bloodTypeDesc !== 'Chưa cập nhật'}
            />
            <DetailItem
              icon={UserCircle}
              label='Tình trạng bệnh lý'
              value={user.medicalConditions}
            />
            <DetailItem
              icon={CalendarDays}
              label='Lần hiến máu cuối'
              value={user.lastDonationDate ? new Date(user.lastDonationDate).toLocaleDateString() : null}
            />
            <DetailItem
              icon={user.isReadyToDonate ? CheckCircle : XCircle}
              label='Sẵn sàng hiến máu'
              value={user.isReadyToDonate ? 'Có' : 'Không'}
              highlight={user.isReadyToDonate === true}
            />

            <h3 className='text-lg font-semibold text-gray-700 pt-5 my-3'>
              Thông tin tài khoản
            </h3>
            <DetailItem
              icon={CheckCircle}
              label='Email đã xác thực'
              value={user.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
            />
            <DetailItem
              icon={CheckCircle}
              label='SĐT đã xác thực'
              value={user.phoneVerified ? 'Đã xác thực' : 'Chưa xác thực'}
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
              value={user.createdAt ? new Date(user.createdAt).toLocaleString() : null}
            />
            <DetailItem
              icon={Clock}
              label='Ngày cập nhật gần nhất'
              value={user.updatedAt ? new Date(user.updatedAt).toLocaleString() : null}
            />
          </dl>
        </div>
      </div>
    </div>
  );
};

export default UserProfileViewPage;
