'use client';

import React, { useEffect } from 'react';
import { Info, CheckCircle2, AlertCircle, X } from 'lucide-react';

export type InfoModalType = 'info' | 'success' | 'warning' | 'error';

export interface InfoModalProps {
  /** Mengatur apakah modal sedang terbuka atau tertutup */
  isOpen: boolean;
  /** Fungsi callback saat modal ditutup */
  onClose: () => void;
  /** Judul informasi modal */
  title?: string;
  /** Subtitle atau isi detail informasi */
  subtitle?: string;
  /** Ikon kustom (bisa berupa komponen Lucide atau ReactNode) */
  icon?: React.ReactNode | React.ElementType;
  /** Tipe tema info (info | success | warning | error, default: 'info') */
  type?: InfoModalType;
  /** Teks pada tombol konfirmasi tunggal (default: 'Oke') */
  buttonText?: string;
}

const defaultTypeIcons: Record<
  InfoModalType,
  {
    icon: React.ElementType;
    bg: string;
    text: string;
    border: string;
  }
> = {
  info: {
    icon: Info,
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    border: 'border-sky-100',
  },
  success: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-100',
  },
};

export default function InfoModal({
  isOpen,
  onClose,
  title = 'Informasi',
  subtitle,
  icon: Icon,
  type = 'info',
  buttonText = 'Oke',
}: InfoModalProps) {
  // Tutup modal saat tombol Escape ditekan & kunci scroll body
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentTypeConfig = defaultTypeIcons[type] || defaultTypeIcons.info;

  // Render icon
  const renderIcon = () => {
    if (!Icon) {
      const DefaultIcon = currentTypeConfig.icon;
      return (
        <div
          className={`w-12 h-12 rounded-2xl ${currentTypeConfig.bg} ${currentTypeConfig.text} ${currentTypeConfig.border} border flex items-center justify-center mb-4 shadow-sm`}
        >
          <DefaultIcon className="w-6 h-6" />
        </div>
      );
    }

    if (React.isValidElement(Icon)) {
      return <div className="mb-4">{Icon}</div>;
    }

    const IconComponent = Icon as React.ElementType;
    return (
      <div
        className={`w-12 h-12 rounded-2xl ${currentTypeConfig.bg} ${currentTypeConfig.text} ${currentTypeConfig.border} border flex items-center justify-center mb-4 shadow-sm`}
      >
        <IconComponent className="w-6 h-6" />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* ── Backdrop Overlay Gelap ── */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* ── Modal Dialog Card ── */}
      <div
        className="relative w-full max-w-sm sm:max-w-md bg-card text-card-foreground border border-card-border rounded-3xl shadow-2xl p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center text-center"
        role="dialog"
        aria-modal="true"
      >
        {/* Tombol Tutup X di sudut kanan atas */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Tutup modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        {renderIcon()}

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-tight">
          {title}
        </h3>

        {/* Subtitle / Description */}
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Single Action Button (Tombol Oke) */}
        <div className="w-full mt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2.5 sm:py-3 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer active:scale-95 flex items-center justify-center"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
