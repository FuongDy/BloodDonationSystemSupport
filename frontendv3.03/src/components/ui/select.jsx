// src/components/ui/select.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const Select = ({ 
  children, 
  value, 
  onValueChange, 
  disabled = false,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectValue = (newValue) => {
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => !disabled && setIsOpen(!isOpen),
            disabled,
            isOpen,
            value
          });
        }
        if (child.type === SelectContent) {
          return React.cloneElement(child, {
            isOpen,
            onSelectValue: handleSelectValue,
            value
          });
        }
        return child;
      })}
    </div>
  );
};

export const SelectTrigger = ({ 
  children, 
  onClick, 
  disabled, 
  isOpen, 
  className = '' 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg
        focus:ring-2 focus:ring-red-500 focus:border-red-500
        disabled:bg-gray-50 disabled:cursor-not-allowed
        flex items-center justify-between
        ${className}
      `}
    >
      <span className="truncate">
        {children}
      </span>
      <ChevronDown 
        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
          isOpen ? 'transform rotate-180' : ''
        }`} 
      />
    </button>
  );
};

export const SelectValue = ({ placeholder, value, children }) => {
  if (value && children) {
    // Find the selected option from children
    const selectedChild = React.Children.toArray(children).find(
      child => child.props?.value === value
    );
    return selectedChild?.props?.children || value;
  }
  
  return (
    <span className="text-gray-500">
      {placeholder || 'Select an option...'}
    </span>
  );
};

export const SelectContent = ({ 
  children, 
  isOpen, 
  onSelectValue, 
  value,
  className = '' 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className={`
        absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg
        max-h-60 overflow-auto
        ${className}
      `}
    >
      {React.Children.map(children, (child) => {
        if (child.type === SelectItem) {
          return React.cloneElement(child, {
            onSelect: onSelectValue,
            isSelected: child.props.value === value
          });
        }
        return child;
      })}
    </div>
  );
};

export const SelectItem = ({ 
  children, 
  value, 
  onSelect, 
  disabled = false,
  isSelected = false,
  className = '' 
}) => {
  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect(value);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between
        ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'}
        ${isSelected ? 'bg-red-50 text-red-900' : ''}
        ${className}
      `}
    >
      <span>{children}</span>
      {isSelected && <Check className="w-4 h-4 text-red-600" />}
    </div>
  );
};
