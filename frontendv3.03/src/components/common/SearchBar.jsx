// src/components/common/SearchBar.jsx
import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';

const SearchBar = ({
  placeholder = 'Tìm kiếm...',
  value = '',
  onChange,
  onClear,
  debounceMs = 300,
  showClearButton = true,
  showFilterIcon = false,
  onFilterClick,
  disabled = false,
  className = '',
  size = 'md', // 'sm', 'md', 'lg'
  variant = 'default', // 'default', 'bordered', 'filled'
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (onChange && debounceMs > 0) {
      const timeoutId = setTimeout(() => {
        onChange(localValue);
      }, debounceMs);

      return () => clearTimeout(timeoutId);
    }
  }, [localValue, onChange, debounceMs]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // If no debounce, call onChange immediately
    if (debounceMs === 0) {
      onChange?.(newValue);
    }
  };

  const handleClear = () => {
    setLocalValue('');
    onChange?.('');
    onClear?.();
  };

  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  // Style variants
  const variantClasses = {
    default: 'border border-gray-300 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500',
    bordered: 'border-2 border-gray-300 bg-white focus:border-red-500',
    filled: 'border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500',
  };

  const baseClasses = `
    w-full rounded-lg shadow-sm transition-all duration-200
    placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Icon size based on component size
  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  // Padding adjustments for icons
  const paddingLeft = showFilterIcon ? 'pl-12' : 'pl-10';
  const paddingRight = showClearButton && localValue ? 'pr-10' : 'pr-4';

  return (
    <div className="relative">
      {/* Search Icon */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Search className={iconSize[size]} />
      </div>

      {/* Filter Icon (optional) */}
      {showFilterIcon && (
        <button
          type="button"
          onClick={onFilterClick}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={disabled}
        >
          <Filter className={iconSize[size]} />
        </button>
      )}

      {/* Input Field */}
      <input
        type="text"
        value={localValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`${baseClasses} ${paddingLeft} ${paddingRight}`}
      />

      {/* Clear Button */}
      {showClearButton && localValue && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Xóa tìm kiếm"
        >
          <X className={iconSize[size]} />
        </button>
      )}
    </div>
  );
};

// Export với một số preset variants
export const SearchBarVariants = {
  Default: (props) => <SearchBar {...props} />,
  Small: (props) => <SearchBar {...props} size="sm" />,
  Large: (props) => <SearchBar {...props} size="lg" />,
  Filled: (props) => <SearchBar {...props} variant="filled" />,
  WithFilter: (props) => <SearchBar {...props} showFilterIcon={true} />,
};

export default SearchBar;