// src/components/blood/compatibility/DonationProcessTabContent.jsx
import React from 'react';
import { UserCheck, Stethoscope, Syringe } from 'lucide-react';

const DonationProcessTabContent = () => {
  return (
    <div className="animate-modal-appear space-y-10">
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Quy Trình Hiến Máu
        </h2>
        <p className="text-gray-600">
          Những điều bạn cần biết khi tham gia hiến máu tại cơ sở của chúng tôi.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-red-700 mb-3">
            Trước khi Hiến máu
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Ngủ đủ giấc vào đêm trước.</li>
            <li>Ăn nhẹ trong vòng 3 giờ trước khi hiến máu.</li>
            <li>Uống nhiều nước trước và sau khi hiến.</li>
            <li>Mang theo giấy tờ tùy thân và danh sách thuốc đang sử dụng (nếu có).</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-red-700 mb-3">
            Điều kiện Tham gia
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Từ 17 tuổi trở lên.</li>
            <li>Cân nặng ít nhất 50 kg.</li>
            <li>Có sức khỏe tốt, không mắc bệnh truyền nhiễm.</li>
            <li>Không hiến máu toàn phần trong 90 ngày qua.</li>
          </ul>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Các bước trong Quy trình
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <UserCheck size={40} className="mx-auto text-red-500 mb-3" />
            <h4 className="font-semibold text-lg">Đăng ký</h4>
            <p className="text-sm text-gray-600 mt-1">
              Điền phiếu đăng ký và đọc các tài liệu hướng dẫn.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Stethoscope size={40} className="mx-auto text-red-500 mb-3" />
            <h4 className="font-semibold text-lg">Khám sàng lọc</h4>
            <p className="text-sm text-gray-600 mt-1">
              Nhân viên y tế sẽ kiểm tra huyết áp, nhiệt độ, và hemoglobin.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Syringe size={40} className="mx-auto text-red-500 mb-3" />
            <h4 className="font-semibold text-lg">Hiến máu</h4>
            <p className="text-sm text-gray-600 mt-1">
              Quá trình lấy máu chỉ mất khoảng 8-10 phút. Sau đó bạn sẽ nghỉ
              ngơi tại chỗ.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DonationProcessTabContent;
