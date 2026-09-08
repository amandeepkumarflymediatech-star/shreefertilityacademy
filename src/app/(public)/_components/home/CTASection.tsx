'use client';

import React, { useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function CTASection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.cta-box',
      { y: 50, opacity: 0 },
      { 
        y: 0, opacity: 1, duration: 1, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: container.current, start: 'top 80%' }
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      
      <div className="cta-box bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative">
        
        {/* Background glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none"></div>

        {/* Left Side: Pitch */}
        <div className="flex-1 p-10 md:p-16 flex flex-col justify-center z-10 border-b lg:border-b-0 lg:border-r border-slate-700/50">
          <span className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-4 block">Take The Next Step</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white font-inter mb-6 leading-tight">
            Elevate Your Reproductive Medicine Career
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-md leading-relaxed">
            Join the upcoming cohort and gain the practical skills needed to run successful IVF cycles.
          </p>

          <div className="space-y-4 mb-10">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-blue-400 mt-0.5" size={20} />
              <span className="text-white font-medium">Download the Syllabus</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-blue-400 mt-0.5" size={20} />
              <span className="text-white font-medium">Apply for Fellowship</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-blue-400 mt-0.5" size={20} />
              <span className="text-white font-medium">Speak with an Advisor</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span>📞 Questions? Call us at</span>
            <a href="tel:+918699767031" className="text-white font-bold hover:text-blue-400 transition-colors">+91 86997 67031</a>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-10 md:p-16 bg-white z-10">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Candidate Application & Syllabus Request</h3>
          <p className="text-slate-500 text-sm mb-8">Fill out the form below to receive detailed course structures and enrollment criteria.</p>

          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">First Name</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors" placeholder="Dr. Jane" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Last Name</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors" placeholder="Doe" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors" placeholder="jane@clinic.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors" placeholder="+91 00000 00000" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Program of Interest</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-700">
                <option>10-Week Mentorship</option>
                <option>Clinical Embryology Fellowship</option>
                <option>Wet-Lab Bootcamp</option>
                <option>Other / Not Sure Yet</option>
              </select>
            </div>

            <button type="button" className="w-full py-4 bg-blue-700 text-white font-bold rounded-lg shadow-md hover:bg-blue-800 transition-all flex items-center justify-center gap-2 mt-4">
              Submit Request & Download Syllabus <ArrowRight size={18} />
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">We respect your privacy. No spam, ever.</p>
          </form>
        </div>

      </div>
    </section>
  );
}
