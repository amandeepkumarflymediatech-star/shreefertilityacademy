'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, CheckCircle2, Eye, EyeOff, ArrowLeft, Stethoscope } from 'lucide-react';
import gsap from 'gsap';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const role = 'TUTOR';
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');
  const [errorMessage, setErrorMessage] = useState(urlError || '');
  const router = useRouter();

  const formRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    if (urlError) {
      toast.error(urlError);
    }
  }, [urlError]);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    );
    gsap.fromTo(
      infoRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
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
        role,
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
        } else if (session?.user?.role === 'TUTOR') {
          router.push('/tutor');
        } else if (session?.user?.role === 'STUDENT') {
          router.push('/student');
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-accent selection:text-white">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-secondary/10">

        {/* Left Form Section */}
        <div ref={formRef} className="w-full md:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white relative">
          <Link href="/login" className="inline-flex items-center gap-2 text-primary/60 hover:text-accent font-bold text-xs tracking-widest uppercase mb-10 transition-colors self-start bg-secondary/5 px-4 py-2 rounded-full">
            <ArrowLeft size={16} /> Back
          </Link>

          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-primary font-playfair mb-3 tracking-tight">
              Tutor Login
            </h1>
            <p className="text-primary/70 font-sans text-lg">
              Sign in to manage your students and schedule live interactive sessions.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-primary/40" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-secondary/20 rounded-xl text-primary bg-secondary/5 focus:ring-0 focus:border-accent focus:bg-white transition-colors duration-200 outline-none placeholder-primary/30"
                  placeholder="mentor@academy.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-primary uppercase tracking-widest">Password</label>
                <Link href="/forgot-password" className="text-xs font-bold text-accent hover:text-primary transition-colors tracking-wide">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-primary/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-10 py-3 border border-secondary/20 rounded-xl text-primary bg-secondary/5 focus:ring-0 focus:border-accent focus:bg-white transition-colors duration-200 outline-none placeholder-primary/30"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary/40 hover:text-primary/70 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {status === 'error' && (
              <div className="p-4 bg-accent/10 border border-accent/20 text-accent text-sm rounded-xl flex items-center gap-2">
                <span className="font-bold">Error:</span> {errorMessage}
              </div>
            )}

            <div className="flex flex-col gap-4 mt-8">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white font-bold uppercase tracking-widest text-sm py-4 px-8 rounded-xl transition-all duration-200 shadow-md group disabled:opacity-70"
              >
                <span>{status === 'loading' ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
          
        </div>

        {/* Right Info Section */}
        <div ref={infoRef} className="hidden md:flex w-full md:w-1/2 bg-primary p-12 relative overflow-hidden items-center justify-center">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="relative z-10 max-w-md text-white">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
              <Stethoscope className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-4xl font-black mb-8 leading-tight font-playfair tracking-tight text-white">
              Tutor Dashboard
            </h2>

            <ul className="space-y-5">
              {[
                'Review student progress',
                'Schedule live Q&A sessions',
                'Upload learning materials',
              ].map((item, i) => (
                <li key={i} className="flex items-center text-white/90 text-lg font-medium">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary-bg flex items-center justify-center text-primary font-bold">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}