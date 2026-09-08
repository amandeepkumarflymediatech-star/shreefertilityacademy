'use client';

import React, { useRef } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function PricingPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.anim-elem', 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2, clearProps: 'all' }
    );

    gsap.fromTo('.price-card', 
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5, clearProps: 'all' }
    );
  }, { scope: container });

  return (
    <div ref={container} className="w-full font-inter bg-slate-50 text-slate-900 pt-32 pb-24 min-h-screen selection:bg-accent selection:text-white relative overflow-x-hidden">
      
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-100/60 via-purple-50/40 to-transparent -z-10 blur-3xl opacity-70"></div>
      
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        {/* Header */}
        <div className="mb-20">
          <div className="anim-elem inline-block px-5 py-2 mb-6 rounded-full border border-blue-200 bg-white/60 backdrop-blur-sm text-accent font-semibold tracking-widest text-xs uppercase shadow-sm">
            Enrolment & Investment
          </div>
          <h1 className="anim-elem text-5xl md:text-6xl font-bold tracking-tight text-slate-900 font-playfair mb-6">
            Make an <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-600 italic">Informed</span> Decision.
          </h1>
          <p className="anim-elem text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-inter leading-relaxed">
            Gain comprehensive practical training in Reproductive Medicine with Dr. Vaishali Grover.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="price-card max-w-2xl mx-auto bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-accent rounded-b-full"></div>
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-playfair text-slate-900 mb-4">10-Week Mentorship</h2>
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 inline-block">
               <div className="flex items-center gap-2 text-accent font-bold text-sm mb-1 justify-center">
                 <Clock size={16} /> Early-bird Registration
               </div>
               <span className="text-slate-500 text-xs">Valid till: 15 September 2026</span>
            </div>

            <div className="flex items-end justify-center gap-2 mb-4">
              <span className="text-6xl font-black font-playfair text-slate-900 tracking-tight">₹55,000</span>
              <span className="text-lg text-slate-500 font-inter mb-2">+ GST</span>
            </div>
            <p className="text-slate-500 font-inter text-sm line-through">Regular Fee: ₹60,000 + GST</p>
          </div>
          
          <div className="h-px w-full bg-slate-100 mb-10"></div>
          
          <div className="text-left space-y-5 mb-12">
            {[
              '10-Week Live Online Mentorship',
              'Interactive Small-Batch Format',
              'Case-Based Clinical Learning',
              'IVF & IUI Protocol Design',
              'Direct Career Guidance',
              'Exclusive Access to Course Materials'
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-slate-700 font-inter font-medium">{feature}</span>
              </div>
            ))}
          </div>
          
          <Link href="/#register" className="block w-full py-5 bg-slate-900 hover:bg-accent text-white font-bold text-lg rounded-2xl shadow-xl shadow-slate-200 transition-all hover:scale-105 duration-300">
            Reserve Your Place
          </Link>
          
          <p className="text-center text-sm text-slate-400 mt-6 font-inter">
            Next cohort starts <strong>13 October 2026</strong>. Limited slots available.
          </p>
        </div>

      </div>
    </div>
  );
}
