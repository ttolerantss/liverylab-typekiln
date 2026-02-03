import type { Glyph, KerningPair, ShapeProfile, ShapeCategory } from '../../types';
import { PRIORITY_KERNING_PAIRS } from '../../types';

export function analyzeGlyphShape(glyph: Glyph): ShapeProfile {
  const { originalBounds } = glyph;

  // Sample points along the left and right edges
  const samples = 20;
  const leftProfile: number[] = [];
  const rightProfile: number[] = [];

  // Analyze the shape to determine category
  const category = determineShapeCategory(glyph.character);

  // Create simplified edge profiles (normalized 0-1)
  for (let i = 0; i < samples; i++) {
    // Simplified: use linear interpolation based on character category
    leftProfile.push(getLeftEdgeValue(category, i / samples));
    rightProfile.push(getRightEdgeValue(category, i / samples));
  }

  return {
    character: glyph.character,
    leftProfile,
    rightProfile,
    topExtent: originalBounds.minY,
    bottomExtent: originalBounds.maxY,
    category,
  };
}

function determineShapeCategory(char: string): ShapeCategory {
  const roundLeft = ['O', 'Q', 'C', 'G', 'o', 'c', 'e'];
  const roundRight = ['O', 'Q', 'D', 'o', 'd', 'b', 'p'];
  const diagonalChars = ['A', 'V', 'W', 'Y', 'v', 'w', 'y'];
  const verticalLeft = ['H', 'I', 'L', 'M', 'N', 'h', 'i', 'l', 'm', 'n'];
  const verticalRight = ['H', 'I', 'M', 'N', 'h', 'i', 'm', 'n'];
  const openLeft = ['C', 'L', 'T', 'c'];
  const openRight = ['F', 'P', 'T', 'Y', 'r', 't', 'f'];

  if (roundLeft.includes(char) && roundRight.includes(char)) return 'round-left';
  if (roundLeft.includes(char)) return 'round-left';
  if (roundRight.includes(char)) return 'round-right';
  if (diagonalChars.includes(char)) return 'diagonal-left';
  if (openRight.includes(char)) return 'open-right';
  if (openLeft.includes(char)) return 'open-left';
  if (verticalLeft.includes(char)) return 'vertical-left';
  if (verticalRight.includes(char)) return 'vertical-right';

  return 'mixed';
}

function getLeftEdgeValue(category: ShapeCategory, t: number): number {
  switch (category) {
    case 'round-left':
      return Math.sin(t * Math.PI) * 0.3;
    case 'diagonal-left':
      return t < 0.5 ? t * 0.4 : (1 - t) * 0.4;
    case 'open-left':
      return 0.2;
    case 'vertical-left':
      return 0;
    default:
      return 0.1;
  }
}

function getRightEdgeValue(category: ShapeCategory, t: number): number {
  switch (category) {
    case 'round-right':
      return Math.sin(t * Math.PI) * 0.3;
    case 'diagonal-right':
      return t < 0.5 ? (0.5 - t) * 0.4 : (t - 0.5) * 0.4;
    case 'open-right':
      return 0.3;
    case 'vertical-right':
      return 0;
    default:
      return 0.1;
  }
}

export function calculateKerningValue(
  leftProfile: ShapeProfile,
  rightProfile: ShapeProfile
): number {
  // Base kerning on shape categories
  const leftCat = leftProfile.category;
  const rightCat = rightProfile.category;

  // Known problematic pairs
  const tightPairs: [ShapeCategory, ShapeCategory, number][] = [
    ['diagonal-left', 'diagonal-left', -80],
    ['diagonal-left', 'open-right', -60],
    ['open-left', 'diagonal-left', -60],
    ['open-right', 'diagonal-left', -70],
    ['vertical-right', 'round-left', -20],
    ['round-right', 'vertical-left', -20],
  ];

  for (const [left, right, value] of tightPairs) {
    if (leftCat === left && rightCat === right) {
      return value;
    }
  }

  // Calculate based on profile overlap
  let overlap = 0;
  const samples = Math.min(leftProfile.rightProfile.length, rightProfile.leftProfile.length);

  for (let i = 0; i < samples; i++) {
    const gap = leftProfile.rightProfile[i] + rightProfile.leftProfile[i];
    overlap += gap;
  }

  const avgGap = overlap / samples;

  // Convert gap to kerning value (negative = tighter)
  if (avgGap > 0.3) {
    return Math.round(-avgGap * 100);
  }

  return 0;
}

export function generateAutoKerning(
  glyphs: Map<string, Glyph>,
  profiles: Map<string, ShapeProfile>
): KerningPair[] {
  const pairs: KerningPair[] = [];

  // Generate kerning for priority pairs
  for (const [left, right] of PRIORITY_KERNING_PAIRS) {
    const leftGlyph = Array.from(glyphs.values()).find(g => g.character === left);
    const rightGlyph = Array.from(glyphs.values()).find(g => g.character === right);

    if (!leftGlyph || !rightGlyph) continue;

    const leftProfile = profiles.get(leftGlyph.id);
    const rightProfile = profiles.get(rightGlyph.id);

    if (!leftProfile || !rightProfile) continue;

    const value = calculateKerningValue(leftProfile, rightProfile);

    if (value !== 0) {
      pairs.push({
        id: `${left}-${right}`,
        left,
        right,
        value,
        isAuto: true,
        isModified: false,
      });
    }
  }

  return pairs;
}
