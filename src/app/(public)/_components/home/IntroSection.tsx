'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function IntroSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.intro-text',
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: container.current,
          start: 'top 80%',
        },
        clearProps: 'all'
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="relative w-full py-32 bg-primary-bg overflow-hidden flex items-center justify-center">
      {/* Decorative center element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-secondary/10 rounded-full pointer-events-none flex items-center justify-center">
         <div className="w-[400px] h-[400px] border border-secondary/20 rounded-full"></div>
      </div>
      
      {/* Floating abstract baby/medical graphic placeholder */}
      <div className="absolute top-1/2 right-20 -translate-y-1/2 opacity-10 pointer-events-none blur-sm">
         <div className="w-64 h-64 bg-secondary rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="intro-text text-accent font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-8">
          A Rewarding Specialization
        </h2>
        
        <h1 className="intro-text text-4xl sm:text-5xl md:text-6xl font-black text-primary leading-tight font-playfair mb-8">
          Discover if Reproductive Medicine is the right career for you.
        </h1>
        
        <p className="intro-text text-secondary-text text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-sans">
          The field of ART is rapidly growing. With our structured curriculum, you can transition into this specialized field with complete confidence and clinical mastery.
        </p>

        <div className="intro-text mt-16 flex justify-center">
           <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center border border-secondary/10 relative">
              <div className="absolute inset-2 border border-dashed border-secondary/30 rounded-full animate-spin-slow"></div>
              <span className="text-secondary font-bold text-xs uppercase tracking-widest">Learn More</span>
           </div>
        </div>
      </div>
    </section>
  );
}
