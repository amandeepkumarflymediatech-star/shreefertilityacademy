'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const faqs = [
  { q: "Where is the centre located?", a: "Our primary training centre is located in New Delhi, India. We also offer online foundational modules before the clinical posting." },
  { q: "What is the duration of the program?", a: "The fellowship is a comprehensive 10-week program, consisting of both theoretical online modules and intensive clinical hands-on training." },
  { q: "What is the eligibility for the program?", a: "The program is open to candidates holding an MD/MS, DGO, or DNB in Obstetrics and Gynaecology." },
  { q: "What is the fee structure?", a: "Please fill out the enquiry form on the left to get a detailed breakdown of the fee structure and payment plans." },
];

export default function FaqAndForm() {
  const container = useRef<HTMLDivElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  useGSAP(() => {
    gsap.fromTo('.faq-header',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: container.current, start: 'top 80%' },
        clearProps: 'all'
      }
    );
    gsap.fromTo('.faq-form',
      { x: -30, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2,
        scrollTrigger: { trigger: container.current, start: 'top 80%' },
        clearProps: 'all'
      }
    );
    gsap.fromTo('.faq-item',
      { y: 20, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.4,
        scrollTrigger: { trigger: container.current, start: 'top 80%' },
        clearProps: 'all'
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="relative w-full py-32 bg-primary-bg overflow-hidden">
      
      {/* Background visual element */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="faq-header mb-16 max-w-2xl">
          <h2 className="text-4xl sm:text-5xl font-black text-primary font-playfair tracking-tight">
            Questions worth <span className="text-accent italic">asking.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Form Left Side */}
          <div className="faq-form bg-primary text-white p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
             {/* Decorative swirls inside form */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/40 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
             
             <div className="relative z-10">
                <h3 className="text-2xl font-bold font-playfair mb-2">Find details about your next step.</h3>
                <p className="text-white/70 font-sans text-sm mb-8">Fill the form below and our team will get back to you.</p>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-1.5">First Name *</label>
                       <input type="text" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors" placeholder="John" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-1.5">Last Name *</label>
                       <input type="text" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors" placeholder="Doe" />
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-1.5">Email *</label>
                       <input type="email" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors" placeholder="john@example.com" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-1.5">Phone Number *</label>
                       <input type="tel" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors" placeholder="+91 9876543210" />
                     </div>
                  </div>
                  
                  <button type="submit" className="w-full bg-white text-primary hover:bg-accent hover:text-white font-bold uppercase tracking-widest text-sm py-4 rounded-xl mt-6 transition-colors shadow-lg">
                    Request Info
                  </button>
                </form>
             </div>
          </div>

          {/* Accordion FAQ Right Side */}
          <div className="flex flex-col gap-4">
             {faqs.map((faq, idx) => {
               const isOpen = openIdx === idx;
               return (
                 <div key={idx} className="faq-item border-b border-secondary/10 pb-4">
                   <button 
                     onClick={() => setOpenIdx(isOpen ? null : idx)}
                     className="w-full flex items-center justify-between text-left py-4 focus:outline-none group"
                   >
                     <span className={`font-sans font-bold text-lg transition-colors ${isOpen ? 'text-accent' : 'text-primary group-hover:text-secondary'}`}>
                       {faq.q}
                     </span>
                     <ChevronDown className={`w-5 h-5 text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
                   </button>
                   <div 
                     className="overflow-hidden transition-all duration-300 ease-in-out"
                     style={{ maxHeight: isOpen ? '200px' : '0px', opacity: isOpen ? 1 : 0 }}
                   >
                     <p className="text-secondary-text font-sans pb-4 pr-8 leading-relaxed">
                       {faq.a}
                     </p>
                   </div>
                 </div>
               );
             })}
          </div>

        </div>
      </div>
    </section>
  );
}
