// Panel kiri bersama — desain dark slate dengan dekorasi geometris
export default function AuthLeftPanel() {
  return (
    <div className="hidden md:flex w-[38%] flex-shrink-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-10 flex-col justify-between relative overflow-hidden text-white rounded-l-2xl">

      {/* Dekorasi: dua kotak berputar, opacity rendah */}
      <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none scale-150">
        <div className="absolute w-80 h-80 border-4 border-white rotate-45 translate-x-10" />
        <div className="absolute w-80 h-80 border-4 border-white rotate-12 -translate-x-10" />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2.5">
        <span className="text-2xl font-black tracking-widest uppercase text-slate-200">
          FLUXIO
        </span>
      </div>

      {/* Tagline */}
      <div className="relative z-10 space-y-4 my-auto">
        <h1 className="text-xl font-bold text-white leading-snug">
          Personal Financial<br />Tracking System
        </h1>
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          Manage cash flow, set budgets, and achieve your financial goals with ease.
          Record your daily transactions and let our system present comprehensive analytics
        </p>
      </div>

      {/* Footer */}
      <p className="relative z-10 text-[10px] text-slate-500 font-mono">
        © 2026 FLUXIO v1.0
      </p>
    </div>
  );
}
