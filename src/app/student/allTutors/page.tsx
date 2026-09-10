import React from 'react';
import { User, LiveClass } from '@/models';
import Image from 'next/image';
import Link from 'next/link';
import { GraduationCap, CheckCircle2, Video, Calendar, Clock, ExternalLink } from 'lucide-react';
import { Op } from 'sequelize';
import { formatClassDate, formatClassTime } from '@/lib/date-utils';

export const metadata = {
  title: 'Faculty & Tutors | Shree Fertility Academy',
};

export default async function AllTutorsPage() {
  const rawTutors = await User.findAll({
    where: {
      role: 'TUTOR',
      isApproved: true,
    },
    include: [
      {
        model: LiveClass,
        as: 'taughtClasses',
        where: {
          scheduledAt: { [Op.gte]: new Date() },
          status: { [Op.notIn]: ['CANCELLED'] },
        },
        required: false,
      },
    ],
    order: [
      ['createdAt', 'ASC'],
      [{ model: LiveClass, as: 'taughtClasses' }, 'scheduledAt', 'ASC'],
    ],
  });
  const tutors = JSON.parse(JSON.stringify(rawTutors));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <div className="mb-6 relative border-b border-secondary/20 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div>
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-xs flex items-center gap-2">
            Clinical Faculty
          </h4>
          <h1 className="text-4xl sm:text-5xl font-black text-primary font-playfair tracking-tight mb-2">Our Mentors & Faculty</h1>
          <p className="text-primary/70 text-base sm:text-lg">Learn from the top specialists in Reproductive Medicine & Clinical Embryology.</p>
        </div>

        <Link
          href="/student/classes"
          className="px-6 py-3 bg-primary hover:bg-accent text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-sm flex items-center gap-2"
        >
          <Video size={16} />
          View All Live Classes
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tutors.map((tutor: any) => {
          const upcomingSessions = tutor.taughtClasses || [];

          return (
            <div key={tutor.id} className="bg-white rounded-[2rem] p-7 border border-secondary/20 shadow-sm hover:shadow-xl hover:border-secondary/40 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 overflow-hidden relative flex-shrink-0 shadow-inner">
                    {tutor.image ? (
                      <Image src={tutor.image} alt={tutor.name || 'Mentor'} fill unoptimized className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xl font-black font-playfair uppercase">
                        {tutor.name?.charAt(0) || 'M'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="font-bold text-primary text-lg truncate flex items-center gap-1.5 font-playfair">
                      {tutor.name || 'Mentor'}
                      <CheckCircle2 size={16} className="text-accent shrink-0" />
                    </h3>
                    <p className="text-xs text-primary/60 font-bold uppercase tracking-widest mt-0.5 truncate">
                      {tutor.teachingHeadline || 'IVF Specialist'}
                    </p>
                    {tutor.experience && (
                      <p className="text-[11px] text-accent font-semibold mt-0.5">
                        {tutor.experience}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-5">
                  <p className="text-xs text-primary/70 line-clamp-3 leading-relaxed">
                    {tutor.bio || 'An experienced mentor ready to guide you through your IVF career journey.'}
                  </p>
                </div>

                {/* Scheduled Live Classes */}
                <div className="space-y-2 pt-3 border-t border-secondary/20">
                  <p className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Video size={13} className="text-accent" />
                    Upcoming Live Sessions ({upcomingSessions.length})
                  </p>

                  {upcomingSessions.length === 0 ? (
                    <p className="text-[11px] text-primary/50 italic py-2 bg-secondary/5 rounded-xl px-3 text-center">
                      No upcoming sessions scheduled right now.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {upcomingSessions.map((session: any) => (
                        <div
                          key={session.id}
                          className="p-3 bg-secondary/10 hover:bg-secondary/20 rounded-xl border border-secondary/20 text-xs transition-colors space-y-1.5"
                        >
                          <p className="font-bold text-primary truncate">{session.title}</p>
                          <div className="flex items-center justify-between text-[11px] text-primary/60">
                            <span>
                              {formatClassDate(session.scheduledAt)} • {formatClassTime(session.scheduledAt)}
                            </span>
                            {session.meetingUrl && (
                              <a
                                href={session.meetingUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-accent hover:underline font-bold flex items-center gap-0.5"
                              >
                                Join <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-secondary/20 flex justify-between items-center text-[11px] text-primary/60">
                <Link
                  href="/student/classes"
                  className="text-xs font-bold text-primary hover:text-accent transition-colors"
                >
                  Full Class Schedule &rarr;
                </Link>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                  Verified Mentor
                </span>
              </div>
            </div>
          );
        })}

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

