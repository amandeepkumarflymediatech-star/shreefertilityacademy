'use client';

import React, { useRef } from 'react';
import { Star } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TESTIMONIALS = [
  {
    name: 'Dr. Emily Chen',
    role: 'Senior OB/GYN',
    text: 'The wet-lab bootcamps are phenomenal. I gained more practical experience in 3 days here than I did in 6 months of observing elsewhere. The mentors are top-notch.',
    rating: 5
  },
  {
    name: 'Dr. Rajesh Kumar',
    role: 'Fertility Specialist',
    text: 'ReproAcademy completely transformed my clinical approach. The 10-week fellowship provided a solid foundation that I immediately applied to my own practice.',
    rating: 5
  },
  {
    name: 'Dr. Sarah Al-Farsi',
    role: 'Clinical Embryologist',
    text: 'The morphokinetic progression modules were incredibly detailed. Having access to such high-quality instructional material and live case reviews is invaluable.',
    rating: 5
  }
];

export default function TestimonialsSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.test-card',
      { y: 40, opacity: 0 },
      { 
        y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '.test-grid', start: 'top 85%' }
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2 block">Alumni Success</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-inter mb-4">Trusted by Clinicians & Embryologists Globally</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Join a thriving community of professionals dedicated to advancing reproductive medicine.</p>
        </div>

        <div className="test-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((test, idx) => (
            <div key={idx} className="test-card bg-slate-50 border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
              
              <div className="flex gap-1 text-yellow-400 mb-6">
                {[...Array(test.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              
              <p className="text-slate-700 italic leading-relaxed flex-1 mb-8">
                "{test.text}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 text-xs font-bold overflow-hidden border border-white shadow-sm">
                  {test.name.charAt(4)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{test.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{test.role}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
