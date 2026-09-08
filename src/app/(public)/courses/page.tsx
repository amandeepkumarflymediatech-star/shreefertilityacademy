'use client';

import React, { useRef } from 'react';
import { Clock, CheckCircle2, BookOpen, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function CoursesPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero animations
    gsap.fromTo('.anim-elem', 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.1, clearProps: 'all' }
    );

    // Modules stagger
    gsap.fromTo('.module-card', 
      { y: 50, opacity: 0 },
      { 
        y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '.modules-container', start: 'top 80%' }
      }
    );
  }, { scope: container });

  return (
    <div ref={container} className="w-full font-inter min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 overflow-x-hidden selection:bg-accent selection:text-white">
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-blue-100/50 to-transparent -z-10 blur-3xl opacity-70 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Side: The Pitch */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          
          <div className="anim-elem flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-accent font-semibold tracking-widest uppercase text-xs">The Program</span>
          </div>
          
          <h1 className="anim-elem text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-8 text-slate-900 font-playfair leading-tight">
            10-Week Live Online <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-600 italic">Mentorship</span>
          </h1>
          
          <p className="anim-elem text-lg text-slate-600 leading-relaxed mb-10 font-medium max-w-xl">
            A comprehensive, case-based fellowship program designed for practicing Obs & Gynae doctors. Gain the practical skills to confidently run IVF and IUI cycles.
          </p>
          
          <div className="anim-elem flex flex-col gap-5 text-slate-800 font-semibold mb-12 p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm w-full max-w-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-accent"><Clock className="w-6 h-6"/></div> 
              <span className="text-lg">Interactive Small-Batch Format</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-accent"><CheckCircle2 className="w-6 h-6"/></div> 
              <span className="text-lg">Case-Based Clinical Learning</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-accent"><Activity className="w-6 h-6"/></div> 
              <span className="text-lg">Career Guidance & Planning</span>
            </div>
          </div>
          
          <div className="anim-elem flex flex-col sm:flex-row items-center gap-6 w-full">
            <Link href="/pricing" className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-blue-600 text-white font-semibold rounded-xl transition-all shadow-lg text-center flex items-center justify-center gap-2">
              View Pricing <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Right Side: Curriculum Modules */}
        <div className="lg:col-span-6 w-full relative modules-container">
           <div className="grid grid-cols-1 gap-6">
             
             <div className="module-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-5 items-start">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                  <span className="font-playfair font-bold text-accent">01</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl text-slate-900 mb-2 font-playfair">Strong Foundation</h4>
                  <p className="text-slate-600 font-inter text-sm leading-relaxed">Build core understanding of reproductive endocrinology and infertility diagnosis.</p>
                </div>
             </div>

             <div className="module-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-5 items-start">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                  <span className="font-playfair font-bold text-accent">02</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl text-slate-900 mb-2 font-playfair">IVF Protocols</h4>
                  <p className="text-slate-600 font-inter text-sm leading-relaxed">Understand the pathway. Master ovarian stimulation and patient management.</p>
                </div>
             </div>

             <div className="module-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-5 items-start">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                  <span className="font-playfair font-bold text-accent">03</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl text-slate-900 mb-2 font-playfair">IUI Protocols & Lab Setup</h4>
                  <p className="text-slate-600 font-inter text-sm leading-relaxed">Learn the essentials of IUI and plan the key elements required for a successful lab setup.</p>
                </div>
             </div>

           </div>
        </div>

      </div>
    </div>
  );
}