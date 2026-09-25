'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { SidebarProvider, useSidebar } from '@/components/SidebarContext';

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <Sidebar />
      <main
        className={`flex-1 bg-white min-h-screen p-4 sm:p-6 md:p-10 text-slate-900 w-full overflow-x-hidden transition-all duration-300 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </SidebarProvider>
  );
}
