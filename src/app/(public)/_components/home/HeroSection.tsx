'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function HeroSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.hero-anim',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2, clearProps: 'all' }
    );
  }, { scope: container });

  return (
    <section ref={container} className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center z-10 overflow-x-hidden">
      
      <div className="flex flex-col items-start text-left">
        <div className="hero-anim inline-block px-4 py-1.5 mb-6 rounded-full border border-blue-200 bg-blue-50 text-blue-700 font-semibold tracking-wide text-xs uppercase shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Shree Fertility Academy - Excellence in Education
        </div>
        
        <h1 className="hero-anim font-inter text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-slate-900 mb-6 tracking-tight">
          Master the Science of <span className="text-blue-600">IVF</span> and Fertility Care
        </h1>
        
        <p className="hero-anim font-inter text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">
          Advance your clinical expertise with our comprehensive, case-based fellowships and training programs. Designed by experts, tailored for your success.
        </p>

        <div className="hero-anim flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <Link href="/courses" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-md font-inter font-bold shadow-lg hover:bg-blue-700 transition-colors w-full sm:w-auto">
            Explore Programs
          </Link>
          <a href="#demo" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 border border-blue-200 rounded-md font-inter font-bold shadow-sm transition-all hover:bg-blue-50 w-full sm:w-auto">
            <PlayCircle size={20} /> Watch Intro Video
          </a>
        </div>
        
        <div className="hero-anim flex items-center gap-8 mt-12 text-sm font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Case-based Learning
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Expert Mentorship
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Clinical Application
          </div>
        </div>
      </div>

      <div className="hero-anim relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-200">
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-inter">
          [Hero Image/Video Placeholder]
        </div>
        
        {/* Floating Stat Card 1 */}
        <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 flex flex-col">
          <span className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Next Batch</span>
          <span className="font-bold text-slate-900">13 Oct, 2026</span>
        </div>

        {/* Floating Stat Card 2 */}
        <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
            98%
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900">Success Rate</span>
            <span className="text-xs text-slate-500">in Clinical Placement</span>
          </div>
        </div>
      </div>

    </section>
  );
}
