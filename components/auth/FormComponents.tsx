"use client";

// Komponen UI kecil yang dipakai bersama oleh form login dan register
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export const inputCls =
  "w-full pl-9 pr-4 py-3 text-sm bg-gray-100 border border-transparent rounded-lg " +
  "text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#1a2a55] " +
  "focus:bg-white focus:ring-2 focus:ring-[#1a2a55]/15 transition-all";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export function InputWithIcon({
  icon, right, children,
}: {
  icon: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
        {icon}
      </span>
      {children}
      {right && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{right}</span>
      )}
    </div>
  );
}

export function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className="text-gray-400 hover:text-gray-600">
      {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
    </button>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
      {message}
    </div>
  );
}

export function SubmitButton({
  isLoading, label, loadingLabel,
}: {
  isLoading: boolean; label: string; loadingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full py-3.5 rounded-lg text-white font-semibold text-sm tracking-wide bg-[#1a2a55] hover:bg-[#0f1c3a] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          {loadingLabel}
        </span>
      ) : label}
    </button>
  );
}

export function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-gray-400">or</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

export function GoogleButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="w-full py-3 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
    >
      <FcGoogle size={18} /> {label}
    </button>
  );
}

