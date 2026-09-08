'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FACULTY = [
  {
    name: 'Dr. Sarah Jenkins',
    title: 'Lead Clinical Embryologist',
    bio: '15+ years experience in advanced ART techniques and lab management. Board certified.'
  },
  {
    name: 'Prof. David A. Reed',
    title: 'Senior IVF Consultant',
    bio: 'Pioneer in customized ovarian stimulation protocols and fertility preservation.'
  },
  {
    name: 'Dr. Elena Ramirez',
    title: 'Reproductive Endocrinologist',
    bio: 'Specialist in PCOS management and recurrent implantation failure diagnostics.'
  }
];

export default function FacultySpotlight() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.fac-card',
      { y: 50, opacity: 0 },
      { 
        y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '.faculty-grid', start: 'top 80%' }
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="py-24 bg-white overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2 block">Our Mentors</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-inter">Distinguished Faculty Spotlight</h2>
          </div>
          <Link href="/mentors" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            View all faculty &rarr;
          </Link>
        </div>

        <div className="faculty-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {FACULTY.map((person, idx) => (
            <div key={idx} className="fac-card group">
              <div className="relative aspect-[3/4] bg-slate-200 rounded-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-500 text-sm font-inter group-hover:scale-105 transition-transform duration-700">
                  [Portrait: {person.name}]
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex gap-2">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">Top Rated</span>
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-1 font-inter">{person.name}</h3>
              <p className="text-blue-600 font-semibold text-sm mb-4">{person.title}</p>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {person.bio}
              </p>
              
              <button className="text-sm font-bold text-slate-900 border-b-2 border-transparent hover:border-blue-600 transition-colors pb-1">
                Read Full Profile
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
