// src/components/common/TableSkeleton.jsx
import React from 'react';

const TableSkeleton = ({ 
  rows = 5, 
  columns = 4,
  showHeader = true,
  className = ''
}) => {
  const generateSkeletonRows = () => {
    return Array.from({ length: rows }, (_, index) => (
      <tr key={index} className="border-b border-gray-200">
        {Array.from({ length: columns }, (_, colIndex) => (
          <td key={colIndex} className="px-6 py-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              {colIndex === 0 && <div className="h-3 bg-gray-200 rounded w-2/3"></div>}
            </div>
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {showHeader && (
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {Array.from({ length: columns }, (_, index) => (
                  <th key={index} className="px-6 py-4 text-left">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="bg-white divide-y divide-gray-200">
            {generateSkeletonRows()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableSkeleton;

