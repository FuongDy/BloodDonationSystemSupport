import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { CalendarCheck } from 'lucide-react';

const ScheduleDonationPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="text-center">
          <CalendarCheck size={48} className="mx-auto text-blue-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-800">Đặt Lịch Hiến Máu</h1>
          <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
            Chức năng này đang được phát triển và sẽ sớm ra mắt. Cảm ơn bạn đã quan tâm!
          </p>
        </div>
        {/* Placeholder for the scheduling form/calendar */}
        <div className="mt-10 p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-700">Hệ Thống Đặt Lịch Sắp Ra Mắt</h2>
          <p className="text-center text-gray-500 mt-4">
            Chúng tôi đang làm việc để mang đến cho bạn một hệ thống đặt lịch hiến máu tiện lợi và nhanh chóng. 
            Bạn sẽ có thể chọn địa điểm, ngày và giờ phù hợp nhất với mình.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScheduleDonationPage;
