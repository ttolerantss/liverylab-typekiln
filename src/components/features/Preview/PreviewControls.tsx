import { usePreviewStore, useMetadataStore } from '../../../store';
import { Slider, ColorPicker } from '../../common';
import {
  PREVIEW_MIN_SIZE,
  PREVIEW_MAX_SIZE,
  MIN_LETTER_SPACING,
  MAX_LETTER_SPACING,
  MIN_WORD_SPACING,
  MAX_WORD_SPACING,
} from '../../../utils';
import styles from './PreviewControls.module.css';

export function PreviewControls() {
  // Preview-only settings (don't affect export)
  const text = usePreviewStore((s) => s.text);
  const setText = usePreviewStore((s) => s.setText);
  const fontSize = usePreviewStore((s) => s.fontSize);
  const setFontSize = usePreviewStore((s) => s.setFontSize);
  const backgroundColor = usePreviewStore((s) => s.backgroundColor);
  const setBackgroundColor = usePreviewStore((s) => s.setBackgroundColor);
  const textColor = usePreviewStore((s) => s.textColor);
  const setTextColor = usePreviewStore((s) => s.setTextColor);

  // Export settings (baked into the font file)
  const metrics = useMetadataStore((s) => s.metrics);
  const updateMetrics = useMetadataStore((s) => s.updateMetrics);

  return (
    <div className={styles.container}>
      {/* Section 1: Preview Text (preview-only) */}
      <div className={styles.card}>
        <h4 className={styles.sectionTitle}>Preview Text</h4>

        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Enter text to preview..."
        />

        <Slider
          label="Preview Size"
          value={fontSize}
          min={PREVIEW_MIN_SIZE}
          max={PREVIEW_MAX_SIZE}
          onChange={(e) => setFontSize(Number(e.target.value))}
          valueFormatter={(v) => `${v}px`}
        />

        <div className={styles.row}>
          <ColorPicker
            label="Background"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
          <ColorPicker
            label="Text Color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
        </div>
      </div>

      {/* Section 2: Export Settings (affects font file) */}
      <div className={styles.card}>
        <h4 className={styles.sectionTitle}>Export Settings</h4>
        <p className={styles.description}>These settings are baked into the exported font file.</p>

        <Slider
          label="Line Height"
          value={metrics.lineGap}
          min={0}
          max={500}
          onChange={(e) => updateMetrics({ lineGap: Number(e.target.value) })}
          valueFormatter={(v) => `${v} units`}
        />

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
      </div>
    </div>
  );
}
