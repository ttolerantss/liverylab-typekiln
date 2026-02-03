import { create } from 'zustand';

interface PreviewState {
  text: string;
  fontSize: number;
  backgroundColor: string;
  textColor: string;
  selectedGlyphId: string | null;

  setText: (text: string) => void;
  setFontSize: (size: number) => void;
  setBackgroundColor: (color: string) => void;
  setTextColor: (color: string) => void;
  setSelectedGlyph: (id: string | null) => void;
  reset: () => void;
}

const DEFAULT_PREVIEW_TEXT = 'The quick brown fox jumps over the lazy dog.\nABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz\n0123456789 !@#$%^&*()';

export const usePreviewStore = create<PreviewState>((set) => ({
  text: DEFAULT_PREVIEW_TEXT,
  fontSize: 48,
  backgroundColor: '#1a1a1a',
  textColor: '#ffffff',
  selectedGlyphId: null,

  setText: (text) => set({ text }),
  setFontSize: (fontSize) => set({ fontSize }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setTextColor: (textColor) => set({ textColor }),
  setSelectedGlyph: (selectedGlyphId) => set({ selectedGlyphId }),

  reset: () =>
    set({
      text: DEFAULT_PREVIEW_TEXT,
      fontSize: 48,
      backgroundColor: '#1a1a1a',
      textColor: '#ffffff',
      selectedGlyphId: null,
    }),
}));
