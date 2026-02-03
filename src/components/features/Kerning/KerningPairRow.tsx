import type { KerningPair } from '../../../types';
import { useKerningStore } from '../../../store';
import { Slider } from '../../common';
import { KERNING_MIN, KERNING_MAX } from '../../../utils';
import styles from './KerningPairRow.module.css';

interface KerningPairRowProps {
  pair: KerningPair;
}

export function KerningPairRow({ pair }: KerningPairRowProps) {
  const updatePairValue = useKerningStore((s) => s.updatePairValue);
  const removePair = useKerningStore((s) => s.removePair);

  return (
    <div className={`${styles.row} ${pair.isModified ? styles.modified : ''}`}>
      <div className={styles.preview}>
        <span className={styles.char}>{pair.left}</span>
        <span className={styles.char}>{pair.right}</span>
      </div>

      <div className={styles.pair}>
        <span className={styles.chars}>
          {pair.left}{pair.right}
        </span>
        {pair.isAuto && !pair.isModified && (
          <span className={styles.badge}>Auto</span>
        )}
        {pair.isModified && (
          <span className={`${styles.badge} ${styles.modified}`}>Modified</span>
        )}
      </div>

      <div className={styles.slider}>
        <Slider
          value={pair.value}
          min={KERNING_MIN}
          max={KERNING_MAX}
          onChange={(e) => updatePairValue(pair.id, Number(e.target.value))}
          valueFormatter={(v) => `${v > 0 ? '+' : ''}${v}`}
        />
      </div>

      <button
        className={styles.remove}
        onClick={() => removePair(pair.id)}
        aria-label="Remove pair"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
