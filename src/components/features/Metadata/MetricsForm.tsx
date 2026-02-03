import { useMetadataStore, useGlyphStore } from '../../../store';
import { Slider, Button } from '../../common';
import { calculateAutoMetrics } from '../../../services';
import { UNITS_PER_EM } from '../../../utils';
import styles from './MetricsForm.module.css';

export function MetricsForm() {
  const metrics = useMetadataStore((s) => s.metrics);
  const updateMetrics = useMetadataStore((s) => s.updateMetrics);
  const glyphs = useGlyphStore((s) => s.glyphs);

  const handleAutoCalculate = () => {
    const autoMetrics = calculateAutoMetrics(glyphs);
    updateMetrics(autoMetrics);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Font Metrics</h3>
        <Button
          variant="secondary"
          size="small"
          onClick={handleAutoCalculate}
          disabled={glyphs.size === 0}
        >
          Auto-Calculate
        </Button>
      </div>

      <div className={styles.info}>
        <span className={styles.label}>Units Per Em</span>
        <span className={styles.value}>{UNITS_PER_EM}</span>
      </div>

      <Slider
        label="Ascender"
        value={metrics.ascender}
        min={0}
        max={UNITS_PER_EM}
        onChange={(e) => updateMetrics({ ascender: Number(e.target.value) })}
        valueFormatter={(v) => `${v} units`}
      />

      <Slider
        label="Descender"
        value={-metrics.descender}
        min={0}
        max={UNITS_PER_EM / 2}
        onChange={(e) => updateMetrics({ descender: -Number(e.target.value) })}
        valueFormatter={(v) => `-${v} units`}
      />

      <Slider
        label="Cap Height"
        value={metrics.capHeight}
        min={0}
        max={metrics.ascender}
        onChange={(e) => updateMetrics({ capHeight: Number(e.target.value) })}
        valueFormatter={(v) => `${v} units`}
      />

      <Slider
        label="x-Height"
        value={metrics.xHeight}
        min={0}
        max={metrics.capHeight}
        onChange={(e) => updateMetrics({ xHeight: Number(e.target.value) })}
        valueFormatter={(v) => `${v} units`}
      />

      <Slider
        label="Line Gap"
        value={metrics.lineGap}
        min={0}
        max={UNITS_PER_EM / 2}
        onChange={(e) => updateMetrics({ lineGap: Number(e.target.value) })}
        valueFormatter={(v) => `${v} units`}
      />
    </div>
  );
}
