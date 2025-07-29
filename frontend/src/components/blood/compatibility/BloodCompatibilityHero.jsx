// src/components/blood/compatibility/BloodCompatibilityHero.jsx
import { HeartHandshake } from 'lucide-react';

const BloodCompatibilityHero = () => {
  return (
    <div className="relative bg-gradient-to-r from-red-600 to-pink-600 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative container mx-auto px-4 py-16 lg:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm mb-6">
            <HeartHandshake className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Cẩm Nang Hiến Máu
          </h1>
          <p className="text-xl lg:text-2xl text-red-100 mb-8 font-light max-w-3xl mx-auto">
            Khám phá thế giới tương thích nhóm máu và trở thành người hùng cứu
            người với kiến thức chuyên sâu
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-white">8</div>
              <div className="text-red-200 text-sm">Nhóm máu chính</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-white">3</div>
              <div className="text-red-200 text-sm">Thành phần máu</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-white">100%</div>
              <div className="text-red-200 text-sm">Tương thích chính xác</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-white">24/7</div>
              <div className="text-red-200 text-sm">Hỗ trợ khẩn cấp</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodCompatibilityHero;
