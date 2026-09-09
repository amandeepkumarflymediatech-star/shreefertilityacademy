'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Users, Award, PlayCircle, FileText, Globe } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function FeaturesBanner() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.feat-header',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: container.current,
          start: 'top 75%',
        },
        clearProps: 'all'
      }
    );

    gsap.fromTo('.feat-card',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.feat-grid',
          start: 'top 80%',
        },
        clearProps: 'all'
      }
    );
  }, { scope: container });

  const features = [
    { title: "Strong Foundation", desc: "Build clinical excellence.", icon: <BookOpen className="w-6 h-6 text-white" /> },
    { title: "Practical Learning", desc: "Case-based methodology.", icon: <Users className="w-6 h-6 text-white" /> },
    { title: "Career Guidance", desc: "Mentorship by experts.", icon: <Award className="w-6 h-6 text-white" /> },
    { title: "Live Sessions", desc: "Interact with senior faculty.", icon: <PlayCircle className="w-6 h-6 text-white" /> },
    { title: "Assessments", desc: "Track your progress.", icon: <FileText className="w-6 h-6 text-white" /> },
    { title: "Global Network", desc: "Join an elite community.", icon: <Globe className="w-6 h-6 text-white" /> },
  ];

  return (
    <section ref={container} className="relative w-full py-32 bg-primary overflow-hidden">
      {/* Background visual effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#301663] to-secondary opacity-90"></div>
      
      {/* Faint DNA / Swirls Graphic using CSS */}
      <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none overflow-hidden">
         <div className="absolute top-1/4 -right-1/4 w-[800px] h-[300px] border-[40px] border-white/10 rounded-[100%] rotate-12 blur-sm"></div>
         <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[200px] border-[20px] border-white/5 rounded-[100%] -rotate-12 blur-sm"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="feat-header text-center sm:text-left mb-16 max-w-2xl">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight font-playfair tracking-tight mb-6">
            Learn, Understand, <br />Grow with confidence.
          </h2>
          <p className="text-white/70 font-sans text-lg">
            A comprehensive curriculum tailored for the modern practitioner.
          </p>
        </div>

        <div className="feat-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div key={idx} className="feat-card bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors flex items-start gap-5">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                {feat.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1 font-sans">{feat.title}</h3>
                <p className="text-white/60 text-sm font-sans">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
