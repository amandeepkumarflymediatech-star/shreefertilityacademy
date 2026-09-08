'use client';

import React, { useRef } from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BOOTCAMPS = [
  {
    title: 'Clinical Embryology & IVF Techniques Masterclass',
    date: 'Oct 15 - 17, 2026',
    location: 'Advanced Skills Lab, New Delhi',
    status: 'Filling Fast'
  },
  {
    title: 'Oocyte Retrieval and Embryo Transfer Simulation',
    date: 'Nov 05 - 06, 2026',
    location: 'ReproAcademy Center, Mumbai',
    status: 'Available'
  },
  {
    title: 'High-Throughput Morphology & Grading Practicum',
    date: 'Dec 12 - 14, 2026',
    location: 'International Fertility Hub, Dubai',
    status: 'Available'
  }
];

export default function UpcomingBootcamps() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.camp-row',
      { x: -50, opacity: 0 },
      { 
        x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '.bootcamp-list', start: 'top 85%' }
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-inter">Upcoming Hands-On Wet-Lab Bootcamps</h2>
          <button className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors">
            View All Dates <ArrowRight size={18} />
          </button>
        </div>

        <div className="bootcamp-list space-y-4">
          {BOOTCAMPS.map((camp, idx) => (
            <div key={idx} className="camp-row bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
              
              <div className="flex items-start md:items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-blue-100">
                  <span className="text-xs font-bold uppercase">{camp.date.split(' ')[0]}</span>
                  <span className="text-xl font-black">{camp.date.split(' ')[1]}</span>
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${camp.status === 'Filling Fast' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                      {camp.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{camp.title}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {camp.date}</span>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {camp.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 shrink-0">
                <button className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-bold rounded-lg shadow-sm hover:bg-blue-600 transition-colors">
                  Reserve Online
                </button>
              </div>

            </div>
          ))}
        </div>

        <button className="mt-8 md:hidden w-full flex items-center justify-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors">
          View All Dates <ArrowRight size={18} />
        </button>

      </div>
    </section>
  );
}
