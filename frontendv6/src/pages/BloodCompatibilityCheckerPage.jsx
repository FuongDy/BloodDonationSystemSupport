import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  Droplets,
  HeartPulse,
  Handshake,
  CheckCircle,
  Info,
  Beaker,
  GitCompareArrows,
  FileText,
  HeartHandshake,
  UserCheck,
  Stethoscope,
  Syringe,
  Search,
  Heart,
  Shield,
  Users,
  ArrowRightLeft,
  Target,
  Activity,
  Award,
  TrendingUp,
} from 'lucide-react';

import bloodTypeService from '../services/bloodTypeService';
import bloodCompatibilityService from '../services/bloodCompatibilityService';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Component con cho từng thẻ thông tin phân bố nhóm máu
const BloodTypeDistributionCard = ({
  type,
  percentage,
  description,
  isRare,
}) => (
  <div
    className={`bg-gradient-to-br ${
      isRare
        ? 'from-red-50 to-pink-50 border-red-200 hover:from-red-100 hover:to-pink-100'
        : 'from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100'
    } p-6 rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group`}
  >
    <div className='flex items-center justify-between mb-3'>
      <p
        className={`text-2xl font-bold ${isRare ? 'text-red-700' : 'text-blue-700'}`}
      >
        {type}
      </p>
      <Droplets
        className={`w-6 h-6 ${isRare ? 'text-red-500' : 'text-blue-500'} group-hover:animate-pulse`}
      />
    </div>
    <p
      className={`text-4xl font-bold ${isRare ? 'text-red-600' : 'text-blue-600'} mb-2`}
    >
      {percentage}
    </p>
    <p className='text-sm text-gray-600 font-medium'>{description}</p>
    {isRare && (
      <div className='mt-2'>
        <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800'>
          <Award className='w-3 h-3 mr-1' />
          Hiếm
        </span>
      </div>
    )}
  </div>
);

