'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Stethoscope, Microscope } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AudienceSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.audience-header',
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

    gsap.fromTo('.audience-card',
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.audience-grid',
          start: 'top 85%',
        },
        clearProps: 'all'
      }
    );
  }, { scope: container });

  const audiences = [
    {
      title: "MD / DGO / DNB",
      desc: "Postgraduates looking to specialize in reproductive medicine.",
      icon: <GraduationCap className="w-8 h-8 text-secondary" />
    },
    {
      title: "Practicing Obs & Gynae",
      desc: "Clinicians wanting to add IVF and infertility treatments to their practice.",
      icon: <Stethoscope className="w-8 h-8 text-secondary" />
    },
    {
      title: "Aspiring Specialists",
      desc: "Doctors who want comprehensive, hands-on clinical experience in ART.",
      icon: <Microscope className="w-8 h-8 text-secondary" />
    }
  ];

  return (
    <section ref={container} className="relative w-full py-24 bg-primary-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20 audience-header">
          <h2 className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4">
            Who Should Join?
          </h2>
          <p className="text-secondary-text text-lg max-w-2xl mx-auto font-sans">
            Our program is meticulously designed for medical professionals seeking to elevate their clinical practice.
          </p>
        </div>

        <div className="audience-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {audiences.map((item, idx) => (
            <div key={idx} className="audience-card bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgba(36,16,79,0.06)] border border-secondary/5 hover:border-secondary/20 transition-all group flex flex-col items-start relative overflow-hidden">
              {/* Subtle hover gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/10 transition-colors"></div>
              
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-8">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4 font-playfair">{item.title}</h3>
              <p className="text-secondary-text text-sm leading-relaxed font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
