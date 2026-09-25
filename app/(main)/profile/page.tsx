'use client';

import React, { useState, useRef } from 'react';
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
} from 'lucide-react';

type Tab = 'personal' | 'security' | 'preferences';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: 'Rahmad Hidayatullah',
    email: 'rahmad@example.com',
    phone: '0812-3456-7890',
    dateOfBirth: '2000-08-15',
  });

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

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1200);
  }

  const initials = form.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  const inputCls =
    'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0b0736]/20 focus:border-[#0b0736] transition-all';

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
        <button className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer shrink-0">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </header>

      {/* ── Content Grid ── */}
      <div className="flex flex-col lg:grid lg:grid-cols-[240px_1fr] gap-4 sm:gap-5 lg:items-stretch">

        {/* ── Left: Avatar Card ── */}
        <div className="bg-white w-full rounded-3xl shadow-sm border border-slate-200/80 p-5 sm:p-6 flex flex-col items-center gap-4 lg:justify-between">

          {/* Avatar + Name (horizontal on mobile, vertical on desktop) */}
          <div className="flex lg:flex-col items-center gap-4 lg:gap-4 w-full lg:w-auto">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-slate-200 flex items-center justify-center shadow-md ring-4 ring-white overflow-hidden shrink-0">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-500">
                {initials}
              </span>
            </div>

            {/* Name & Email */}
            <div className="text-left lg:text-center min-w-0 flex-1 lg:flex-none">
              <p className="text-sm sm:text-base font-bold text-slate-900 truncate">{form.name}</p>
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">{form.email}</p>
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

          <p className="text-[11px] text-slate-400 text-center">Member since 1 January 2025</p>
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
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === tab.id
                      ? 'border-[#0b0736] text-[#0b0736]'
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
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5" htmlFor="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Full name"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      readOnly
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-400 bg-slate-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5" htmlFor="phone">Phone</label>
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
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5" htmlFor="dob">Date of Birth</label>
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
                  className="flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#0b0736] hover:bg-[#160a5c] text-white text-sm font-semibold rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {/* ── Security Tab ── */}
            {activeTab === 'security' && (
              <form onSubmit={handleSave} className="space-y-5 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-slate-900">Security</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Change your account password</p>
                </div>

                <div className="space-y-3.5 sm:space-y-4 w-full max-w-sm sm:max-w-md">
                  {[
                    { label: 'Current Password', key: 'current' as const, field: 'currentPassword' as const, placeholder: 'Current password' },
                    { label: 'New Password', key: 'new' as const, field: 'newPassword' as const, placeholder: 'Min. 8 characters' },
                    { label: 'Confirm Password', key: 'confirm' as const, field: 'confirmPassword' as const, placeholder: 'Repeat new password' },
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
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd((p) => ({ ...p, [key]: !p[key] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          {showPwd[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#0b0736] hover:bg-[#160a5c] text-white text-sm font-semibold rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Update Password'}
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
                          <div className="w-10 h-5 bg-slate-300 peer-checked:bg-[#0b0736] rounded-full transition-colors duration-200" />
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-5" />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { setIsSaving(true); setTimeout(() => setIsSaving(false), 1200); }}
                  disabled={isSaving}
                  className="flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#0b0736] hover:bg-[#160a5c] text-white text-sm font-semibold rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60"
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
