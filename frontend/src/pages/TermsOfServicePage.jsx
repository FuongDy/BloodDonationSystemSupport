import { Droplet, Info, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import PageContainer from '../components/layout/PageContainer';

const TermsOfServicePage = () => (
  <div className="bg-gradient-to-br from-red-50 to-pink-50 min-h-[80vh] py-10">
    <PageContainer maxWidth="2xl">
      <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 md:p-10 flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 mb-4 shadow">
            <Droplet className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-red-600 mb-2 text-center">Điều khoản sử dụng</h1>
          <div className="h-1 w-16 bg-red-200 rounded-full mb-2"></div>
        </div>
        <ul className="space-y-5 w-full">
          <li className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-green-500 mt-1" />
            <span className="text-base md:text-lg text-gray-700">
              Khi sử dụng hệ thống, <b>bạn đồng ý cung cấp thông tin chính xác</b> và chịu trách nhiệm về thông tin của mình.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-500 mt-1" />
            <span className="text-base md:text-lg text-gray-700">
              <b>Bạn cam kết không sử dụng hệ thống</b> cho các mục đích vi phạm pháp luật hoặc gây ảnh hưởng xấu đến cộng đồng.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Droplet className="w-6 h-6 text-red-400 mt-1" />
            <span className="text-base md:text-lg text-gray-700">
              Chúng tôi có quyền thay đổi điều khoản sử dụng bất cứ lúc nào và sẽ thông báo cho bạn khi có thay đổi quan trọng.
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

export default TermsOfServicePage;