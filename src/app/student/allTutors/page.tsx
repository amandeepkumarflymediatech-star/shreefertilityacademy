import React from 'react';
import { prisma } from '@/lib/db';
import Image from 'next/image';
import { GraduationCap, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'All Mentors | Shree Fertility Academy',
};

export default async function AllTutorsPage() {
  const tutors = await prisma.user.findMany({
    where: {
      role: 'TUTOR',
      isApproved: true,
    }
  });

  return (
    <div>
      <div className="mb-10 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-xs flex items-center gap-2">
          Fellowship
        </h4>
        <h1 className="text-4xl sm:text-5xl font-black text-primary font-playfair tracking-tight mb-2">Our Mentors</h1>
        <p className="text-primary/70 text-lg">Learn from the best in the field of Reproductive Medicine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tutors.map((tutor) => (
          <div key={tutor.id} className="bg-white rounded-[2rem] p-8 border border-secondary/10 shadow-[0_10px_40px_rgba(36,16,79,0.03)] hover:shadow-xl hover:border-secondary/30 transition-all duration-300 group flex flex-col h-full">
            <div className="flex items-start gap-5 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 overflow-hidden relative flex-shrink-0 shadow-inner">
                {tutor.image ? (
                  <Image src={tutor.image} alt={tutor.name || 'Mentor'} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xl font-black font-playfair uppercase">
                    {tutor.name?.charAt(0) || 'M'}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <h3 className="font-bold text-primary text-lg truncate flex items-center gap-1.5 font-playfair">
                  {tutor.name || 'Mentor'}
                  <CheckCircle2 size={16} className="text-accent" />
                </h3>
                <p className="text-xs text-primary/60 font-bold uppercase tracking-widest mt-0.5 truncate">
                  {tutor.teachingHeadline || 'IVF Specialist'}
                </p>
              </div>
            </div>

            <div className="flex-1 mb-6">
              <p className="text-sm text-primary/70 line-clamp-3 leading-relaxed">
                {tutor.bio || 'An experienced mentor ready to guide you through your IVF career journey.'}
              </p>
            </div>
          </div>
        ))}

        {tutors.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-[2rem] border border-secondary/20 shadow-sm">
            <GraduationCap className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2 font-playfair">No Mentors Found</h3>
            <p className="text-primary/60 text-sm">There are currently no approved mentors available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
