'use client';

import React, { useState } from 'react';
import { X, Tag, CheckCircle2, ShieldCheck, Loader2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';

interface PricingPackage {
  id: string;
  title: string;
  tagline?: string;
  price: number;
  regularPrice?: number;
  classCount?: number;
}

interface AppliedCoupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  discountAmount: number;
  finalAmount: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: PricingPackage | null;
}

export default function CheckoutModal({ isOpen, onClose, pkg }: CheckoutModalProps) {
  const { data: session } = useSession();
  const [couponCode, setCouponCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !pkg) return null;

  const originalPrice = pkg.price;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalPayable = appliedCoupon ? appliedCoupon.finalAmount : originalPrice;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsValidating(true);
    setCouponError(null);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim().toUpperCase(),
          amount: originalPrice,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAppliedCoupon({
          id: data.coupon.id,
          code: data.coupon.code,
          discountType: data.coupon.discountType,
          discountValue: data.coupon.discountValue,
          discountAmount: data.discountAmount,
          finalAmount: data.finalAmount,
        });
        setCouponCode('');
        toast.success(`Coupon "${data.coupon.code}" applied successfully!`);
      } else {
        setCouponError(data.error || 'Invalid coupon code');
        toast.error(data.error || 'Invalid coupon code');
      }
    } catch (err) {
      setCouponError('Failed to validate coupon. Please try again.');
      toast.error('Failed to validate coupon');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    toast.info('Coupon removed');
  };

  const handleProceedToPayment = async () => {
    if (!session) {
      toast.info('Please sign in to proceed with enrollment');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pkg.id,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
          amount: finalPayable,
        }),
      });

      const data = await res.json();

      if (res.ok && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast.error(data.error || 'Payment initiation failed. Please try again.');
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 sm:p-10 shadow-2xl border border-secondary/20 relative my-auto animate-in zoom-in-95 duration-200 text-primary">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 rounded-2xl text-primary/40 hover:text-primary hover:bg-secondary/10 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full inline-block mb-2">
            Enrollment Summary
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-playfair tracking-tight text-primary">
            {pkg.title}
          </h2>
          {pkg.classCount && (
            <p className="text-xs font-bold text-primary/60 mt-1 uppercase tracking-wider">
              {pkg.classCount} Live Interactive Classes & Hands-on Mentorship
            </p>
          )}
        </div>

        {/* Coupon Section */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6">
          <label className="text-xs font-bold uppercase tracking-widest text-primary/60 block mb-2 flex items-center gap-1.5">
            <Tag size={14} className="text-accent" /> Have a Coupon Code?
          </label>

          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Sparkles size={16} />
                </div>
                <div>
                  <span className="font-mono font-bold text-emerald-900 text-sm tracking-wide">
                    {appliedCoupon.code}
                  </span>
                  <p className="text-xs text-emerald-700 font-medium">
                    {appliedCoupon.discountType === 'PERCENTAGE'
                      ? `${appliedCoupon.discountValue}% discount applied (-₹${appliedCoupon.discountAmount.toLocaleString('en-IN')})`
                      : `₹${appliedCoupon.discountAmount.toLocaleString('en-IN')} off applied`}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-widest px-2.5 py-1 hover:bg-red-50 rounded-lg transition"
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError(null);
                  }}
                  placeholder="ENTER CODE"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono uppercase font-bold tracking-wider placeholder:font-sans placeholder:normal-case placeholder:text-primary/40 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={isValidating || !couponCode.trim()}
                  className="px-5 py-2.5 bg-primary hover:bg-accent text-white font-bold text-xs uppercase tracking-widest rounded-xl transition disabled:opacity-50 shrink-0 flex items-center justify-center min-w-[80px]"
                >
                  {isValidating ? <Loader2 size={16} className="animate-spin" /> : 'Apply'}
                </button>
              </div>
              {couponError && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1 animate-in fade-in">
                  <AlertCircle size={13} /> {couponError}
                </p>
              )}
            </form>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 pt-2 pb-4 border-b border-slate-200/80 mb-6 text-sm font-sans">
          <div className="flex justify-between items-center text-primary/70">
            <span>Package Fee</span>
            <span className="font-bold text-primary">₹{originalPrice.toLocaleString('en-IN')}</span>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between items-center text-emerald-600 font-medium animate-in fade-in">
              <span className="flex items-center gap-1">
                Coupon ({appliedCoupon.code})
              </span>
              <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="flex justify-between items-baseline pt-2 text-primary border-t border-slate-100">
            <div>
              <span className="text-base font-bold">Total Payable</span>
              <p className="text-[11px] text-primary/50">+ Applicable GST</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black font-playfair text-primary">
                ₹{finalPayable.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {session ? (
          <button
            onClick={handleProceedToPayment}
            disabled={isProcessing}
            className="w-full py-4 bg-accent hover:bg-primary text-white font-bold text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-xl hover:shadow-accent/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Preparing Payment...
              </>
            ) : (
              <>
                {finalPayable === 0 ? 'Confirm Free Enrollment' : `Proceed to Pay ₹${finalPayable.toLocaleString('en-IN')}`}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        ) : (
          <div className="space-y-3">
            <Link
              href="/student/signup"
              className="w-full py-4 bg-accent hover:bg-primary text-white font-bold text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-2 text-center"
            >
              Sign Up to Enroll <ArrowRight size={18} />
            </Link>
            <p className="text-center text-xs text-primary/60">
              Already have an account?{' '}
              <Link href="/student/login" className="text-accent font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        )}

        {/* Secure Guarantee */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-primary/50 font-medium">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>256-Bit Encrypted Secure Checkout via PhonePe</span>
        </div>

      </div>
    </div>
  );
}
