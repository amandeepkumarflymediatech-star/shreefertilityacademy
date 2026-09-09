import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image';
import { GraduationCap, CheckCircle2, Search } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'All Mentors | Shree Fertility Academy',
};

export default async function AllTutorsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';

  const tutors = await prisma.user.findMany({
    where: {
      role: 'TUTOR',
      isApproved: true,
      ...(query ? {
        OR: [
          { name: { contains: query } },
          { teachingHeadline: { contains: query } },
          { bio: { contains: query } }
        ]
      } : {})
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-6">
        <div>
          <h1 className="text-3xl font-black text-primary font-playfair tracking-tight mb-2">Fellow Mentors</h1>
          <p className="text-primary/60">Connect with other experts in the field of IVF and infertility.</p>
        </div>
        
        {/* Simple Search Form */}
        <form className="relative w-full sm:w-auto" method="GET">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
          <input 
            type="text" 
            name="q"
            defaultValue={query}
            placeholder="Search mentors..."
            className="w-full sm:w-80 bg-white border border-secondary/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 pl-12 pr-4 py-3 rounded-full text-sm font-medium text-primary outline-none transition-all shadow-sm"
          />
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map((tutor) => (
          <div key={tutor.id} className="bg-white rounded-2xl p-6 border border-secondary/30 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all group flex flex-col h-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-secondary/50 overflow-hidden relative flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                {tutor.image ? (
                  <Image src={tutor.image} alt={tutor.name || 'Tutor'} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xl font-black font-playfair uppercase">
                    {tutor.name?.charAt(0) || 'T'}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-primary text-lg truncate flex items-center gap-1.5 group-hover:text-accent transition-colors">
                  {tutor.name || 'Tutor'}
                  <CheckCircle2 size={14} className="text-accent" />
                </h3>
                <p className="text-xs text-primary/60 font-bold uppercase tracking-widest mt-0.5 truncate">
                  {tutor.teachingHeadline || 'IVF Specialist'}
                </p>
              </div>
            </div>

            <div className="flex-1 mb-6">
              <p className="text-sm text-primary/70 line-clamp-3 leading-relaxed">
                {tutor.bio || 'An experienced mentor ready to guide students.'}
              </p>
            </div>
            
            <div className="pt-4 border-t border-secondary/20">
              <Link href={`/tutors/${tutor.id}`} className="block w-full py-2.5 text-center bg-secondary/10 hover:bg-primary text-primary hover:text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-colors">
                View Profile
              </Link>
            </div>
          </div>
        ))}

        {tutors.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-secondary/30">
            <GraduationCap className="w-16 h-16 text-primary/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">No Mentors Found</h3>
            <p className="text-primary/60 text-sm">
              {query ? `No mentors matched your search for "${query}".` : 'There are currently no approved instructors available.'}
            </p>
            {query && (
              <Link href="/tutor/allTutors" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-accent hover:underline">
                Clear Search
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
