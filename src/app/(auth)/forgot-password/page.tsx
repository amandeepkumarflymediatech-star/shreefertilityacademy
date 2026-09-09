'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.anim-elem',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
    );
  }, { scope: container });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Failed to process request.');
        return;
      }

      setStatus('success');
      setMessage('If an account exists with this email, a reset link has been sent.');
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div ref={container} className="min-h-screen bg-primary-bg flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-accent selection:text-white">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-secondary/10 flex flex-col p-8 sm:p-10 relative">
        
        <Link href="/login" className="anim-elem inline-flex items-center gap-2 text-primary/60 hover:text-accent font-bold text-xs tracking-widest uppercase mb-10 transition-colors self-start bg-secondary/5 px-4 py-2 rounded-full">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <div className="text-center mb-8">
          <div className="anim-elem flex justify-center mb-6 text-accent">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h1 className="anim-elem text-3xl font-black text-primary font-playfair mb-3 tracking-tight">
            Reset Password
          </h1>
          <p className="anim-elem text-primary/70 font-sans text-sm">
            Enter your registered email address and we'll send you a link to reset your password.
          </p>
        </div>

        {status === 'success' ? (
          <div className="anim-elem p-6 bg-accent/10 border border-accent/20 rounded-xl text-center">
             <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                <Mail className="w-6 h-6" />
             </div>
             <h3 className="text-primary font-bold text-lg mb-2">Check your email</h3>
             <p className="text-primary/70 text-sm">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="anim-elem">
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

            {status === 'error' && (
              <div className="anim-elem p-4 bg-accent/10 border border-accent/20 text-accent text-sm rounded-xl flex items-center gap-2">
                <span className="font-bold">Error:</span> {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="anim-elem w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-md group disabled:opacity-70 uppercase tracking-widest text-sm mt-4"
            >
              <span>{status === 'loading' ? 'Sending...' : 'Send Reset Link'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
