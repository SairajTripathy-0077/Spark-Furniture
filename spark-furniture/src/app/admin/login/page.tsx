'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/check');
        if (res.ok) {
          router.replace('/admin');
        } else {
          setCheckingAuth(false);
        }
      } catch (err) {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        // Force full page reload or router push to load the admin dashboard freshly
        window.location.href = '/admin';
      } else {
        setError(data.message || 'Invalid password');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdf9f4]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#31170E] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#31170E]/60">Checking Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdf9f4] px-4">
      {/* Visual background elements */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#31170E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-[#31170E]/10 bg-white p-8 shadow-xl md:p-10"
      >
        <div className="text-center">
          {/* Logo / Badge */}
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#31170E]/5 text-[#31170E] mb-6">
            <Lock size={20} />
          </div>
          
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#31170E]">
            Admin Portal
          </h1>
          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-[#31170E]/60">
            Spark Furniture Management
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label 
              htmlFor="password" 
              className="block text-xs font-bold uppercase tracking-wider text-[#31170E]/70"
            >
              Enter Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-4 pr-12 text-sm text-[#31170E] placeholder-neutral-400 focus:border-[#31170E] focus:outline-none focus:ring-1 focus:ring-[#31170E]/20 transition-all duration-300"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                <Lock size={16} />
              </div>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-700 border border-red-100"
            >
              <ShieldAlert size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#31170E] py-3.5 text-xs font-bold uppercase tracking-wider text-[#fdf9f4] shadow-md transition-all hover:bg-[#6b4335] active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Sign In'}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-xs font-bold uppercase tracking-wider text-[#31170E]/50 hover:text-[#31170E] transition-colors"
          >
            ← Back to Storefront
          </a>
        </div>
      </motion.div>
    </div>
  );
}
