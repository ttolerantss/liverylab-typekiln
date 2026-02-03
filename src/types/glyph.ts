import type { ParsedPath, SVGBounds } from './svg';

export interface Glyph {
  id: string;
  character: string;
  unicode: number;
  name: string;
  paths: ParsedPath[];
  originalBounds: SVGBounds;
  scaledPaths?: string[];
  advanceWidth: number;
  leftSideBearing: number;
  sourceFileId: string;
  sourceFileName: string;
}

export interface GlyphMetrics {
  advanceWidth: number;
  leftSideBearing: number;
  rightSideBearing: number;
  yMin: number;
  yMax: number;
}

export type CaseMode = 'both' | 'uppercase' | 'lowercase';

export interface CharacterMapping {
  character: string;
  unicode: number;
  name: string;
  glyphId?: string;
  status: 'assigned' | 'unassigned' | 'duplicate';
}
