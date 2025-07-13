// src/hooks/useEmergencyDonors.js
import { useState, useCallback } from 'react';
import bloodRequestService from '../services/bloodRequestService';

export const useEmergencyDonors = () => {
  const [donors, setDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDonors = useCallback(async (requestId) => {
    if (!requestId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Gọi API thực tế để lấy danh sách người đăng ký hiến máu
      const response = await bloodRequestService.getRequestPledges(requestId);
      
      // Transform data từ backend về format mong muốn
      const transformedDonors = response.data.map(user => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        bloodGroup: user.bloodTypeDescription || 'N/A',
        address: user.address || 'Chưa cập nhật',
        donationDate: user.createdAt, // Thời gian đăng ký
        status: 'scheduled', // Mặc định là đã đăng ký
        emergencyContact: user.emergencyContact || user.phone,
        lastDonationDate: user.lastDonationDate,
        totalDonations: 0, // Backend chưa có field này
        isVerified: user.emailVerified || false,
        notes: user.medicalConditions || ''
      }));
      
      setDonors(transformedDonors);
      
    } catch (err) {
      console.error('Error fetching donors:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách người hiến máu');
      setDonors([]);
      
      // Fallback to mock data for development
      if (process.env.NODE_ENV === 'development') {
        const mockDonors = [
          {
            id: 1,
            fullName: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com',
            phone: '0123456789',
            bloodGroup: 'O+',
            address: '123 Đường ABC, Quận 1, TP.HCM',
            donationDate: '2024-01-15T10:30:00Z',
            status: 'completed',
            emergencyContact: '0987654321',
            lastDonationDate: '2023-09-10',
            totalDonations: 5,
            isVerified: true,
            notes: 'Người hiến tích cực, đã tham gia nhiều chương trình hiến máu.'
          },
          {
            id: 2,
            fullName: 'Trần Thị B',
            email: 'tranthib@email.com',
            phone: '0987654321',
            bloodGroup: 'O+',
            address: '456 Đường XYZ, Quận 3, TP.HCM',
            donationDate: '2024-01-15T14:15:00Z',
            status: 'completed',
            emergencyContact: '0123456789',
            lastDonationDate: '2023-11-20',
            totalDonations: 3,
            isVerified: true,
            notes: 'Lần đầu tham gia hiến máu khẩn cấp.'
          },
          {
            id: 3,
            fullName: 'Lê Minh C',
            email: 'leminhc@email.com',
            phone: '0369852147',
            bloodGroup: 'O+',
            address: '789 Đường DEF, Quận 7, TP.HCM',
            donationDate: '2024-01-16T09:00:00Z',
            status: 'scheduled',
            emergencyContact: '0741852963',
            lastDonationDate: '2023-08-05',
            totalDonations: 8,
            isVerified: true,
            notes: 'Người hiến máu thường xuyên, có kinh nghiệm.'
          },
          {
            id: 4,
            fullName: 'Phạm Thị D',
            email: 'phamthid@email.com',
            phone: '0159753468',
            bloodGroup: 'O+',
            address: '321 Đường GHI, Quận 5, TP.HCM',
            donationDate: '2024-01-16T15:30:00Z',
            status: 'scheduled',
            emergencyContact: '0852741963',
            lastDonationDate: '2023-12-01',
            totalDonations: 2,
            isVerified: false,
            notes: 'Cần xác minh thông tin CCCD trước khi hiến máu.'
          }
        ];
        setDonors(mockDonors);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStats = useCallback(() => {
    const completed = donors.filter(d => d.status === 'completed').length;
    const scheduled = donors.filter(d => d.status === 'scheduled').length;
    const verified = donors.filter(d => d.isVerified).length;
    const total = donors.length;

    return {
      total,
      completed,
      scheduled,
      verified,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      verificationRate: total > 0 ? Math.round((verified / total) * 100) : 0
    };
  }, [donors]);

  const getDonorsByStatus = useCallback((status) => {
    return donors.filter(donor => donor.status === status);
  }, [donors]);

  const searchDonors = useCallback((searchTerm) => {
    if (!searchTerm.trim()) return donors;
    
    const term = searchTerm.toLowerCase();
    return donors.filter(donor => 
      donor.fullName.toLowerCase().includes(term) ||
      donor.email.toLowerCase().includes(term) ||
      donor.phone.includes(term) ||
      donor.bloodGroup.toLowerCase().includes(term)
    );
  }, [donors]);

  return {
    donors,
    isLoading,
    error,
    fetchDonors,
    getStats,
    getDonorsByStatus,
    searchDonors
  };
};
