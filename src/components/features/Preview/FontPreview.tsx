import { useEffect, useRef, useMemo } from 'react';
import { usePreviewStore, useGlyphStore, useMetadataStore } from '../../../store';
import styles from './FontPreview.module.css';

export function FontPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Preview-only settings
  const text = usePreviewStore((s) => s.text);
  const fontSize = usePreviewStore((s) => s.fontSize);
  const backgroundColor = usePreviewStore((s) => s.backgroundColor);
  const textColor = usePreviewStore((s) => s.textColor);

  const glyphs = useGlyphStore((s) => s.glyphs);
  const metrics = useMetadataStore((s) => s.metrics);

  // Create a map of character to glyph for quick lookup
  const glyphMap = useMemo(() => {
    const map = new Map<string, typeof glyphs extends Map<string, infer G> ? G : never>();
    for (const glyph of glyphs.values()) {
      if (glyph.character) {
        map.set(glyph.character, glyph);
      }
    }
    return map;
  }, [glyphs]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Calculate scale from UPM to pixels
    const scale = fontSize / metrics.unitsPerEm;

    // Line height: font size + line gap (scaled from font units)
    const lineGapPx = metrics.lineGap * scale;
    const lineHeightPx = fontSize + lineGapPx;

    // Letter and word spacing in pixels (scaled from font units)
    const letterSpacingPx = metrics.letterSpacing * scale;
    const wordSpacingPx = metrics.wordSpacing * scale;

    // Draw text
    const lines = text.split('\n');
    let y = fontSize + 20; // Start with some padding

    for (const line of lines) {
      let x = 20; // Left padding

      // Draw each character
      for (const char of line) {
        // Try to get glyph, with uppercase fallback for lowercase
        let glyph = glyphMap.get(char);
        if (!glyph && char >= 'a' && char <= 'z') {
          glyph = glyphMap.get(char.toUpperCase());
        }

        if (glyph && glyph.paths.length > 0) {
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(scale, scale);

          // Position glyph so its bottom (maxY) aligns with baseline
          // and left edge (minX) starts at x position
          const { minX, maxY, width: glyphWidth } = glyph.originalBounds;
          ctx.translate(-minX, -maxY);

          ctx.fillStyle = textColor;

          for (const path of glyph.paths) {
            const p = new Path2D(path.d);
            ctx.fill(p);
          }

          ctx.restore();

          // Calculate advance from original bounds with proportional sidebearing
          // This matches how we render (using original paths) rather than stored advanceWidth
          const sidebearing = glyphWidth * 0.05;
          const advance = glyphWidth + sidebearing * 2;
          x += advance * scale + letterSpacingPx;
        } else if (char === ' ') {
          x += wordSpacingPx + letterSpacingPx;
        } else {
          // Draw placeholder for missing glyphs
          ctx.fillStyle = 'rgba(255, 100, 100, 0.3)';
          ctx.fillRect(x, y - fontSize, fontSize * 0.6, fontSize);
          x += fontSize * 0.6 + letterSpacingPx;
        }
      }

      y += lineHeightPx;
    }
  }, [text, fontSize, backgroundColor, textColor, glyphMap, metrics]);

  return (
    <div ref={containerRef} className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
      {glyphs.size === 0 && (
        <div className={styles.empty}>
          <p>No glyphs loaded.</p>
          <p className={styles.hint}>Upload SVG files to preview your font.</p>
        </div>
      )}
    </div>
  );
}
