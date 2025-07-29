import { ArrowRight, Droplet, Info } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

const BloodCompatibilitySection = () => {
  const [selectedBloodType, setSelectedBloodType] = useState('');
  
  const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  
  // Memoize data để tránh re-create object
  const compatibilityData = useMemo(() => ({
    'O-': { canGiveTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], canReceiveFrom: ['O-'] },
    'O+': { canGiveTo: ['O+', 'A+', 'B+', 'AB+'], canReceiveFrom: ['O-', 'O+'] },
    'A-': { canGiveTo: ['A-', 'A+', 'AB-', 'AB+'], canReceiveFrom: ['O-', 'A-'] },
    'A+': { canGiveTo: ['A+', 'AB+'], canReceiveFrom: ['O-', 'O+', 'A-', 'A+'] },
    'B-': { canGiveTo: ['B-', 'B+', 'AB-', 'AB+'], canReceiveFrom: ['O-', 'B-'] },
    'B+': { canGiveTo: ['B+', 'AB+'], canReceiveFrom: ['O-', 'O+', 'B-', 'B+'] },
    'AB-': { canGiveTo: ['AB-', 'AB+'], canReceiveFrom: ['O-', 'A-', 'B-', 'AB-'] },
    'AB+': { canGiveTo: ['AB+'], canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] }
  }), []);

  // Memoize callback để tránh re-render
  const handleBloodTypeSelect = useCallback((type) => {
    setSelectedBloodType(type);
  }, []);

  // Memoize compatibility info
  const compatibilityInfo = useMemo(() => {
    if (!selectedBloodType) return null;
    return compatibilityData[selectedBloodType];
  }, [selectedBloodType, compatibilityData]);

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 via-pink-50 to-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Droplet className="h-8 w-8 text-red-600 mr-2" />
            <h2 className="text-3xl font-bold text-gray-900">Tương thích nhóm máu</h2>
          </div>
          <p className="text-lg text-black-600 max-w-2xl mx-auto">
            Tìm hiểu về tính tương thích giữa các nhóm máu để hiến và nhận máu an toàn
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Chọn nhóm máu của bạn:
              </label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {bloodTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleBloodTypeSelect(type)}
                    className={`py-3 px-4 rounded-lg font-bold transition-all ${
                      selectedBloodType === type
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {compatibilityInfo && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Có thể hiến cho
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {compatibilityInfo.canGiveTo.map((type) => (
                      <div key={type} className="bg-green-100 text-green-800 py-2 px-3 rounded-lg text-center font-medium">
                        {type}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                    <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
                    Có thể nhận từ
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {compatibilityInfo.canReceiveFrom.map((type) => (
                      <div key={type} className="bg-red-100 text-red-800 py-2 px-3 rounded-lg text-center font-medium">
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                  <p>Thông tin này chỉ mang tính chất tham khảo. Trước khi hiến hoặc nhận máu, luôn cần có sự kiểm tra và xác nhận từ đội ngũ y tế chuyên nghiệp.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(BloodCompatibilitySection);
