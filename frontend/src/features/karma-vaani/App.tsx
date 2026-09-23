import React from 'react';
import { AppContextProvider } from '../../context/AppContext';
import { ToastProvider } from '../../context/ToastContext';
import { AppLayout } from '../../layouts/AppLayout';

export default function App() {
  return (
    <AppContextProvider>
      <ToastProvider>
        <AppLayout />
      </ToastProvider>
    </AppContextProvider>
  );
}
