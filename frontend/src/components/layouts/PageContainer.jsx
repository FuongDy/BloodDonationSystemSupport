import React from 'react';
import { cn } from '../../utils/cn';

// Đóng gói nội dung trang trong một khung cố định
// Giữ nội dung căn giữa màn hình
// Đặt giới hạn chiều rộng(responsive theo các mức sm, md, lg, 7xl, v.v.)
// Thêm padding tự động
// Chỉnh sửa cho từng trang

const PageContainer = ({
    children,
    className,
    maxWidth = "7xl",
    padding = true,
    ...props
}) => {
    const maxWidthClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
        full: "max-w-full",
    };

    return (
        <div
            className={cn(
                "mx-auto",
                maxWidthClasses[maxWidth],
                padding && "px-4 sm:px-6 lg:px-8",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default PageContainer;