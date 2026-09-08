'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { CheckCircle2, GraduationCap, Award, Stethoscope } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AboutPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.hero-text', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2, clearProps: 'all' }
    );

    gsap.fromTo('.image-reveal', 
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.4, clearProps: 'all' }
    );

    const stats = gsap.utils.toArray('.stat-item');
    stats.forEach((stat: any, i) => {
      gsap.fromTo(stat, 
        { y: 40, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 0.8, delay: i * 0.1, ease: 'power3.out', clearProps: 'all',
          scrollTrigger: { trigger: stat, start: 'top 85%' }
        }
      );
    });

  }, { scope: container });

  return (
    <div ref={container} className="w-full font-inter bg-slate-50 text-slate-900 pt-32 pb-24 selection:bg-accent selection:text-white overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="px-6 py-12 lg:py-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        
        <div className="flex-1 space-y-8 z-10">
          <div className="hero-text inline-block px-5 py-2 rounded-full border border-blue-200 bg-white/60 backdrop-blur-sm text-accent font-semibold tracking-widest text-xs uppercase shadow-sm">
            Meet Your Mentor
          </div>
          <h1 className="hero-text text-5xl md:text-7xl font-bold text-slate-900 font-playfair tracking-tight leading-tight">
            Dr. Vaishali Grover
          </h1>
          <h2 className="hero-text text-2xl font-inter text-slate-600 font-medium">Senior IVF Consultant & Fertility Specialist</h2>
          
          <p className="hero-text text-lg text-slate-600 leading-relaxed font-inter border-l-4 border-accent pl-6 italic">
            "My goal is to help young doctors build a solid foundation so they can confidently decide if reproductive medicine is their true calling."
          </p>

          <div className="hero-text flex flex-col gap-4 pt-6">
            <div className="flex items-center gap-4 text-slate-700 font-medium font-inter">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                 <Stethoscope className="text-accent w-5 h-5" />
              </div>
              20+ Years of Clinical Experience
            </div>
            <div className="flex items-center gap-4 text-slate-700 font-medium font-inter">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                 <GraduationCap className="text-accent w-5 h-5" />
              </div>
              Dedicated to Guiding the Next Generation
            </div>
          </div>
        </div>

        <div className="flex-1 w-full relative">
          <div className="image-reveal relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10"></div>
             {/* Using a placeholder for now, you should replace this with Dr. Vaishali Grover's actual portrait */}
            <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500 font-inter">
               [Dr. Vaishali Grover Portrait]
            </div>
            <div className="absolute bottom-10 left-10 z-20">
              <h3 className="text-2xl font-playfair font-bold text-white drop-shadow-md">Excellence in Practice</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Value Section */}
      <section className="px-6 py-24 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="stat-item p-10 bg-slate-50 rounded-3xl border border-slate-100 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"><CheckCircle2 className="w-8 h-8 text-accent" /></div>
            <h4 className="text-xl font-bold font-playfair mb-3">Strong Foundation</h4>
            <p className="text-slate-600 font-inter text-sm">A meticulously designed curriculum to build core understanding.</p>
          </div>
          <div className="stat-item p-10 bg-slate-50 rounded-3xl border border-slate-100 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"><Award className="w-8 h-8 text-accent" /></div>
            <h4 className="text-xl font-bold font-playfair mb-3">Practical Learning</h4>
            <p className="text-slate-600 font-inter text-sm">Case-based clinical learning to handle real-world IVF & IUI scenarios.</p>
          </div>
          <div className="stat-item p-10 bg-slate-50 rounded-3xl border border-slate-100 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"><GraduationCap className="w-8 h-8 text-accent" /></div>
            <h4 className="text-xl font-bold font-playfair mb-3">Career Guidance</h4>
            <p className="text-slate-600 font-inter text-sm">Make a confident, informed decision before committing to a long-term fellowship.</p>
          </div>
        </div>
      </section>

    </div>
  );
}