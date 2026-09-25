'use client';

import React from 'react';
import FinCard from '@/components/FinCard';
import { PlusIcon, Wallet, TrendingUp, TrendingDown, Landmark } from 'lucide-react';
import FixedButton from '@/components/FixedButton';

export default function DashboardPage() {
    return (
        <div className="bg-white min-h-full">
            {/* Header */}
            <header className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-sm sm:text-base text-slate-500 mt-1">
                    Selamat datang kembali! Berikut ringkasan kondisi keuangan Anda hari ini.
                </p>
            </header>

            {/* Floating Fixed Action Button */}
            <FixedButton
                icon={PlusIcon}
                title="Buat Transaksi"
                position="bottom-5 right-5 sm:bottom-6 sm:right-6"
                onClick={() => console.log('Button clicked')}
            />

            {/* Financial Overview Cards using FinCard Component */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <FinCard
                    title="Total Saldo"
                    amount={24500000}
                    icon={Wallet}
                    textColor="text-slate-900"
                    bgColor="bg-gradient-to-t from-orange-700 via-orange-500 to-orange-400"
                    subtitle="+12.5% dari bulan lalu"
                    iconColor="text-orange-900"
                    iconBgColor="bg-white/0 border-none"
                />

                <FinCard
                    title="Pemasukan Bulan Ini"
                    amount={8200000}
                    icon={TrendingUp}
                    textColor="text-slate-900"
                    bgColor="bg-gradient-to-t from-emerald-700 via-emerald-500 to-emerald-400"
                    subtitle="4 transaksi masuk"
                    iconColor="text-lime-500"
                    iconBgColor="bg-white/0 border-none"
                />

                <FinCard
                    title="Pengeluaran Bulan Ini"
                    amount={3150000}
                    icon={TrendingDown}
                    textColor="text-slate-900"
                    bgColor="bg-gradient-to-t from-red-700 via-red-500 to-red-400"
                    subtitle="18 transaksi keluar"
                    iconColor="text-rose-700"
                    iconBgColor="bg-white/0 border-none"
                />

                <FinCard
                    title="Target Tabungan"
                    amount={15000000}
                    icon={Landmark}
                    textColor="text-slate-900"
                    bgColor="bg-gradient-to-t from-indigo-900 via-indigo-500 to-indigo-400"
                    subtitle="Tercapai 65% dari target"
                    iconColor="text-indigo-700"
                    iconBgColor="bg-white/0 border-none"
                />
            </div>

            {/* Main Section Placeholder */}
            <div className="p-5 sm:p-8 rounded-2xl border border-dashed border-slate-200 text-center bg-slate-50/50">
                <h3 className="text-base sm:text-lg font-semibold text-slate-700">Area Konten Utama Dashboard</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Tabel transaksi terbaru, grafik arus kas, dan daftar kategori keuangan dapat ditampilkan di sini.
                </p>
            </div>
        </div>
    );
}