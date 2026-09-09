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
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.2, clearProps: 'all' }
    );

    gsap.fromTo('.image-reveal', 
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.4, clearProps: 'all' }
    );

    const stats = gsap.utils.toArray('.stat-item');
    stats.forEach((stat: any, i) => {
      gsap.fromTo(stat, 
        { y: 30, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 0.8, delay: i * 0.1, ease: 'power3.out', clearProps: 'all',
          scrollTrigger: { trigger: stat, start: 'top 85%' }
        }
      );
    });

  }, { scope: container });

  return (
    <div ref={container} className="w-full font-sans bg-primary-bg text-primary pt-28 pb-16 selection:bg-accent selection:text-white overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="px-6 py-12 lg:py-16 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/4 -translate-y-1/4"></div>
        
        <div className="flex-1 space-y-6 z-10">
          <div className="hero-text inline-flex items-center px-4 py-1.5 rounded-full border border-secondary/20 bg-secondary/5 text-accent font-bold tracking-widest text-[10px] uppercase shadow-sm">
            Meet Your Mentor
          </div>
          <h1 className="hero-text text-5xl md:text-6xl font-black text-primary font-playfair tracking-tight leading-tight">
            Dr. Vaishali Grover
          </h1>
          <h2 className="hero-text text-xl sm:text-2xl font-bold text-secondary-text">Senior IVF Consultant & Fertility Specialist</h2>
          
          <p className="hero-text text-base sm:text-lg text-primary/80 leading-relaxed font-sans border-l-4 border-accent pl-5 italic my-8">
            "My goal is to help young doctors build a solid foundation so they can confidently decide if reproductive medicine is their true calling."
          </p>

          <div className="hero-text flex flex-col gap-4 pt-4">
            <div className="flex items-center gap-4 text-primary font-bold text-sm">
              <div className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center shrink-0 border border-secondary/10">
                 <Stethoscope className="text-accent w-4 h-4" />
              </div>
              20+ Years of Clinical Experience
            </div>
            <div className="flex items-center gap-4 text-primary font-bold text-sm">
              <div className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center shrink-0 border border-secondary/10">
                 <GraduationCap className="text-accent w-4 h-4" />
              </div>
              Dedicated to Guiding the Next Generation
            </div>
          </div>
        </div>

        <div className="flex-1 w-full relative max-w-lg lg:max-w-none">
          <div className="image-reveal relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-100 flex items-end justify-center">
             
             {/* Mentor Image */}
             <Image src="/tutor-2.jpg" alt="Dr. Vaishali Grover" fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-cover object-top z-0" />
             
             <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent z-10 pointer-events-none"></div>
             
             <div className="absolute bottom-10 left-10 z-20">
               <h3 className="text-2xl font-playfair font-black text-white drop-shadow-md">Excellence in Practice</h3>
             </div>
          </div>
        </div>
      </section>

      {/* Stats/Value Section */}
      <section className="px-6 py-20 mt-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="stat-item p-8 bg-white rounded-3xl border border-secondary/10 text-center shadow-[0_10px_40px_rgba(36,16,79,0.05)] hover:border-accent/50 transition-colors duration-300">
            <div className="w-14 h-14 bg-secondary/5 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-6 h-6 text-accent" />
            </div>
            <h4 className="text-lg font-bold font-playfair text-primary mb-2">Strong Foundation</h4>
            <p className="text-secondary-text text-sm leading-relaxed">A meticulously designed curriculum to build core understanding.</p>
          </div>
          
          <div className="stat-item p-8 bg-white rounded-3xl border border-secondary/10 text-center shadow-[0_10px_40px_rgba(36,16,79,0.05)] hover:border-accent/50 transition-colors duration-300">
            <div className="w-14 h-14 bg-secondary/5 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Award className="w-6 h-6 text-accent" />
            </div>
            <h4 className="text-lg font-bold font-playfair text-primary mb-2">Practical Learning</h4>
            <p className="text-secondary-text text-sm leading-relaxed">Case-based clinical learning to handle real-world IVF & IUI scenarios.</p>
          </div>
          
          <div className="stat-item p-8 bg-white rounded-3xl border border-secondary/10 text-center shadow-[0_10px_40px_rgba(36,16,79,0.05)] hover:border-accent/50 transition-colors duration-300">
            <div className="w-14 h-14 bg-secondary/5 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <GraduationCap className="w-6 h-6 text-accent" />
            </div>
            <h4 className="text-lg font-bold font-playfair text-primary mb-2">Career Guidance</h4>
            <p className="text-secondary-text text-sm leading-relaxed">Make a confident, informed decision before committing to a fellowship.</p>
          </div>

        </div>
      </section>

    </div>
  );
}