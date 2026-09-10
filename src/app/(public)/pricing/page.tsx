'use client';

import React, { useRef, useState, useEffect } from 'react';
import { CheckCircle2, Clock, ShieldCheck, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import CheckoutModal from '@/components/pricing/CheckoutModal';

gsap.registerPlugin(useGSAP);

export default function PricingPage() {
  const { data: session } = useSession();
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('/api/packages');
        if (res.ok) {
          const data = await res.json();
          setPackages(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  useGSAP(() => {
    if (isLoading) return; // Wait until data loads

    gsap.fromTo('.anim-text',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.1, clearProps: 'all' }
    );

    gsap.fromTo('.price-card',
      { x: 50, opacity: 0, scale: 0.95 },
      { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out', delay: 0.4, stagger: 0.2, clearProps: 'all' }
    );

    gsap.fromTo('.feature-item',
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out', delay: 0.8, clearProps: 'all' }
    );
  }, { scope: container, dependencies: [isLoading, packages.length] });

  const handleOpenCheckout = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsCheckoutModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const parseFeatures = (featureString: string) => {
    if (!featureString) return [];
    try {
      const parsed = JSON.parse(featureString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  return (
    <div ref={container} className="w-full font-sans bg-slate-50 min-h-screen pt-32 pb-24 relative overflow-hidden flex items-center">

      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/3 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">

        <div className="flex flex-col items-center justify-center gap-16">

          {/* Top: Value Proposition */}
          <div className="w-full text-center max-w-3xl mx-auto flex flex-col items-center">

            <h1 className="anim-text text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-primary font-playfair mb-8 leading-tight">
              Invest in your <span className="text-accent italic">clinical mastery.</span>
            </h1>

          </div>

          {/* Bottom: Pricing Cards Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center items-start">
            {isLoading ? (
              <div className="col-span-full text-center text-primary/50 py-20">Loading packages...</div>
            ) : packages.length === 0 ? (
              <div className="col-span-full text-center text-primary/50 py-20">No packages available at the moment.</div>
            ) : (
              packages.map((pkg, idx) => {
                const features = parseFeatures(pkg.features);
                const isPopular = idx === 0;

                return (
                  <div key={pkg.id} className="price-card relative group h-full">

                    <div className={`h-full flex flex-col bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden border ${isPopular ? 'border-accent/30 shadow-[0_10px_40px_rgba(var(--accent),0.1)] hover:-translate-y-1' : 'border-secondary/20 hover:-translate-y-1'}`}>
                      {isPopular && (
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-blue-500"></div>
                      )}

                      <div className="mb-8 flex-shrink-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {pkg.classCount ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold tracking-wide">
                              {pkg.classCount} Live Interactive Classes
                            </span>
                          ) : null}
                        </div>

                        <h2 className="text-3xl font-bold font-playfair text-primary mb-4">{pkg.title}</h2>

                        {(pkg.tagline || pkg.validTill) && (
                          <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4 mb-6">
                            {pkg.tagline && (
                              <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mb-1">
                                <Clock size={16} /> {pkg.tagline}
                              </div>
                            )}
                            {pkg.validTill && (
                              <span className="text-primary/60 text-xs uppercase tracking-widest font-bold">Valid till: {formatDate(pkg.validTill)}</span>
                            )}
                          </div>
                        )}

                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-5xl font-black font-playfair tracking-tight text-primary">₹{pkg.price.toLocaleString('en-IN')}</span>
                          <span className="text-sm text-primary/60 font-bold mb-2">+ GST</span>
                        </div>
                        {pkg.regularPrice && (
                          <p className="text-primary/50 text-xs font-bold uppercase tracking-widest line-through">Regular Fee: ₹{pkg.regularPrice.toLocaleString('en-IN')} + GST</p>
                        )}
                      </div>

                      {features.length > 0 && (
                        <div className="flex-grow">
                          <div className="h-px w-full bg-secondary/10 mb-8"></div>
                          <div className="space-y-4 mb-10">
                            {features.map((feature: string, i: number) => (
                              <div key={i} className="feature-item flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                                  <CheckCircle2 className="w-4 h-4 text-accent" />
                                </div>
                                <span className="text-primary/80 font-medium text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-auto pt-4">
                        <button
                          onClick={() => handleOpenCheckout(pkg)}
                          className="flex items-center justify-center gap-2 w-full py-4 bg-accent hover:bg-primary text-white font-bold text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 cursor-pointer group"
                        >
                          Enroll Now
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>

      {/* Interactive Checkout & Coupon Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        pkg={selectedPackage}
      />
    </div>
  );
}
