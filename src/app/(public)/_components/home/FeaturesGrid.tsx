'use client';

import React, { useRef } from 'react';
import { Microscope, BookOpen, UserCheck, ShieldCheck, Activity, Award } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FEATURES = [
  {
    icon: <Microscope className="w-6 h-6 text-blue-600" />,
    title: 'Advanced Wet-Lab Environment',
    desc: 'Train in a state-of-the-art simulation lab that mirrors real-world IVF setups and workflows.'
  },
  {
    icon: <BookOpen className="w-6 h-6 text-blue-600" />,
    title: 'Evidence-Based Curriculum',
    desc: 'Our protocols and teaching methodologies are firmly rooted in the latest scientific literature.'
  },
  {
    icon: <UserCheck className="w-6 h-6 text-blue-600" />,
    title: '1-on-1 Mentorship Availability',
    desc: 'Get direct access to senior consultants for case discussions and personalized career guidance.'
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
    title: 'Ethical & Legal Frameworks',
    desc: 'Understand the critical medico-legal aspects of running an IVF center in today\'s landscape.'
  },
  {
    icon: <Activity className="w-6 h-6 text-blue-600" />,
    title: 'Live Case Observations',
    desc: 'Watch real-time decision making in live clinical settings, from stimulation to embryo transfer.'
  },
  {
    icon: <Award className="w-6 h-6 text-blue-600" />,
    title: 'Recognized Certification',
    desc: 'Earn a certificate that holds weight in the industry, proving your practical competence.'
  }
];

export default function FeaturesGrid() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.feature-card',
      { y: 40, opacity: 0 },
      { 
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '.features-grid', start: 'top 80%' }
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="py-24 bg-slate-50 overflow-hidden border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        <div className="mb-16">
          <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2 block">Why Choose Us</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-inter mb-4">ReproAcademy Clinical Architecture</h2>
          <p className="text-slate-600 max-w-2xl mx-auto font-inter text-lg">
            We bridge the gap between theoretical knowledge and practical clinical application.
          </p>
        </div>

        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="feature-card bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-left hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-inter">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
