import { adminHandlers } from './adminHandlers';
import { authHandlers } from './authHandlers';
import { bloodCompatibilityHandlers } from './bloodCompatibilityHandlers';
import { bloodRequestHandlers } from './bloodRequestHandlers';
import { donationHandlers } from './donationHandlers.js';
// import { pledgeHandlers } from './pledgeHandlers.js';
// Gộp tất cả các handler từ các file riêng biệt vào một mảng duy nhất
export const handlers = [
  ...adminHandlers,
  ...authHandlers,
  ...bloodCompatibilityHandlers,
  ...bloodRequestHandlers,
  ...donationHandlers,
  // ...pledgeHandlers,
];
