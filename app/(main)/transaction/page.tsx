'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    Search, 
    Calendar, 
    ChevronDown, 
    Plus, 
    X, 
    RotateCcw,
    Receipt
} from 'lucide-react';
import TransactionCard from '@/components/transactions/TransactionCard';
import TransactionDetailModal from '@/components/transactions/TransactionDetailModal';
import TransactionFormModal from '@/components/transactions/TransactionFormModal';
import FixedButton from '@/components/FixedButton';
import { Transaction, Category } from '@/types/transaction';
import { useNotification } from '@/components/NotificationContext';

export default function TransactionPage() {
    const { notify } = useNotification();

    // Data State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [activeTab, setActiveTab] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Date Input Refs for Reliable Picker Triggering
    const startDateInputRef = useRef<HTMLInputElement>(null);
    const endDateInputRef = useRef<HTMLInputElement>(null);

    // Modal State
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Fetch Categories
    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch('/api/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    }, []);

    // Fetch Transactions
    const fetchTransactions = useCallback(async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (searchQuery.trim()) params.append('search', searchQuery.trim());
            if (selectedCategory !== 'ALL') params.append('categoryId', selectedCategory);
            if (activeTab !== 'ALL') params.append('type', activeTab);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const res = await fetch(`/api/transactions?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setTransactions(data.transactions || []);
            } else {
                notify.error('Gagal memuat data transaksi');
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            notify.error('Terjadi kesalahan saat memuat transaksi');
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, selectedCategory, activeTab, startDate, endDate, notify]);

    // Initial load
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Debounce / filter update
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTransactions();
        }, 200);
        return () => clearTimeout(timer);
    }, [fetchTransactions]);

    // Handle Tab Change & Sync Category Filter
    const handleTabChange = (tab: 'ALL' | 'INCOME' | 'EXPENSE') => {
        setActiveTab(tab);
        if (selectedCategory !== 'ALL') {
            const cat = categories.find(c => c.id === selectedCategory);
            if (cat && tab !== 'ALL' && cat.type.toUpperCase() !== tab) {
                setSelectedCategory('ALL');
            }
        }
    };

    // Filter categories based on active tab
    const displayCategories = categories.filter(c => {
        if (activeTab === 'ALL') return true;
        return c.type.toUpperCase() === activeTab;
    });

    // Format Date for Display (e.g., 2024-05-01 -> 1/5/2024)
    const formatDisplayDate = (dStr: string) => {
        if (!dStr) return '';
        const [year, month, day] = dStr.split('-');
        return `${parseInt(day, 10)}/${parseInt(month, 10)}/${year}`;
    };

    // Handler Buka Kartu Transaksi untuk Edit / Hapus
    const handleCardClick = (trx: Transaction) => {
        setSelectedTransaction(trx);
        setIsDetailModalOpen(true);
    };

    // Handler Tambah Transaksi
    const handleCreateTransaction = async (data: {
        description: string;
        amount: number;
        categoryId: string;
        date: string;
    }) => {
        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Gagal membuat transaksi');
            }

            notify.success('Transaksi berhasil ditambahkan');
            fetchTransactions();
        } catch (error: any) {
            notify.error(error.message || 'Gagal menambahkan transaksi');
            throw error;
        }
    };

    // Handler Edit Transaksi
    const handleUpdateTransaction = async (data: {
        id: string;
        description: string;
        amount: number;
        categoryId: string;
        date: string;
    }) => {
        try {
            const res = await fetch(`/api/transactions/${data.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Gagal memperbarui transaksi');
            }

            notify.success('Transaksi berhasil diperbarui');
            fetchTransactions();
        } catch (error: any) {
            notify.error(error.message || 'Gagal memperbarui transaksi');
            throw error;
        }
    };

    // Handler Hapus Transaksi
    const handleDeleteTransaction = async (id: string) => {
        try {
            const res = await fetch(`/api/transactions/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Gagal menghapus transaksi');
            }

            notify.success('Transaksi berhasil dihapus');
            fetchTransactions();
        } catch (error: any) {
            notify.error(error.message || 'Gagal menghapus transaksi');
            throw error;
        }
    };

    // Reset Semua Filter
    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('ALL');
        setActiveTab('ALL');
        setStartDate('');
        setEndDate('');
    };

    const hasActiveFilters = searchQuery || selectedCategory !== 'ALL' || activeTab !== 'ALL' || startDate || endDate;

    return (
        <div className="min-h-full max-w-5xl mx-auto space-y-5 pb-24 sm:pb-28">
            {/* ── Page Header ── */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                    Transaction
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                    View and manage all your transactions
                </p>
            </div>

            {/* ── Search Input ── */}
            <div className="relative w-full">
                <Search className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-11 pr-10 py-2.5 sm:py-3 text-sm sm:text-base bg-white rounded-xl sm:rounded-2xl border border-slate-300/80 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] transition-all"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* ── Filter Controls Row (Category + Time Start + Time End) ── */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Category Dropdown (Left) */}
                <div className="relative sm:w-64">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full appearance-none bg-white border border-slate-400/80 hover:border-slate-500 text-slate-900 text-sm sm:text-base font-bold rounded-xl px-4 py-2 sm:py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer shadow-xs transition-colors"
                    >
                        <option value="ALL">Category</option>
                        {displayCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="w-5 h-5 text-slate-900 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
                </div>

                {/* Time Start & End Pickers (Right) */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Time Start Picker */}
                    <div 
                        onClick={() => startDateInputRef.current?.showPicker?.() || startDateInputRef.current?.focus()}
                        className="relative flex-1 sm:flex-none flex items-center gap-2 bg-white border border-slate-400/80 hover:border-slate-500 text-slate-900 text-sm sm:text-base font-bold rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-xs cursor-pointer transition-colors select-none"
                    >
                        <Calendar className="w-4 h-4 text-slate-900 shrink-0 stroke-[2.2]" />
                        <span className="whitespace-nowrap text-xs sm:text-sm font-bold">
                            {startDate ? formatDisplayDate(startDate) : 'Time Start'}
                        </span>
                        {startDate && (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setStartDate('');
                                }}
                                className="p-0.5 hover:bg-slate-200 rounded-full cursor-pointer ml-1 text-slate-500 hover:text-slate-800"
                                title="Hapus tanggal mulai"
                            >
                                <X className="w-3.5 h-3.5" />
                            </span>
                        )}
                        <input
                            ref={startDateInputRef}
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="sr-only"
                        />
                    </div>

                    {/* Time End Picker */}
                    <div 
                        onClick={() => endDateInputRef.current?.showPicker?.() || endDateInputRef.current?.focus()}
                        className="relative flex-1 sm:flex-none flex items-center gap-2 bg-white border border-slate-400/80 hover:border-slate-500 text-slate-900 text-sm sm:text-base font-bold rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-xs cursor-pointer transition-colors select-none"
                    >
                        <Calendar className="w-4 h-4 text-slate-900 shrink-0 stroke-[2.2]" />
                        <span className="whitespace-nowrap text-xs sm:text-sm font-bold">
                            {endDate ? formatDisplayDate(endDate) : 'Time End'}
                        </span>
                        {endDate && (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEndDate('');
                                }}
                                className="p-0.5 hover:bg-slate-200 rounded-full cursor-pointer ml-1 text-slate-500 hover:text-slate-800"
                                title="Hapus tanggal selesai"
                            >
                                <X className="w-3.5 h-3.5" />
                            </span>
                        )}
                        <input
                            ref={endDateInputRef}
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="sr-only"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Reset Button info if filters are active */}
            {hasActiveFilters && (
                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span>Menampilkan hasil filter</span>
                    <button
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-950 font-semibold underline cursor-pointer"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Filter
                    </button>
                </div>
            )}

            {/* ── Transaction Container (Tabs + Card List Area) ── */}
            <div className="w-full bg-white/50 rounded-xs sm:rounded-md border border-slate-300 shadow-xs overflow-hidden">
                {/* ── Type Tabs (All Transaction | Income | Expense) - Exact Screenshot Style ── */}
                <div className="w-full bg-white border-b border-slate-300 flex items-stretch">
                    <button
                        type="button"
                        onClick={() => handleTabChange('ALL')}
                        className={`flex-1 py-2.5 sm:py-3 text-sm sm:text-base font-bold transition-colors cursor-pointer border-r border-slate-300 ${
                            activeTab === 'ALL'
                                ? 'bg-[#1e3a5f] text-white'
                                : 'bg-white text-slate-800 hover:bg-slate-50'
                        }`}
                    >
                        All Transaction
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTabChange('INCOME')}
                        className={`flex-1 py-2.5 sm:py-3 text-sm sm:text-base font-bold transition-colors cursor-pointer border-r border-slate-300 ${
                            activeTab === 'INCOME'
                                ? 'bg-[#1e3a5f] text-white'
                                : 'bg-white text-slate-800 hover:bg-slate-50'
                        }`}
                    >
                        Income
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTabChange('EXPENSE')}
                        className={`flex-1 py-2.5 sm:py-3 text-sm sm:text-base font-bold transition-colors cursor-pointer ${
                            activeTab === 'EXPENSE'
                                ? 'bg-[#1e3a5f] text-white'
                                : 'bg-white text-slate-800 hover:bg-slate-50'
                        }`}
                    >
                        Expense
                    </button>
                </div>

                {/* ── Transaction List Area ── */}
                <div className="p-3 sm:p-4 space-y-3 min-h-[220px] flex flex-col justify-start">
                    {isLoading ? (
                        // Skeleton Loading
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((n) => (
                                <div
                                    key={n}
                                    className="w-full h-18 bg-white animate-pulse rounded-xl sm:rounded-2xl border border-slate-200 px-5 py-3 flex items-center justify-between shadow-xs"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-full bg-slate-200" />
                                        <div className="space-y-2">
                                            <div className="w-36 h-4 bg-slate-200 rounded" />
                                            <div className="w-24 h-3 bg-slate-100 rounded" />
                                        </div>
                                    </div>
                                    <div className="w-28 h-5 bg-slate-200 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        // Pesan teks sederhana jika belum ada data transaksi (TANPA TOMBOL TAMBAH PERTAMA)
                        <div className="flex flex-col items-center justify-center py-14 px-4 text-center my-auto">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                                <Receipt className="w-6 h-6" />
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1">
                                Belum Ada Transaksi
                            </h3>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                {hasActiveFilters
                                    ? 'Tidak ada transaksi yang cocok dengan filter atau kata kunci pencarian Anda.'
                                    : 'Mulai catat pemasukan dan pengeluaran Anda untuk melihat daftar transaksi di sini.'}
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={handleResetFilters}
                                    className="mt-3 px-3.5 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                                >
                                    Reset Filter
                                </button>
                            )}
                        </div>
                    ) : (
                        // Transaction Cards List
                        transactions.map((trx) => (
                            <TransactionCard
                                key={trx.id}
                                transaction={trx}
                                onClick={handleCardClick}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* ── Fixed Floating Button: + Add Transaction ── */}
            <FixedButton
                icon={Plus}
                title="Add Transaction"
                position="bottom-6 right-6 sm:bottom-8 sm:right-8"
                bgColor="bg-[#1b254b] hover:bg-[#111936]"
                textColor="text-white font-semibold text-xs sm:text-sm"
                onClick={() => setIsAddModalOpen(true)}
            />

            {/* ── Modal Tambah Transaksi ── */}
            <TransactionFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                categories={categories}
                onCreate={handleCreateTransaction}
            />

            {/* ── Modal Detail & Edit Transaksi ── */}
            <TransactionDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedTransaction(null);
                }}
                transaction={selectedTransaction}
                categories={categories}
                onUpdate={handleUpdateTransaction}
                onDelete={handleDeleteTransaction}
            />
        </div>
    );
}