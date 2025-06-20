import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const UrgentRequestsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Cần Máu Gấp</h1>
          <p className="text-lg text-gray-700">
            Đây là trang dành cho các trường hợp khẩn cấp cần máu. Chức năng này đang được phát triển.
          </p>
          {/* Nội dung chi tiết sẽ được thêm vào đây */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UrgentRequestsPage;
