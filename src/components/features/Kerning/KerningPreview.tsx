import { useState, useMemo } from 'react';
import { useGlyphStore } from '../../../store';
import { Input } from '../../common';
import styles from './KerningPreview.module.css';

export function KerningPreview() {
  const [previewText, setPreviewText] = useState('AV AWA TAVA');
  const glyphs = useGlyphStore((s) => s.glyphs);

  const glyphMap = useMemo(() => {
    const map = new Map<string, typeof glyphs extends Map<string, infer G> ? G : never>();
    for (const glyph of glyphs.values()) {
      if (glyph.character) {
        map.set(glyph.character, glyph);
        // Also map uppercase to lowercase if lowercase doesn't exist
        if (glyph.character >= 'A' && glyph.character <= 'Z') {
          const lower = glyph.character.toLowerCase();
          if (!map.has(lower)) {
            map.set(lower, glyph);
          }
        }
      }
    }
    return map;
  }, [glyphs]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Kerning Preview</h3>

      <Input
        placeholder="Type to preview kerning..."
        value={previewText}
        onChange={(e) => setPreviewText(e.target.value)}
        fullWidth
      />

      <div className={styles.preview}>
        {previewText.split('').map((char, i) => {
          const glyph = glyphMap.get(char);

          if (char === ' ') {
            return <span key={i} className={styles.space} />;
          }

          if (!glyph) {
            return (
              <span key={i} className={styles.missing}>
                {char}
              </span>
            );
          }

          const { originalBounds, paths } = glyph;
          const padding = 2;
          const viewBox = `${originalBounds.minX - padding} ${originalBounds.minY - padding} ${originalBounds.width + padding * 2} ${originalBounds.height + padding * 2}`;

          return (
            <svg
              key={i}
              viewBox={viewBox}
              className={styles.glyph}
              style={{ aspectRatio: `${originalBounds.width} / ${originalBounds.height}` }}
            >
              {paths.map((path, j) => (
                <path key={j} d={path.d} fill="currentColor" />
              ))}
            </svg>
          );
        })}
      </div>

      <p className={styles.hint}>
        Common kerning pairs: AV, AW, AT, LT, TA, VA, WA, YA
      </p>
    </div>
  );
}
