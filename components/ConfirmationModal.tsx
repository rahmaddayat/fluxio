'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export interface ConfirmationModalProps {
  /** Mengatur apakah modal sedang terbuka atau tertutup */
  isOpen: boolean;
  /** Fungsi untuk menutup modal (misal saat klik batal, backdrop, atau tombol x) */
  onClose: () => void;
  /** Fungsi callback saat tombol konfirmasi/ya ditekan */
  onConfirm: () => void;
  /** Judul modal */
  title?: string;
  /** Subtitle atau deskripsi pesan modal */
  subtitle?: string;
  /** Ikon kustom (komponen Lucide atau ReactNode) */
  icon?: React.ReactNode | React.ElementType;
  /** Teks pada tombol konfirmasi (default: 'Ya') */
  confirmText?: string;
  /** Teks pada tombol batal (default: 'Tidak') */
  cancelText?: string;
  /** Varian warna tombol konfirmasi ('primary' | 'danger' | 'warning', default: 'primary') */
  confirmVariant?: 'primary' | 'danger' | 'warning';
  /** Status loading pada tombol konfirmasi */
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Aksi',
  subtitle,
  icon: Icon,
  confirmText = 'Ya',
  cancelText = 'Tidak',
  confirmVariant = 'primary',
  isLoading = false,
}: ConfirmationModalProps) {
  // Tutup modal saat tombol Escape ditekan & kunci scroll body
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  // Render icon
  const renderIcon = () => {
    if (!Icon) {
      return (
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 shadow-sm border border-amber-100">
          <AlertTriangle className="w-6 h-6" />
        </div>
      );
    }

    if (React.isValidElement(Icon)) {
      return <div className="mb-4">{Icon}</div>;
    }

    const IconComponent = Icon as React.ElementType;
    return (
      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 shadow-sm border border-amber-100">
        <IconComponent className="w-6 h-6" />
      </div>
    );
  };

  const confirmBtnStyles = {
    primary:
      'bg-primary hover:bg-primary-hover text-white shadow-primary/25',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25',
    warning:
      'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25',
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* ── Backdrop Overlay Gelap ── */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => {
          if (!isLoading) onClose();
        }}
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
          disabled={isLoading}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
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

        {/* Action Buttons (2 Tombol: Tidak / Ya) */}
        <div className="flex items-center gap-3 w-full mt-2">
          {/* Tombol Batal / Tidak */}
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-2xl transition-all duration-150 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>

          {/* Tombol Konfirmasi / Ya */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 sm:py-3 font-semibold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${confirmBtnStyles[confirmVariant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
