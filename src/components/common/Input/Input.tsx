import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={`${styles.inputWrapper} ${error ? styles.hasError : ''}`}>
          {icon && iconPosition === 'left' && (
            <span className={`${styles.icon} ${styles.iconLeft}`}>{icon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`${styles.input} ${icon ? styles.hasIcon : ''} ${iconPosition === 'left' ? styles.iconLeft : styles.iconRight}`}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <span className={`${styles.icon} ${styles.iconRight}`}>{icon}</span>
          )}
        </div>
        {error && <span className={styles.error}>{error}</span>}
        {hint && !error && <span className={styles.hint}>{hint}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
