'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, DollarSign, FileText, Plus } from 'lucide-react';
import { Category } from '@/types/transaction';

interface TransactionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    onCreate: (data: { description: string; amount: number; categoryId: string; date: string }) => Promise<void>;
}

export default function TransactionFormModal({
    isOpen,
    onClose,
    categories,
    onCreate,
}: TransactionFormModalProps) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [isLoading, setIsLoading] = useState(false);

    // Reset dan atur default saat modal dibuka
    useEffect(() => {
        if (isOpen) {
            setDescription('');
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setType('EXPENSE');
            const defaultCat = categories.find(c => c.type.toUpperCase() === 'EXPENSE');
            if (defaultCat) setCategoryId(defaultCat.id);
        }
    }, [isOpen, categories]);

    if (!isOpen) return null;

    const filteredCategories = categories.filter(c => c.type.toUpperCase() === type);

    const handleTypeChange = (newType: 'INCOME' | 'EXPENSE') => {
        setType(newType);
        const matchingCat = categories.find(c => c.type.toUpperCase() === newType);
        if (matchingCat) {
            setCategoryId(matchingCat.id);
        } else {
            setCategoryId('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim() || !amount || !categoryId || !date) return;

        try {
            setIsLoading(true);
            await onCreate({
                description: description.trim(),
                amount: parseFloat(amount),
                categoryId,
                date,
            });
            onClose();
        } catch (error) {
            console.error('Failed to create transaction', error);
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
                        <h3 className="text-lg font-bold text-slate-900">Tambah Transaksi Baru</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Catat pemasukan atau pengeluaran Anda</p>
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
                    {/* Tipe Transaksi Toggle */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                            Tipe Transaksi
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
                            <button
                                type="button"
                                onClick={() => handleTypeChange('INCOME')}
                                className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                                    type === 'INCOME'
                                        ? 'bg-emerald-600 text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Pemasukan (Income)
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTypeChange('EXPENSE')}
                                className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                                    type === 'EXPENSE'
                                        ? 'bg-rose-600 text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Pengeluaran (Expense)
                            </button>
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            Deskripsi Transaksi
                        </label>
                        <div className="relative">
                            <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Contoh: Salary Deposit, Grocery Shopping"
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 transition-all"
                            />
                        </div>
                    </div>

                    {/* Nominal & Kategori Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Nominal */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                Nominal (Rp)
                            </label>
                            <div className="relative">
                                <span className="text-xs font-bold text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                                    Rp
                                </span>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    step="any"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="100000"
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 font-semibold transition-all"
                                />
                            </div>
                        </div>

                        {/* Kategori */}
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
                                    {filteredCategories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Tanggal Transaksi */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            Tanggal Transaksi
                        </label>
                        <div className="relative">
                            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 transition-all cursor-pointer"
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
                            <span>{isLoading ? 'Menambahkan...' : 'Tambah Transaksi'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
