import { create } from 'zustand';

interface StopPanelState {
  itemId: string | null;
  open: (itemId: string) => void;
  close: () => void;
}

export const useStopPanel = create<StopPanelState>()((set) => ({
  itemId: null,
  open: (itemId) => set({ itemId }),
  close: () => set({ itemId: null }),
}));
