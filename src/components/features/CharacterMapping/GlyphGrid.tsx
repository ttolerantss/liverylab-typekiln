import { useGlyphStore } from '../../../store';
import { GlyphCard } from './GlyphCard';
import styles from './GlyphGrid.module.css';

export function GlyphGrid() {
  const glyphs = useGlyphStore((s) => s.glyphs);

  if (glyphs.size === 0) {
    return (
      <div className={styles.empty}>
        <p>No glyphs loaded yet.</p>
        <p className={styles.hint}>Upload SVG files to get started.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Loaded Glyphs ({glyphs.size})</h3>
      <div className={styles.grid}>
        {Array.from(glyphs.values()).map((glyph) => (
          <GlyphCard key={glyph.id} glyph={glyph} />
        ))}
      </div>
    </div>
  );
}
