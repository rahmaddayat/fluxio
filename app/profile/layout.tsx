'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { SidebarProvider, useSidebar } from '@/components/SidebarContext';

function ProfileLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f0f2f8]">
      <Sidebar />
      <main
        className={`flex-1 min-h-screen p-4 sm:p-6 md:p-10 w-full overflow-x-hidden transition-all duration-300 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ProfileLayoutContent>{children}</ProfileLayoutContent>
    </SidebarProvider>
  );
}
