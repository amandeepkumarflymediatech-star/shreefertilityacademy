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
      <div className="mb-8">
        <h1 className="text-3xl font-black text-primary font-playfair tracking-tight mb-2">Fellow Instructors</h1>
        <p className="text-primary/60">Connect with other experts in the field of IVF and infertility.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map((tutor) => (
          <div key={tutor.id} className="bg-white rounded-2xl p-6 border border-secondary/30 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-secondary/50 overflow-hidden relative flex-shrink-0 shadow-sm">
                {tutor.image ? (
                  <Image src={tutor.image} alt={tutor.name || 'Tutor'} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xl font-black font-playfair uppercase">
                    {tutor.name?.charAt(0) || 'T'}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-primary text-lg truncate flex items-center gap-1.5">
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
          </div>
        ))}

        {tutors.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-secondary/30">
            <GraduationCap className="w-12 h-12 text-primary/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-primary mb-2">No Mentors Found</h3>
            <p className="text-primary/60 text-sm">There are currently no approved instructors available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
