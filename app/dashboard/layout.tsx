import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Reusable Sidebar Component */}
      <Sidebar />

      {/* Main Content Area (Background White) */}
      <main className="flex-1 md:ml-64 bg-white min-h-screen p-6 md:p-10 text-slate-900">
        {children}
      </main>
    </div>
  );
}
