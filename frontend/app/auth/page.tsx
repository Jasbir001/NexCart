'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '../../src/context/StoreContext';
import { FiLock, FiMail, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginUserAction, registerUserAction, isLoggedIn } = useStore();

  const activeTab: 'login' | 'register' = searchParams.get('tab') === 'register' ? 'register' : 'login';

  // Form Fields
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Password Visibility toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Redirect handling
  const handleRedirect = useCallback(() => {
    const redirectUrl = searchParams.get('redirect');
    if (redirectUrl && redirectUrl !== '/auth') {
      router.push(redirectUrl);
    } else {
      router.push('/account');
    }
  }, [router, searchParams]);

  // If already logged in, redirect immediately
  useEffect(() => {
    const savedLoggedIn = localStorage.getItem('nexcart-logged-in');
    const checkedLoggedIn = savedLoggedIn ? JSON.parse(savedLoggedIn) : isLoggedIn;
    if (checkedLoggedIn) {
      handleRedirect();
    }
  }, [isLoggedIn, handleRedirect]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailOrPhone || !loginPassword) {
      toast.error('Please enter all credentials.');
      return;
    }

    const success = loginUserAction(loginEmailOrPhone, loginPassword);
    if (success) {
      toast.success('Logged in successfully! Welcome back.');
      handleRedirect();
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!regName || !regPhone || !regEmail || !regPassword || !regConfirmPassword) {
      toast.error('All fields are required.');
      return;
    }

    // Phone validation
    const cleanPhone = regPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Password match validation
    if (regPassword !== regConfirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (regPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    const success = registerUserAction(regName, cleanPhone, regEmail, regPassword);
    if (success) {
      toast.success('Account created successfully! Welcome to NexCart.');
      handleRedirect();
    } else {
      toast.error('Registration failed. Please check details and try again.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-background text-text flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <Toaster position="bottom-right" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Logo Link & Header */}
        <div className="text-center">
          <Link href="/" className="inline-block text-3xl font-extrabold tracking-tight text-primary hover:opacity-90 mb-2">
            Nex<span className="text-text font-semibold">Cart</span>
          </Link>
          <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
            Premium Curated E-Commerce Shopping
          </p>
        </div>

        {/* Auth Card Container */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Tabs header */}
          <div className="flex border-b border-border/60 pb-1">
            <button
              onClick={() => {
                router.replace('/auth?tab=login');
              }}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-zinc-400 hover:text-text'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                router.replace('/auth?tab=register');
              }}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-zinc-400 hover:text-text'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Content */}
          {activeTab === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4" autoComplete="off">
              <input type="text" name="fakeusernameremembered" autoComplete="username" className="hidden" />
              <input type="password" name="fakepasswordremembered" autoComplete="current-password" className="hidden" />
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <FiMail />
                  </span>
                  <input
                    type="text"
                    name="emailOrPhone_noautofill"
                    autoComplete="off"
                    required
                    placeholder="Enter email or 10-digit mobile"
                    value={loginEmailOrPhone}
                    onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-4 text-xs font-semibold outline-none focus:border-primary text-text"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Password
                  </label>
                  <a href="#" onClick={(e) => { e.preventDefault(); toast('Password reset link has been sent (mock).'); }} className="text-[10px] font-bold text-primary hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <FiLock />
                  </span>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    name="password_noautofill"
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-10 text-xs font-semibold outline-none focus:border-primary text-text"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-text cursor-pointer border-none bg-transparent outline-none p-0 flex items-center"
                  >
                    {showLoginPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-primary py-3.5 mt-2 font-bold text-xs text-white shadow-lg hover:bg-primary/95 transition-all cursor-pointer"
              >
                Sign In
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <FiUser />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-4 text-xs font-semibold outline-none focus:border-primary text-text"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <FiPhone />
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-4 text-xs font-semibold outline-none focus:border-primary text-text"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <FiMail />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-4 text-xs font-semibold outline-none focus:border-primary text-text"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <FiLock />
                  </span>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-10 text-xs font-semibold outline-none focus:border-primary text-text"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-text cursor-pointer border-none bg-transparent outline-none p-0 flex items-center"
                  >
                    {showRegPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <FiLock />
                  </span>
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-10 text-xs font-semibold outline-none focus:border-primary text-text"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-text cursor-pointer border-none bg-transparent outline-none p-0 flex items-center"
                  >
                    {showRegConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-primary py-3.5 mt-2 font-bold text-xs text-white shadow-lg hover:bg-primary/95 transition-all cursor-pointer"
              >
                Create Account
              </button>
            </form>
          )}

        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/" className="text-xs font-semibold text-zinc-400 hover:text-primary transition-colors">
            ← Back to home page
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-bold text-zinc-400">Loading Auth...</div>}>
      <AuthContent />
    </Suspense>
  );
}
