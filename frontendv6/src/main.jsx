// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Khởi chạy ứng dụng ngay lập tức, không dùng MSW
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
