import React from 'react';
import { Lock, UserCheck, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/common/Button';

const PrivacyPolicyPage = () => (
  <div className="bg-gradient-to-br from-red-50 to-pink-50 min-h-[80vh] py-10">
    <PageContainer maxWidth="2xl">
      <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 md:p-10 flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 mb-4 shadow">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-red-600 mb-2 text-center">Chính sách bảo mật</h1>
          <div className="h-1 w-16 bg-red-200 rounded-full mb-2"></div>
        </div>
        <ul className="space-y-5 w-full">
          <li className="flex items-start gap-3">
            <UserCheck className="w-6 h-6 text-green-500 mt-1" />
            <span className="text-base md:text-lg text-gray-700">
              <b>Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn.</b> Mọi thông tin bạn cung cấp sẽ chỉ được sử dụng cho mục đích quản lý tài khoản và hỗ trợ các hoạt động hiến máu.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-500 mt-1" />
            <span className="text-base md:text-lg text-gray-700">
              <b>Chúng tôi không chia sẻ thông tin cá nhân của bạn</b> cho bên thứ ba khi chưa có sự đồng ý của bạn, trừ khi pháp luật yêu cầu.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Lock className="w-6 h-6 text-red-400 mt-1" />
            <span className="text-base md:text-lg text-gray-700">
              Bạn có thể liên hệ với chúng tôi để yêu cầu chỉnh sửa hoặc xóa thông tin cá nhân bất cứ lúc nào.
            </span>
          </li>
        </ul>
        <div className="mt-8 text-gray-500 text-sm text-center">
         
        </div>
        <Link to="/" className="mt-8">
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow">
            Quay về trang chủ
          </Button>
        </Link>
      </div>
    </PageContainer>
  </div>
);

export default PrivacyPolicyPage;