// src/components/blood/compatibility/CompatibilityTabContent.jsx
import React from 'react';
import { Handshake, HeartPulse } from 'lucide-react';
import LoadingSpinner from '../../common/LoadingSpinner';

const CompatibilityTabContent = ({
  activeSubTab,
  setActiveSubTab,
  isLoading,
  wholeBloodTypes,
  bloodGroups,
  componentTypes,
  selectedWholeBloodId,
  setSelectedWholeBloodId,
  selectedBloodGroup,
  setSelectedBloodGroup,
  selectedComponent,
  setSelectedComponent,
  compatibleDonors,
  compatibleRecipients
}) => {
  return (
    <div className="animate-modal-appear space-y-8">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveSubTab('whole')}
          className={`px-4 py-2 text-sm font-medium ${
            activeSubTab === 'whole'
              ? 'border-b-2 border-red-600 text-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Máu Toàn Phần
        </button>
        <button
          onClick={() => setActiveSubTab('components')}
          className={`px-4 py-2 text-sm font-medium ${
            activeSubTab === 'components'
              ? 'border-b-2 border-red-600 text-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Thành Phần Máu
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="p-4 bg-red-50 rounded-lg shadow-inner">
          {/* Content for sub-tabs */}
          {activeSubTab === 'whole' ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Tra cứu tương thích Máu Toàn Phần
              </h3>
              <label
                htmlFor="selectWholeBloodType"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Chọn nhóm máu:
              </label>
              <select
                id="selectWholeBloodType"
                value={selectedWholeBloodId}
                onChange={e => setSelectedWholeBloodId(e.target.value)}
                className="block w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
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
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Tra cứu tương thích theo Thành Phần Máu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="selectBloodGroup"
                    className="block text-base font-medium text-gray-700 mb-2"
                  >
                    Chọn nhóm máu:
                  </label>
                  <select
                    id="selectBloodGroup"
                    value={selectedBloodGroup}
                    onChange={e => setSelectedBloodGroup(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
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
                    htmlFor="selectComponent"
                    className="block text-base font-medium text-gray-700 mb-2"
                  >
                    Chọn thành phần:
                  </label>
                  <select
                    id="selectComponent"
                    value={selectedComponent}
                    onChange={e => setSelectedComponent(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-md shadow-sm border border-green-200">
              <h3 className="text-lg font-semibold text-green-700 flex items-center mb-3">
                <Handshake size={20} className="mr-2" /> Có thể Hiến cho
              </h3>
              <div className="flex flex-wrap gap-2">
                {compatibleRecipients.length > 0 ? (
                  compatibleRecipients.map(bg => (
                    <span
                      key={bg}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                    >
                      {bg}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-sm">
                    Không tìm thấy kết quả phù hợp.
                  </p>
                )}
              </div>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-700 flex items-center mb-3">
                <HeartPulse size={20} className="mr-2" /> Có thể Nhận từ
              </h3>
              <div className="flex flex-wrap gap-2">
                {compatibleDonors.length > 0 ? (
                  compatibleDonors.map(bg => (
                    <span
                      key={bg}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {bg}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-sm">
                    Không tìm thấy kết quả phù hợp.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <section>
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Lưu ý Tương thích Đặc biệt
        </h3>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong className="text-red-600">
              Người cho toàn năng (Hồng cầu):
            </strong>{' '}
            O- có thể hiến hồng cầu cho bất kỳ ai vì không có kháng nguyên A, B,
            hoặc Rh.
          </p>
          <p>
            <strong className="text-red-600">
              Người nhận toàn năng (Hồng cầu):
            </strong>{' '}
            AB+ có thể nhận hồng cầu từ bất kỳ ai vì họ có cả kháng nguyên A, B
            và Rh, không tạo ra kháng thể chống lại chúng.
          </p>
          <p>
            <strong className="text-gray-600">Tương thích Huyết tương:</strong>{' '}
            Quy tắc tương thích huyết tương ngược lại với hồng cầu. AB là người
            cho huyết tương toàn năng, trong khi O là người nhận toàn năng.
          </p>
        </div>
      </section>
    </div>
  );
};

export default CompatibilityTabContent;
