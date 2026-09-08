'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TABS = [
  { day: 'Day 1', title: 'Zygote Stage', desc: 'Evaluation of fertilization. Presence of two pronuclei (2PN).' },
  { day: 'Day 2', title: 'Cleavage (2-4 Cells)', desc: 'Early cell division. Assessing blastomere symmetry.' },
  { day: 'Day 3', title: 'Cleavage (6-8 Cells)', desc: 'Multicellular stage. Important milestone for grading.' },
  { day: 'Day 4', title: 'Morula Stage', desc: 'Compaction begins, cells merge into a tight sphere.' },
  { day: 'Day 5', title: 'Blastocyst Stage', desc: 'Formation of inner cell mass and trophectoderm.' }
];

export default function EmbryoProgression() {
  const container = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  useGSAP(() => {
    gsap.fromTo('.prog-elem',
      { y: 30, opacity: 0 },
      { 
        y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: container.current, start: 'top 80%' }
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="py-24 px-6 max-w-6xl mx-auto overflow-hidden">
      
      <div className="text-center mb-16 prog-elem">
        <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2 block">Clinical Timeline</span>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-inter mb-4">Day 1 to Day 5 Embryo Morphokinetic Progression</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">Master the critical stages of embryo development and grading criteria.</p>
      </div>

      <div className="prog-elem bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-2">
        
        {/* Tabs Header */}
        <div className="flex flex-wrap md:flex-nowrap gap-2 p-2 bg-slate-50 rounded-2xl mb-6 border border-slate-100">
          {TABS.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-sm font-bold transition-all text-left md:text-center ${activeTab === idx ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}
            >
              <div className="text-xs mb-1 opacity-80">{tab.day}</div>
              <div>{tab.title}</div>
            </button>
          ))}
        </div>

        {/* Tab Content area */}
        <div className="p-4 md:p-8 grid md:grid-cols-2 gap-8 items-center bg-slate-50 rounded-2xl">
          
          <div className="order-2 md:order-1">
            <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-4">
              Module Snippet
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{TABS[activeTab].title} Assessment & Grading</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {TABS[activeTab].desc} In our hands-on workshops, you will learn exactly what markers to look for under the microscope to ensure the highest probability of a successful transfer.
            </p>
            <div className="flex gap-4">
              <button className="text-sm font-bold text-blue-600 hover:text-blue-800 underline">Read full module</button>
            </div>
          </div>

          <div className="order-1 md:order-2 relative aspect-video bg-white rounded-xl shadow-inner border border-slate-200 flex items-center justify-center overflow-hidden">
             {/* Image placeholder */}
             <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-500 font-inter text-sm">
                [Microscope Image: {TABS[activeTab].title}]
             </div>
             
             {/* Mock overlay HUD */}
             <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-md text-white text-xs font-mono flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
               REC: {TABS[activeTab].day} Observation
             </div>
          </div>

        </div>

      </div>
    </section>
  );
}
