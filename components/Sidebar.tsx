'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header / Hamburger Toggle */}
      <div className="md:hidden flex items-center justify-between bg-[#0b0736] text-white px-5 py-4 sticky top-0 z-50 border-b border-white/10 shadow-md">
        <span className="text-xl font-bold tracking-[0.2em] text-white">FLUXIO</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
          aria-label="Toggle sidebar menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0b0736] text-white flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="pt-8 pb-4 px-6 text-center">
          <h1 className="text-2xl font-bold tracking-[0.2em] text-white font-sans">
            FLUXIO
          </h1>
          <hr className="mt-6 border-t border-white/20" />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-normal transition-all duration-200 group ${
                  isActive
                    ? 'bg-white/20 text-white font-semibold shadow-sm'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-white/90'
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
