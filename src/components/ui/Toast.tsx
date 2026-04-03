import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastContextType {
  addToast: (
    message: string,
    type?: 'success' | 'error' | 'info',
    duration?: number
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (
      message: string,
      type: 'success' | 'error' | 'info' = 'info',
      duration = 3000
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      const toast: ToastMessage = { id, message, type, duration };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
            {toasts.map((toast) => (
              <ToastItem
                key={toast.id}
                toast={toast}
                onClose={() => removeToast(toast.id)}
              />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{
  toast: ToastMessage;
  onClose: () => void;
}> = ({ toast, onClose }) => {
  const bgClasses = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textClasses = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  };

  const iconClasses = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className={`h-5 w-5 ${iconClasses.success}`} />;
      case 'error':
        return <AlertCircle className={`h-5 w-5 ${iconClasses.error}`} />;
      case 'info':
      default:
        return <Info className={`h-5 w-5 ${iconClasses.info}`} />;
    }
  };

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${bgClasses[toast.type]} animate-slide-in`}
      role="alert"
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <p className={`text-sm font-medium ${textClasses[toast.type]} flex-1`}>
        {toast.message}
      </p>
      <button
        onClick={onClose}
        className={`flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors`}
        aria-label="Close notification"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ToastProvider;
