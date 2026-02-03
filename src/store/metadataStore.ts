import { create } from 'zustand';
import type { FontMetadata, FontMetrics, LicenseType } from '../types';
import { DEFAULT_FONT_METADATA, UNITS_PER_EM, DEFAULT_ASCENDER, DEFAULT_DESCENDER, DEFAULT_CAP_HEIGHT, DEFAULT_X_HEIGHT, DEFAULT_LINE_GAP, DEFAULT_LETTER_SPACING, DEFAULT_WORD_SPACING } from '../utils';

interface MetadataState {
  metadata: FontMetadata;
  metrics: FontMetrics;
  metricsLocked: boolean;

  updateMetadata: (updates: Partial<FontMetadata>) => void;
  setLicense: (license: LicenseType) => void;
  updateMetrics: (updates: Partial<FontMetrics>) => void;
  setMetricsLocked: (locked: boolean) => void;
  resetMetadata: () => void;
  resetMetrics: () => void;
}

const defaultMetrics: FontMetrics = {
  unitsPerEm: UNITS_PER_EM,
  ascender: DEFAULT_ASCENDER,
  descender: DEFAULT_DESCENDER,
  capHeight: DEFAULT_CAP_HEIGHT,
  xHeight: DEFAULT_X_HEIGHT,
  lineGap: DEFAULT_LINE_GAP,
  letterSpacing: DEFAULT_LETTER_SPACING,
  wordSpacing: DEFAULT_WORD_SPACING,
};

export const useMetadataStore = create<MetadataState>((set) => ({
  metadata: { ...DEFAULT_FONT_METADATA },
  metrics: { ...defaultMetrics },
  metricsLocked: false,

  updateMetadata: (updates) =>
    set((state) => ({
      metadata: { ...state.metadata, ...updates },
    })),

  setLicense: (license) =>
    set((state) => ({
      metadata: { ...state.metadata, license },
    })),

  updateMetrics: (updates) =>
    set((state) => ({
      metrics: { ...state.metrics, ...updates },
    })),

  setMetricsLocked: (metricsLocked) => set({ metricsLocked }),

  resetMetadata: () =>
    set({
      metadata: { ...DEFAULT_FONT_METADATA },
    }),

  resetMetrics: () =>
    set({
      metrics: { ...defaultMetrics },
      metricsLocked: false,
    }),
}));
