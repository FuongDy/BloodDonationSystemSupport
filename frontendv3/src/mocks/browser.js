import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Cấu hình worker với các handlers đã tạo
export const worker = setupWorker(...handlers);