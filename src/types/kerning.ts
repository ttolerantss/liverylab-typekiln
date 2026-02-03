export interface KerningPair {
  id: string;
  left: string;
  right: string;
  value: number;
  isAuto: boolean;
  isModified: boolean;
}

export interface ShapeProfile {
  character: string;
  leftProfile: number[];
  rightProfile: number[];
  topExtent: number;
  bottomExtent: number;
  category: ShapeCategory;
}

export type ShapeCategory =
  | 'round-left'    // O, C, G, Q
  | 'round-right'   // O, D, Q
  | 'diagonal-left' // A, V, W
  | 'diagonal-right'// A, V, W, Y
  | 'vertical-left' // H, I, L, M, N
  | 'vertical-right'// H, I, M, N
  | 'open-left'     // C, L, T
  | 'open-right'    // F, P, T, Y
  | 'mixed';

export const PRIORITY_KERNING_PAIRS = [
  // A combinations
  ['A', 'V'], ['A', 'W'], ['A', 'Y'], ['A', 'T'], ['A', 'v'], ['A', 'w'], ['A', 'y'],
  // L combinations
  ['L', 'T'], ['L', 'V'], ['L', 'W'], ['L', 'Y'], ['L', 'v'], ['L', 'y'],
  // T combinations
  ['T', 'A'], ['T', 'O'], ['T', 'a'], ['T', 'e'], ['T', 'o'], ['T', 'r'], ['T', 'u'], ['T', 'y'],
  // V combinations
  ['V', 'A'], ['V', 'a'], ['V', 'e'], ['V', 'o'], ['V', 'u'],
  // W combinations
  ['W', 'A'], ['W', 'a'], ['W', 'e'], ['W', 'o'],
  // Y combinations
  ['Y', 'A'], ['Y', 'a'], ['Y', 'e'], ['Y', 'i'], ['Y', 'o'], ['Y', 'u'],
  // P combinations
  ['P', 'A'], ['P', 'a'], ['P', '.'], ['P', ','],
  // F combinations
  ['F', 'A'], ['F', 'a'], ['F', '.'], ['F', ','],
  // Punctuation
  ['r', '.'], ['r', ','], ['v', '.'], ['v', ','], ['w', '.'], ['w', ','], ['y', '.'], ['y', ','],
  // Quotes
  ['"', 'A'], ["'", 'A'], ['A', '"'], ['A', "'"],
];
