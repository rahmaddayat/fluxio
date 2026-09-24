import React from 'react';

export interface FinCardProps {
  title: string;
  amount: number | string;
  icon?: React.ReactNode | React.ElementType;
  textColor?: string;
  bgColor?: string;
  iconColor?: string;
  iconBgColor?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Format angka ke format Rupiah Indonesia (contoh: 24500000 -> "Rp 24.500.000")
 */
function formatCurrency(val: number | string): string {
  if (typeof val === 'number') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  }
  return val;
}

export default function FinCard({
  title,
  amount,
  icon: Icon,
  textColor = 'text-slate-900',
  bgColor = 'bg-slate-50',
  iconColor = 'text-slate-700',
  iconBgColor = 'bg-white/80',
  subtitle,
  className = '',
}: FinCardProps) {
  // Render icon whether it's passed as a React Element <Icon /> or an Icon Component
  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    const IconComponent = Icon as React.ElementType;
    return <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />;
  };

  const formattedAmount = formatCurrency(amount);

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border border-white/10 
        shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 
        transition-all duration-300 w-full overflow-hidden ${bgColor} ${className}`}
    >
      <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-white/90 mb-1 truncate">{title}</p>
          <h3
            className={`text-base sm:text-lg lg:text-xl xl:text-2xl font-bold tracking-tight whitespace-nowrap truncate ${textColor}`}
            title={typeof amount === 'string' ? amount : formattedAmount}
          >
            {formattedAmount}
          </h3>
        </div>

        {Icon && (
          <div
            className={`p-2 sm:p-2.5 rounded-xl shadow-xs border border-white/20 flex items-center justify-center shrink-0 ${iconBgColor} ${iconColor}`}
          >
            {renderIcon()}
          </div>
        )}
      </div>

      {subtitle && (
        <div className="mt-3 pt-2.5 border-t border-white/20">
          <p className="text-[11px] sm:text-xs text-white/90 font-medium truncate">{subtitle}</p>
        </div>
      )}
    </div>
  );
}