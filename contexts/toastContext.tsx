"use client";

import React, { ReactNode, createContext, useContext, useState, useCallback } from 'react';
import ToastPortal from '@/components/toast/toastPortal';
import { ToastMessage, ToastType } from '@/customTypes/toast';

export interface ToastContextProps {
  showInfo: (title: string, message: string) => void;
  showSuccess: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextProps | null>(null);

export function useToast (): ToastContextProps {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const contextValue = {
    showInfo: (title: string, message: string) => showToast(title, message, 'info'),
    showSuccess: (title: string, message: string) => showToast(title, message, 'success'),
    showWarning: (title: string, message: string) => showToast(title, message, 'warning'),
    showError: (title: string, message: string) => showToast(title, message, 'error'),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastPortal toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}