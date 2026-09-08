'use client';

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, LayoutDashboard, ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;

  const links = [
    { label: 'Home', href: '/' },
    { label: 'About Dr. Vaishali', href: '/about' },
    { label: 'The Program', href: '/courses' },
    { label: 'Contact & Enrol', href: '/pricing' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`w-full transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 py-3' : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Left Side: Logo */}
          <div className="font-bold flex items-center bg-white p-2 rounded-xl">
            <Link href="/" className="group flex items-center">
              <Image src="/logo.png" alt="Shree Fertility Academy" width={180} height={60} className="object-contain w-auto h-12" priority />
            </Link>
          </div>

          {/* Middle: Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition flex items-center gap-1 ${isActive(link.href) ? 'text-accent' : 'text-slate-700 hover:text-accent'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-5">
            {session ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 transition rounded-full font-bold text-sm border border-slate-200"
                >
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-playfair font-black text-sm relative overflow-hidden">
                    {session.user.image ? (
                      <Image src={session.user.image} alt="Profile" fill className="object-cover" />
                    ) : (
                      session.user.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <span className="hidden sm:block">{session.user.name || 'User'}</span>
                  <ChevronDown size={16} className={`transition-transform text-slate-500 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col py-2 animate-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-100 mb-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{session.user.email}</p>
                    </div>
                    <Link
                      href={session.user.role === 'STUDENT' ? '/student' : '/tutor'}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-800 transition font-bold text-sm"
                    >
                      <LayoutDashboard size={16} className="text-accent" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { setIsDropdownOpen(false); signOut({ callbackUrl: '/' }); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition font-bold text-sm w-full text-left"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:block px-6 py-2.5 bg-accent text-white font-medium text-sm rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-300"
                >
                  Student Login
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-md transition-colors ml-2 bg-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 text-base font-bold ${isActive(link.href) ? 'text-accent' : 'text-slate-800'}`}
              >
                {link.label}
              </Link>
            ))}
            {!session ? (
              <div className="border-t border-slate-100 pt-4 mt-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-3 bg-accent text-white font-medium text-sm rounded-md shadow-sm"
                >
                  Student Login
                </Link>
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-4 mt-2">
                <div className="px-2 mb-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="text-sm font-bold text-slate-900 truncate">{session.user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                </div>
                <Link
                  href={session.user.role === 'STUDENT' ? '/student' : '/tutor'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 text-base font-bold text-slate-800 mb-2"
                >
                  <LayoutDashboard size={18} className="text-accent" />
                  Dashboard
                </Link>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                  className="flex items-center gap-3 py-3 text-base font-bold text-red-600 w-full text-left"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}