'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const COURSES = [
  {
    title: 'Comprehensive Fellowship in Clinical Embryology',
    mode: 'Hybrid (Online + Offline)',
    duration: '6 Months',
    price: '₹ 1,50,000',
    tag: 'Best Seller',
    tagColor: 'bg-green-500'
  },
  {
    title: 'Advanced Masterclass in Ovarian Stimulation Protocols',
    mode: '100% Online',
    duration: '10 Weeks',
    price: '₹ 55,000',
    tag: 'Starting Soon',
    tagColor: 'bg-blue-500'
  },
  {
    title: 'Hands-on Certificate in IUI Setup & Management',
    mode: 'On-site Bootcamp',
    duration: '3 Days',
    price: '₹ 25,000',
    tag: 'Limited Seats',
    tagColor: 'bg-orange-500'
  },
  {
    title: 'Advanced Diploma in Reproductive Endocrinology',
    mode: 'Self-Paced Online',
    duration: '3 Months',
    price: '₹ 40,000',
    tag: 'New',
    tagColor: 'bg-purple-500'
  }
];

export default function FeaturedCourses() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.course-card',
      { y: 50, opacity: 0 },
      { 
        y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '.courses-grid', start: 'top 85%' }
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2 block">Our Programs</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-inter">Featured Medical Certifications <br/>& Fellowships</h2>
        </div>
        <Link href="/courses" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center gap-1">
          View all programs <ArrowRight size={16} />
        </Link>
      </div>

      <div className="courses-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {COURSES.map((course, idx) => (
          <div key={idx} className="course-card bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
            
            {/* Image Placeholder */}
            <div className="relative h-48 bg-slate-200 w-full overflow-hidden">
               <div className="absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-400 font-inter text-sm group-hover:scale-105 transition-transform duration-500">
                  [Course Image]
               </div>
               <div className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-sm shadow-sm ${course.tagColor}`}>
                 {course.tag}
               </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-bold text-slate-900 text-lg mb-4 leading-tight group-hover:text-blue-600 transition-colors line-clamp-3">
                {course.title}
              </h3>
              
              <div className="space-y-2 mb-6 mt-auto">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={14} className="text-slate-400" /> {course.mode}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock size={14} className="text-slate-400" /> {course.duration}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                <div className="font-bold text-slate-900 text-lg">{course.price}</div>
                <Link href={`/courses`} className="text-xs font-bold uppercase tracking-wider text-white bg-slate-900 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                  Apply Now
                </Link>
              </div>
            </div>
            
          </div>
        ))}
      </div>

    </section>
  );
}
