import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 border-t border-slate-800 font-inter">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6 bg-white p-2 rounded-xl">
              <Image src="/logo.png" alt="Shree Fertility Academy" width={180} height={60} className="object-contain w-auto h-12" priority />
            </Link>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Empowering Obs & Gynae doctors with practical, case-based training in IVF and Reproductive Medicine.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold font-playfair text-lg mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">About Dr. Vaishali</Link></li>
              <li><Link href="/courses" className="hover:text-accent transition-colors">The Program</Link></li>
              <li><Link href="/pricing" className="hover:text-accent transition-colors">Contact & Enrol</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold font-playfair text-lg mb-6 tracking-wide">Resources</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/login" className="hover:text-accent transition-colors">Student Login</Link></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Refund Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold font-playfair text-lg mb-6 tracking-wide">Contact Us</h4>
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
                <span>Serving doctors across India and beyond.</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Shree Fertility Academy. All rights reserved.</p>
          <p>Designed for clinical excellence.</p>
        </div>
      </div>
    </footer>
  );
}