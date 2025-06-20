import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Info } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="text-center">
          <Info size={48} className="mx-auto text-blue-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-800">Về Chúng Tôi</h1>
          <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
            Chức năng này đang được phát triển và sẽ sớm ra mắt. Cảm ơn bạn đã quan tâm!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
