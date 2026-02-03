import { SVGPathData } from 'svg-pathdata';
import type { Glyph, FontMetrics, ParsedPath, SVGBounds } from '../../types';
import { UNITS_PER_EM } from '../../utils';

export interface ScaledGlyph {
  paths: string[];
  advanceWidth: number;
  leftSideBearing: number;
}

export function scaleGlyphToFontMetrics(
  paths: ParsedPath[],
  bounds: SVGBounds,
  metrics: FontMetrics,
  targetHeight?: number
): ScaledGlyph {
  const { ascender } = metrics;

  // Calculate scale factor to fit glyph within font metrics
  const glyphHeight = bounds.height || 1;
  const glyphWidth = bounds.width || 1;
  const desiredHeight = targetHeight || ascender * 0.85;
  const scale = desiredHeight / glyphHeight;

  // Calculate the scaled dimensions
  const scaledHeight = glyphHeight * scale;
  const scaledWidth = glyphWidth * scale;

  // Calculate horizontal metrics with proportional sidebearings
  // Use 5% of glyph width (not fixed UPM percentage) to keep spacing proportional
  const sidebearing = Math.round(scaledWidth * 0.05);
  const leftSideBearing = sidebearing;
  const advanceWidth = Math.round(scaledWidth + sidebearing * 2);

  // Helper to transform coordinates from SVG to font space
  // SVG: Y increases downward, origin at top-left
  // Font: Y increases upward, baseline at Y=0
  const transformX = (x: number) => (x - bounds.minX) * scale + leftSideBearing;
  const transformY = (y: number) => scaledHeight - (y - bounds.minY) * scale;

  // Transform each path
  const scaledPaths = paths.map((path) => {
    try {
      const pathData = new SVGPathData(path.d);
      const absCommands = pathData.toAbs().commands;

      const newCommands: string[] = [];
      let lastX = 0;
      let lastY = 0;
      let lastControlX = 0;
      let lastControlY = 0;

      for (const cmd of absCommands) {
        switch (cmd.type) {
          case SVGPathData.MOVE_TO:
            newCommands.push(`M${transformX(cmd.x)} ${transformY(cmd.y)}`);
            lastX = cmd.x;
            lastY = cmd.y;
            lastControlX = cmd.x;
            lastControlY = cmd.y;
            break;
          case SVGPathData.LINE_TO:
            newCommands.push(`L${transformX(cmd.x)} ${transformY(cmd.y)}`);
            lastX = cmd.x;
            lastY = cmd.y;
            lastControlX = cmd.x;
            lastControlY = cmd.y;
            break;
          case SVGPathData.HORIZ_LINE_TO:
            newCommands.push(`L${transformX(cmd.x)} ${transformY(lastY)}`);
            lastX = cmd.x;
            lastControlX = cmd.x;
            lastControlY = lastY;
            break;
          case SVGPathData.VERT_LINE_TO:
            newCommands.push(`L${transformX(lastX)} ${transformY(cmd.y)}`);
            lastY = cmd.y;
            lastControlX = lastX;
            lastControlY = cmd.y;
            break;
          case SVGPathData.CURVE_TO:
            newCommands.push(
              `C${transformX(cmd.x1)} ${transformY(cmd.y1)} ${transformX(cmd.x2)} ${transformY(cmd.y2)} ${transformX(cmd.x)} ${transformY(cmd.y)}`
            );
            lastControlX = cmd.x2;
            lastControlY = cmd.y2;
            lastX = cmd.x;
            lastY = cmd.y;
            break;
          case SVGPathData.SMOOTH_CURVE_TO: {
            // Expand S to full C command - reflect previous control point
            const x1 = lastX * 2 - lastControlX;
            const y1 = lastY * 2 - lastControlY;
            newCommands.push(
              `C${transformX(x1)} ${transformY(y1)} ${transformX(cmd.x2)} ${transformY(cmd.y2)} ${transformX(cmd.x)} ${transformY(cmd.y)}`
            );
            lastControlX = cmd.x2;
            lastControlY = cmd.y2;
            lastX = cmd.x;
            lastY = cmd.y;
            break;
          }
          case SVGPathData.QUAD_TO:
            newCommands.push(
              `Q${transformX(cmd.x1)} ${transformY(cmd.y1)} ${transformX(cmd.x)} ${transformY(cmd.y)}`
            );
            lastControlX = cmd.x1;
            lastControlY = cmd.y1;
            lastX = cmd.x;
            lastY = cmd.y;
            break;
          case SVGPathData.SMOOTH_QUAD_TO: {
            // Expand T to full Q command - reflect previous control point
            const x1 = lastX * 2 - lastControlX;
            const y1 = lastY * 2 - lastControlY;
            newCommands.push(
              `Q${transformX(x1)} ${transformY(y1)} ${transformX(cmd.x)} ${transformY(cmd.y)}`
            );
            lastControlX = x1;
            lastControlY = y1;
            lastX = cmd.x;
            lastY = cmd.y;
            break;
          }
          case SVGPathData.ARC: {
            // Convert arc to cubic bezier approximation
            // For small arcs, a single bezier is a reasonable approximation
            const rx = cmd.rX * scale;
            const ry = cmd.rY * scale;
            const endX = transformX(cmd.x);
            const endY = transformY(cmd.y);
            const startX = transformX(lastX);
            const startY = transformY(lastY);

            // Simple bezier approximation for the arc
            const dx = endX - startX;
            const dy = endY - startY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 0) {
              // Perpendicular offset based on arc radius
              const perpX = -dy / dist;
              const perpY = dx / dist;
              const bulge = Math.min(rx, ry) * 0.55; // Approximation factor
              const sweepDir = cmd.sweepFlag ? -1 : 1; // Flip because Y is flipped

              const cp1x = startX + dx / 3 + perpX * bulge * sweepDir;
              const cp1y = startY + dy / 3 + perpY * bulge * sweepDir;
              const cp2x = startX + dx * 2 / 3 + perpX * bulge * sweepDir;
              const cp2y = startY + dy * 2 / 3 + perpY * bulge * sweepDir;

              newCommands.push(`C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${endX} ${endY}`);
            } else {
              newCommands.push(`L${endX} ${endY}`);
            }

            lastX = cmd.x;
            lastY = cmd.y;
            lastControlX = cmd.x;
            lastControlY = cmd.y;
            break;
          }
          case SVGPathData.CLOSE_PATH:
            newCommands.push('Z');
            break;
        }
      }

      return newCommands.join(' ');
    } catch (e) {
      console.warn('Failed to transform path:', e);
      return path.d;
    }
  });

  return {
    paths: scaledPaths,
    advanceWidth,
    leftSideBearing,
  };
}

