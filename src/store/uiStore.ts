import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface Modal {
  id: string;
  type: 'confirm' | 'help' | 'character-select' | 'export-guide';
  props?: Record<string, unknown>;
}

interface UIState {
  activeTab: 'upload' | 'mapping' | 'kerning' | 'preview' | 'metadata' | 'export';
  toasts: Toast[];
  modals: Modal[];
  isSidebarOpen: boolean;

  setActiveTab: (tab: UIState['activeTab']) => void;
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  openModal: (modal: Omit<Modal, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'upload',
  toasts: [],
  modals: [],
  isSidebarOpen: true,

  setActiveTab: (activeTab) => set({ activeTab }),

  addToast: (type, message, duration = 5000) => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, duration }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  openModal: (modal) => {
    const id = crypto.randomUUID();
    set((state) => ({
      modals: [...state.modals, { ...modal, id }],
    }));
    return id;
  },

  closeModal: (id) =>
    set((state) => ({
      modals: state.modals.filter((m) => m.id !== id),
    })),

  closeAllModals: () => set({ modals: [] }),

  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
