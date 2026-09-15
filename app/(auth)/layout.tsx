"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthAnimationContext } from "@/components/auth/AuthAnimationContext";

type Mode = "login" | "register";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [panelWidth, setPanelWidth] = useState("38%");
  const [formOpacity, setFormOpacity] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  function switchMode(newMode: Mode) {
    if (isAnimating) return;
    setIsAnimating(true);

    // Phase 1: sembunyikan form, lalu perluas panel
    setFormOpacity(0);
    setTimeout(() => setPanelWidth("100%"), 80);

    // Phase 2: di puncak ekspansi → navigasi ke halaman baru
    setTimeout(() => router.push(`/${newMode}`), 480);

    // Phase 3: kontraksi panel
    setTimeout(() => setPanelWidth("38%"), 530);

    // Phase 4: tampilkan form baru
    setTimeout(() => {
      setFormOpacity(1);
      setIsAnimating(false);
    }, 980);
  }

  return (
    <AuthAnimationContext.Provider value={{ switchMode, isAnimating }}>
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8 font-sans">
        <div className="w-[80%] flex rounded-2xl shadow-2xl overflow-hidden bg-white h-[640px]">

          {/* ── Panel Kiri (Animasi) ── */}
          <div
            className="flex-shrink-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950
                       flex flex-col justify-between p-10 relative overflow-hidden text-white
                       rounded-l-2xl z-10"
            style={{
              width: panelWidth,
              transition: "width 450ms cubic-bezier(0.77, 0, 0.175, 1)",
            }}
          >
            {/* Dekorasi */}
            <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none scale-150">
              <div className="absolute w-80 h-80 border-4 border-white rotate-45 translate-x-10" />
              <div className="absolute w-80 h-80 border-4 border-white rotate-12 -translate-x-10" />
            </div>

            {/* Logo */}
            <div className="relative z-10">
              <span className="text-2xl font-black tracking-widest uppercase text-slate-200">FLUXIO</span>
            </div>

            {/* Tagline — disembunyikan saat animasi */}
            <div
              className="relative z-10 space-y-4 my-auto"
              style={{ opacity: isAnimating ? 0 : 1, transition: "opacity 150ms ease" }}
            >
              <h2 className="text-xl font-bold text-white leading-snug">
                Personal Financial<br />Tracking System
              </h2>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Manage cash flow, set budgets, and achieve your financial goals with ease.
                Record your daily transactions and let our system present comprehensive analytics.
              </p>
            </div>

            {/* Footer */}
            <p className="relative z-10 text-[10px] text-slate-500 font-mono">© 2026 FLUXIO v1.0</p>
          </div>

          {/* ── Panel Kanan (halaman form sebagai children) ── */}
          <div
            className="flex flex-1 flex-col justify-center items-center px-10 py-10 overflow-hidden min-w-0"
            style={{ opacity: formOpacity, transition: "opacity 150ms ease" }}
          >
            {children}
          </div>

        </div>
      </div>
    </AuthAnimationContext.Provider>
  );
}