const BloodCompatibilityCheckerPage = () => {
  // State quản lý tab chính và tab phụ
  const [activeTab, setActiveTab] = useState('compatibility'); // Mặc định mở tab compatibility
  const [activeSubTab, setActiveSubTab] = useState('whole'); // 'whole', 'components'

  // State cho dữ liệu API
  const [allBloodTypes, setAllBloodTypes] = useState([]);
  const [compatibilityRules, setCompatibilityRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State cho dropdowns
  const [wholeBloodTypes, setWholeBloodTypes] = useState([]);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [componentTypes, setComponentTypes] = useState([]);

  // State cho việc lựa chọn và tính toán
  const [selectedWholeBloodId, setSelectedWholeBloodId] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('');
  const [compatibleDonors, setCompatibleDonors] = useState([]);
  const [compatibleRecipients, setCompatibleRecipients] = useState([]);

  // --- Data Fetching & Preparation ---
  const fetchBloodData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [typesResponse, rulesResponse] = await Promise.all([
        bloodTypeService.getAll(),
        bloodCompatibilityService.getAll(0, 1000),
      ]);

      const allTypes = typesResponse || [];
      const allRules = rulesResponse.content || [];

      setAllBloodTypes(allTypes);
      setCompatibilityRules(allRules);
      setAllBloodTypes(allTypes);
      setCompatibilityRules(allRules);

      const wholeTypes = allTypes.filter(
        bt => bt.componentType === 'Whole Blood'
      );
      setWholeBloodTypes(wholeTypes);

      const uniqueGroups = [...new Set(allTypes.map(t => t.bloodGroup))];
      const uniqueComponents = [
        ...new Set(allTypes.map(t => t.componentType)),
      ].filter(c => c !== 'Whole Blood');

      setBloodGroups(uniqueGroups);
      setComponentTypes(uniqueComponents);

      if (wholeTypes.length > 0) {
        setSelectedWholeBloodId(String(wholeTypes[0].id));
      }
      if (uniqueGroups.length > 0) {
        setSelectedBloodGroup(uniqueGroups[0]);
      }
      if (uniqueComponents.length > 0) {
        setSelectedComponent(uniqueComponents[0]);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Đã có lỗi xảy ra.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBloodData();
  }, [fetchBloodData]);

  // --- Logic tính toán tương thích ---
  useEffect(() => {
    let targetTypeId = null;
    if (activeSubTab === 'whole') {
      targetTypeId = parseInt(selectedWholeBloodId, 10);
    } else {
      const foundType = allBloodTypes.find(
        bt =>
          bt.bloodGroup === selectedBloodGroup &&
          bt.componentType === selectedComponent
      );
      if (foundType) {
        targetTypeId = foundType.id;
      }
    }

    if (targetTypeId && compatibilityRules.length > 0) {
      const donors = new Set();
      compatibilityRules.forEach(rule => {
        if (rule.recipientBloodType?.id === targetTypeId && rule.isCompatible) {
          donors.add(rule.donorBloodType.description); // Lấy mô tả đầy đủ
        }
      });
      setCompatibleDonors(Array.from(donors));

      const recipients = new Set();
      compatibilityRules.forEach(rule => {
        if (rule.donorBloodType?.id === targetTypeId && rule.isCompatible) {
          recipients.add(rule.recipientBloodType.description); // Lấy mô tả đầy đủ
        }
      });
      setCompatibleRecipients(Array.from(recipients));
    } else {
      setCompatibleDonors([]);
      setCompatibleRecipients([]);
    }
  }, [
    selectedWholeBloodId,
    selectedBloodGroup,
    selectedComponent,
    activeSubTab,
    allBloodTypes,
    compatibilityRules,
  ]);

  // --- Render Functions cho từng Tab ---

  const renderBloodTypesTab = () => (
    <div className='animate-fade-in space-y-12'>
      {/* Header Section */}
      <div className='text-center'>
        <h2 className='text-3xl lg:text-4xl font-bold text-gray-800 mb-4'>
          Khám Phá Thế Giới Nhóm Máu
        </h2>
        <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
          Hiểu rõ về các nhóm máu khác nhau và sự phân bố của chúng trong dân số
          để trở thành người hiến máu hiệu quả
        </p>
      </div>

      {/* ABO System Explanation */}
      <section className='grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
        <div className='space-y-6'>
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200'>
            <div className='flex items-center mb-4'>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                <Beaker className='w-6 h-6 text-blue-600' />
              </div>
              <h3 className='text-xl font-semibold text-blue-800 ml-3'>
                Hệ thống nhóm máu ABO
              </h3>
            </div>
            <p className='text-gray-700 leading-relaxed'>
              Hệ thống ABO phân loại máu thành bốn loại chính: A, B, AB và O,
              dựa trên sự hiện diện hoặc vắng mặt của kháng nguyên A và B trên
              bề mặt hồng cầu.
            </p>
          </div>

          <div className='bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200'>
            <div className='flex items-center mb-4'>
              <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
                <Target className='w-6 h-6 text-red-600' />
              </div>
              <h3 className='text-xl font-semibold text-red-800 ml-3'>
                Yếu tố Rh
              </h3>
            </div>
            <p className='text-gray-700 leading-relaxed'>
              Yếu tố Rh là một kháng nguyên quan trọng khác trên hồng cầu. Nếu
              có mặt, nhóm máu là dương (+); nếu không có, là âm (-).
            </p>
          </div>
        </div>

        <div className='flex justify-center'>
          <div className='relative'>
            <div className='w-64 h-64 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center shadow-2xl'>
              <Droplets className='w-32 h-32 text-red-400' />
            </div>
            <div className='absolute -top-4 -right-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shadow-lg'>
              <Heart className='w-8 h-8 text-blue-600' />
            </div>
            <div className='absolute -bottom-4 -left-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shadow-lg'>
              <Shield className='w-6 h-6 text-green-600' />
            </div>
          </div>
        </div>
      </section>

      {/* Blood Type Distribution */}
      <section>
        <div className='text-center mb-8'>
          <h2 className='text-2xl lg:text-3xl font-bold text-gray-800 mb-4'>
            Phân Bố Nhóm Máu Trong Dân Số
          </h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Tỷ lệ phần trăm các nhóm máu trong dân số Việt Nam (số liệu tham
            khảo)
          </p>
        </div>

        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6'>
          <BloodTypeDistributionCard
            type='O+'
            percentage='38%'
            description='Phổ biến nhất - Người cho hồng cầu tuyệt vời'
          />
          <BloodTypeDistributionCard
            type='A+'
            percentage='34%'
            description='Phổ biến thứ hai - Tương thích cao'
          />
          <BloodTypeDistributionCard
            type='B+'
            percentage='9%'
            description='Ít phổ biến - Cần thiết cho nhóm B'
          />
          <BloodTypeDistributionCard
            type='AB+'
            percentage='3%'
            description='Hiếm - Người nhận toàn năng'
          />
          <BloodTypeDistributionCard
            type='O-'
            percentage='7%'
            description='Người cho toàn năng - Cực kỳ quý giá'
            isRare={true}
          />
          <BloodTypeDistributionCard
            type='A-'
            percentage='6%'
            description='Hiếm - Cần thiết cho A- và AB-'
            isRare={true}
          />
          <BloodTypeDistributionCard
            type='B-'
            percentage='2%'
            description='Rất hiếm - Chỉ cho B- và AB-'
            isRare={true}
          />
          <BloodTypeDistributionCard
            type='AB-'
            percentage='1%'
            description='Hiếm nhất - Chỉ cho AB-'
            isRare={true}
          />
        </div>
      </section>

      {/* Key Facts */}
      <section className='bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8'>
        <h3 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
          Những Điều Thú Vị Về Nhóm Máu
        </h3>
        <div className='grid lg:grid-cols-3 gap-6'>
          <div className='text-center'>
            <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <TrendingUp className='w-8 h-8 text-red-600' />
            </div>
            <h4 className='font-semibold text-lg mb-2'>Nhóm O-</h4>
            <p className='text-gray-600 text-sm'>
              Chỉ chiếm 7% dân số nhưng có thể cứu sống bất kỳ ai trong tình
              huống khẩn cấp
            </p>
          </div>
          <div className='text-center'>
            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Users className='w-8 h-8 text-blue-600' />
            </div>
            <h4 className='font-semibold text-lg mb-2'>Nhóm AB+</h4>
            <p className='text-gray-600 text-sm'>
              Có thể nhận máu từ tất cả các nhóm máu khác, được gọi là "người
              nhận toàn năng"
            </p>
          </div>
          <div className='text-center'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Heart className='w-8 h-8 text-green-600' />
            </div>
            <h4 className='font-semibold text-lg mb-2'>Tính Di Truyền</h4>
            <p className='text-gray-600 text-sm'>
              Nhóm máu được quyết định bởi gen từ cha mẹ và không thay đổi suốt
              đời
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  const renderCompatibilityTab = () => (
    <div className='animate-modal-appear space-y-8'>
      <div className='flex border-b border-gray-200'>
        <button
          onClick={() => setActiveSubTab('whole')}
          className={`px-4 py-2 text-sm font-medium ${activeSubTab === 'whole' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Máu Toàn Phần
        </button>
        <button
          onClick={() => setActiveSubTab('components')}
          className={`px-4 py-2 text-sm font-medium ${activeSubTab === 'components' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Thành Phần Máu
        </button>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center py-10'>
          <LoadingSpinner />
        </div>
      ) : (
        <div className='p-4 bg-red-50 rounded-lg shadow-inner'>
          {/* Content for sub-tabs */}
          {activeSubTab === 'whole' ? (
            <div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                Tra cứu tương thích Máu Toàn Phần
              </h3>
              <label
                htmlFor='selectWholeBloodType'
                className='block text-base font-medium text-gray-700 mb-2'
              >
                Chọn nhóm máu:
              </label>
              <select
                id='selectWholeBloodType'
                value={selectedWholeBloodId}
                onChange={e => setSelectedWholeBloodId(e.target.value)}
                className='block w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500'
              >
                {wholeBloodTypes.map(bt => (
                  <option key={bt.id} value={bt.id}>
                    {bt.bloodGroup}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                Tra cứu tương thích theo Thành Phần Máu
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='selectBloodGroup'
                    className='block text-base font-medium text-gray-700 mb-2'
                  >
                    Chọn nhóm máu:
                  </label>
                  <select
                    id='selectBloodGroup'
                    value={selectedBloodGroup}
                    onChange={e => setSelectedBloodGroup(e.target.value)}
                    className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500'
                  >
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor='selectComponent'
                    className='block text-base font-medium text-gray-700 mb-2'
                  >
                    Chọn thành phần:
                  </label>
                  <select
                    id='selectComponent'
                    value={selectedComponent}
                    onChange={e => setSelectedComponent(e.target.value)}
                    className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500'
                  >
                    {componentTypes.map(ct => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-white p-4 rounded-md shadow-sm border border-green-200'>
              <h3 className='text-lg font-semibold text-green-700 flex items-center mb-3'>
                <Handshake size={20} className='mr-2' /> Có thể Hiến cho
              </h3>
              <div className='flex flex-wrap gap-2'>
                {compatibleRecipients.length > 0 ? (
                  compatibleRecipients.map(bg => (
                    <span
                      key={bg}
                      className='px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full'
                    >
                      {bg}
                    </span>
                  ))
                ) : (
                  <p className='text-gray-500 italic text-sm'>
                    Không tìm thấy kết quả phù hợp.
                  </p>
                )}
              </div>
            </div>
            <div className='bg-white p-4 rounded-md shadow-sm border border-blue-200'>
              <h3 className='text-lg font-semibold text-blue-700 flex items-center mb-3'>
                <HeartPulse size={20} className='mr-2' /> Có thể Nhận từ
              </h3>
              <div className='flex flex-wrap gap-2'>
                {compatibleDonors.length > 0 ? (
                  compatibleDonors.map(bg => (
                    <span
                      key={bg}
                      className='px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full'
                    >
                      {bg}
                    </span>
                  ))
                ) : (
                  <p className='text-gray-500 italic text-sm'>
                    Không tìm thấy kết quả phù hợp.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <section>
        <h3 className='text-xl font-bold text-gray-800 mb-3'>
          Lưu ý Tương thích Đặc biệt
        </h3>
        <div className='space-y-3 text-gray-700'>
          <p>
            <strong className='text-red-600'>
              Người cho toàn năng (Hồng cầu):
            </strong>{' '}
            O- có thể hiến hồng cầu cho bất kỳ ai vì không có kháng nguyên A, B,
            hoặc Rh.
          </p>
          <p>
            <strong className='text-red-600'>
              Người nhận toàn năng (Hồng cầu):
            </strong>{' '}
            AB+ có thể nhận hồng cầu từ bất kỳ ai vì họ có cả kháng nguyên A, B
            và Rh, không tạo ra kháng thể chống lại chúng.
          </p>
          <p>
            <strong className='text-gray-600'>Tương thích Huyết tương:</strong>{' '}
            Quy tắc tương thích huyết tương ngược lại với hồng cầu. AB là người
            cho huyết tương toàn năng, trong khi O là người nhận toàn năng.
          </p>
        </div>
      </section>
    </div>
  );

  const renderDonationProcessTab = () => (
    <div className='animate-modal-appear space-y-10'>
      <section>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>
          Quy Trình Hiến Máu
        </h2>
        <p className='text-gray-600'>
          Những điều bạn cần biết khi tham gia hiến máu tại cơ sở của chúng tôi.
        </p>
      </section>

      <section className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div>
          <h3 className='text-xl font-semibold text-red-700 mb-3'>
            Trước khi Hiến máu
          </h3>
          <ul className='list-disc list-inside space-y-2 text-gray-700'>
            <li>Ngủ đủ giấc vào đêm trước.</li>
            <li>Ăn nhẹ trong vòng 3 giờ trước khi hiến máu.</li>
            <li>Uống nhiều nước trước và sau khi hiến.</li>
            <li>Mang theo giấy tờ tùy thân và danh sách thuốc (nếu có).</li>
          </ul>
        </div>
        <div>
          <h3 className='text-xl font-semibold text-red-700 mb-3'>
            Điều kiện Tham gia
          </h3>
          <ul className='list-disc list-inside space-y-2 text-gray-700'>
            <li>Từ 17 tuổi trở lên.</li>
            <li>Cân nặng ít nhất 50 kg.</li>
            <li>Có sức khỏe tốt, không mắc bệnh truyền nhiễm.</li>
            <li>Không hiến máu toàn phần trong 56 ngày qua.</li>
          </ul>
        </div>
      </section>

      <section>
        <h3 className='text-2xl font-bold text-gray-800 mb-4 text-center'>
          Các bước trong Quy trình
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-center'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <UserCheck size={40} className='mx-auto text-red-500 mb-3' />
            <h4 className='font-semibold text-lg'>Đăng ký</h4>
            <p className='text-sm text-gray-600 mt-1'>
              Điền phiếu đăng ký và đọc các tài liệu hướng dẫn.
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <Stethoscope size={40} className='mx-auto text-red-500 mb-3' />
            <h4 className='font-semibold text-lg'>Khám sàng lọc</h4>
            <p className='text-sm text-gray-600 mt-1'>
              Nhân viên y tế sẽ kiểm tra huyết áp, nhiệt độ, và hemoglobin.
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <Syringe size={40} className='mx-auto text-red-500 mb-3' />
            <h4 className='font-semibold text-lg'>Hiến máu</h4>
            <p className='text-sm text-gray-600 mt-1'>
              Quá trình lấy máu chỉ mất khoảng 8-10 phút. Sau đó bạn sẽ nghỉ
              ngơi tại chỗ.
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  // -- Cấu trúc render chính của trang --
  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50'>
      {/* Background Pattern */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-32 w-80 h-80 bg-red-100 rounded-full opacity-20 blur-3xl'></div>
        <div className='absolute -bottom-40 -left-32 w-80 h-80 bg-pink-100 rounded-full opacity-20 blur-3xl'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full opacity-10 blur-3xl'></div>
      </div>

      {/* Hero Section */}
      <div className='relative bg-gradient-to-r from-red-600 to-pink-600 text-white overflow-hidden'>
        <div className='absolute inset-0 bg-black/10'></div>
        <div className='relative container mx-auto px-4 py-16 lg:py-20'>
          <div className='text-center max-w-4xl mx-auto'>
            <div className='inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm mb-6'>
              <HeartHandshake className='w-10 h-10 text-white' />
            </div>
            <h1 className='text-4xl lg:text-6xl font-bold mb-6'>
              Cẩm Nang Hiến Máu
            </h1>
            <p className='text-xl lg:text-2xl text-red-100 mb-8 font-light max-w-3xl mx-auto'>
              Khám phá thế giới tương thích nhóm máu và trở thành người hùng cứu
              người với kiến thức chuyên sâu
            </p>

            {/* Quick Stats */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-3xl mx-auto'>
              <div className='text-center'>
                <div className='text-2xl lg:text-3xl font-bold text-white'>
                  8
                </div>
                <div className='text-red-200 text-sm'>Nhóm máu chính</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl lg:text-3xl font-bold text-white'>
                  3
                </div>
                <div className='text-red-200 text-sm'>Thành phần máu</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl lg:text-3xl font-bold text-white'>
                  100%
                </div>
                <div className='text-red-200 text-sm'>
                  Tương thích chính xác
                </div>
              </div>
              <div className='text-center'>
                <div className='text-2xl lg:text-3xl font-bold text-white'>
                  24/7
                </div>
                <div className='text-red-200 text-sm'>Hỗ trợ khẩn cấp</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='relative container mx-auto px-4 py-12 lg:py-20'>
        <div className='max-w-7xl mx-auto'>
          {/* Tab Navigation - Modern Cards Style */}
          <div className='flex flex-col lg:flex-row gap-4 lg:gap-6 mb-12'>
            <button
              onClick={() => setActiveTab('types')}
              className={`flex-1 p-6 rounded-2xl border-2 transition-all duration-300 ${
                activeTab === 'types'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-xl transform scale-105'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-lg hover:scale-102'
              }`}
            >
              <div className='flex items-center justify-center mb-3'>
                <Info
                  className={`w-8 h-8 ${activeTab === 'types' ? 'text-white' : 'text-blue-600'}`}
                />
              </div>
              <h3 className='text-lg font-semibold mb-2'>Nhóm Máu</h3>
              <p
                className={`text-sm ${activeTab === 'types' ? 'text-blue-100' : 'text-gray-600'}`}
              >
                Tìm hiểu về các nhóm máu và phân bố
              </p>
            </button>

            <button
              onClick={() => setActiveTab('compatibility')}
              className={`flex-1 p-6 rounded-2xl border-2 transition-all duration-300 ${
                activeTab === 'compatibility'
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white border-red-600 shadow-xl transform scale-105'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:shadow-lg hover:scale-102'
              }`}
            >
              <div className='flex items-center justify-center mb-3'>
                <ArrowRightLeft
                  className={`w-8 h-8 ${activeTab === 'compatibility' ? 'text-white' : 'text-red-600'}`}
                />
              </div>
              <h3 className='text-lg font-semibold mb-2'>Tương Thích</h3>
              <p
                className={`text-sm ${activeTab === 'compatibility' ? 'text-red-100' : 'text-gray-600'}`}
              >
                Kiểm tra tương thích hiến và nhận máu
              </p>
            </button>

            <button
              onClick={() => setActiveTab('process')}
              className={`flex-1 p-6 rounded-2xl border-2 transition-all duration-300 ${
                activeTab === 'process'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-600 shadow-xl transform scale-105'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:shadow-lg hover:scale-102'
              }`}
            >
              <div className='flex items-center justify-center mb-3'>
                <Activity
                  className={`w-8 h-8 ${activeTab === 'process' ? 'text-white' : 'text-green-600'}`}
                />
              </div>
              <h3 className='text-lg font-semibold mb-2'>Quy Trình</h3>
              <p
                className={`text-sm ${activeTab === 'process' ? 'text-green-100' : 'text-gray-600'}`}
              >
                Hướng dẫn quy trình hiến máu
              </p>
            </button>
          </div>

          {/* Tab Content */}
          <div className='bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100'>
            {activeTab === 'types' && renderBloodTypesTab()}
            {activeTab === 'compatibility' && renderCompatibilityTab()}
            {activeTab === 'process' && renderDonationProcessTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodCompatibilityCheckerPage;
