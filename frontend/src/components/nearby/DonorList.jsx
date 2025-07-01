import React from 'react';
import { Loader2, Search } from 'lucide-react';
import DonorResultCard from './DonorResultCard';
import FilterTags from './FilterTags';

const DonorList = ({ donors, isLoading, error, hasSearched, searchParams, bloodTypes }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full">
        <Loader2 className="animate-spin h-8 w-8 text-red-600" />
        <p className="mt-2 text-gray-600">Đang tìm kiếm người hiến máu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-center text-red-600">
        <p>Lỗi: {error.message}</p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center bg-gray-50 rounded-lg p-4">
        <Search className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-800">Tìm kiếm người hiến máu</h3>
        <p className="text-gray-500 max-w-xs">
          Điền thông tin và nhấn "Tìm kiếm" để xem kết quả phù hợp.
        </p>
      </div>
    );
  }

  if (donors.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center text-gray-500">
        <div>
          <p className="font-semibold">Không tìm thấy người hiến máu phù hợp.</p>
          <p className='text-sm mt-2'>Vui lòng thử thay đổi địa chỉ hoặc mở rộng bán kính.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <FilterTags searchParams={searchParams} bloodTypes={bloodTypes} />
      <div className="space-y-3">
        {donors.map((donor) => (
          <DonorResultCard key={donor.id} donor={donor} />
        ))}
      </div>
    </div>
  );
};

export default DonorList;