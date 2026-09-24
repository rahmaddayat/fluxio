'use client';

import React from 'react';

export interface FixedButtonProps {
  /** Judul atau label teks pada tombol */
  title?: string;
  /** Ikon tombol (bisa berupa komponen Lucide icon atau ReactNode) */
  icon?: React.ReactNode | React.ElementType;
  /** Posisi fixed tombol (contoh: "bottom-6 right-6", "bottom-8 right-8", "bottom-6 left-6") */
  position?: string;
  /** Warna background tombol (contoh: "bg-[#0b0736]", "bg-emerald-600", "bg-indigo-600") */
  bgColor?: string;
  /** Warna teks/font tombol (contoh: "text-white", "text-slate-900") */
  textColor?: string;
  /** Event handler saat tombol diklik */
  onClick?: () => void;
  /** Custom class Tambahan */
  className?: string;
  /** Level z-index (default: "z-50") */
  zIndex?: string;
}

export default function FixedButton({
  title,
  icon: Icon,
  position = 'bottom-6 right-6',
  bgColor = 'bg-[#0b0736]',
  textColor = 'text-white',
  onClick,
  className = '',
  zIndex = 'z-50',
}: FixedButtonProps) {
  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    const IconComponent = Icon as React.ElementType;
    return <IconComponent className="w-5 h-5 shrink-0" />;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`fixed ${position} ${zIndex} inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-full font-medium text-sm shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer ${bgColor} ${textColor} ${className}`}
    >
      {renderIcon()}
      {title && <span className="whitespace-nowrap">{title}</span>}
    </button>
  );
}
