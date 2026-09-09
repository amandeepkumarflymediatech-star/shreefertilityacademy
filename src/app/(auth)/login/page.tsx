'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { User, Stethoscope, ArrowLeft, ArrowRight, Activity } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function LoginSelectionPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // IVF Animation Sequence (Sperm moving towards Egg)
    const tl = gsap.timeline({ repeat: -1 });
    
    // Sperm wiggle and swim
    tl.to('.sperm', {
      x: 150,
      y: 30,
      rotation: 15,
      duration: 3,
      ease: "power1.inOut"
    }, 0);
    
    tl.to('.sperm-tail', {
      rotation: 'random(-20, 20)',
      yoyo: true,
      repeat: 12,
      duration: 0.25,
      ease: "sine.inOut",
      transformOrigin: "left center"
    }, 0);

    // Egg gentle pulse
    gsap.to('.egg', {
      scale: 1.05,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

    gsap.fromTo('.anim-elem', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.2, clearProps: 'all' }
    );

    gsap.fromTo('.card-anim', 
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.4, clearProps: 'all' }
    );

  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen bg-primary flex items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-accent selection:text-white">
      
      {/* Dark Purple Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#301663] to-secondary opacity-90 z-0"></div>

      {/* Background IVF Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-80">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
            {/* The Egg */}
            <div className="egg absolute top-1/2 right-1/4 w-40 h-40 rounded-full border-[2px] border-white/20 bg-white/5 backdrop-blur-sm -translate-y-1/2 flex items-center justify-center shadow-[0_0_50px_rgba(230,57,70,0.3)]">
               <div className="w-24 h-24 rounded-full border border-white/10 bg-white/5"></div>
               <div className="absolute w-8 h-8 rounded-full bg-accent/40 blur-sm translate-x-3 -translate-y-3"></div>
            </div>

            {/* The Sperm */}
            <div className="sperm absolute top-1/2 left-1/4 -translate-y-1/2 flex items-center">
               <div className="w-6 h-5 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] z-10"></div>
               <div className="sperm-tail w-16 h-0.5 bg-white/60 rounded-full -ml-2 origin-left blur-[1px]"></div>
            </div>

            {/* Other ambient elements */}
            <div className="absolute top-1/4 right-1/3 w-6 h-6 rounded-full bg-accent/40 blur-sm animate-pulse"></div>
            <div className="absolute bottom-1/3 left-1/3 w-8 h-8 rounded-full bg-white/20 blur-md animate-pulse" style={{ animationDelay: '1s' }}></div>
         </div>
      </div>

      <div className="max-w-4xl w-full bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/20 flex flex-col p-6 sm:p-10 z-10 relative mt-4">
        
        <Link href="/" className="anim-elem inline-flex items-center gap-2 text-primary/60 hover:text-accent font-bold text-[10px] tracking-widest uppercase mb-6 transition-colors self-start bg-secondary/5 px-3 py-1.5 rounded-full">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="text-center mb-10">
          <div className="anim-elem flex justify-center mb-4 text-accent">
            <Activity className="w-10 h-10" />
          </div>
          <h1 className="anim-elem text-3xl sm:text-4xl font-black text-primary font-playfair mb-2 tracking-tight">
            Academy Portal
          </h1>
          <p className="anim-elem text-secondary-text text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Access your video courses, track your progress, and continue your learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto w-full">
          
          {/* Student / Doctor Card */}
          <Link href="/student/login" className="card-anim group relative bg-white border border-secondary/10 hover:border-accent p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-secondary/5 border border-secondary/10 group-hover:bg-accent/10 group-hover:border-accent/20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
              <User className="w-6 h-6 text-primary/50 group-hover:text-accent transition-colors" />
            </div>
            <h2 className="text-xl font-bold text-primary mb-2 font-playfair">Enrolled Student</h2>
            <p className="text-secondary-text text-xs sm:text-sm mb-6 leading-relaxed">Access your pre-recorded video modules and join live clinical sessions.</p>
            <div className="mt-auto flex items-center gap-2 text-accent font-bold text-[10px] sm:text-xs tracking-widest uppercase bg-accent/10 px-5 py-2 rounded-full group-hover:bg-accent group-hover:text-white transition-colors">
              Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tutor / Mentor Card */}
          <Link href="/tutor/login" className="card-anim group relative bg-white border border-secondary/10 hover:border-accent p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-secondary/5 border border-secondary/10 group-hover:bg-accent/10 group-hover:border-accent/20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
              <Stethoscope className="w-6 h-6 text-primary/50 group-hover:text-accent transition-colors" />
            </div>
            <h2 className="text-xl font-bold text-primary mb-2 font-playfair">Course Mentor</h2>
            <p className="text-secondary-text text-xs sm:text-sm mb-6 leading-relaxed">Schedule live sessions and track your mentees' progress.</p>
            <div className="mt-auto flex items-center gap-2 text-accent font-bold text-[10px] sm:text-xs tracking-widest uppercase bg-accent/10 px-5 py-2 rounded-full group-hover:bg-accent group-hover:text-white transition-colors">
              Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

      </div>
    </div>
  );
}