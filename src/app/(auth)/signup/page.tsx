import Link from 'next/link';
import { User, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import React from 'react';

export default function SignupSelectionPage() {
  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col border border-secondary/10 p-8 sm:p-12 md:p-16">
        
        <Link href="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-accent font-bold text-xs tracking-widest uppercase mb-12 transition-colors self-start bg-secondary/5 px-4 py-2 rounded-full">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-5xl font-black text-primary mb-4 font-playfair tracking-tight">
            Create an account
          </h1>
          <p className="text-primary/70 font-sans text-lg max-w-lg mx-auto">
            Join India's premier fellowship in Assisted Reproductive Technology today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
          
          <Link href="/student/signup" className="group relative bg-white border border-secondary/20 hover:border-accent p-8 sm:p-10 rounded-3xl transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-secondary/5 group-hover:bg-accent/10 rounded-2xl flex items-center justify-center mb-6 transition-colors">
              <User className="w-10 h-10 text-primary/60 group-hover:text-accent transition-colors" />
            </div>
            <h2 className="text-2xl font-black text-primary font-playfair mb-3">Enrolling Doctor</h2>
            <p className="text-primary/70 text-sm font-sans mb-8 leading-relaxed">Access expert mentors, case-based curriculum, and track your clinical progress.</p>
            <div className="mt-auto flex items-center gap-2 text-accent font-bold text-sm tracking-widest uppercase bg-accent/10 px-6 py-2.5 rounded-full group-hover:bg-accent group-hover:text-white transition-colors">
              Sign Up <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/tutor/signup" className="group relative bg-white border border-secondary/20 hover:border-accent p-8 sm:p-10 rounded-3xl transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-secondary/5 group-hover:bg-accent/10 rounded-2xl flex items-center justify-center mb-6 transition-colors">
              <BookOpen className="w-10 h-10 text-primary/60 group-hover:text-accent transition-colors" />
            </div>
            <h2 className="text-2xl font-black text-primary font-playfair mb-3">Course Mentor</h2>
            <p className="text-primary/70 text-sm font-sans mb-8 leading-relaxed">Join our network of experts, find motivated students, and guide the next generation.</p>
            <div className="mt-auto flex items-center gap-2 text-accent font-bold text-sm tracking-widest uppercase bg-accent/10 px-6 py-2.5 rounded-full group-hover:bg-accent group-hover:text-white transition-colors">
              Sign Up <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

        <div className="mt-16 text-center text-primary/70 font-sans text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-accent font-bold hover:text-primary transition-colors">
            Log in
          </Link>
        </div>

      </div>
    </div>
  );
}