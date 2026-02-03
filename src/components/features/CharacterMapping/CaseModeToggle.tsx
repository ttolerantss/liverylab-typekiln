import { useGlyphStore } from '../../../store';
import type { CaseMode } from '../../../types';
import styles from './CaseModeToggle.module.css';

const MODES: { value: CaseMode; label: string }[] = [
  { value: 'both', label: 'Both Cases' },
  { value: 'uppercase', label: 'Uppercase Only' },
  { value: 'lowercase', label: 'Lowercase Only' },
];

export function CaseModeToggle() {
  const caseMode = useGlyphStore((s) => s.caseMode);
  const setCaseMode = useGlyphStore((s) => s.setCaseMode);

  return (
    <div className={styles.container}>
      <span className={styles.label}>Case Mode</span>
      <div className={styles.toggle}>
        {MODES.map((mode) => (
          <button
            key={mode.value}
            className={`${styles.option} ${caseMode === mode.value ? styles.active : ''}`}
            onClick={() => setCaseMode(mode.value)}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}
