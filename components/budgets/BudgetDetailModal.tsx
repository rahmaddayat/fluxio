'use client';

import React, { useState, useEffect } from 'react';
import { X, Trash2, Tag, DollarSign, Calendar } from 'lucide-react';
import { Budget, BudgetPeriod } from '@/types/budget';
import { Category } from '@/types/transaction';
import ConfirmationModal from '@/components/ConfirmationModal';

interface BudgetDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    budget: Budget | null;
    categories: Category[];
    onUpdate: (updatedData: { id: string; categoryId: string; limitAmount: number; period: BudgetPeriod }) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

// Format string angka dengan titik pemisah ribuan (contoh: "1000000" -> "1.000.000")
function formatNumberWithDots(val: string | number): string {
    if (!val && val !== 0) return '';
    const cleanStr = String(val).replace(/\D/g, '');
    if (!cleanStr) return '';
    return new Intl.NumberFormat('id-ID').format(parseInt(cleanStr, 10));
}

export default function BudgetDetailModal({
    isOpen,
    onClose,
    budget,
    categories,
    onUpdate,
    onDelete,
}: BudgetDetailModalProps) {
    const [categoryId, setCategoryId] = useState('');
    const [limitAmount, setLimitAmount] = useState('');
    const [period, setPeriod] = useState<BudgetPeriod>('MONTHLY');

    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (budget) {
            setCategoryId(budget.categoryId || '');
            setLimitAmount(budget.limitAmount !== undefined ? formatNumberWithDots(budget.limitAmount) : '');
            const p = (budget.period || 'MONTHLY').toUpperCase() as BudgetPeriod;
            setPeriod(p === 'DAILY' || p === 'YEARLY' ? p : 'MONTHLY');
        }
    }, [budget]);

    if (!isOpen || !budget) return null;

    // Filter kategori pengeluaran (EXPENSE)
    const expenseCategories = categories.filter(c => c.type.toUpperCase() === 'EXPENSE');

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawDigits = e.target.value.replace(/\D/g, '');
        if (!rawDigits) {
            setLimitAmount('');
            return;
        }
        setLimitAmount(formatNumberWithDots(rawDigits));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const rawNumeric = limitAmount.replace(/\./g, '');
        if (!categoryId || !rawNumeric || !period) return;

        try {
            setIsSaving(true);
            await onUpdate({
                id: budget.id,
                categoryId,
                limitAmount: parseFloat(rawNumeric),
                period,
            });
            onClose();
        } catch (error) {
            console.error('Failed to update budget', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await onDelete(budget.id);
            setShowDeleteConfirm(false);
            onClose();
        } catch (error) {
            console.error('Failed to delete budget', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
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
                            <h3 className="text-lg font-bold text-slate-900">Detail & Edit Budget</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Ubah batas pengeluaran atau periode budget ini</p>
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
                    <form onSubmit={handleSave} className="p-6 space-y-4">
                        {/* Periode Budget Toggle */}
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
                                Kategori
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
                        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                            {/* Tombol Hapus */}
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors cursor-pointer active:scale-95"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Hapus</span>
                            </button>

                            {/* Tombol Batal & Simpan */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-2xl shadow-sm transition-all cursor-pointer disabled:opacity-60"
                                >
                                    {isSaving ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Konfirmasi Hapus Dialog */}
            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Budget?"
                subtitle={`Apakah Anda yakin ingin menghapus budget kategori "${budget.category?.name || 'ini'}"?`}
                confirmText="Ya, Hapus"
                cancelText="Batal"
                confirmVariant="danger"
                isLoading={isDeleting}
            />
        </>
    );
}
