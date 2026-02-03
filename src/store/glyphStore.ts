import { create } from 'zustand';
import type { Glyph, CaseMode, CharacterMapping } from '../types';
import { FULL_CHARACTER_SET, getCharacterUnicode } from '../utils';

interface GlyphState {
  glyphs: Map<string, Glyph>;
  characterMappings: CharacterMapping[];
  caseMode: CaseMode;
  spaceWidth: number;

  addGlyph: (glyph: Glyph) => void;
  updateGlyph: (id: string, updates: Partial<Glyph>) => void;
  removeGlyph: (id: string) => void;
  assignCharacter: (glyphId: string, character: string) => void;
  unassignCharacter: (character: string) => void;
  setCaseMode: (mode: CaseMode) => void;
  setSpaceWidth: (width: number) => void;
  initializeMappings: () => void;
  clearAll: () => void;

  getGlyphByCharacter: (character: string) => Glyph | undefined;
  getAssignedCharacters: () => string[];
  getUnassignedCharacters: () => string[];
}

export const useGlyphStore = create<GlyphState>((set, get) => ({
  glyphs: new Map(),
  characterMappings: [],
  caseMode: 'both',
  spaceWidth: 250,

  addGlyph: (glyph) =>
    set((state) => {
      const newGlyphs = new Map(state.glyphs);
      newGlyphs.set(glyph.id, glyph);
      return { glyphs: newGlyphs };
    }),

  updateGlyph: (id, updates) =>
    set((state) => {
      const newGlyphs = new Map(state.glyphs);
      const existing = newGlyphs.get(id);
      if (existing) {
        newGlyphs.set(id, { ...existing, ...updates });
      }
      return { glyphs: newGlyphs };
    }),

  removeGlyph: (id) =>
    set((state) => {
      const newGlyphs = new Map(state.glyphs);
      newGlyphs.delete(id);

      // Update character mappings
      const newMappings = state.characterMappings.map((m) =>
        m.glyphId === id ? { ...m, glyphId: undefined, status: 'unassigned' as const } : m
      );

      return { glyphs: newGlyphs, characterMappings: newMappings };
    }),

  assignCharacter: (glyphId, character) =>
    set((state) => {
      const glyph = state.glyphs.get(glyphId);
      if (!glyph) return state;

      // Update glyph with new character
      const newGlyphs = new Map(state.glyphs);
      newGlyphs.set(glyphId, {
        ...glyph,
        character,
        unicode: getCharacterUnicode(character),
      });

      // Update mappings
      const newMappings = state.characterMappings.map((m) => {
        if (m.character === character) {
          return { ...m, glyphId, status: 'assigned' as const };
        }
        if (m.glyphId === glyphId) {
          return { ...m, glyphId: undefined, status: 'unassigned' as const };
        }
        return m;
      });

      return { glyphs: newGlyphs, characterMappings: newMappings };
    }),

  unassignCharacter: (character) =>
    set((state) => {
      const mapping = state.characterMappings.find((m) => m.character === character);
      if (!mapping?.glyphId) return state;

      // Update glyph
      const newGlyphs = new Map(state.glyphs);
      const glyph = newGlyphs.get(mapping.glyphId);
      if (glyph) {
        newGlyphs.set(mapping.glyphId, { ...glyph, character: '' });
      }

      // Update mapping
      const newMappings = state.characterMappings.map((m) =>
        m.character === character
          ? { ...m, glyphId: undefined, status: 'unassigned' as const }
          : m
      );

      return { glyphs: newGlyphs, characterMappings: newMappings };
    }),

  setCaseMode: (caseMode) => set({ caseMode }),
  setSpaceWidth: (spaceWidth) => set({ spaceWidth }),

  initializeMappings: () =>
    set({
      characterMappings: FULL_CHARACTER_SET.map((char) => ({
        character: char,
        unicode: getCharacterUnicode(char),
        name: char,
        glyphId: undefined,
        status: 'unassigned' as const,
      })),
    }),

  clearAll: () =>
    set({
      glyphs: new Map(),
      characterMappings: [],
      caseMode: 'both',
      spaceWidth: 250,
    }),

  getGlyphByCharacter: (character) => {
    const state = get();
    for (const glyph of state.glyphs.values()) {
      if (glyph.character === character) {
        return glyph;
      }
    }
    return undefined;
  },

  getAssignedCharacters: () => {
    const state = get();
    return state.characterMappings
      .filter((m) => m.status === 'assigned')
      .map((m) => m.character);
  },

  getUnassignedCharacters: () => {
    const state = get();
    return state.characterMappings
      .filter((m) => m.status === 'unassigned')
      .map((m) => m.character);
  },
}));
