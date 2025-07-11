// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Toaster } from 'react-hot-toast';          // 🆕
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <Toaster                                         // 🆕
      position="top-right"
      toastOptions={{
        style: { fontSize: '0.875rem' },            // 14 px
        duration: 3000
      }}
    />
  </React.StrictMode>
);
