'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, BookOpen, Stethoscope, Award } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ProgramJourney() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.journey-header',
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

    gsap.fromTo('.journey-step',
      { y: 30, opacity: 0, scale: 0.9 },
      {
        y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: '.journey-timeline',
          start: 'top 85%',
        },
        clearProps: 'all'
      }
    );
  }, { scope: container });

  const steps = [
    { title: "Initial Orientation", icon: <BookOpen className="w-6 h-6 text-accent" /> },
    { title: "Clinical Rotations", icon: <Stethoscope className="w-6 h-6 text-accent" /> },
    { title: "Lab Hands-On", icon: <Activity className="w-6 h-6 text-accent" /> },
    { title: "Final Assessment", icon: <Award className="w-6 h-6 text-accent" /> },
  ];

  return (
    <section ref={container} className="relative w-full py-24 bg-white overflow-hidden border-t border-secondary/5">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        
        <div className="text-center mb-20 journey-header">
          <h2 className="text-primary font-bold text-3xl font-playfair tracking-tight mb-4">
            Program Journey
          </h2>
        </div>

        <div className="journey-timeline relative w-full">
           {/* Connecting Line */}
           <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-secondary/10 z-0"></div>

           <div className="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4 relative z-10">
              {steps.map((step, idx) => (
                <div key={idx} className="journey-step flex flex-col items-center text-center w-full md:w-48 group">
                   <div className="w-20 h-20 bg-white rounded-full border border-secondary/20 shadow-md flex items-center justify-center mb-6 group-hover:border-accent transition-colors relative">
                      {/* Pulse effect */}
                      <div className="absolute inset-0 rounded-full border border-accent/0 group-hover:animate-ping opacity-20"></div>
                      {step.icon}
                   </div>
                   <h3 className="text-primary font-bold text-sm font-sans tracking-wide">{step.title}</h3>
                </div>
              ))}
           </div>
        </div>

      </div>
    </section>
  );
}
