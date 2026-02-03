import { useMetadataStore } from '../../../store';
import { Slider } from '../../common';
import {
  MIN_LETTER_SPACING,
  MAX_LETTER_SPACING,
  MIN_WORD_SPACING,
  MAX_WORD_SPACING,
} from '../../../utils';
import styles from './SpacingForm.module.css';

export function SpacingForm() {
  const metrics = useMetadataStore((s) => s.metrics);
  const updateMetrics = useMetadataStore((s) => s.updateMetrics);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Font Spacing (Export)</h3>
      <p className={styles.description}>
        These settings are baked into the exported font file.
      </p>

      <Slider
        label="Letter Spacing"
        value={metrics.letterSpacing}
        min={MIN_LETTER_SPACING}
        max={MAX_LETTER_SPACING}
        onChange={(e) => updateMetrics({ letterSpacing: Number(e.target.value) })}
        valueFormatter={(v) => `${v} units`}
      />

      <Slider
        label="Word Spacing"
        value={metrics.wordSpacing}
        min={MIN_WORD_SPACING}
        max={MAX_WORD_SPACING}
        onChange={(e) => updateMetrics({ wordSpacing: Number(e.target.value) })}
        valueFormatter={(v) => `${v} units`}
      />

      <div className={styles.hint}>
        <p>Letter spacing: extra space after each character ({MIN_LETTER_SPACING} to {MAX_LETTER_SPACING} units)</p>
        <p>Word spacing: width of space character ({MIN_WORD_SPACING} to {MAX_WORD_SPACING} units)</p>
        <p>Standard values: Letter=0, Word=250 (1/4 em)</p>
      </div>
    </div>
  );
}
