// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.jsx';
// import './index.css';


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );

// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Hàm để khởi động MSW
async function enableMocking() {
  // Chỉ chạy mock khi ở môi trường development
  if (import.meta.env.MODE !== 'development') {
    return;
  }
  console.log("MSW is running in development mode.");
  const { worker } = await import('./mocks/browser.js');
  // `onUnhandledRequest: 'bypass'` cho phép các request không được mock đi qua bình thường
  return worker.start({ onUnhandledRequest: 'bypass' });
}

// Khởi động MSW trước khi render App
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});