import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900/95 border border-brand-500/40 text-slate-100 shadow-2xl backdrop-blur-md animate-fade-in text-xs font-medium max-w-sm">
      <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
      <span className="leading-snug">{message}</span>
      <button
        onClick={onClose}
        className="p-1 rounded-md text-slate-400 hover:text-white transition-colors ml-2"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default Toast;
