import opentype from 'opentype.js';
import { SVGPathData } from 'svg-pathdata';
import type { Glyph, FontMetadata, FontMetrics, KerningPair } from '../../types';
import { UNITS_PER_EM } from '../../utils';
import { scaleGlyphToFontMetrics } from './glyphScaler';

export interface BuildFontOptions {
  glyphs: Map<string, Glyph>;
  metadata: FontMetadata;
  metrics: FontMetrics;
  kerningPairs: KerningPair[];
}

export function buildFont(options: BuildFontOptions): opentype.Font {
  const { glyphs, metadata, metrics, kerningPairs } = options;
  const { letterSpacing, wordSpacing } = metrics;

  // Create notdef glyph (required)
  const notdefPath = new opentype.Path();
  notdefPath.moveTo(100, 0);
  notdefPath.lineTo(100, 700);
  notdefPath.lineTo(500, 700);
  notdefPath.lineTo(500, 0);
  notdefPath.closePath();
  notdefPath.moveTo(150, 50);
  notdefPath.lineTo(450, 50);
  notdefPath.lineTo(450, 650);
  notdefPath.lineTo(150, 650);
  notdefPath.closePath();

  const notdefGlyph = new opentype.Glyph({
    name: '.notdef',
    unicode: 0,
    advanceWidth: 600,
    path: notdefPath,
  });

  // Create space glyph (word spacing + letter spacing)
  const spaceGlyph = new opentype.Glyph({
    name: 'space',
    unicode: 32,
    advanceWidth: wordSpacing + letterSpacing,
    path: new opentype.Path(),
  });

  // Convert our glyphs to opentype glyphs
  const otGlyphs: opentype.Glyph[] = [notdefGlyph, spaceGlyph];

  // Build a map of character to glyph for fallback lookups
  const charToGlyph = new Map<string, Glyph>();
  for (const glyph of glyphs.values()) {
    if (glyph.character) {
      charToGlyph.set(glyph.character, glyph);
    }
  }

  // Track which characters we've added to avoid duplicates
  const addedUnicodes = new Set<number>([0, 32]); // notdef and space

  // Helper function to create an opentype glyph from our glyph data
  const createOTGlyph = (glyph: Glyph, unicode: number, name: string): opentype.Glyph | null => {
    try {
      const scaled = scaleGlyphToFontMetrics(
        glyph.paths,
        glyph.originalBounds,
        metrics
      );

      const otPath = new opentype.Path();

      let lastX = 0;
      let lastY = 0;
      let lastControlX = 0;
      let lastControlY = 0;

      for (const pathStr of scaled.paths) {
        const pathData = new SVGPathData(pathStr);
        const commands = pathData.toAbs().commands;

        for (const cmd of commands) {
          switch (cmd.type) {
            case SVGPathData.MOVE_TO:
              otPath.moveTo(cmd.x, cmd.y);
              lastX = cmd.x;
              lastY = cmd.y;
              // Reset control point for smooth curves after move
              lastControlX = cmd.x;
              lastControlY = cmd.y;
              break;
            case SVGPathData.LINE_TO:
              otPath.lineTo(cmd.x, cmd.y);
              lastX = cmd.x;
              lastY = cmd.y;
              // Reset control point for smooth curves after line
              lastControlX = cmd.x;
              lastControlY = cmd.y;
              break;
            case SVGPathData.HORIZ_LINE_TO:
              otPath.lineTo(cmd.x, lastY);
              lastX = cmd.x;
              lastControlX = cmd.x;
              lastControlY = lastY;
              break;
            case SVGPathData.VERT_LINE_TO:
              otPath.lineTo(lastX, cmd.y);
              lastY = cmd.y;
              lastControlX = lastX;
              lastControlY = cmd.y;
              break;
            case SVGPathData.CURVE_TO:
              otPath.curveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
              lastControlX = cmd.x2;
              lastControlY = cmd.y2;
              lastX = cmd.x;
              lastY = cmd.y;
              break;
            case SVGPathData.SMOOTH_CURVE_TO: {
              const x1 = lastX * 2 - lastControlX;
              const y1 = lastY * 2 - lastControlY;
              otPath.curveTo(x1, y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
              lastControlX = cmd.x2;
              lastControlY = cmd.y2;
              lastX = cmd.x;
              lastY = cmd.y;
              break;
            }
            case SVGPathData.QUAD_TO:
              otPath.quadTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
              lastControlX = cmd.x1;
              lastControlY = cmd.y1;
              lastX = cmd.x;
              lastY = cmd.y;
              break;
            case SVGPathData.SMOOTH_QUAD_TO: {
              const x1 = lastX * 2 - lastControlX;
              const y1 = lastY * 2 - lastControlY;
              otPath.quadTo(x1, y1, cmd.x, cmd.y);
              lastControlX = x1;
              lastControlY = y1;
              lastX = cmd.x;
              lastY = cmd.y;
              break;
            }
            case SVGPathData.ARC: {
              // Arcs are approximated as lines (opentype.js doesn't support arcs directly)
              otPath.lineTo(cmd.x, cmd.y);
              lastX = cmd.x;
              lastY = cmd.y;
              lastControlX = cmd.x;
              lastControlY = cmd.y;
              break;
            }
            case SVGPathData.CLOSE_PATH:
              otPath.closePath();
              // Don't reset position - closePath returns to the start of the current subpath
              break;
          }
        }
      }

      return new opentype.Glyph({
        name,
        unicode,
        advanceWidth: scaled.advanceWidth + letterSpacing,
        path: otPath,
      });
    } catch (e) {
      console.warn(`Failed to convert glyph ${name}:`, e);
      return null;
    }
  };

  // First pass: add all directly mapped glyphs
  for (const glyph of glyphs.values()) {
    if (!glyph.character || glyph.character === ' ') continue;
    if (addedUnicodes.has(glyph.unicode)) continue;

    const otGlyph = createOTGlyph(glyph, glyph.unicode, glyph.name || glyph.character);
    if (otGlyph) {
      otGlyphs.push(otGlyph);
      addedUnicodes.add(glyph.unicode);
    }
  }

  // Second pass: add lowercase fallbacks using uppercase glyphs
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  for (const lower of lowercaseLetters) {
    const lowerUnicode = lower.charCodeAt(0);

    // Skip if we already have this lowercase letter
    if (addedUnicodes.has(lowerUnicode)) continue;

    // Check if we have the uppercase version
    const upper = lower.toUpperCase();
    const upperGlyph = charToGlyph.get(upper);

    if (upperGlyph) {
      // Create a lowercase glyph using the uppercase glyph's paths
      const otGlyph = createOTGlyph(upperGlyph, lowerUnicode, lower);
      if (otGlyph) {
        otGlyphs.push(otGlyph);
        addedUnicodes.add(lowerUnicode);
      }
    }
  }

  // Create the font
  const font = new opentype.Font({
    familyName: metadata.familyName,
    styleName: metadata.styleName,
    unitsPerEm: UNITS_PER_EM,
    ascender: metrics.ascender,
    descender: metrics.descender,
    glyphs: otGlyphs,
  });

  // Add kerning pairs
  if (kerningPairs.length > 0) {
    const kerningTable: Record<string, Record<string, number>> = {};

    for (const pair of kerningPairs) {
      if (pair.value !== 0) {
        if (!kerningTable[pair.left]) {
          kerningTable[pair.left] = {};
        }
        kerningTable[pair.left][pair.right] = pair.value;
      }
    }

    // Note: opentype.js doesn't have a direct API to add kerning
    // The kerning would need to be added via GPOS table manipulation
    // For now, we'll skip this as it requires more complex table building
  }

  return font;
}

export function exportFontToArrayBuffer(font: opentype.Font): ArrayBuffer {
  return font.toArrayBuffer();
}
