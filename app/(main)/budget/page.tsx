'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, CircleDollarSign } from 'lucide-react';
import BudgetCard from '@/components/budgets/BudgetCard';
import BudgetDetailModal from '@/components/budgets/BudgetDetailModal';
import BudgetFormModal from '@/components/budgets/BudgetFormModal';
import FixedButton from '@/components/FixedButton';
import { Budget, BudgetPeriod } from '@/types/budget';
import { Category } from '@/types/transaction';
import { useNotification } from '@/components/NotificationContext';

export default function BudgetPage() {
    const { notify } = useNotification();

    // Data State
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
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

    // Fetch Budgets
    const fetchBudgets = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/budgets');
            if (res.ok) {
                const data = await res.json();
                setBudgets(data.budgets || []);
            } else {
                notify.error('Gagal memuat data budget');
            }
        } catch (error) {
            console.error('Failed to fetch budgets:', error);
            notify.error('Terjadi kesalahan saat memuat budget');
        } finally {
            setIsLoading(false);
        }
    }, [notify]);

    // Initial Load
    useEffect(() => {
        fetchCategories();
        fetchBudgets();
    }, [fetchCategories, fetchBudgets]);

    // Handler Klik Kartu Budget untuk Edit / Hapus
    const handleCardClick = (b: Budget) => {
        setSelectedBudget(b);
        setIsDetailModalOpen(true);
    };

    // Handler Tambah Budget
    const handleCreateBudget = async (data: {
        categoryId: string;
        limitAmount: number;
        period: BudgetPeriod;
    }) => {
        try {
            const res = await fetch('/api/budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const json = await res.json();
            if (!res.ok) {
                notify.error(json.message || 'Gagal membuat budget');
                return;
            }

            notify.success('Budget berhasil dibuat');
            setIsAddModalOpen(false);
            fetchBudgets();
        } catch (error: any) {
            notify.error(error.message || 'Gagal membuat budget');
        }
    };

    // Handler Update Budget
    const handleUpdateBudget = async (data: {
        id: string;
        categoryId: string;
        limitAmount: number;
        period: BudgetPeriod;
    }) => {
        try {
            const res = await fetch(`/api/budgets/${data.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const json = await res.json();
            if (!res.ok) {
                notify.error(json.message || 'Gagal memperbarui budget');
                return;
            }

            notify.success('Budget berhasil diperbarui');
            setIsDetailModalOpen(false);
            setSelectedBudget(null);
            fetchBudgets();
        } catch (error: any) {
            notify.error(error.message || 'Gagal memperbarui budget');
        }
    };

    // Handler Hapus Budget
    const handleDeleteBudget = async (id: string) => {
        try {
            const res = await fetch(`/api/budgets/${id}`, {
                method: 'DELETE',
            });

            const json = await res.json();
            if (!res.ok) {
                notify.error(json.message || 'Gagal menghapus budget');
                return;
            }

            notify.success('Budget berhasil dihapus');
            setIsDetailModalOpen(false);
            setSelectedBudget(null);
            fetchBudgets();
        } catch (error: any) {
            notify.error(error.message || 'Gagal menghapus budget');
        }
    };

    return (
        <div className="min-h-full max-w-5xl mx-auto space-y-5 pb-24 sm:pb-28">
            {/* ── Page Header ── */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                    Budget
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                    Set and track your monthly spending limit
                </p>
            </div>

            {/* ── Outer Budget Container (Sesuai Desain Screenshot) ── */}
            <div className="w-full bg-white/70 backdrop-blur-xs rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-3.5 sm:p-5 md:p-6 space-y-3 sm:space-y-4 min-h-[300px] flex flex-col justify-start">
                {isLoading ? (
                    // Skeleton Loading State
                    <div className="space-y-3 sm:space-y-4">
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="w-full h-24 bg-white animate-pulse rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col justify-between shadow-xs"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded bg-slate-200" />
                                        <div className="w-28 h-4 bg-slate-200 rounded" />
                                    </div>
                                    <div className="w-32 h-4 bg-slate-200 rounded" />
                                </div>
                                <div className="w-full h-3.5 bg-slate-100 rounded-full" />
                                <div className="w-16 h-3 bg-slate-100 rounded" />
                            </div>
                        ))}
                    </div>
                ) : budgets.length === 0 ? (
                    // Empty Message jika belum ada budget (Tanpa tombol tambahan di dalam)
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center my-auto">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                            <CircleDollarSign className="w-7 h-7" />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
                            Belum Ada Budget
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                            Tentukan batas pengeluaran Anda (Harian, Bulanan, atau Tahunan) untuk memantau keuangan dengan lebih teratur.
                        </p>
                    </div>
                ) : (
                    // Budget Cards List
                    budgets.map((b) => (
                        <BudgetCard
                            key={b.id}
                            budget={b}
                            onClick={handleCardClick}
                        />
                    ))
                )}
            </div>

            {/* ── Fixed Floating Button: + Add Budget ── */}
            <FixedButton
                icon={Plus}
                title="Add Budget"
                position="bottom-6 right-6 sm:bottom-8 sm:right-8"
                bgColor="bg-[#1b254b] hover:bg-[#111936]"
                textColor="text-white font-semibold text-xs sm:text-sm"
                onClick={() => setIsAddModalOpen(true)}
            />

            {/* ── Modal Tambah Budget ── */}
            <BudgetFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                categories={categories}
                onCreate={handleCreateBudget}
            />

            {/* ── Modal Detail & Edit Budget ── */}
            <BudgetDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedBudget(null);
                }}
                budget={selectedBudget}
                categories={categories}
                onUpdate={handleUpdateBudget}
                onDelete={handleDeleteBudget}
            />
        </div>
    );
}