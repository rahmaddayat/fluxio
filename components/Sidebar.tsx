'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Banknote,
  CircleDollarSign,
  Target,
  LineChart,
  User,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useSidebar } from './SidebarContext';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Transaction', href: '/transaction', icon: Banknote },
  { name: 'Budget', href: '/budget', icon: CircleDollarSign },
  { name: 'Goal', href: '/goal', icon: Target },
  { name: 'Report', href: '/report', icon: LineChart },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse, isMobileOpen, setIsMobileOpen } = useSidebar();

  // Automatically close mobile sidebar on screen resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileOpen]);

  return (
    <>
      {/* Mobile Top Header (Visible on screens < 768px) */}
      <header className="md:hidden flex items-center justify-between bg-[#0b0736] text-white px-4 py-3.5 sticky top-0 z-30 border-b border-white/10 shadow-md w-full">
        <span className="text-xl font-bold tracking-[0.2em] text-white">FLUXIO</span>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors focus:outline-none cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Panel (Desktop: Fixed left sidebar with Collapsible mode, Mobile: Sliding Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#0b0736] text-white flex flex-col transition-all duration-300 ease-in-out ${
          /* Desktop width & transition */
          isCollapsed ? 'md:w-20' : 'md:w-64'
        } ${
          /* Mobile width & slide drawer transition */
          isMobileOpen
            ? 'translate-x-0 w-[260px] max-w-[80vw] shadow-2xl'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="pt-6 pb-4 px-4 relative flex items-center justify-between border-b border-white/15">
          {/* Logo Brand / Compact Icon */}
          <div className="flex items-center justify-center w-full">
            {isCollapsed ? (
              <span className="hidden md:block text-2xl font-black tracking-wider text-white">
                F
              </span>
            ) : (
              <span className="text-xl md:text-2xl font-bold tracking-[0.2em] text-white font-sans truncate">
                FLUXIO
              </span>
            )}
          </div>

          {/* Desktop Collapse / Expand Toggle Button */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex items-center justify-center p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0"
            title={isCollapsed ? 'Perluas Sidebar' : 'Kecilkan Sidebar'}
            aria-label="Toggle sidebar collapse"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                title={item.name}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center rounded-xl transition-all duration-200 group ${
                  isCollapsed
                    ? 'md:justify-center md:px-0 md:py-3.5 px-4 py-3 gap-4'
                    : 'px-4 py-3 gap-4 justify-start'
                } ${
                  isActive
                    ? 'bg-white/20 text-white font-semibold shadow-xs'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-white/90'
                  }`}
                />
                <span
                  className={`truncate transition-all duration-200 ${
                    isCollapsed ? 'md:hidden' : 'block'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
