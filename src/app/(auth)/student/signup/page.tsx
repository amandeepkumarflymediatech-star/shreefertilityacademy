'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, User, Mail, Lock, CheckCircle2, Eye, EyeOff, ArrowLeft, Microscope } from 'lucide-react';
import gsap from 'gsap';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const role = 'STUDENT';
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const router = useRouter();
  const formRef = useRef(null);
  const infoRef = useRef(null);

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to register');
        return;
      }

      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        setStatus('error');
        setErrorMessage(signInRes.error);
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
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-accent selection:text-white">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-secondary/10">
        
        {/* Left Form Section */}
        <div ref={formRef} className="w-full md:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white relative">
          <Link href="/signup" className="inline-flex items-center gap-2 text-primary/60 hover:text-accent font-bold text-xs tracking-widest uppercase mb-10 transition-colors self-start bg-secondary/5 px-4 py-2 rounded-full">
            <ArrowLeft size={16} /> Back
          </Link>

          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-primary font-playfair mb-3 tracking-tight">
              Apply for Mentorship
            </h1>
            <p className="text-primary/70 font-sans text-lg">
              Join our comprehensive clinical training in reproductive medicine.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-primary/40" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-secondary/20 rounded-xl text-primary bg-secondary/5 focus:ring-0 focus:border-accent focus:bg-white transition-colors duration-200 outline-none placeholder-primary/30"
                  placeholder="Dr. John Doe"
                  required
                />
              </div>
            </div>
            
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
                  placeholder="doctor@clinic.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Password</label>
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
                  minLength={6}
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
                <span>{status === 'loading' ? 'Creating account...' : 'Submit Application'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-secondary/20"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-primary/50 text-xs uppercase tracking-widest font-bold">Or</span></div>
              </div>

              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('intended_role', role);
                  signIn('google', { callbackUrl: '/auth-callback' });
                }}
                className="w-full bg-white border border-secondary/20 rounded-xl text-primary py-3.5 font-bold text-sm tracking-widest uppercase hover:border-primary hover:bg-secondary/5 transition-colors flex items-center justify-center gap-3"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-primary/70 text-sm">
            Already have an account?{' '}
            <Link href="/student/login" className="text-accent font-bold hover:text-primary transition-colors">
              Log in
            </Link>
          </div>
        </div>

        {/* Right Info Section */}
        <div ref={infoRef} className="hidden md:flex w-full md:w-1/2 bg-primary p-12 relative overflow-hidden items-center justify-center">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
          </div>
          
          <div className="relative z-10 max-w-md text-white">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
              <Microscope className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-4xl font-black mb-8 leading-tight font-playfair tracking-tight text-white">
              Advance your clinical expertise.
            </h2>
            
            <ul className="space-y-5 mb-10">
              {[
                'Access case-based clinical modules',
                'Join live discussions with senior faculty',
                'Download standard operating protocols',
                'Earn an accredited fellowship certificate'
              ].map((item, i) => (
                <li key={i} className="flex items-center text-white/90 text-lg font-medium">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-base">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg">
              <p className="text-white/80 text-base italic mb-4 font-cormorant">
                "This fellowship completely changed my approach to ART. I gained practical knowledge I couldn't find in textbooks."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold text-lg">
                  E
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Dr. Emily Chen</div>
                  <div className="text-accent/80 text-xs font-bold uppercase tracking-widest mt-0.5">Fellowship Alum</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}