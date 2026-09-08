'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function StatsBanner() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.stat-box',
      { y: 30, opacity: 0 },
      { 
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: container.current, start: 'top 90%' }
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="w-full bg-blue-700 py-16 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-blue-600/50">
        
        <div className="stat-box flex flex-col items-start md:items-center text-left md:text-center px-4">
          <span className="text-4xl md:text-5xl font-bold text-white mb-2 font-inter">5,000<span className="text-blue-300">+</span></span>
          <span className="text-blue-100 text-sm font-medium leading-tight">Experienced Clinicians Trained Worldwide</span>
        </div>
        
        <div className="stat-box flex flex-col items-start md:items-center text-left md:text-center px-4">
          <span className="text-4xl md:text-5xl font-bold text-white mb-2 font-inter">50<span className="text-blue-300">+</span></span>
          <span className="text-blue-100 text-sm font-medium leading-tight">World-Class Faculty Members</span>
        </div>

        <div className="stat-box flex flex-col items-start md:items-center text-left md:text-center px-4">
          <span className="text-4xl md:text-5xl font-bold text-white mb-2 font-inter">100<span className="text-blue-300">+</span></span>
          <span className="text-blue-100 text-sm font-medium leading-tight">Clinical Center Partners Globally</span>
        </div>

        <div className="stat-box flex flex-col items-start md:items-center text-left md:text-center px-4">
          <span className="text-4xl md:text-5xl font-bold text-white mb-2 font-inter">20<span className="text-blue-300">+</span></span>
          <span className="text-blue-100 text-sm font-medium leading-tight">Years of Excellence in Reproductive Med</span>
        </div>

      </div>
    </section>
  );
}
