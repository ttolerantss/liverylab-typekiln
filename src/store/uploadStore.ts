import { create } from 'zustand';
import type { SVGFile, ParsedSVG } from '../types';

interface UploadState {
  files: SVGFile[];
  parsedSVGs: ParsedSVG[];
  isProcessing: boolean;
  processingProgress: number;
  error: string | null;

  addFiles: (files: File[]) => void;
  updateFileStatus: (id: string, status: SVGFile['status'], error?: string) => void;
  updateFileContent: (id: string, content: string) => void;
  addParsedSVG: (svg: ParsedSVG) => void;
  removeParsedSVG: (id: string) => void;
  setProcessing: (isProcessing: boolean) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  removeFile: (id: string) => void;
  clearAll: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  files: [],
  parsedSVGs: [],
  isProcessing: false,
  processingProgress: 0,
  error: null,

  addFiles: (files) =>
    set((state) => ({
      files: [
        ...state.files,
        ...files.map((file) => ({
          id: crypto.randomUUID(),
          name: file.name,
          file,
          content: '',
          status: 'pending' as const,
        })),
      ],
    })),

  updateFileStatus: (id, status, error) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, status, error } : f
      ),
    })),

  updateFileContent: (id, content) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, content } : f
      ),
    })),

  addParsedSVG: (svg) =>
    set((state) => ({
      parsedSVGs: [...state.parsedSVGs, svg],
    })),

  removeParsedSVG: (id) =>
    set((state) => ({
      parsedSVGs: state.parsedSVGs.filter((s) => s.id !== id),
    })),

  setProcessing: (isProcessing) => set({ isProcessing }),
  setProgress: (processingProgress) => set({ processingProgress }),
  setError: (error) => set({ error }),

  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
      parsedSVGs: state.parsedSVGs.filter((s) => s.id !== id),
    })),

  clearAll: () =>
    set({
      files: [],
      parsedSVGs: [],
      isProcessing: false,
      processingProgress: 0,
      error: null,
    }),
}));
