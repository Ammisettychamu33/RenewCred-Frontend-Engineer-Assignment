import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../store/slices/uiSlice';
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
  FiXCircle,
  FiX,
} from 'react-icons/fi';

const ToastItem = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <FiXCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
    warning: <FiAlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
    info: <FiInfo className="w-5 h-5 text-brand-500 flex-shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/80',
    error: 'border-rose-200 bg-rose-50/80',
    warning: 'border-amber-200 bg-amber-50/80',
    info: 'border-brand-200 bg-brand-50/80',
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all transform translate-y-0 duration-200 ${
        borders[toast.type] || borders.info
      }`}
    >
      {icons[toast.type] || icons.info}
      <span className="text-sm font-medium text-slate-800 flex-1">{toast.message}</span>
      <button
        onClick={() => onClose(toast.id)}
        className="text-slate-400 hover:text-slate-600 transition-colors p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
        aria-label="Close notification"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.ui.toasts);

  const handleClose = (id) => {
    dispatch(removeToast(id));
  };

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={handleClose} />
      ))}
    </div>
  );
};

export default ToastContainer;
