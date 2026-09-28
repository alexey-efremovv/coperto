'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { create } from 'zustand';

const TOAST_LIFETIME_MS = 5000;

interface Toast {
  id: number;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  show: (message: string) => void;
  dismiss: (id: number) => void;
}

let lastToastId = 0;

const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (message) => {
    const id = ++lastToastId;
    set((state) => ({ toasts: [...state.toasts, { id, message }] }));
    setTimeout(() => get().dismiss(id), TOAST_LIFETIME_MS);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));

export function showToast(message: string) {
  useToastStore.getState().show(message);
}

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div className="fixed right-6 bottom-6 z-50 flex w-80 max-w-[calc(100vw-3rem)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            role="alert"
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="flex items-start gap-3 rounded-lg border-l-4 border-accent bg-ink px-4 py-3 text-sm text-white shadow-lg"
          >
            <p className="flex-1">{toast.message}</p>
            <button
              type="button"
              aria-label="Закрыть уведомление"
              onClick={() => dismiss(toast.id)}
              className="text-white/60 hover:text-white"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
