import React from 'react'

export const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    iconLeft,
    iconRight,
    ...props
}) => {
    const baseStyle =
        'inline-flex items-center justify-center font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ease-in-out';

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const variantStyles = {
        primary: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400',
        secondary: 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-300 border border-gray-300 disabled:bg-gray-50 disabled:text-gray-400',
        danger: 'text-white bg-red-500 hover:bg-red-600 focus:ring-red-500 disabled:bg-red-300',
        outline: 'text-red-600 bg-white border border-red-600 hover:bg-red-50 focus:ring-red-500 disabled:text-red-300 disabled:border-red-300 disabled:hover:bg-white',
        icon: 'p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 focus:ring-red-500 disabled:text-gray-300 disabled:hover:bg-transparent',
        link: 'text-red-600 hover:text-red-800 focus:ring-red-500 underline disabled:text-gray-400 disabled:no-underline',
    };

    return (
        <>
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
                {...props}
            >
            </button>
        </>
    )
}
