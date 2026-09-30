'use client';

import React, { useState, useEffect } from 'react';
import { X, Trash2, Calendar, Tag, DollarSign, FileText, Check } from 'lucide-react';
import { Transaction, Category } from '@/types/transaction';
import ConfirmationModal from '@/components/ConfirmationModal';

interface TransactionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
    categories: Category[];
    onUpdate: (updatedData: { id: string; description: string; amount: number; categoryId: string; date: string }) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

// Format string angka dengan titik pemisah ribuan (contoh: "1000000" -> "1.000.000")
function formatNumberWithDots(val: string | number): string {
    if (!val && val !== 0) return '';
    const cleanStr = String(val).replace(/\D/g, '');
    if (!cleanStr) return '';
    return new Intl.NumberFormat('id-ID').format(parseInt(cleanStr, 10));
}

export default function TransactionDetailModal({
    isOpen,
    onClose,
    transaction,
    categories,
    onUpdate,
    onDelete,
}: TransactionDetailModalProps) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');

    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Sinkronisasi data form saat transaction berubah
    useEffect(() => {
        if (transaction) {
            setDescription(transaction.description || '');
            setAmount(transaction.amount !== undefined && transaction.amount !== null ? formatNumberWithDots(transaction.amount) : '');
            setCategoryId(transaction.categoryId || '');
            
            // Format tanggal YYYY-MM-DD untuk input date
            if (transaction.date) {
                const d = new Date(transaction.date);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                setDate(`${year}-${month}-${day}`);
            } else {
                setDate(new Date().toISOString().split('T')[0]);
            }

            const currentCatType = transaction.category?.type?.toUpperCase() === 'INCOME' ? 'INCOME' : 'EXPENSE';
            setType(currentCatType);
        }
    }, [transaction]);

    if (!isOpen || !transaction) return null;

    const filteredCategories = categories.filter(c => c.type.toUpperCase() === type);

    const handleTypeChange = (newType: 'INCOME' | 'EXPENSE') => {
        setType(newType);
        // Reset category ke kategori pertama tipe baru jika tidak cocok
        const matchingCat = categories.find(c => c.type.toUpperCase() === newType);
        if (matchingCat) {
            setCategoryId(matchingCat.id);
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawDigits = e.target.value.replace(/\D/g, '');
        if (!rawDigits) {
            setAmount('');
            return;
        }
        setAmount(formatNumberWithDots(rawDigits));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const rawNumeric = amount.replace(/\./g, '');
        if (!description.trim() || !rawNumeric || !categoryId || !date) return;

        try {
            setIsSaving(true);
            await onUpdate({
                id: transaction.id,
                description: description.trim(),
                amount: parseFloat(rawNumeric),
                categoryId,
                date,
            });
            onClose();
        } catch (error) {
            console.error('Failed to update transaction', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await onDelete(transaction.id);
            setShowDeleteConfirm(false);
            onClose();
        } catch (error) {
            console.error('Failed to delete transaction', error);
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
                            <h3 className="text-lg font-bold text-slate-900">Detail & Edit Transaksi</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Ubah atau hapus transaksi yang dipilih</p>
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
                                    placeholder="Contoh: Salary Deposit, Belanja Bulanan"
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
                                        type="text"
                                        inputMode="numeric"
                                        required
                                        value={amount}
                                        onChange={handleAmountChange}
                                        placeholder="100.000"
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
                title="Hapus Transaksi?"
                subtitle={`Apakah Anda yakin ingin menghapus transaksi "${transaction.description}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Ya, Hapus"
                cancelText="Batal"
                confirmVariant="danger"
                isLoading={isDeleting}
            />
        </>
    );
}
