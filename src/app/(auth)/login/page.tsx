'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { User, Stethoscope, ArrowLeft, ArrowRight, Microscopic, Activity } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function LoginSelectionPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Background IVF animation element
    gsap.to('.ivf-cell', {
      y: 'random(-20, 20)',
      x: 'random(-20, 20)',
      rotation: 'random(-15, 15)',
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.2
    });

    gsap.fromTo('.anim-elem', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2, clearProps: 'all' }
    );

    gsap.fromTo('.card-anim', 
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.5, clearProps: 'all' }
    );

  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-inter relative overflow-x-hidden selection:bg-accent selection:text-white">
      
      {/* Abstract IVF Animation Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-200/40 via-purple-100/30 to-transparent -z-10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-accent/10 via-teal-50/40 to-transparent -z-10 blur-3xl rounded-full"></div>

      {/* Floating abstract cells */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border border-blue-200/50 bg-white/40 backdrop-blur-sm -z-10 ivf-cell flex items-center justify-center">
         <div className="w-16 h-16 rounded-full bg-blue-100/50 ivf-cell"></div>
      </div>
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full border border-purple-200/50 bg-white/40 backdrop-blur-sm -z-10 ivf-cell flex items-center justify-center">
         <div className="w-24 h-24 rounded-full bg-purple-100/50 ivf-cell"></div>
      </div>
      <div className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full border border-teal-200/50 bg-white/40 backdrop-blur-sm -z-10 ivf-cell"></div>

      <div className="max-w-5xl w-full bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white overflow-hidden flex flex-col p-8 sm:p-12 md:p-16 z-10 relative">
        
        <Link href="/" className="anim-elem inline-flex items-center gap-2 text-slate-500 hover:text-accent font-bold text-xs tracking-widest uppercase mb-12 transition-colors self-start bg-slate-100 px-4 py-2 rounded-full">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="text-center mb-16">
          <div className="anim-elem flex justify-center mb-6 text-accent">
            <Activity className="w-12 h-12" />
          </div>
          <h1 className="anim-elem text-4xl sm:text-5xl font-black text-slate-900 mb-4 font-playfair tracking-tight">
            Academy Portal
          </h1>
          <p className="anim-elem text-slate-600 text-lg max-w-lg mx-auto leading-relaxed">
            Access your mentorship modules, track your progress, and continue your journey in reproductive medicine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
          
          {/* Student / Doctor Card */}
          <Link href="/student/login" className="card-anim group relative bg-white border border-slate-200 hover:border-accent p-8 sm:p-10 rounded-3xl transition-all duration-300 hover:shadow-xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110">
              <User className="w-8 h-8 text-slate-400 group-hover:text-accent transition-colors" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-playfair mb-3">Enrolled Doctor</h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">Access your learning dashboard, view case studies, and join live sessions.</p>
            <div className="mt-auto flex items-center gap-2 text-accent font-bold text-sm tracking-widest uppercase bg-blue-50 px-6 py-2.5 rounded-full group-hover:bg-accent group-hover:text-white transition-colors">
              Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tutor / Mentor Card */}
          <Link href="/tutor/login" className="card-anim group relative bg-white border border-slate-200 hover:border-accent p-8 sm:p-10 rounded-3xl transition-all duration-300 hover:shadow-xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110">
              <Stethoscope className="w-8 h-8 text-slate-400 group-hover:text-accent transition-colors" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-playfair mb-3">Course Mentor</h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">Manage your mentees, update the curriculum schedule, and review clinical progress.</p>
            <div className="mt-auto flex items-center gap-2 text-accent font-bold text-sm tracking-widest uppercase bg-blue-50 px-6 py-2.5 rounded-full group-hover:bg-accent group-hover:text-white transition-colors">
              Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

      </div>
    </div>
  );
}