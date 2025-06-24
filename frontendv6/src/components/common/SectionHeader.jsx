// src/components/common/SectionHeader.jsx
import React from 'react';

const SectionHeader = ({ 
  title, 
  icon: IconComponent,
  className = '',
  iconClassName = 'w-4 h-4 mr-2',
  titleClassName = 'font-medium'
}) => {
  return (
    <h4 className={`mb-3 flex items-center ${titleClassName} ${className}`}>
      {IconComponent && <IconComponent className={iconClassName} />}
      {title}
    </h4>
  );
};

export default SectionHeader;


