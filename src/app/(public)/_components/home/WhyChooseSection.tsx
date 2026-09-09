'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function WhyChooseSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.why-left',
      { x: -50, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: container.current,
          start: 'top 75%',
        },
        clearProps: 'all'
      }
    );

    gsap.fromTo('.why-point',
      { x: 30, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: {
          trigger: container.current,
          start: 'top 75%',
        },
        clearProps: 'all'
      }
    );
  }, { scope: container });

  const points = [
    { title: "Evaluate", desc: "Assess if reproductive medicine aligns with your career goals." },
    { title: "Choose", desc: "Select the right fellowship without wasting time and resources." },
    { title: "Understand", desc: "Get a clear picture of the clinical and embryology aspects." },
    { title: "Decide", desc: "Make an informed decision about your medical specialization." },
  ];

  return (
    <section ref={container} className="relative w-full py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        <div className="why-left">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary font-playfair leading-tight tracking-tight mb-6">
            Before choosing an <br />expensive IVF fellowship, <br />
            <span className="text-accent italic">understand the field first.</span>
          </h2>
        </div>

        <div className="flex flex-col gap-8 border-l border-secondary/10 pl-8 md:pl-12">
          {points.map((point, idx) => (
            <div key={idx} className="why-point flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-4 h-4 text-accent" strokeWidth={3} />
              </div>
              <div>
                <h3 className="text-primary font-bold text-lg font-sans mb-1">{point.title}</h3>
                <p className="text-secondary-text text-sm font-sans leading-relaxed">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
