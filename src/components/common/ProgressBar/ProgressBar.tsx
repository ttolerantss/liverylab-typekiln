import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'small' | 'medium';
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  size = 'medium',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={styles.wrapper}>
      {(label || showPercentage) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showPercentage && (
            <span className={styles.percentage}>{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`${styles.track} ${styles[size]}`}>
        <div
          className={styles.fill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
