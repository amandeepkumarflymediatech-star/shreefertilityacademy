'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function FooterCta() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.cta-content',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: container.current,
          start: 'top 80%',
        },
        clearProps: 'all'
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="relative w-full py-32 bg-primary overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
      
      {/* Abstract circles */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-secondary/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 cta-content">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-playfair tracking-tight mb-6 leading-tight">
          Take the First Step Towards a <br />
          <span className="text-accent">Career in IVF</span>
        </h2>
        
        <p className="text-white/80 font-sans text-lg sm:text-xl mb-12 max-w-2xl mx-auto">
          Equip yourself with the clinical confidence to excel in reproductive medicine. Join our next cohort today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
           <Link href="/student/signup" className="flex items-center gap-3 bg-white text-primary hover:bg-accent hover:text-white px-10 py-5 rounded-full font-bold text-sm tracking-widest uppercase transition-colors shadow-xl group">
             Register Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
           </Link>
           <div className="flex items-center gap-6">
              <span className="text-white/60 font-sans text-sm uppercase tracking-widest">Or Contact Us</span>
              <div className="flex flex-col text-left">
                 <span className="text-white font-bold font-sans text-sm">+91 9876543210</span>
                 <span className="text-white/60 text-xs font-sans">info@shreefertilityacademy.com</span>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
