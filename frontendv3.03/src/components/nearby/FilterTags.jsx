import React from 'react';
import { X } from 'lucide-react';

const FilterTag = ({ children, onRemove }) => (
  <div className="flex items-center bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full">
    <span>{children}</span>
    {onRemove && (
      <button onClick={onRemove} className="ml-2 text-gray-400 hover:text-gray-600">
        <X size={14} />
      </button>
    )}
  </div>
);


const FilterTags = ({ searchParams, bloodTypes }) => {
  const selectedBloodType = bloodTypes.find(bt => bt.id === searchParams.bloodTypeId);

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {selectedBloodType && (
        <FilterTag>Nhóm máu: {selectedBloodType.bloodGroup}</FilterTag>
      )}
      <FilterTag>Bán kính: {searchParams.radius} km</FilterTag>
      {/* You can add more tags here if needed, e.g., for "Khẩn cấp" */}
    </div>
  );
};

export default FilterTags;