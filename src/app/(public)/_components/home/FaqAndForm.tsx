'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Send, CheckCircle2 } from 'lucide-react';
import { submitContactMessage } from '@/actions/contact-actions';
import { toast } from 'sonner';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const faqs = [
  { q: "Where is the centre located?", a: "Our primary training centre is located in New Delhi, India. We also offer online foundational modules before the clinical posting." },
  { q: "What is the duration of the program?", a: "The fellowship is a comprehensive 10-week program, consisting of both theoretical online modules and intensive clinical hands-on training." },
  { q: "What is the eligibility for the program?", a: "The program is open to candidates holding an MD/MS, DGO, or DNB in Obstetrics and Gynaecology." },
  { q: "What is the fee structure?", a: "Please fill out the enquiry form on the left to get a detailed breakdown of the fee structure and payment plans." },
];

export default function FaqAndForm() {
  const container = useRef<HTMLDivElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useGSAP(() => {
    gsap.fromTo('.faq-header',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: container.current, start: 'top 80%' },
        clearProps: 'all'
      }
    );
    gsap.fromTo('.faq-form',
      { x: -30, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2,
        scrollTrigger: { trigger: container.current, start: 'top 80%' },
        clearProps: 'all'
      }
    );
    gsap.fromTo('.faq-item',
      { y: 20, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.4,
        scrollTrigger: { trigger: container.current, start: 'top 80%' },
        clearProps: 'all'
      }
    );
  }, { scope: container });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const message = `Phone: ${formData.phone || 'Not provided'} | Inquiry from Homepage Request Info form.`;

    try {
      const res = await submitContactMessage({
        name: fullName || 'Prospective Fellow',
        email: formData.email,
        studyPreference: 'Homepage Inquiry / Request Info',
        message: message,
      });

      if (res.success) {
        setIsSubmitted(true);
        setFormData({ firstName: '', lastName: '', email: '', phone: '' });
        toast.success("Thank you! Your information request has been submitted.");
      } else {
        toast.error(res.error || "Failed to submit form. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section ref={container} className="relative w-full py-32 bg-primary-bg overflow-hidden">
      
      {/* Background visual element */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="faq-header mb-16 max-w-2xl">
          <h2 className="text-4xl sm:text-5xl font-black text-primary font-playfair tracking-tight">
            Questions worth <span className="text-accent italic">asking.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Form Left Side */}
          <div className="faq-form bg-primary text-white p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
             {/* Decorative swirls inside form */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/40 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
             
             <div className="relative z-10">
                <h3 className="text-2xl font-bold font-playfair mb-2">Find details about your next step.</h3>
                <p className="text-white/70 font-sans text-sm mb-8">Fill the form below and our team will get back to you.</p>

                {isSubmitted ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-accent/20 border border-accent/40 rounded-full flex items-center justify-center text-accent mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold font-playfair mb-2">Request Received!</h4>
                    <p className="text-white/80 text-sm mb-6 max-w-xs">
                      Thank you for your interest. Our academic coordinator will contact you shortly with the fellowship details.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-2.5 bg-white text-primary rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition"
                    >
                      Submit Another Request
                    </button>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-1.5">First Name *</label>
                         <input 
                           type="text" 
                           name="firstName"
                           value={formData.firstName}
                           onChange={handleChange}
                           required
                           className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors" 
                           placeholder="John" 
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-1.5">Last Name *</label>
                         <input 
                           type="text" 
                           name="lastName"
                           value={formData.lastName}
                           onChange={handleChange}
                           required
                           className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors" 
                           placeholder="Doe" 
                         />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-1.5">Email *</label>
                         <input 
                           type="email" 
                           name="email"
                           value={formData.email}
                           onChange={handleChange}
                           required
                           className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors" 
                           placeholder="doctor@example.com" 
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-1.5">Phone Number *</label>
                         <input 
                           type="tel" 
                           name="phone"
                           value={formData.phone}
                           onChange={handleChange}
                           required
                           className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors" 
                           placeholder="+91 9876543210" 
                         />
                       </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-white text-primary hover:bg-accent hover:text-white font-bold uppercase tracking-widest text-sm py-4 rounded-xl mt-6 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Request Info
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </form>
                )}
             </div>
          </div>

          {/* Accordion FAQ Right Side */}
          <div className="flex flex-col gap-4">
             {faqs.map((faq, idx) => {
               const isOpen = openIdx === idx;
               return (
                 <div key={idx} className="faq-item border-b border-secondary/10 pb-4">
                   <button 
                     onClick={() => setOpenIdx(isOpen ? null : idx)}
                     className="w-full flex items-center justify-between text-left py-4 focus:outline-none group"
                   >
                     <span className={`font-sans font-bold text-lg transition-colors ${isOpen ? 'text-accent' : 'text-primary group-hover:text-secondary'}`}>
                       {faq.q}
                     </span>
                     <ChevronDown className={`w-5 h-5 text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
                   </button>
                   <div 
                     className="overflow-hidden transition-all duration-300 ease-in-out"
                     style={{ maxHeight: isOpen ? '200px' : '0px', opacity: isOpen ? 1 : 0 }}
                   >
                     <p className="text-secondary-text font-sans pb-4 pr-8 leading-relaxed">
                       {faq.a}
                     </p>
                   </div>
                 </div>
               );
             })}
          </div>

        </div>
      </div>
    </section>
  );
}
