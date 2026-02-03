import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './ColorPicker.module.css';

interface ColorPickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ label, className = '', id, value, ...props }, ref) => {
    const pickerId = id || `color-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && (
          <label htmlFor={pickerId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            id={pickerId}
            type="color"
            className={styles.input}
            value={value}
            {...props}
          />
          <div
            className={styles.swatch}
            style={{ backgroundColor: String(value) }}
          />
          <span className={styles.value}>{String(value).toUpperCase()}</span>
        </div>
      </div>
    );
  }
);

ColorPicker.displayName = 'ColorPicker';
