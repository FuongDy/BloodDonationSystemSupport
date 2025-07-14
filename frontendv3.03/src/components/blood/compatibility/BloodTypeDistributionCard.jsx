// src/components/blood/compatibility/BloodTypeDistributionCard.jsx
import React from 'react';
import { Droplets, Award } from 'lucide-react';

const BloodTypeDistributionCard = ({
  type,
  percentage,
  description,
  isRare = false,
}) => {
  return (
    <div
      className={`bg-gradient-to-br ${
        isRare
          ? 'from-red-50 to-pink-50 border-red-200 hover:from-red-100 hover:to-pink-100'
          : 'from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100'
      } p-6 rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group`}
    >
      <div className="flex items-center justify-between mb-3">
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
      <p className="text-sm text-gray-600 font-medium">{description}</p>
      {isRare && (
        <div className="mt-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <Award className="w-3 h-3 mr-1" />
            Hiếm
          </span>
        </div>
      )}
    </div>
  );
};

export default BloodTypeDistributionCard;