export function calculateAutoMetrics(glyphs: Map<string, Glyph>): Partial<FontMetrics> {
  let maxHeight = 0;
  let capHeightRaw = 0;
  let xHeightRaw = 0;

  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const lowercaseXHeight = 'acemnorsuvwxz'.split('');

  for (const glyph of glyphs.values()) {
    const { originalBounds } = glyph;
    const height = originalBounds.height;

    // Track maximum height
    if (height > maxHeight) {
      maxHeight = height;
    }

    // Track cap height from uppercase letters
    if (uppercaseChars.includes(glyph.character)) {
      if (height > capHeightRaw) {
        capHeightRaw = height;
      }
    }

    // Track x-height from lowercase letters
    if (lowercaseXHeight.includes(glyph.character)) {
      if (height > xHeightRaw) {
        xHeightRaw = height;
      }
    }
  }

  // Scale factor to fit glyphs in the UPM with some margin
  const targetHeight = UNITS_PER_EM * 0.85; // Leave 15% margin for line spacing
  const scale = targetHeight / (maxHeight || 1);

  // Calculate scaled metrics
  const ascender = Math.round(maxHeight * scale);
  const capHeight = capHeightRaw > 0 ? Math.round(capHeightRaw * scale) : ascender;

  // If no lowercase, estimate x-height as 70% of cap height
  const xHeight = xHeightRaw > 0
    ? Math.round(xHeightRaw * scale)
    : Math.round(capHeight * 0.7);

  // Small descender for fonts without descender characters
  const descender = -Math.round(UNITS_PER_EM * 0.15);

  return {
    ascender,
    descender,
    capHeight,
    xHeight,
  };
}
