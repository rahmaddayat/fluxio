"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiLock, FiPhone, FiCalendar } from "react-icons/fi";
import { useAuthSwitch } from "@/components/auth/AuthAnimationContext";
import {
  Field, InputWithIcon, EyeToggle, ErrorBox,
  SubmitButton, Divider, GoogleButton, inputCls,
} from "@/components/auth/FormComponents";

export default function RegisterPage() {
  const router = useRouter();
  const { switchMode } = useAuthSwitch();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", dateOfBirth: "", password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.phone || !form.dateOfBirth) {
      setError("Nomor telepon dan tanggal lahir wajib diisi.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setIsLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        password: form.password,
      }),
    });

    const data = await res.json();
    setIsLoading(false);

    if (!res.ok) {
      setError(data.message || "Terjadi kesalahan.");
      return;
    }

    // Register berhasil → animasi ke halaman login
    switchMode("login");
  }

  return (
    <div className="w-full max-w-[400px]">
      <h1 className="text-3xl font-black text-gray-900 tracking-widest uppercase mb-7 text-center">
        Sign Up
      </h1>

      {error && <ErrorBox message={error} />}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Field label="Name">
          <InputWithIcon icon={<FiUser size={15} />}>
            <input
              name="name" type="text" value={form.name} onChange={handleChange}
              placeholder="Input your name here" required
              className={inputCls}
            />
          </InputWithIcon>
        </Field>

        <Field label="Email">
          <InputWithIcon icon={<FiMail size={15} />}>
            <input
              name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="YourEmail@gmail.com" required
              className={inputCls}
            />
          </InputWithIcon>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone Number">
            <InputWithIcon icon={<FiPhone size={14} />}>
              <input
                name="phone" type="tel" value={form.phone} onChange={handleChange}
                placeholder="08xx-xxxx-xxxx" required
                className={inputCls}
              />
            </InputWithIcon>
          </Field>

          <Field label="Date of Birth">
            <InputWithIcon icon={<FiCalendar size={14} />}>
              <input
                name="dateOfBirth" type="date" value={form.dateOfBirth}
                onChange={handleChange} required
                className={inputCls}
              />
            </InputWithIcon>
          </Field>
        </div>

        <Field label="Password">
          <InputWithIcon
            icon={<FiLock size={15} />}
            right={<EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />}
          >
            <input
              name="password" type={showPassword ? "text" : "password"}
              value={form.password} onChange={handleChange}
              placeholder="Your Password (Min. 8 characters)" required
              className={`${inputCls} pr-11`}
            />
          </InputWithIcon>
        </Field>

        <SubmitButton isLoading={isLoading} label="Sign Up" loadingLabel="Creating account..." />
        <Divider />
        <GoogleButton label="Sign Up with Google" />
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <button
          onClick={() => switchMode("login")}
          className="text-[#1a2a55] font-semibold hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}
