'use client';

import React from 'react';
import { 
    Home, 
    Utensils, 
    ShoppingBag, 
    Car, 
    Film, 
    Zap, 
    HeartPulse, 
    GraduationCap, 
    Layers
} from 'lucide-react';
import { Budget } from '@/types/budget';

export interface BudgetCardProps {
    budget: Budget;
    onClick?: (budget: Budget) => void;
}

/**
 * Format currency to short Indonesian Rupiah format (contoh: "Rp750.000" atau "1.000.000")
 */
export function formatRupiahSimple(val: number | string): string {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '0';
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
}

export default function BudgetCard({ budget, onClick }: BudgetCardProps) {
    const categoryName = budget.category?.name || 'General';
    const spent = budget.spentAmount || 0;
    const limit = typeof budget.limitAmount === 'string' ? parseFloat(budget.limitAmount) : budget.limitAmount;
    const percentage = budget.percentage !== undefined 
        ? budget.percentage 
        : limit > 0 
            ? Math.round((spent / limit) * 100) 
            : 0;

    // Label periode
    const getPeriodLabel = () => {
        const p = (budget.period || 'MONTHLY').toUpperCase();
        if (p === 'DAILY') return 'Daily';
        if (p === 'YEARLY') return 'Yearly';
        return 'Monthly';
    };

    // Ambil outline Icon yang sesuai dengan kategori
    const getCategoryIcon = () => {
        const lowerName = categoryName.toLowerCase();
        if (lowerName.includes('hous') || lowerName.includes('rumah') || lowerName.includes('kost') || lowerName.includes('tempat tinggal')) {
            return <Home className="w-5 h-5 text-slate-800 stroke-[2]" />;
        }
        if (lowerName.includes('food') || lowerName.includes('makan') || lowerName.includes('restoran')) {
            return <Utensils className="w-5 h-5 text-slate-800 stroke-[2]" />;
        }
        if (lowerName.includes('shop') || lowerName.includes('belanja')) {
            return <ShoppingBag className="w-5 h-5 text-slate-800 stroke-[2]" />;
        }
        if (lowerName.includes('transport') || lowerName.includes('kendaraan') || lowerName.includes('bensin')) {
            return <Car className="w-5 h-5 text-slate-800 stroke-[2]" />;
        }
        if (lowerName.includes('hiburan') || lowerName.includes('entertain') || lowerName.includes('movie')) {
            return <Film className="w-5 h-5 text-slate-800 stroke-[2]" />;
        }
        if (lowerName.includes('listrik') || lowerName.includes('utility') || lowerName.includes('tagihan')) {
            return <Zap className="w-5 h-5 text-slate-800 stroke-[2]" />;
        }
        if (lowerName.includes('kesehatan') || lowerName.includes('health') || lowerName.includes('medis')) {
            return <HeartPulse className="w-5 h-5 text-slate-800 stroke-[2]" />;
        }
        if (lowerName.includes('pendidikan') || lowerName.includes('edu') || lowerName.includes('kuliah')) {
            return <GraduationCap className="w-5 h-5 text-slate-800 stroke-[2]" />;
        }

        return <Layers className="w-5 h-5 text-slate-800 stroke-[2]" />;
    };

    // Warna progress bar (hijau default sesuai screenshot)
    const getBarColor = () => {
        if (percentage > 100) return 'bg-rose-500';
        if (percentage >= 90) return 'bg-amber-500';
        return 'bg-[#5cb85c]'; // Hijau sesuai screenshot
    };

    return (
        <div
            onClick={() => onClick && onClick(budget)}
            className="group w-full bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-[0_3px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.09)] transition-all duration-200 p-4 sm:p-5 cursor-pointer select-none active:scale-[0.99]"
        >
            {/* Top Row: Icon + Kategori + Periode Tag di kiri & Nominal Rp... / ... di kanan */}
            <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="shrink-0 text-slate-800">
                        {getCategoryIcon()}
                    </div>
                    <div className="flex items-center gap-2 truncate">
                        <h4 className="font-semibold text-slate-900 text-sm sm:text-base truncate group-hover:text-slate-950 transition-colors">
                            {categoryName}
                        </h4>
                        <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200/60 shrink-0">
                            {getPeriodLabel()}
                        </span>
                    </div>
                </div>

                <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight">
                        Rp{formatRupiahSimple(spent)}/{formatRupiahSimple(limit)}
                    </span>
                </div>
            </div>

            {/* Middle Row: Thick Rounded Progress Bar */}
            <div className="w-full bg-[#f1f5f9] h-3 sm:h-3.5 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>

            {/* Bottom Row: % used */}
            <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    {percentage}% used
                </span>
                {percentage > 100 && (
                    <span className="text-[10px] sm:text-xs text-rose-500 font-bold">
                        Over Budget (+{percentage - 100}%)
                    </span>
                )}
            </div>
        </div>
    );
}
