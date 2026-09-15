"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuthSwitch } from "@/components/auth/AuthAnimationContext";
import {
  Field, InputWithIcon, EyeToggle, ErrorBox,
  SubmitButton, Divider, GoogleButton, inputCls,
} from "@/components/auth/FormComponents";

export default function LoginPage() {
  const router = useRouter();
  const { switchMode } = useAuthSwitch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", { email, password, redirect: false });
    setIsLoading(false);

    if (result?.error) {
      if (result.error === "GOOGLE_ONLY_ACCOUNT" || result.error.includes("GOOGLE_ONLY_ACCOUNT")) {
        setError("Akun ini didaftarkan menggunakan Google. Silakan login menggunakan tombol Google.");
      } else {
        setError("Email atau password salah.");
      }
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-[360px]">
      <h1 className="text-3xl font-black text-gray-900 tracking-widest uppercase mb-8 text-center">
        Sign In
      </h1>

      {error && <ErrorBox message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email">
          <InputWithIcon icon={<FiMail size={15} />}>
            <input
              id="email" type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="YourEmail@gmail.com" required
              className={inputCls}
            />
          </InputWithIcon>
        </Field>

        <Field label="Password">
          <InputWithIcon
            icon={<FiLock size={15} />}
            right={<EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />}
          >
            <input
              id="password" type={showPassword ? "text" : "password"}
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Your Password (Min. 8 characters)" required
              className={`${inputCls} pr-11`}
            />
          </InputWithIcon>
        </Field>

        <div className="flex justify-end -mt-1">
          <a href="#" className="text-xs text-[#1a2a55] font-medium hover:underline">Forgot password?</a>
        </div>

        <SubmitButton isLoading={isLoading} label="Sign In" loadingLabel="Signing in..." />
        <Divider />
        <GoogleButton label="Sign In with Google" />
      </form>

      <p className="mt-7 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <button
          onClick={() => switchMode("register")}
          className="text-[#1a2a55] font-semibold hover:underline"
        >
          Register
        </button>
      </p>
    </div>
  );
}
