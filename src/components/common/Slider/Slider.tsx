import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Slider.module.css';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  fullWidth?: boolean;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      showValue = true,
      valueFormatter = (v) => String(v),
      fullWidth = false,
      className = '',
      value,
      min = 0,
      max = 100,
      id,
      ...props
    },
    ref
  ) => {
    const sliderId = id || `slider-${Math.random().toString(36).slice(2, 9)}`;
    const numValue = typeof value === 'number' ? value : Number(value) || 0;
    const numMin = Number(min);
    const numMax = Number(max);
    const percentage = ((numValue - numMin) / (numMax - numMin)) * 100;

    return (
      <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
        {(label || showValue) && (
          <div className={styles.header}>
            {label && (
              <label htmlFor={sliderId} className={styles.label}>
                {label}
              </label>
            )}
            {showValue && (
              <span className={styles.value}>{valueFormatter(numValue)}</span>
            )}
          </div>
        )}
        <div className={styles.sliderWrapper}>
          <input
            ref={ref}
            id={sliderId}
            type="range"
            className={styles.slider}
            value={value}
            min={min}
            max={max}
            style={{ '--percentage': `${percentage}%` } as React.CSSProperties}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';
