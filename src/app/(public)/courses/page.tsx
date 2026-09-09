'use client';

import React, { useRef } from 'react';
import { Clock, CheckCircle2, Activity, ArrowRight, BookOpen, Stethoscope, Video, Users } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const modules = [
  {
    id: '01',
    title: 'Reproductive Endocrinology Basics',
    description: 'Build a solid foundation in the hormonal pathways and core diagnostic principles necessary for successful ART interventions.'
  },
  {
    id: '02',
    title: 'Ovarian Stimulation & IVF Protocols',
    description: 'Master step-by-step ovarian stimulation, monitoring, and patient management strategies across diverse clinical scenarios.'
  },
  {
    id: '03',
    title: 'IUI Protocols & Lab Setup',
    description: 'Learn the essentials of Intrauterine Insemination (IUI) and the key elements required for a successful basic lab setup.'
  },
  {
    id: '04',
    title: 'Troubleshooting & Poor Responders',
    description: 'Develop advanced strategies to handle complex cases, poor ovarian response, and recurring implantation failures.'
  },
  {
    id: '05',
    title: 'Complication Management (OHSS)',
    description: 'Learn how to predict, prevent, and clinically manage Ovarian Hyperstimulation Syndrome and other ART complications.'
  },
  {
    id: '06',
    title: 'Live Case Discussions & Q&A',
    description: 'Engage directly with Dr. Vaishali to review real-world case studies, analyze outcomes, and refine clinical judgment.'
  }
];

export default function CoursesPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero animations
    gsap.fromTo('.anim-elem', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.1, clearProps: 'all' }
    );

    // Modules stagger
    gsap.fromTo('.module-card', 
      { y: 30, opacity: 0 },
      { 
        y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '.modules-container', start: 'top 85%' }
      }
    );
  }, { scope: container });

  return (
    <div ref={container} className="w-full font-sans min-h-screen bg-primary-bg text-primary pt-24 pb-16 overflow-x-hidden selection:bg-accent selection:text-white relative">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full px-6 flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mb-12">
          <div className="anim-elem inline-flex items-center gap-2 mb-4 bg-secondary/5 px-4 py-1.5 rounded-full border border-secondary/20">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-accent font-bold tracking-widest uppercase text-[10px]">The Curriculum</span>
          </div>
          
          <h1 className="anim-elem text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-primary font-playfair leading-tight">
            10-Week Clinical <span className="text-accent italic">Mentorship</span>
          </h1>
          
          <p className="anim-elem text-base sm:text-lg text-secondary-text leading-relaxed font-medium">
            A comprehensive, case-based fellowship program designed for practicing Obs & Gynae doctors. Gain the practical skills to confidently run IVF and IUI cycles independently.
          </p>
        </div>

        {/* Value Props */}
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
           <div className="anim-elem bg-white p-5 rounded-2xl border border-secondary/10 shadow-sm flex flex-col items-center text-center">
             <div className="w-10 h-10 bg-secondary/5 rounded-full flex items-center justify-center text-accent mb-3"><Video className="w-5 h-5"/></div>
             <h4 className="font-bold text-sm text-primary mb-1">Live Online Sessions</h4>
             <p className="text-xs text-secondary-text">Interactive learning from anywhere</p>
           </div>
           <div className="anim-elem bg-white p-5 rounded-2xl border border-secondary/10 shadow-sm flex flex-col items-center text-center">
             <div className="w-10 h-10 bg-secondary/5 rounded-full flex items-center justify-center text-accent mb-3"><Users className="w-5 h-5"/></div>
             <h4 className="font-bold text-sm text-primary mb-1">Small Batches</h4>
             <p className="text-xs text-secondary-text">Personalized attention guaranteed</p>
           </div>
           <div className="anim-elem bg-white p-5 rounded-2xl border border-secondary/10 shadow-sm flex flex-col items-center text-center">
             <div className="w-10 h-10 bg-secondary/5 rounded-full flex items-center justify-center text-accent mb-3"><BookOpen className="w-5 h-5"/></div>
             <h4 className="font-bold text-sm text-primary mb-1">Case-Based Learning</h4>
             <p className="text-xs text-secondary-text">Real-world clinical scenarios</p>
           </div>
           <div className="anim-elem bg-white p-5 rounded-2xl border border-secondary/10 shadow-sm flex flex-col items-center text-center">
             <div className="w-10 h-10 bg-secondary/5 rounded-full flex items-center justify-center text-accent mb-3"><Stethoscope className="w-5 h-5"/></div>
             <h4 className="font-bold text-sm text-primary mb-1">Career Planning</h4>
             <p className="text-xs text-secondary-text">Direct mentorship and guidance</p>
           </div>
        </div>

        {/* Modules Grid */}
        <div className="w-full modules-container mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black font-playfair text-primary">Syllabus Overview</h2>
            <div className="h-px bg-secondary/20 flex-1 ml-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => (
              <div key={mod.id} className="module-card bg-white p-6 rounded-2xl shadow-sm border border-secondary/10 hover:border-accent/50 hover:shadow-md transition-all group flex flex-col">
                <div className="w-12 h-12 rounded-full bg-secondary/5 flex items-center justify-center border border-secondary/10 mb-4 group-hover:bg-accent/10 transition-colors">
                  <span className="font-playfair font-black text-accent text-lg">{mod.id}</span>
                </div>
                <h4 className="font-bold text-lg text-primary mb-3 font-playfair">{mod.title}</h4>
                <p className="text-secondary-text text-sm leading-relaxed mb-4 flex-1">{mod.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full bg-primary rounded-[2rem] p-10 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black font-playfair text-white mb-4">Ready to elevate your clinical practice?</h2>
            <p className="text-white/80 text-sm sm:text-base mb-8">Join the next cohort and get the practical knowledge required to succeed in reproductive medicine.</p>
            <Link href="/pricing" className="inline-flex px-8 py-4 bg-accent hover:bg-white hover:text-primary text-white font-bold text-xs tracking-widest uppercase rounded-full transition-all shadow-lg items-center justify-center gap-2">
              View Pricing & Enrol <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}