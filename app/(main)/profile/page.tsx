'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  User,
  Camera,
  Save,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

type Tab = 'personal' | 'security' | 'preferences';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    image: '',
    createdAt: '',
  });

  const [hasPassword, setHasPassword] = useState<boolean>(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });

  const [prefs, setPrefs] = useState({
    language: 'id',
    currency: 'IDR',
    notifyTransactions: true,
    notifyBudget: true,
    notifyGoal: false,
  });

  // Fetch data profil user dari API backend (/api/profile) yang mengambil dari database
  useEffect(() => {
    async function loadUserProfile() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setForm({
              name: data.user.name || '',
              email: data.user.email || '',
              phone: data.user.phone || '',
              dateOfBirth: data.user.dateOfBirth
                ? new Date(data.user.dateOfBirth).toISOString().split('T')[0]
                : '',
              image: data.user.image || '',
              createdAt: data.user.createdAt || '',
            });
            setHasPassword(Boolean(data.user.hasPassword));
            if (data.user.settings) {
              setPrefs((prev) => ({ ...prev, ...data.user.settings }));
            }
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (status === 'authenticated') {
      loadUserProfile();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [status]);

  // Simpan perubahan data profil ke API backend
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          dateOfBirth: form.dateOfBirth,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal memperbarui profil');
      }

      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });

      // Refresh session context jika nama berubah
      if (update) {
        await update({ name: form.name });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan saat menyimpan.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  }

  // Handle Ubah Password
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (hasPassword && !passwords.currentPassword) {
      setMessage({ type: 'error', text: 'Password saat ini wajib diisi.' });
      return;
    }

    if (!passwords.newPassword || passwords.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password baru minimal 8 karakter.' });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok.' });
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: hasPassword ? passwords.currentPassword : '',
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengubah password');
      }

      setMessage({ type: 'success', text: data.message || 'Password berhasil diperbarui!' });
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setHasPassword(true);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan saat mengubah password.' });
    } finally {
      setIsChangingPassword(false);
      setTimeout(() => setMessage(null), 4000);
    }
  }

  // Handle Logout
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  const initials = (form.name || session?.user?.name || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const formattedJoinDate = form.createdAt
    ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(form.createdAt))
    : 'Member';

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  const inputCls =
    'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all';

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-slate-500">Memuat data profil dari database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full">

      {/* ── Page Header ── */}
      <header className="flex items-start justify-between mb-5 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Profile</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </header>

      {/* ── Notification Banner ── */}
      {message && (
        <div
          className={`mb-5 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium transition-all ${message.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* ── Content Grid ── */}
      <div className="flex flex-col lg:grid lg:grid-cols-[260px_1fr] gap-4 sm:gap-5 lg:items-stretch">

        {/* ── Left: Avatar Card ── */}
        <div className="bg-white w-full rounded-3xl shadow-sm border border-slate-200/80 p-5 sm:p-6 flex flex-col items-center gap-4 lg:justify-between">

          {/* Avatar + Name */}
          <div className="flex lg:flex-col items-center gap-4 lg:gap-4 w-full lg:w-auto">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-slate-200 flex items-center justify-center shadow-md ring-4 ring-white overflow-hidden shrink-0">
              {form.image ? (
                <img
                  src={form.image}
                  alt={form.name || 'User Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-500">
                  {initials}
                </span>
              )}
            </div>

            {/* Name & Email */}
            <div className="text-left lg:text-center min-w-0 flex-1 lg:flex-none">
              <p className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {form.name || session?.user?.name || 'User'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">
                {form.email || session?.user?.email || ''}
              </p>
            </div>
          </div>

          {/* Change Picture Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold rounded-2xl transition-all duration-200 cursor-pointer active:scale-95"
          >
            <Camera className="w-4 h-4" />
            Change Picture
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />

          <p className="text-[11px] text-slate-400 text-center">
            {form.createdAt ? `Bergabung sejak ${formattedJoinDate}` : 'FLUXIO User'}
          </p>
        </div>

        {/* ── Right: Tabs + Form ── */}
        <div className="bg-white w-full rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">

          {/* Tab Bar */}
          <div className="flex items-center gap-0.5 px-4 sm:px-6 pt-4 sm:pt-5 border-b border-slate-100 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-xl'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-4 sm:p-6 md:p-8">

            {/* ── Personal Info Tab ── */}
            {activeTab === 'personal' && (
              <form onSubmit={handleSave} className="space-y-5 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-slate-900">Personal Information</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Update your personal details</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5" htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Full name"
                      className={inputCls}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      readOnly
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-400 bg-slate-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5" htmlFor="phone">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="08xx-xxxx-xxxx"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5" htmlFor="dob">
                      Date of Birth
                    </label>
                    <input
                      id="dob"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) => setForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {/* ── Security Tab ── */}
            {activeTab === 'security' && (
              <form onSubmit={handleChangePassword} className="space-y-5 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-slate-900">Security</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {hasPassword ? 'Change your account password' : 'Create a password for your account'}
                  </p>
                </div>

                <div className="space-y-3.5 sm:space-y-4 w-full max-w-sm sm:max-w-md">
                  {[
                    ...(hasPassword
                      ? [
                        {
                          label: 'Current Password',
                          key: 'current' as const,
                          field: 'currentPassword' as const,
                          placeholder: 'Current password',
                        },
                      ]
                      : []),
                    {
                      label: 'New Password',
                      key: 'new' as const,
                      field: 'newPassword' as const,
                      placeholder: 'Min. 8 characters',
                    },
                    {
                      label: 'Confirm Password',
                      key: 'confirm' as const,
                      field: 'confirmPassword' as const,
                      placeholder: 'Repeat new password',
                    },
                  ].map(({ label, key, field, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                      <div className="relative">
                        <input
                          type={showPwd[key] ? 'text' : 'password'}
                          value={passwords[field]}
                          onChange={(e) => setPasswords((p) => ({ ...p, [field]: e.target.value }))}
                          placeholder={placeholder}
                          className={`${inputCls} pr-11`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd((p) => ({ ...p, [key]: !p[key] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          {showPwd[key] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  {isChangingPassword ? 'Saving...' : hasPassword ? 'Update Password' : 'Create Password'}
                </button>
              </form>
            )}

            {/* ── Preferences Tab ── */}
            {activeTab === 'preferences' && (
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-slate-900">Preferences</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Customize display and notification settings</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 max-w-sm sm:max-w-md">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Language</label>
                    <select
                      value={prefs.language}
                      onChange={(e) => setPrefs((p) => ({ ...p, language: e.target.value }))}
                      className={`${inputCls} cursor-pointer`}
                    >
                      <option value="id">🇮🇩 Bahasa Indonesia</option>
                      <option value="en">🇺🇸 English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Currency</label>
                    <select
                      value={prefs.currency}
                      onChange={(e) => setPrefs((p) => ({ ...p, currency: e.target.value }))}
                      className={`${inputCls} cursor-pointer`}
                    >
                      <option value="IDR">IDR — Rupiah</option>
                      <option value="USD">USD — Dollar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
                    <Bell className="w-4 h-4" /> Notifications
                  </h3>
                  <div className="space-y-2.5 sm:space-y-3 max-w-sm sm:max-w-md">
                    {[
                      { key: 'notifyTransactions', label: 'New transaction alert' },
                      { key: 'notifyBudget', label: 'Budget limit warning' },
                      { key: 'notifyGoal', label: 'Goal progress update' },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        <span className="text-xs sm:text-sm font-medium text-slate-700">{label}</span>
                        <div className="relative shrink-0">
                          <input
                            type="checkbox"
                            checked={prefs[key as keyof typeof prefs] as boolean}
                            onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-slate-300 peer-checked:bg-primary rounded-full transition-colors duration-200" />
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-5" />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsSaving(true);
                    setTimeout(() => {
                      setIsSaving(false);
                      setMessage({ type: 'success', text: 'Preferensi berhasil disimpan!' });
                      setTimeout(() => setMessage(null), 4000);
                    }, 800);
                  }}
                  disabled={isSaving}
                  className="flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
