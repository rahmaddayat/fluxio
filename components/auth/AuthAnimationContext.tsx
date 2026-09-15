"use client";

import { createContext, useContext } from "react";

type Mode = "login" | "register";

interface AuthAnimationContextType {
  switchMode: (mode: Mode) => void;
  isAnimating: boolean;
}

export const AuthAnimationContext = createContext<AuthAnimationContextType>({
  switchMode: () => {},
  isAnimating: false,
});

// Hook untuk dipakai di halaman login/register
export function useAuthSwitch() {
  return useContext(AuthAnimationContext);
}
