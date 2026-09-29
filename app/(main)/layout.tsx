'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { SidebarProvider, useSidebar } from '@/components/SidebarContext';

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-page text-page-foreground">
      <Sidebar />
      <main
        className={`flex-1 bg-page min-h-screen p-4 sm:p-6 md:p-10 text-page-foreground w-full overflow-x-hidden transition-all duration-300 
          ${isCollapsed ? 'sm:ml-20' : 'sm:ml-64'
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
