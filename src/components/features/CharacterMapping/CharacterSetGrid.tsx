import { useGlyphStore } from '../../../store';
import { FULL_CHARACTER_SET, getDisplayName } from '../../../utils';
import styles from './CharacterSetGrid.module.css';

export function CharacterSetGrid() {
  const characterMappings = useGlyphStore((s) => s.characterMappings);

  const assignedCount = characterMappings.filter((m) => m.status === 'assigned').length;
  const totalCount = FULL_CHARACTER_SET.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Character Coverage</h3>
        <span className={styles.count}>
          {assignedCount} / {totalCount}
        </span>
      </div>

      <div className={styles.grid}>
        {FULL_CHARACTER_SET.map((char) => {
          const mapping = characterMappings.find((m) => m.character === char);
          const isAssigned = mapping?.status === 'assigned';

          return (
            <div
              key={char}
              className={`${styles.cell} ${isAssigned ? styles.assigned : styles.missing}`}
              title={`${getDisplayName(char)} (U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')})`}
            >
              {char === ' ' ? '␣' : char}
            </div>
          );
        })}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.assigned}`} /> Assigned
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.missing}`} /> Missing
        </span>
      </div>
    </div>
  );
}
