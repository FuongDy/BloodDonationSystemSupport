import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  MapPin, 
  MessageSquare, 
  Send, 
  Heart, 
  Clock, 
  Users,
  CheckCircle,
  Info
} from 'lucide-react';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import DateTimePicker from '../components/common/DateTimePicker';
import donationService from '../services/donationService';
import { useAuth } from '../hooks/useAuth';
import useAuthRedirect from '../hooks/useAuthRedirect';
import { HOSPITAL_INFO } from '../utils/constants';

const RequestDonationPage = () => {  const [formData, setFormData] = useState({
    appointmentDate: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useAuthRedirect();

  const handleChange = useCallback(e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
      // Check authentication before processing
    const canProceed = requireAuth(null, 'Vui lòng đăng nhập để đặt lịch hẹn hiến máu.');
    if (!canProceed) return;
    
    if (!formData.appointmentDate) {
      toast.error('Vui lòng chọn ngày hẹn.');
      return;
    }    setLoading(true);
    try {
      // Tự động gán địa điểm cố định
      const requestData = {
        appointmentDate: formData.appointmentDate,
        location: HOSPITAL_INFO.FULL_ADDRESS,
        notes: formData.notes
      };
      
      await donationService.createDonationRequest(requestData);
      toast.success(
        'Yêu cầu hiến máu đã được gửi thành công! Chúng tôi sẽ sớm liên hệ với bạn.'
      );
      navigate('/my-donation-history'); // Chuyển về trang lịch sử hiến máu sau khi thành công
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gửi yêu cầu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 overflow-x-hidden'>
      {/* Hero Section */}
      <div className='relative overflow-hidden bg-gradient-to-r from-red-600 to-pink-600 text-white'>
        <div className='absolute inset-0 bg-black/10'></div>
        <div className='relative container mx-auto px-4 py-12 sm:py-16'>
          <div className='text-center max-w-4xl mx-auto'>
            <div className='inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm mb-6'>
              <Heart className='h-10 w-10 text-white' />
            </div>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 break-words'>
              Đặt Lịch Hẹn Hiến Máu
            </h1>
            <p className='text-lg sm:text-xl lg:text-2xl text-red-100 mb-8 font-light break-words'>
              Mỗi giọt máu bạn hiến tặng là một cơ hội cứu sống một người
            </p>
            <div className='flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 text-red-100'>
              <div className='flex items-center space-x-2 min-w-0'>
                <Clock className='h-5 w-5 flex-shrink-0' />
                <span className='whitespace-nowrap'>Nhanh chóng</span>
              </div>
              <div className='flex items-center space-x-2 min-w-0'>
                <Users className='h-5 w-5 flex-shrink-0' />
                <span className='whitespace-nowrap'>An toàn</span>
              </div>
              <div className='flex items-center space-x-2 min-w-0'>
                <CheckCircle className='h-5 w-5 flex-shrink-0' />
                <span className='whitespace-nowrap'>Tin cậy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-12 overflow-x-hidden'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8'>
            {/* Information Panel */}
            <div className='xl:col-span-1 space-y-6 order-2 xl:order-1'>
              {/* Process Steps */}
              <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                  <Info className='h-5 w-5 text-blue-600 mr-2' />
                  Quy trình hiến máu
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-start space-x-3'>
                    <div className='flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-semibold text-red-600'>
                      1
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='text-sm font-medium text-gray-900 break-words'>Đặt lịch hẹn</p>
                      <p className='text-xs text-gray-600 break-words'>Chọn thời gian phù hợp</p>
                    </div>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <div className='flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-semibold text-red-600'>
                      2
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='text-sm font-medium text-gray-900 break-words'>Khám sàng lọc</p>
                      <p className='text-xs text-gray-600 break-words'>Kiểm tra sức khỏe</p>
                    </div>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <div className='flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-semibold text-red-600'>
                      3
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='text-sm font-medium text-gray-900 break-words'>Hiến máu</p>
                      <p className='text-xs text-gray-600 break-words'>Chỉ mất 10-15 phút</p>
                    </div>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <div className='flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-semibold text-red-600'>
                      4
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='text-sm font-medium text-gray-900 break-words'>Nghỉ ngơi</p>
                      <p className='text-xs text-gray-600 break-words'>Thưởng thức đồ ăn nhẹ</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className='bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                  <Heart className='h-5 w-5 text-green-600 mr-2' />
                  Lợi ích khi hiến máu
                </h3>
                <ul className='space-y-2 text-sm text-gray-700'>
                  <li className='flex items-start space-x-2'>
                    <CheckCircle className='h-4 w-4 text-green-600 flex-shrink-0 mt-0.5' />
                    <span className='break-words'>Kiểm tra sức khỏe miễn phí</span>
                  </li>
                  <li className='flex items-start space-x-2'>
                    <CheckCircle className='h-4 w-4 text-green-600 flex-shrink-0 mt-0.5' />
                    <span className='break-words'>Cải thiện tuần hoàn máu</span>
                  </li>
                  <li className='flex items-start space-x-2'>
                    <CheckCircle className='h-4 w-4 text-green-600 flex-shrink-0 mt-0.5' />
                    <span className='break-words'>Giảm nguy cơ bệnh tim mạch</span>
                  </li>
                  <li className='flex items-start space-x-2'>
                    <CheckCircle className='h-4 w-4 text-green-600 flex-shrink-0 mt-0.5' />
                    <span className='break-words'>Cảm giác hạnh phúc và ý nghĩa</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Form Section */}
            <div className='xl:col-span-2 order-1 xl:order-2'>
              <div className='bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100'>
                <div className='text-center mb-8'>
                  <div className='inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4'>
                    <Calendar className='h-8 w-8 text-red-600' />
                  </div>
                  <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-2'>
                    Thông tin đặt lịch
                  </h2>
                  <p className='text-gray-600 text-sm sm:text-base break-words'>
                    Vui lòng điền đầy đủ thông tin để chúng tôi có thể hỗ trợ bạn tốt nhất
                  </p>
                </div>

                {/* Auth Notice for Guests */}
                {!isAuthenticated && (
                  <div className='mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                    <div className='flex items-start'>
                      <Info className='h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0' />
                      <div>
                        <h3 className='text-sm font-medium text-yellow-800'>
                          Cần đăng nhập để đặt lịch
                        </h3>
                        <p className='text-sm text-yellow-700 mt-1'>
                          Bạn có thể xem thông tin và quy trình hiến máu. Để đặt lịch hẹn, vui lòng đăng nhập hoặc đăng ký tài khoản.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-6'>
                  {/* Date and Time Selection */}
                  <div className='bg-gray-50 rounded-xl p-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                      <Calendar className='h-5 w-5 text-red-600 mr-2' />
                      Chọn thời gian
                    </h3>
                    <DateTimePicker
                      label='Ngày và giờ hẹn'
                      name='appointmentDate'
                      value={formData.appointmentDate}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      minDate={new Date().toISOString().split('T')[0]} // Không cho chọn ngày quá khứ
                      className='bg-white'
                    />
                  </div>                  {/* Location Display - Fixed Hospital */}
                  <div className='bg-blue-50 rounded-xl p-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                      <MapPin className='h-5 w-5 text-blue-600 mr-2' />
                      Địa điểm hiến máu
                    </h3>
                    <div className='bg-white rounded-lg p-4 border border-gray-200'>
                      <div className='flex items-start space-x-3'>
                        <div className='p-2 bg-blue-100 rounded-lg'>
                          <MapPin className='w-5 h-5 text-blue-600' />
                        </div>
                        <div className='flex-1'>
                          <h4 className='font-semibold text-gray-900'>{HOSPITAL_INFO.FULL_NAME}</h4>
                          <p className='text-sm text-gray-600 mt-1'>{HOSPITAL_INFO.ADDRESS}</p>
                          <div className='mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                            ✓ Địa điểm cố định
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='mt-3 text-xs text-gray-500'>
                      <p>Tất cả các hoạt động hiến máu sẽ được thực hiện tại địa điểm này.</p>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className='bg-purple-50 rounded-xl p-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                      <MessageSquare className='h-5 w-5 text-purple-600 mr-2' />
                      Ghi chú thêm
                    </h3>
                    <div className='relative'>
                      <textarea
                        id='notes'
                        name='notes'
                        rows='4'
                        value={formData.notes}
                        onChange={handleChange}
                        disabled={loading}
                        className='block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white resize-none'
                        placeholder='Ví dụ: Tôi có thể đến sau 18:00, có tiền sử bệnh tim, cần tư vấn thêm...'
                      />
                    </div>
                    <p className='mt-2 text-xs text-gray-500'>
                      Hãy cho chúng tôi biết bất kỳ thông tin nào có thể hữu ích
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className='pt-6'>
                    <Button
                      type='submit'
                      className='w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base'
                      disabled={loading}
                      isLoading={loading}
                      size='lg'
                    >
                      <Send className='mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0' />
                      <span className='truncate'>
                        {loading ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu hiến máu'}
                      </span>
                    </Button>
                    <p className='mt-3 text-center text-xs text-gray-500 break-words px-2'>
                      Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận lịch hẹn
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDonationPage;
