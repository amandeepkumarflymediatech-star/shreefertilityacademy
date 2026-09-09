import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white/70 pt-20 pb-10 border-t border-secondary/20 font-sans relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6 bg-white p-2 rounded-xl shadow-lg border border-secondary/20">
              <Image src="/logo.png" alt="Shree Fertility Academy" width={180} height={60} className="object-contain w-auto h-12" priority />
            </Link>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              Empowering Obs & Gynae doctors with practical, case-based training in IVF and Reproductive Medicine.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold font-playfair text-xl mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">About Dr. Vaishali</Link></li>
              <li><Link href="/courses" className="hover:text-accent transition-colors">The Program</Link></li>
              <li><Link href="/pricing" className="hover:text-accent transition-colors">Contact & Enrol</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold font-playfair text-xl mb-6 tracking-wide">Resources</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/login" className="hover:text-accent transition-colors">Student Login</Link></li>
              <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-accent transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold font-playfair text-xl mb-6 tracking-wide">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <a href="mailto:info@shreefertilityacademy.com" className="hover:text-white transition-colors">info@shreefertilityacademy.com</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <a href="tel:8699767031" className="hover:text-white transition-colors">86997 67031</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-white/60">Serving doctors across India and beyond.</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-secondary/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40 font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Shree Fertility Academy. All rights reserved.</p>
          <p>Designed for clinical excellence.</p>
        </div>
      </div>
    </footer>
  );
}