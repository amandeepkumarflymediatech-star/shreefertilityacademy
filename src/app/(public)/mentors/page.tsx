import React from 'react';
import Image from 'next/image';
import { Star, CheckCircle2, Languages, Clock } from 'lucide-react';
import { User, Review } from '@/models';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Meet Your Mentors | Shree Fertility Academy',
  description: 'Connect with elite IVF specialists and reproductive medicine mentors tailored to your needs.',
};

export default async function MentorsPage() {
  const session = await getServerSession(authOptions);

  const getBookingLink = (mentorId: string) => {
    if (!session) return '/login';
    if (session.user.role === 'STUDENT') return `/student`;
    if (session.user.role === 'TUTOR') return '/tutor';
    if (session.user.role === 'ADMIN') return '/admin';
    return '/login';
  };

  const getButtonText = () => {
    if (!session) return 'Book Consultation';
    if (session.user.role === 'STUDENT') return 'Enquire Now';
    if (session.user.role === 'TUTOR') return 'Go to Dashboard';
    if (session.user.role === 'ADMIN') return 'Go to Dashboard';
    return 'Book Consultation';
  };

  // Fetch available mentors
  const mentors = await User.findAll({
    where: { 
      role: 'TUTOR',
      isApproved: true,
      isActive: true
    },
    attributes: ['id', 'name', 'image', 'bio', 'experience', 'languages']
  });

  // Fetch student reviews
  const reviews = await Review.findAll({
    where: { isActive: true },
    include: [
      { model: User, as: 'student', attributes: ['name'] },
      { model: User, as: 'tutor', attributes: ['name'] }
    ],
    order: [['createdAt', 'DESC']],
    limit: 10
  });


  return (
    <div className="w-full bg-slate-50 pt-32 pb-24 min-h-screen font-inter selection:bg-accent selection:text-white relative overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-blue-50 to-transparent -z-10 blur-3xl opacity-60"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-block px-5 py-2 mb-6 rounded-full border border-blue-200 bg-white/50 backdrop-blur-sm text-accent font-semibold tracking-widest text-xs uppercase shadow-sm">
            Elite Faculty
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-slate-900 font-playfair mb-6">
            Guidance from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-600 italic">Best</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-inter leading-relaxed">
            Connect with our elite roster of IVF specialists and start mastering clinical reproductive medicine today.
          </p>
        </div>

        {/* Available Mentors Section */}
        <div className="mb-32">
          <div className="flex items-center gap-6 mb-16">
             <h2 className="text-3xl md:text-4xl font-bold font-playfair text-slate-900 tracking-tight">Available Mentors</h2>
             <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-all duration-300 group flex flex-col relative">
                <div className="relative h-72 w-full overflow-hidden bg-slate-100">
                  {mentor.image ? (
                    <Image 
                      src={mentor.image} 
                      alt={mentor.name || 'Mentor'} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-slate-400 font-playfair text-6xl font-bold">
                      {mentor.name?.charAt(0) || 'M'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="text-yellow-500 w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-slate-900">5.0</span>
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col relative z-10 bg-white rounded-t-3xl -mt-6">
                  <h3 className="text-2xl font-bold font-playfair text-slate-900 mb-2">{mentor.name}</h3>
                  
                  <div className="flex flex-col gap-3 mt-4 mb-6 text-sm text-slate-600 font-inter">
                    {mentor.languages && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center"><Languages className="w-4 h-4 text-accent" /></div>
                        <span className="font-medium">{mentor.languages}</span>
                      </div>
                    )}
                    {mentor.experience && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center"><Clock className="w-4 h-4 text-accent" /></div>
                        <span className="font-medium">{mentor.experience}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-slate-600 font-inter text-sm line-clamp-3 leading-relaxed mb-8 flex-1">
                    {mentor.bio || 'Professional IVF specialist dedicated to helping you achieve clinical confidence and success.'}
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <Link 
                      href={getBookingLink(mentor.id)} 
                      className="w-full block text-center py-4 bg-slate-900 text-white font-semibold text-sm hover:bg-accent transition-colors rounded-xl shadow-md"
                    >
                      {getButtonText()}
                    </Link>
                    <Link 
                      href={`/mentors/${mentor.id}`} 
                      className="w-full block text-center py-4 bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors rounded-xl"
                    >
                      View Full Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {mentors.length === 0 && (
              <div className="col-span-full py-24 text-center text-slate-500 font-inter">
                No mentors available at the moment. Please check back later.
              </div>
            )}
          </div>
        </div>

        {/* What Our Doctors Say Section */}
        <div>
          <div className="flex items-center gap-6 mb-16">
             <div className="h-px bg-slate-200 flex-1 hidden md:block"></div>
             <h2 className="text-3xl md:text-4xl font-bold font-playfair text-slate-900 text-center tracking-tight">What Our Doctors Say</h2>
             <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review: any) => (
              <div key={review.id} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex text-yellow-400 mb-8">
                  {[...Array(review.rating)].map((_, j) => <Star key={j} size={20} fill="currentColor" />)}
                </div>
                <p className="text-slate-700 mb-10 text-lg font-inter font-medium leading-relaxed italic">
                  "{review.content}"
                </p>
                <div className="flex items-center gap-5 mt-auto pt-6 border-t border-slate-100">
                  <div className="w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center font-bold text-2xl font-playfair shrink-0 shadow-sm">
                    {review.student?.name?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 font-inter">{review.student?.name || 'Anonymous Doctor'}</h4>
                    {review.tutor && (
                      <p className="text-xs text-slate-500 font-semibold font-inter uppercase tracking-wider mt-1.5">
                        Mentored by {review.tutor.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {reviews.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-500 font-inter">
                No reviews yet. Check back soon!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
