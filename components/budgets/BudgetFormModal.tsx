'use client';

import React, { useState, useEffect } from 'react';
import { X, Tag, DollarSign, Calendar, Plus } from 'lucide-react';
import { Category } from '@/types/transaction';
import { BudgetPeriod } from '@/types/budget';

interface BudgetFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    onCreate: (data: { categoryId: string; limitAmount: number; period: BudgetPeriod }) => Promise<void>;
}

// Format string angka dengan titik pemisah ribuan (contoh: "1000000" -> "1.000.000")
function formatNumberWithDots(val: string | number): string {
    if (!val && val !== 0) return '';
    const cleanStr = String(val).replace(/\D/g, '');
    if (!cleanStr) return '';
    return new Intl.NumberFormat('id-ID').format(parseInt(cleanStr, 10));
}

export default function BudgetFormModal({
    isOpen,
    onClose,
    categories,
    onCreate,
}: BudgetFormModalProps) {
    const [categoryId, setCategoryId] = useState('');
    const [limitAmount, setLimitAmount] = useState('');
    const [period, setPeriod] = useState<BudgetPeriod>('MONTHLY');
    const [isLoading, setIsLoading] = useState(false);

    // Filter kategori pengeluaran (EXPENSE)
    const expenseCategories = categories.filter(c => c.type.toUpperCase() === 'EXPENSE');

    // Reset default saat dibuka
    useEffect(() => {
        if (isOpen) {
            setLimitAmount('');
            setPeriod('MONTHLY');
            if (expenseCategories.length > 0) {
                setCategoryId(expenseCategories[0].id);
            } else {
                setCategoryId('');
            }
        }
    }, [isOpen, categories]);

    if (!isOpen) return null;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawDigits = e.target.value.replace(/\D/g, '');
        if (!rawDigits) {
            setLimitAmount('');
            return;
        }
        setLimitAmount(formatNumberWithDots(rawDigits));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const rawNumeric = limitAmount.replace(/\./g, '');
        if (!categoryId || !rawNumeric || !period) return;

        try {
            setIsLoading(true);
            await onCreate({
                categoryId,
                limitAmount: parseFloat(rawNumeric),
                period,
            });
            onClose();
        } catch (error) {
            console.error('Failed to create budget', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Buat Budget Baru</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Tentukan batas pengeluaran untuk periode tertentu</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Periode Budget Toggle (DAILY / MONTHLY / YEARLY) */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                            Periode Budget
                        </label>
                        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-2xl">
                            <button
                                type="button"
                                onClick={() => setPeriod('DAILY')}
                                className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                                    period === 'DAILY'
                                        ? 'bg-[#1e3a5f] text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Daily (Harian)
                            </button>
                            <button
                                type="button"
                                onClick={() => setPeriod('MONTHLY')}
                                className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                                    period === 'MONTHLY'
                                        ? 'bg-[#1e3a5f] text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Monthly (Bulanan)
                            </button>
                            <button
                                type="button"
                                onClick={() => setPeriod('YEARLY')}
                                className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                                    period === 'YEARLY'
                                        ? 'bg-[#1e3a5f] text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Yearly (Tahunan)
                            </button>
                        </div>
                    </div>

                    {/* Kategori Pengeluaran */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            Kategori Pengeluaran
                        </label>
                        <div className="relative">
                            <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <select
                                required
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Pilih Kategori</option>
                                {expenseCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Batas Nominal Budget (Rp) */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            Batas Nominal Budget (Rp)
                        </label>
                        <div className="relative">
                            <span className="text-xs font-bold text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                                Rp
                            </span>
                            <input
                                type="text"
                                inputMode="numeric"
                                required
                                value={limitAmount}
                                onChange={handleAmountChange}
                                placeholder="1.000.000"
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 font-semibold transition-all"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-2xl shadow-sm transition-all cursor-pointer disabled:opacity-60"
                        >
                            <Plus className="w-4 h-4" />
                            <span>{isLoading ? 'Menyimpan...' : 'Simpan Budget'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
