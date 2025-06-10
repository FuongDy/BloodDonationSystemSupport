// src/mocks/browser.js

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { initializeDb } from './db'; // THÊM: Import hàm khởi tạo

initializeDb(); // THÊM: Gọi hàm để nạp dữ liệu trước khi worker khởi động

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);