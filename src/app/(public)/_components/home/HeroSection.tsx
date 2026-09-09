'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(useGSAP);

export default function HeroSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo('.hero-anim',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2, clearProps: 'all' }
    );
    
    gsap.fromTo('.hero-image',
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.6, clearProps: 'all' }
    );

    gsap.fromTo('.hero-badge',
      { y: 20, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)', delay: 1, clearProps: 'all' }
    );
  }, { scope: container });

  return (
    <section ref={container} className="relative w-full min-h-[90vh] flex items-center pt-24 overflow-hidden bg-white">
      {/* Abstract Background Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-secondary/5 via-secondary/10 to-transparent -z-10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent/5 via-white to-transparent -z-10 blur-3xl rounded-full -translate-x-1/4 translate-y-1/4"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* Left Content */}
        <div className="flex flex-col items-start pt-12 lg:pt-0">
          {/* <div className="hero-anim inline-block mb-6 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
            <span className="text-secondary font-bold text-xs tracking-widest uppercase">Reproductive Medicine Fellowship</span>
          </div>
           */}
          <h1 className="hero-anim text-5xl sm:text-6xl lg:text-7xl font-black text-primary mb-6 font-playfair leading-[1.1] tracking-tight">
            Thinking of a <br />Career in <span className="text-accent">IVF?</span>
          </h1>
          
          <p className="hero-anim text-secondary-text text-lg sm:text-xl max-w-xl mb-10 leading-relaxed font-sans">
            Advance your clinical expertise with India's premier fellowship in Assisted Reproductive Technology.
          </p>

          <div className="hero-anim bg-secondary/5 rounded-3xl p-8 mb-10 border border-secondary/10 w-full max-w-md">
             <h3 className="text-primary font-bold mb-4 font-sans uppercase tracking-widest text-sm">Fellowship Benefits</h3>
             <ul className="space-y-4">
                {[
                  '100% Practical & Clinical Approach',
                  'Expert Mentorship',
                  'Live Case Discussions',
                  'Accredited Certification'
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-primary font-sans text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
             </ul>
          </div>

          <div className="hero-anim flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all shadow-[0_10px_30px_rgba(36,16,79,0.3)] hover:shadow-[0_15px_40px_rgba(69,33,140,0.4)]">
              Schedule a Consult
            </button>
            <button className="bg-white border border-secondary/20 hover:border-secondary text-primary px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all shadow-sm">
              Apply Now
            </button>
          </div>
        </div>

        <div className="relative w-full h-[500px] sm:h-[600px] flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
          <div className="hero-image relative w-full h-full rounded-[4rem] flex items-end justify-center">
             
             {/* Dr. Vaishali Grover Image */}
             <Image src="/tutor-2.jpg" alt="Dr. Vaishali Grover" fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-contain object-bottom z-0 drop-shadow-2xl" />

             {/* Using a placeholder gradient for the doctor image */}
             <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent z-10 pointer-events-none"></div>
             
             {/* Abstract medical cross/stars in background */}
             <div className="absolute top-10 right-10 text-accent/20 z-10">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/></svg>
             </div>

             {/* Badge */}
             <div className="hero-badge absolute bottom-12 left-0 sm:-left-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/50 z-20 max-w-[280px]">
                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-accent font-bold text-xl font-playfair">V</span>
                   </div>
                   <div>
                      <h4 className="text-primary font-bold text-sm font-sans mb-1">Dr. Vaishali Grover</h4>
                      <p className="text-secondary-text text-xs leading-relaxed">Senior IVF Consultant & Mentor, 20+ Years Experience.</p>
                   </div>
                </div>
             </div>
             
          </div>
        </div>

      </div>
    </section>
  );
}
