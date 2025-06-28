// src/components/blood/compatibility/BloodTypesTabContent.jsx
import React from 'react';
import { Beaker, Target, Droplets, Heart, Shield, TrendingUp, Users } from 'lucide-react';
import BloodTypeDistributionCard from './BloodTypeDistributionCard';

const BloodTypesTabContent = () => {
  const bloodTypeData = [
    {
      type: 'O+',
      percentage: '38%',
      description: 'Phổ biến nhất - Người cho hồng cầu tuyệt vời',
      isRare: false
    },
    {
      type: 'A+',
      percentage: '34%',
      description: 'Phổ biến thứ hai - Tương thích cao',
      isRare: false
    },
    {
      type: 'B+',
      percentage: '9%',
      description: 'Ít phổ biến - Cần thiết cho nhóm B',
      isRare: false
    },
    {
      type: 'AB+',
      percentage: '3%',
      description: 'Hiếm - Người nhận toàn năng',
      isRare: false
    },
    {
      type: 'O-',
      percentage: '7%',
      description: 'Người cho toàn năng - Cực kỳ quý giá',
      isRare: true
    },
    {
      type: 'A-',
      percentage: '6%',
      description: 'Hiếm - Cần thiết cho A- và AB-',
      isRare: true
    },
    {
      type: 'B-',
      percentage: '2%',
      description: 'Rất hiếm - Chỉ cho B- và AB-',
      isRare: true
    },
    {
      type: 'AB-',
      percentage: '1%',
      description: 'Hiếm nhất - Chỉ cho AB-',
      isRare: true
    }
  ];

  return (
    <div className="animate-fade-in space-y-12">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
          Khám Phá Thế Giới Nhóm Máu
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Hiểu rõ về các nhóm máu khác nhau và sự phân bố của chúng trong dân số
          để trở thành người hiến máu hiệu quả
        </p>
      </div>

      {/* ABO System Explanation */}
      <section className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Beaker className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-800 ml-3">
                Hệ thống nhóm máu ABO
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Hệ thống ABO phân loại máu thành bốn loại chính: A, B, AB và O,
              dựa trên sự hiện diện hoặc vắng mặt của kháng nguyên A và B trên
              bề mặt hồng cầu.
            </p>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-red-800 ml-3">
                Yếu tố Rh
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Yếu tố Rh là một kháng nguyên quan trọng khác trên hồng cầu. Nếu
              có mặt, nhóm máu là dương (+); nếu không có, là âm (-).
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <div className="w-64 h-64 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center shadow-2xl">
              <Droplets className="w-32 h-32 text-red-400" />
            </div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Blood Type Distribution */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
            Phân Bố Nhóm Máu Trong Dân Số
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tỷ lệ phần trăm các nhóm máu trong dân số Việt Nam (số liệu tham khảo)
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {bloodTypeData.map((data) => (
            <BloodTypeDistributionCard key={data.type} {...data} />
          ))}
        </div>
      </section>

      {/* Key Facts */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Những Điều Thú Vị Về Nhóm Máu
        </h3>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Nhóm O-</h4>
            <p className="text-gray-600 text-sm">
              Chỉ chiếm 7% dân số nhưng có thể cứu sống bất kỳ ai trong tình
              huống khẩn cấp
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Nhóm AB+</h4>
            <p className="text-gray-600 text-sm">
              Có thể nhận máu từ tất cả các nhóm máu khác, được gọi là "người
              nhận toàn năng"
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Tính Di Truyền</h4>
            <p className="text-gray-600 text-sm">
              Nhóm máu được quyết định bởi gen từ cha mẹ và không thay đổi suốt đời
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BloodTypesTabContent;
