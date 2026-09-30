'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'failure' | 'warning' | 'info' | 'error';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  isLeaving?: boolean;
}

interface NotificationContextType {
  showNotification: (type: NotificationType, message: string, duration?: number) => void;
  notify: {
    success: (message: string, duration?: number) => void;
    failure: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
  };
  closeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const typeStyles: Record<
  NotificationType,
  {
    bg: string;
    border: string;
    text: string;
    icon: React.ElementType;
    iconColor: string;
  }
> = {
  success: {
    bg: 'bg-emerald-50/95 dark:bg-emerald-950/90',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-900 dark:text-emerald-100',
    icon: CheckCircle2,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  failure: {
    bg: 'bg-rose-50/95 dark:bg-rose-950/90',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-900 dark:text-rose-100',
    icon: XCircle,
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  error: {
    bg: 'bg-rose-50/95 dark:bg-rose-950/90',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-900 dark:text-rose-100',
    icon: XCircle,
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  warning: {
    bg: 'bg-amber-50/95 dark:bg-amber-950/90',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-900 dark:text-amber-100',
    icon: AlertTriangle,
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  info: {
    bg: 'bg-sky-50/95 dark:bg-sky-950/90',
    border: 'border-sky-200 dark:border-sky-800',
    text: 'text-sky-900 dark:text-sky-100',
    icon: Info,
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const closeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isLeaving: true } : item))
    );

    // Hapus dari state setelah animasi keluar selesai (350ms)
    setTimeout(() => {
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    }, 350);
  }, []);

  const showNotification = useCallback(
    (type: NotificationType, message: string, duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      setNotifications((prev) => [...prev, { id, type, message, isLeaving: false }]);

      if (duration > 0) {
        setTimeout(() => {
          closeNotification(id);
        }, duration);
      }
    },
    [closeNotification]
  );

  // Stabilkan referensi objek `notify` agar TIDAK memicu re-render / useEffect tak terbatas pada komponen pemanggil
  const notify = useMemo(
    () => ({
      success: (message: string, duration?: number) => showNotification('success', message, duration),
      failure: (message: string, duration?: number) => showNotification('failure', message, duration),
      error: (message: string, duration?: number) => showNotification('error', message, duration),
      warning: (message: string, duration?: number) => showNotification('warning', message, duration),
      info: (message: string, duration?: number) => showNotification('info', message, duration),
    }),
    [showNotification]
  );

  const contextValue = useMemo(
    () => ({ showNotification, notify, closeNotification }),
    [showNotification, notify, closeNotification]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}

      {/* Container Notifikasi Posisi Fixed di Atas Tengah */}
      <div
        className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2.5 w-full max-w-md px-4 pointer-events-none"
        aria-live="polite"
      >
        {notifications.map((item) => {
          const config = typeStyles[item.type] || typeStyles.info;
          const Icon = config.icon;

          return (
            <div
              key={item.id}
              style={{
                animation: item.isLeaving
                  ? 'slideUpFade 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                  : 'slideDownFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
              className={`pointer-events-auto flex items-center justify-between gap-3 w-full px-4 py-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 ${
                config.bg
              } ${config.border}`}
              role="alert"
            >
              {/* Icon & Message */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Icon className={`w-5 h-5 shrink-0 ${config.iconColor}`} />
                <p className={`text-sm font-semibold leading-snug break-words ${config.text}`}>
                  {item.message}
                </p>
              </div>

              {/* Close Button X */}
              <button
                type="button"
                onClick={() => closeNotification(item.id)}
                className={`p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0 ${config.text}`}
                aria-label="Tutup notifikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* CSS Keyframes untuk Animasi Slide Down & Slide Up */}
      <style jsx global>{`
        @keyframes slideDownFade {
          0% {
            opacity: 0;
            transform: translateY(-28px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slideUpFade {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-24px) scale(0.95);
          }
        }
      `}</style>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
