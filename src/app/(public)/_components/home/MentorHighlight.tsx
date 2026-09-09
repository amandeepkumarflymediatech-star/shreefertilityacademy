'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PlayCircle } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function MentorHighlight() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.mentor-image',
      { x: -50, opacity: 0, rotation: -5 },
      {
        x: 0, opacity: 1, rotation: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: container.current,
          start: 'top 75%',
        },
        clearProps: 'all'
      }
    );

    gsap.fromTo('.mentor-content',
      { x: 50, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2,
        scrollTrigger: {
          trigger: container.current,
          start: 'top 75%',
        },
        clearProps: 'all'
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="relative w-full py-24 bg-primary-bg overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Mentor Image (Left) */}
        <div className="mentor-image relative flex justify-center lg:justify-end">
           {/* Decorative background rings */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-[2px] border-dashed border-secondary/20 rounded-full animate-spin-slow -z-10"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-secondary/10 rounded-full -z-10 bg-white shadow-xl"></div>
           
           {/* Actual Image */}
           <div className="relative w-72 sm:w-80 h-96 sm:h-[28rem] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white flex items-end justify-center bg-slate-100">
              <Image src="/tutor-2.jpg" alt="Dr. Vaishali Grover" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent z-0 pointer-events-none"></div>
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[90%]">
                 <div className="bg-white/90 backdrop-blur-md py-3 px-4 rounded-2xl shadow-lg border border-white/50 text-center">
                    <p className="text-primary font-bold text-sm font-sans">20+ Years</p>
                    <p className="text-accent text-xs font-bold uppercase tracking-widest">Experience</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Mentor Content (Right) */}
        <div className="mentor-content flex flex-col items-center lg:items-start text-center lg:text-left">
          <h4 className="text-secondary font-bold text-xs tracking-[0.2em] uppercase mb-4">Course Director</h4>
          <h2 className="text-4xl sm:text-5xl font-black text-primary font-playfair mb-2">Dr. Vaishali Grover</h2>
          <h3 className="text-accent font-sans font-bold text-lg mb-8">Senior IVF Consultant & Mentor</h3>
          
          <div className="space-y-6 text-secondary-text font-sans text-base leading-relaxed max-w-lg">
             <p>
               Dr. Vaishali Grover is a renowned specialist in Reproductive Medicine, having helped thousands of couples achieve their dream of parenthood. 
             </p>
             <p>
               With extensive clinical experience and a passion for teaching, she has designed this fellowship to bridge the gap between theoretical knowledge and practical application in the IVF lab and clinic.
             </p>
          </div>

          <button className="mt-10 flex items-center gap-3 bg-white border border-secondary/20 hover:border-secondary text-primary px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all shadow-sm group">
            <PlayCircle className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
            Watch Intro Video
          </button>
        </div>

      </div>
    </section>
  );
}
