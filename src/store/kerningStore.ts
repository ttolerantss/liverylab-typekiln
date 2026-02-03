import { create } from 'zustand';
import type { KerningPair, ShapeProfile } from '../types';

interface KerningState {
  pairs: KerningPair[];
  shapeProfiles: Map<string, ShapeProfile>;
  isCalculating: boolean;
  calculationProgress: number;

  addPair: (pair: KerningPair) => void;
  updatePairValue: (id: string, value: number) => void;
  removePair: (id: string) => void;
  resetPair: (id: string) => void;
  setPairs: (pairs: KerningPair[]) => void;
  setShapeProfiles: (profiles: Map<string, ShapeProfile>) => void;
  setCalculating: (isCalculating: boolean) => void;
  setProgress: (progress: number) => void;
  clearAll: () => void;

  getPair: (left: string, right: string) => KerningPair | undefined;
  getKernValue: (left: string, right: string) => number;
}

export const useKerningStore = create<KerningState>((set, get) => ({
  pairs: [],
  shapeProfiles: new Map(),
  isCalculating: false,
  calculationProgress: 0,

  addPair: (pair) =>
    set((state) => ({
      pairs: [...state.pairs, pair],
    })),

  updatePairValue: (id, value) =>
    set((state) => ({
      pairs: state.pairs.map((p) =>
        p.id === id ? { ...p, value, isModified: true } : p
      ),
    })),

  removePair: (id) =>
    set((state) => ({
      pairs: state.pairs.filter((p) => p.id !== id),
    })),

  resetPair: (id) =>
    set((state) => ({
      pairs: state.pairs.map((p) =>
        p.id === id ? { ...p, isModified: false } : p
      ),
    })),

  setPairs: (pairs) => set({ pairs }),

  setShapeProfiles: (shapeProfiles) => set({ shapeProfiles }),

  setCalculating: (isCalculating) => set({ isCalculating }),
  setProgress: (calculationProgress) => set({ calculationProgress }),

  clearAll: () =>
    set({
      pairs: [],
      shapeProfiles: new Map(),
      isCalculating: false,
      calculationProgress: 0,
    }),

  getPair: (left, right) => {
    const state = get();
    return state.pairs.find((p) => p.left === left && p.right === right);
  },

  getKernValue: (left, right) => {
    const pair = get().getPair(left, right);
    return pair?.value ?? 0;
  },
}));
