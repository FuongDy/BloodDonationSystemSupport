import React, { useState, useEffect } from 'react';
import bloodTypeService from '../../services/bloodTypeService';
import AddressPicker from '../common/AddressPicker';

const DonorSearchControls = ({ searchParams, onSearchChange, onSearch, isLoading }) => {
  const [bloodTypes, setBloodTypes] = useState([]);

  useEffect(() => {
    const fetchBloodTypes = async () => {
      try {
        const data = await bloodTypeService.getAll();
        const uniqueBloodTypes = data.filter((bt, index, self) =>
          index === self.findIndex(t => t.bloodGroup === bt.bloodGroup)
        );
        setBloodTypes(uniqueBloodTypes || []);
      } catch (error) {
        console.error("Failed to fetch blood types:", error);
      }
    };
    fetchBloodTypes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onSearchChange({ [name]: value });
  };

  const handleBloodTypeChange = (e) => {
    const { name, value } = e.target;
    onSearchChange({ [name]: value === "all" ? null : parseInt(value, 10) });
  };

  const handleAddressSelect = ({ address, latitude, longitude }) => {
    onSearchChange({ address, latitude, longitude });
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm h-full">
      <h3 className="text-lg font-semibold mb-4 border-b pb-3">Tìm kiếm</h3>
      <div className="space-y-6">

        <AddressPicker
          onAddressSelect={handleAddressSelect}
          value={searchParams.address}
          disabled={isLoading}
        />

        {/* === TRƯỜNG CHỌN NHÓM MÁU === */}
        <div>
          <label htmlFor="bloodTypeId" className="block text-sm font-medium text-gray-700">
            Nhóm máu
          </label>
          <select
            id="bloodTypeId"
            name="bloodTypeId"
            value={searchParams.bloodTypeId === null ? 'all' : searchParams.bloodTypeId}
            onChange={handleBloodTypeChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
          >
            <option value="all">Tất cả</option>
            {bloodTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.bloodGroup}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="radius" className="block text-sm font-medium text-gray-700">
            Bán kính tìm kiếm: {searchParams.radius} km
          </label>
          <input
            type="range"
            id="radius"
            name="radius"
            min="1"
            max="100"
            value={searchParams.radius}
            onChange={handleInputChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
        </div>

        <button
          onClick={onSearch}
          disabled={isLoading}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 disabled:bg-red-300 transition-colors font-semibold"
        >
          {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </div>
    </div>
  );
};

export default DonorSearchControls;