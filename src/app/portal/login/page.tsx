'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, Eye, EyeOff, ShieldCheck, ChevronLeft, Activity } from 'lucide-react';
import gsap from 'gsap';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

function AdminLoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');
  const [errorMessage, setErrorMessage] = useState(urlError || '');
  
  const router = useRouter();
  const formRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (urlError) {
      toast.error(urlError);
    }
  }, [urlError]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      imageRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' }
    ).fromTo(
      formRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' },
      "-=0.8"
    );
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        role: 'ADMIN',
        redirect: false,
      });

      if (res?.error) {
        setStatus('error');
        setErrorMessage(res.error);
      } else {
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();

        if (session?.user?.role === 'ADMIN') {
          router.push('/admin');
        } else {
          setStatus('error');
          setErrorMessage('Access denied. Admin privileges required.');
        }
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen flex bg-primary-bg selection:bg-accent selection:text-white font-sans overflow-hidden">
      
      {/* Left side: Branding/Visual */}
      <div 
        ref={imageRef} 
        className="hidden lg:flex w-1/2 bg-primary relative items-center justify-center overflow-hidden p-12"
      >
        {/* Decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent/20 blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-secondary/40 blur-[100px] mix-blend-screen" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 max-w-lg text-white">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-xl">
            <Activity className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-5xl font-playfair font-bold mb-6 leading-tight">
            Shree Fertility <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-pink-400">Academy</span>
          </h1>
          <p className="text-lg text-white/70 mb-8 leading-relaxed font-light">
            Secure admin portal for managing student enrollments, live classes, pricing, and platform analytics.
          </p>
          
          <div className="flex items-center gap-4 text-sm font-bold tracking-widest uppercase text-white/50 mt-12">
            <ShieldCheck className="w-5 h-5 text-accent" />
            Restricted Access
          </div>
        </div>

        {/* Abstract pattern overlay */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative bg-white">
        <Link href="/" className="absolute top-8 left-8 sm:top-12 sm:left-12 flex items-center gap-2 text-secondary/60 hover:text-accent transition-colors font-bold text-sm tracking-wide group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div ref={formRef} className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-playfair font-bold text-primary mb-3">Welcome Back</h2>
            <p className="text-secondary/80 text-sm">Please sign in to access your administrative dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                  <Mail className="h-5 w-5 text-secondary/40 group-focus-within/input:text-accent transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-secondary-bg border border-border text-primary focus:ring-0 focus:border-accent focus:bg-white transition-all duration-300 outline-none placeholder-secondary/40 rounded-2xl text-sm shadow-sm"
                  placeholder="admin@shreefertilityacademy.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                  <Lock className="h-5 w-5 text-secondary/40 group-focus-within/input:text-accent transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 bg-secondary-bg border border-border text-primary focus:ring-0 focus:border-accent focus:bg-white transition-all duration-300 outline-none placeholder-secondary/40 rounded-2xl text-sm shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary/40 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {status === 'error' && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl text-center shadow-sm animate-in fade-in">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-between px-6 py-4 bg-primary text-white hover:bg-accent font-bold transition-all duration-300 shadow-lg hover:shadow-accent/30 group disabled:opacity-70 mt-8 rounded-2xl overflow-hidden relative"
            >
              <span className="relative z-10 text-sm tracking-wide">{status === 'loading' ? 'Authenticating...' : 'Sign In'}</span>
              <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors relative z-10">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </form>
          
          <div className="mt-12 text-center">
            <p className="text-xs text-secondary/60">
              Secured by <span className="font-bold text-primary">Shree Fertility Academy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary-bg flex items-center justify-center text-primary tracking-widest text-xs uppercase font-bold animate-pulse">
        Loading...
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  );
}
