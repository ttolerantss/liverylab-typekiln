import { useState } from 'react';
import { useGlyphStore, useMetadataStore, useUIStore } from '../../../store';
import { useFontGeneration } from '../../../hooks';
import { Button, ProgressBar } from '../../common';
import type { ExportOptions } from '../../../types';
import styles from './ExportPanel.module.css';

export function ExportPanel() {
  const [formats, setFormats] = useState<('ttf' | 'otf')[]>(['ttf', 'otf']);
  const [includeReadme, setIncludeReadme] = useState(true);

  const glyphs = useGlyphStore((s) => s.glyphs);
  const metadata = useMetadataStore((s) => s.metadata);
  const addToast = useUIStore((s) => s.addToast);
  const { exportFont, progress, isExporting } = useFontGeneration();

  const handleExport = () => {
    if (!metadata.familyName) {
      addToast('error', 'Please enter a font family name');
      return;
    }

    if (glyphs.size === 0) {
      addToast('error', 'Please add at least one glyph');
      return;
    }

    const options: ExportOptions = {
      formats,
      includeReadme,
      zipName: metadata.familyName.replace(/[^a-zA-Z0-9]/g, '-'),
    };

    exportFont(options);
  };

  const toggleFormat = (format: 'ttf' | 'otf') => {
    setFormats((prev) => {
      if (prev.includes(format)) {
        // Don't allow removing the last format
        if (prev.length === 1) return prev;
        return prev.filter((f) => f !== format);
      }
      return [...prev, format];
    });
  };

  const assignedGlyphs = Array.from(glyphs.values()).filter((g) => g.character).length;

  return (
    <div className={styles.container}>
      <div className={styles.summary}>
        <h3 className={styles.title}>Export Summary</h3>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{assignedGlyphs}</span>
            <span className={styles.statLabel}>Glyphs</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{metadata.familyName || '—'}</span>
            <span className={styles.statLabel}>Font Name</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{metadata.styleName || 'Regular'}</span>
            <span className={styles.statLabel}>Style</span>
          </div>
        </div>
      </div>

      <div className={styles.options}>
        <h4 className={styles.optionsTitle}>Export Options</h4>

        <div className={styles.option}>
          <span className={styles.optionLabel}>Formats</span>
          <div className={styles.formats}>
            <label className={styles.formatOption}>
              <input
                type="checkbox"
                checked={formats.includes('ttf')}
                onChange={() => toggleFormat('ttf')}
              />
              <span className={styles.toggleSwitch} />
              <span>TTF</span>
            </label>
            <label className={styles.formatOption}>
              <input
                type="checkbox"
                checked={formats.includes('otf')}
                onChange={() => toggleFormat('otf')}
              />
              <span className={styles.toggleSwitch} />
              <span>OTF</span>
            </label>
          </div>
        </div>

        <div className={styles.option}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={includeReadme}
              onChange={(e) => setIncludeReadme(e.target.checked)}
            />
            <span className={styles.toggleSwitch} />
            <span>Include README.txt</span>
          </label>
        </div>
      </div>

      {progress && (
        <div className={styles.progress}>
          <ProgressBar
            value={progress.progress}
            label={progress.message}
            showPercentage
          />
        </div>
      )}

      <Button
        variant="primary"
        size="large"
        fullWidth
        onClick={handleExport}
        loading={isExporting}
        disabled={!metadata.familyName || glyphs.size === 0}
      >
        Export Font Package
      </Button>

      {(!metadata.familyName || glyphs.size === 0) && (
        <p className={styles.warning}>
          {!metadata.familyName && 'Enter a font family name in Metadata. '}
          {glyphs.size === 0 && 'Upload at least one SVG glyph.'}
        </p>
      )}
    </div>
  );
}
