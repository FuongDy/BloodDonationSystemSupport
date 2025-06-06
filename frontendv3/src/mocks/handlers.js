import { adminHandlers } from './adminHandlers';
import { authHandlers } from './authHandlers';

// Gộp tất cả các handler từ các file riêng biệt vào một mảng duy nhất
export const handlers = [
    ...adminHandlers,
    ...authHandlers,
];