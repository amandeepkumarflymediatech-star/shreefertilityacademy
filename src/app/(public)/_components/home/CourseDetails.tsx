'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function CourseDetails() {
  const container = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header animation
    gsap.fromTo('.course-header',
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

    // The animated progress line
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: timelineRef.current,
        start: 'top 80%',
        end: 'bottom 50%',
        scrub: 1,
      }
    });

    // Draw the line width from 0 to 100%
    tl.fromTo('.progress-line', 
      { width: '0%' }, 
      { width: '100%', ease: 'none' }
    );

    // Pop the circles as the line reaches them
    const steps = gsap.utils.toArray('.course-step-circle');
    steps.forEach((step: any, i) => {
      // Calculate approximate position of the step along the line
      const position = i / (steps.length - 1);
      
      tl.to(step, {
        backgroundColor: '#E63946', // Accent color
        borderColor: '#E63946',
        color: '#ffffff',
        scale: 1.1,
        boxShadow: '0 0 20px rgba(230,57,70,0.5)',
        duration: 0.1,
      }, position); // Insert into timeline at the corresponding progress point
      
      // Also pop the text below it
      tl.to(`.course-step-text-${i}`, {
        color: '#E63946',
        scale: 1.05,
        duration: 0.1,
      }, position);
    });

  }, { scope: container });

  const steps = [
    { day: "01", title: "Basic Endoscopy" },
    { day: "02", title: "Follicular Dynamics" },
    { day: "03", title: "Oocyte Retrieval" },
    { day: "04", title: "Embryology Basics" },
    { day: "05", title: "Embryo Transfer" },
  ];

  return (
    <section ref={container} className="relative w-full py-32 bg-primary-bg overflow-hidden selection:bg-accent selection:text-white">
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="text-center mb-20 course-header flex flex-col items-center">
          <div className="inline-flex items-center gap-2 mb-4 bg-secondary/5 px-4 py-1.5 rounded-full border border-secondary/20">
            <Sparkles className="w-3 h-3 text-accent" />
            <span className="text-accent font-bold tracking-widest uppercase text-[10px]">Step-by-Step</span>
          </div>
          <h2 className="text-primary font-black text-4xl sm:text-5xl font-playfair tracking-tight mb-4">
            Course Details
          </h2>
          <p className="text-secondary-text text-lg max-w-2xl mx-auto font-sans">
            A comprehensive approach to mastering reproductive medicine.
          </p>
        </div>

        <div 
          ref={timelineRef}
          className="relative max-w-6xl mx-auto bg-white p-8 sm:p-14 rounded-[2rem] shadow-[0_20px_60px_rgba(36,16,79,0.08)] border border-secondary/10"
        >
          
          <div className="flex flex-col sm:flex-row justify-between relative items-center sm:items-start">
            
            {/* The static background line */}
            <div className="hidden sm:block absolute top-[2.25rem] left-[4%] right-[4%] h-1 bg-secondary/10 rounded-full z-0"></div>
            
            {/* The animated fill line */}
            <div className="progress-line hidden sm:block absolute top-[2.25rem] left-[4%] h-1 bg-gradient-to-r from-primary to-accent rounded-full z-0 origin-left"></div>

            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-row sm:flex-col items-center gap-6 sm:gap-5 w-full sm:w-[15%] mb-10 sm:mb-0 group cursor-default">
                
                {/* Step Circle */}
                <div className={`course-step-circle w-16 h-16 sm:w-20 sm:h-20 bg-white border-4 border-secondary/20 rounded-full flex items-center justify-center shadow-lg text-primary font-bold text-xl sm:text-2xl font-playfair transition-all duration-300 z-10`}>
                  {step.day}
                </div>
                
                {/* Step Title */}
                <div className="text-left sm:text-center w-full">
                   <h3 className={`course-step-text-${idx} text-primary/70 font-bold text-xs sm:text-[11px] md:text-xs uppercase tracking-widest font-sans transition-colors duration-300`}>
                     {step.title}
                   </h3>
                </div>

                {/* Mobile static connecting line */}
                {idx !== steps.length - 1 && (
                   <div className="sm:hidden absolute left-8 top-16 bottom-[-2.5rem] w-1 bg-secondary/10 -z-10 rounded-full"></div>
                )}
                {/* Mobile animated connecting line (simplified for mobile) */}
                {idx !== steps.length - 1 && (
                   <div className="progress-line sm:hidden absolute left-8 top-16 bottom-[-2.5rem] w-1 bg-gradient-to-b from-primary to-accent -z-10 origin-top"></div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
