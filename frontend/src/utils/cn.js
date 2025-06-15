import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Gộp class hiệu quả như classnames, clsx
// Xử lý thông minh class Tailwind bị trùng(twMerge)
// Dễ bảo trì, ít bug hơn khi viết nhiều điều kiện class

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}