import React, { useEffect } from 'react';
import { FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import { MdOutlineWarning, MdOutlineError } from "react-icons/md";

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: ToastType;
};

const icons = {
  info: <FaInfoCircle />,
  warning: <MdOutlineWarning />,
  success: <FaCheckCircle />,
  error: <MdOutlineError />
};

interface ToastProps {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  onRemove: (id: string) => void;
};

const Toast: React.FC<ToastProps> = ({ id, title, message, type, onRemove }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onRemove(id);
    }, getTimeout());

    return () => {
      clearTimeout(timeout);
    };
  }, [id, type, onRemove]);

  const getTimeout = () => {
    switch (type) {
      case 'warning':
        return 6500;
      case 'error':
        return 8000;
      default:
        return 5000;
    }
  };

  return (
    <div className={`toast toast-${type} flex gap-2 z-50 pointer-events-auto`} role="alert" onClick={() => onRemove(id)}>
      <span className="toast-icon text-2xl">{icons[type]}</span>
      <div className="toast-content">
        <h4 className="toast-title font-bold">{title}</h4>
        <p className="toast-message text-sm">{message}</p>
      </div>
    </div>
  );
};

export default Toast;