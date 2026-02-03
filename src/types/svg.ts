export interface SVGFile {
  id: string;
  name: string;
  file: File;
  content: string;
  status: 'pending' | 'parsing' | 'parsed' | 'error';
  error?: string;
}

export interface ParsedPath {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface SVGBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

export interface ParsedSVG {
  id: string;
  fileName: string;
  paths: ParsedPath[];
  bounds: SVGBounds;
  viewBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  width: number;
  height: number;
  detectedCharacter?: string;
  detectionMethod?: 'literal' | 'descriptive' | 'manual';
}
