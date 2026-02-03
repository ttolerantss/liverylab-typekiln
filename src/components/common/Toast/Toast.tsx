import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useUIStore, type ToastType } from '../../../store';
import styles from './Toast.module.css';

interface ToastItemProps {
  type: ToastType;
  message: string;
  onClose: () => void;
}

function ToastItem({ type, message, onClose }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 150);
  };

  const icons: Record<ToastType, React.ReactNode> = {
    success: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    error: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 6L6 10M6 6L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    warning: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 5.5V8.5M8 10.5V10.51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7.13 2.5L1.13 12.5C0.91 12.88 1.18 13.5 1.63 13.5H14.37C14.82 13.5 15.09 12.88 14.87 12.5L8.87 2.5C8.65 2.12 8.35 2.12 8.13 2.5H7.13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    info: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 11V7M8 5V5.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  };

  return (
    <div className={`${styles.toast} ${styles[type]} ${isExiting ? styles.exiting : ''}`}>
      <span className={styles.icon}>{icons[type]}</span>
      <span className={styles.message}>{message}</span>
      <button className={styles.closeButton} onClick={handleClose} aria-label="Dismiss">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return createPortal(
    <div className={styles.container}>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
}
