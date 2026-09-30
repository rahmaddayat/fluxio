'use client';

import React from 'react';
import { 
    ArrowUp, 
    Utensils, 
    ShoppingBag, 
    Car, 
    Film, 
    Zap, 
    HeartPulse, 
    GraduationCap, 
    Receipt, 
    ArrowDown 
} from 'lucide-react';
import { Transaction } from '@/types/transaction';

export interface TransactionCardProps {
    transaction: Transaction;
    onClick?: (transaction: Transaction) => void;
}

/**
 * Format currency to Indonesian Rupiah (Contoh: "Rp1.000.000,00")
 */
export function formatRupiah(val: number | string): string {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return 'Rp0,00';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num).replace(/\s/g, '');
}

/**
 * Format tanggal ke format D/M/YYYY
 */
export function formatTransactionDate(dateInput: string | Date): string {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export default function TransactionCard({ transaction, onClick }: TransactionCardProps) {
    const isIncome = transaction.category?.type?.toUpperCase() === 'INCOME';
    const categoryName = transaction.category?.name || (isIncome ? 'Income' : 'Food');
    const formattedDate = formatTransactionDate(transaction.date);

    // Ambil Icon yang sesuai dengan kategori
    const getCategoryIcon = () => {
        if (isIncome) {
            return <ArrowUp className="w-5 h-5 text-[#22c55e] stroke-[2.2]" />;
        }

        const lowerName = categoryName.toLowerCase();
        if (lowerName.includes('food') || lowerName.includes('makan') || lowerName.includes('restoran')) {
            return <Utensils className="w-5 h-5 text-[#ef4444] stroke-[2.2]" />;
        }
        if (lowerName.includes('shop') || lowerName.includes('belanja')) {
            return <ShoppingBag className="w-5 h-5 text-[#ef4444] stroke-[2.2]" />;
        }
        if (lowerName.includes('transport') || lowerName.includes('kendaraan')) {
            return <Car className="w-5 h-5 text-[#ef4444] stroke-[2.2]" />;
        }
        if (lowerName.includes('hiburan') || lowerName.includes('entertain')) {
            return <Film className="w-5 h-5 text-[#ef4444] stroke-[2.2]" />;
        }
        if (lowerName.includes('listrik') || lowerName.includes('utility') || lowerName.includes('tagihan')) {
            return <Zap className="w-5 h-5 text-[#ef4444] stroke-[2.2]" />;
        }
        if (lowerName.includes('kesehatan') || lowerName.includes('health')) {
            return <HeartPulse className="w-5 h-5 text-[#ef4444] stroke-[2.2]" />;
        }
        if (lowerName.includes('pendidikan') || lowerName.includes('edu')) {
            return <GraduationCap className="w-5 h-5 text-[#ef4444] stroke-[2.2]" />;
        }

        return <ArrowDown className="w-5 h-5 text-[#ef4444] stroke-[2.2]" />;
    };

    return (
        <div
            onClick={() => onClick && onClick(transaction)}
            className="group w-full bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-[0_3px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.09)] transition-all duration-200 px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-4 cursor-pointer select-none active:scale-[0.99]"
        >
            {/* Sisi Kiri: Icon Bulat + Title & Subtitle */}
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                {/* Icon Circle */}
                <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        isIncome 
                            ? 'bg-[#eaf8ee] text-[#22c55e]' 
                            : 'bg-[#fdeeed] text-[#ef4444]'
                    }`}
                >
                    {getCategoryIcon()}
                </div>

                {/* Deskripsi & Kategori/Tanggal */}
                <div className="min-w-0">
                    <h4 className="font-semibold text-slate-900 text-sm sm:text-base leading-snug truncate group-hover:text-slate-950 transition-colors">
                        {transaction.description}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5 truncate">
                        {formattedDate ? `${formattedDate} - ` : ''}{categoryName}
                    </p>
                </div>
            </div>

            {/* Sisi Kanan: Nominal Transaksi */}
            <div className="text-right shrink-0">
                <span
                    className={`text-sm sm:text-base font-semibold tracking-tight ${
                        isIncome ? 'text-[#22c55e]' : 'text-[#ef4444]'
                    }`}
                >
                    {formatRupiah(transaction.amount)}
                </span>
            </div>
        </div>
    );
}
