// src/mocks/handlers.js
import { authHandlers } from './authHandlers';
import { adminHandlers } from './adminHandlers';
import { bloodHandlers } from './bloodHandlers';

export const handlers = [
    ...authHandlers,
    ...adminHandlers,
    ...bloodHandlers,
    // ...thêm các handlers khác ở đây
];