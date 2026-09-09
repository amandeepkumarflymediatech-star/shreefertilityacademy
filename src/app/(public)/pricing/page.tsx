'use client';

import React, { useRef, useState } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

gsap.registerPlugin(useGSAP);

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.anim-elem', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.2, clearProps: 'all' }
    );

    gsap.fromTo('.price-card', 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.4, clearProps: 'all' }
    );
  }, { scope: container });

  return (
    <div ref={container} className="w-full font-sans bg-primary-bg text-primary pt-28 pb-16 min-h-[90vh] selection:bg-accent selection:text-white relative overflow-x-hidden flex flex-col items-center justify-center">
      
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-secondary/10 via-secondary/5 to-transparent -z-10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent/5 via-transparent to-transparent -z-10 blur-3xl rounded-full"></div>
      
      <div className="max-w-4xl mx-auto px-6 text-center w-full">
        
        {/* Header */}
        <div className="mb-10">
         
          <h1 className="anim-elem text-4xl sm:text-5xl font-black tracking-tight text-primary font-playfair mb-4">
            Make an <span className="text-accent italic">Informed</span> Decision.
          </h1>
          <p className="anim-elem text-base text-secondary-text max-w-xl mx-auto leading-relaxed">
            Gain comprehensive practical training in Reproductive Medicine.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="price-card max-w-lg mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-secondary/10 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-accent rounded-b-full"></div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-playfair text-primary mb-3">10-Week Mentorship</h2>
            
            <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-3 mb-5 inline-block">
               <div className="flex items-center gap-2 text-accent font-bold text-[10px] uppercase tracking-widest mb-1 justify-center">
                 <Clock size={14} /> Early-bird Registration
               </div>
               <span className="text-secondary-text text-[10px] uppercase tracking-widest font-bold">Valid till: 15 Sep 2026</span>
            </div>

            <div className="flex items-end justify-center gap-2 mb-2">
              <span className="text-5xl font-black font-playfair text-primary tracking-tight">₹55,000</span>
              <span className="text-sm text-secondary-text font-bold mb-1.5">+ GST</span>
            </div>
            <p className="text-secondary-text/70 text-[10px] font-bold uppercase tracking-widest line-through">Regular Fee: ₹60,000 + GST</p>
          </div>
          
          <div className="h-px w-full bg-secondary/10 mb-8"></div>
          
          <div className="text-left space-y-4 mb-10">
            {[
              '10-Week Live Online Mentorship',
              'Interactive Small-Batch Format',
              'Case-Based Clinical Learning',
              'IVF & IUI Protocol Design',
              'Direct Career Guidance',
              'Access to Course Materials'
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-accent" />
                </div>
                <span className="text-primary text-sm font-bold">{feature}</span>
              </div>
            ))}
          </div>
          
          {session ? (
            <button 
              onClick={async () => {
                setIsProcessing(true);
                try {
                  const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: 55000 })
                  });
                  const data = await res.json();
                  if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                  } else {
                    toast.error(data.error || 'Payment initiation failed');
                    setIsProcessing(false);
                  }
                } catch (err) {
                  toast.error('An error occurred. Please try again.');
                  setIsProcessing(false);
                }
              }}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 w-full py-4 bg-primary hover:bg-secondary text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all duration-300 disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Enroll Now with PhonePe"}
            </button>
          ) : (
            <Link href="/student/signup" className="flex items-center justify-center gap-2 w-full py-4 bg-primary hover:bg-secondary text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all duration-300">
              Reserve Your Place
            </Link>
          )}
          
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-secondary-text mt-4">
            Next cohort starts <span className="text-primary">13 Oct 2026</span>.
          </p>
        </div>

      </div>
    </div>
  );
}
