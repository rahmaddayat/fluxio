'use client';

import React from 'react';

export default function DashboardPage() {
  return (
    <div className="bg-white min-h-full">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Selamat datang kembali! Berikut ringkasan keuangan Anda hari ini.</p>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs">
          <p className="text-sm font-medium text-slate-500">Total Saldo</p>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">Rp 24.500.000</h2>
          <span className="text-xs text-emerald-600 font-medium inline-block mt-2">
            +12.5% dari bulan lalu
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs">
          <p className="text-sm font-medium text-slate-500">Pemasukan Bulan Ini</p>
          <h2 className="text-2xl font-bold text-emerald-600 mt-2">Rp 8.200.000</h2>
          <span className="text-xs text-slate-500 font-medium inline-block mt-2">
            4 transaksi
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs">
          <p className="text-sm font-medium text-slate-500">Pengeluaran Bulan Ini</p>
          <h2 className="text-2xl font-bold text-rose-600 mt-2">Rp 3.150.000</h2>
          <span className="text-xs text-slate-500 font-medium inline-block mt-2">
            18 transaksi
          </span>
        </div>
      </div>

      {/* Main Section Placeholder */}
      <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-center bg-slate-50/50">
        <h3 className="text-lg font-semibold text-slate-700">Area Konten Utama Dashboard</h3>
        <p className="text-sm text-slate-500 mt-1">
          Konten dashboard tambahan (grafik, tabel transaksi, target tabungan) dapat ditambahkan di sini.
        </p>
      </div>
    </div>
  );
}