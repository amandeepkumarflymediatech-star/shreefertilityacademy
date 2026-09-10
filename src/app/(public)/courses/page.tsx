'use client';

import React, { useRef, useState } from 'react';
import { ChevronDown, Video, Users, BookOpen, Stethoscope, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const modules = [
  {
    id: '01',
    title: 'Reproductive Endocrinology Basics',
    description: 'Build a solid foundation in the hormonal pathways and core diagnostic principles necessary for successful ART interventions. Includes deep dives into HPO axis and follicular dynamics.'
  },
  {
    id: '02',
    title: 'Ovarian Stimulation & IVF Protocols',
    description: 'Master step-by-step ovarian stimulation, monitoring, and patient management strategies across diverse clinical scenarios. Learn to tailor protocols based on patient profiles.'
  },
  {
    id: '03',
    title: 'IUI Protocols & Lab Setup',
    description: 'Learn the essentials of Intrauterine Insemination (IUI) and the key elements required for a successful basic lab setup, including semen washing techniques and timing.'
  },
  {
    id: '04',
    title: 'Troubleshooting & Poor Responders',
    description: 'Develop advanced strategies to handle complex cases, poor ovarian response, and recurring implantation failures with evidence-based approaches.'
  },
  {
    id: '05',
    title: 'Complication Management (OHSS)',
    description: 'Learn how to predict, prevent, and clinically manage Ovarian Hyperstimulation Syndrome and other ART complications safely in an outpatient setting.'
  },
  {
    id: '06',
    title: 'Live Case Discussions & Q&A',
    description: 'Engage directly with Dr. Vaishali to review real-world case studies, analyze outcomes, and refine clinical judgment in an interactive format.'
  }
];

export default function CoursesPage() {
  const container = useRef<HTMLDivElement>(null);
  const [activeModule, setActiveModule] = useState<string | null>(modules[0].id);

  useGSAP(() => {
    gsap.fromTo('.anim-elem', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.1, clearProps: 'all' }
    );
    
    gsap.fromTo('.floating-shape', 
      { y: 0 },
      { y: -20, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 1 }
    );

    gsap.fromTo('.module-card', 
      { x: -30, opacity: 0 },
      { 
        x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '.modules-container', start: 'top 80%' }
      }
    );
  }, { scope: container });

  const toggleModule = (id: string) => {
    setActiveModule(activeModule === id ? null : id);
  };

  return (
    <div ref={container} className="w-full font-sans min-h-screen bg-slate-50 text-primary pt-24 pb-20 overflow-x-hidden selection:bg-accent selection:text-white relative">
      
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[80px] pointer-events-none floating-shape"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none floating-shape"></div>
      <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-purple-400/20 rounded-full blur-[80px] pointer-events-none floating-shape"></div>

      <div className="max-w-7xl mx-auto w-full px-6 flex flex-col items-center relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mb-16 mt-8">

          <h1 className="anim-elem text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8 text-primary font-playfair leading-tight">
            10-Week Clinical <span className="text-accent italic pr-2">Mentorship</span>
          </h1>
          
          <p className="anim-elem text-lg sm:text-xl text-primary/70 leading-relaxed font-medium max-w-2xl mx-auto">
            A comprehensive, case-based fellowship program designed for practicing Obs & Gynae doctors. Gain the practical skills to confidently run IVF and IUI cycles independently.
          </p>
        </div>

        {/* Value Props Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
           {[
             { icon: Video, title: 'Live Online Sessions', desc: 'Interactive learning from anywhere' },
             { icon: Users, title: 'Small Batches', desc: 'Personalized attention guaranteed' },
             { icon: BookOpen, title: 'Case-Based Learning', desc: 'Real-world clinical scenarios' },
             { icon: Stethoscope, title: 'Career Planning', desc: 'Direct mentorship and guidance' }
           ].map((prop, idx) => (
             <div key={idx} className="anim-elem bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/50 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-500">
               <div className="w-14 h-14 bg-gradient-to-br from-primary/5 to-accent/10 rounded-2xl flex items-center justify-center text-primary mb-5 shadow-inner">
                 <prop.icon className="w-6 h-6" />
               </div>
               <h4 className="font-bold text-lg text-primary mb-2 font-playfair">{prop.title}</h4>
               <p className="text-sm text-primary/60">{prop.desc}</p>
             </div>
           ))}
        </div>

        {/* Modules Accordion Section */}
        <div className="w-full max-w-4xl modules-container mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black font-playfair text-primary mb-4">Syllabus Overview</h2>
            <p className="text-primary/60">Explore the comprehensive 6-module structure</p>
          </div>

          <div className="space-y-4">
            {modules.map((mod) => {
              const isActive = activeModule === mod.id;
              return (
                <div 
                  key={mod.id} 
                  className={`module-card bg-white/80 backdrop-blur-md rounded-2xl border transition-all duration-500 overflow-hidden shadow-sm cursor-pointer ${isActive ? 'border-accent/40 shadow-xl shadow-accent/5' : 'border-secondary/10 hover:border-secondary/30'}`}
                  onClick={() => toggleModule(mod.id)}
                >
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-playfair font-black text-xl transition-colors duration-500 ${isActive ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'bg-slate-100 text-primary/40'}`}>
                        {mod.id}
                      </div>
                      <h4 className={`font-bold text-lg sm:text-xl font-playfair transition-colors duration-300 ${isActive ? 'text-accent' : 'text-primary'}`}>
                        {mod.title}
                      </h4>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-primary/40 transition-transform duration-500 ${isActive ? 'rotate-180 text-accent' : ''}`} />
                  </div>
                  
                  <div className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${isActive ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-18">
                      <p className="text-primary/70 leading-relaxed ml-18 text-sm sm:text-base border-l-2 border-accent/20 pl-6 py-1">
                        {mod.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-5xl bg-primary rounded-[3rem] p-12 sm:p-16 text-center relative overflow-hidden shadow-2xl">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-black font-playfair text-white mb-6">Ready to elevate your clinical practice?</h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">Join the next cohort and get the practical knowledge required to succeed in reproductive medicine.</p>
            <Link href="/pricing" className="inline-flex px-10 py-5 bg-white text-primary hover:bg-accent hover:text-white hover:scale-105 font-bold tracking-widest uppercase rounded-full transition-all duration-300 shadow-xl items-center justify-center gap-3 group">
              View Pricing & Enrol <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}