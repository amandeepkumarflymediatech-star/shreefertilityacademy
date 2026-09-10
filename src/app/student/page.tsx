import { Calendar, Video, Award, Clock, ArrowRight, Target, CheckCircle2, History, CreditCard, Play, FileText } from "lucide-react";
import Link from "next/link";
import { ClassEnrollment, Membership, Order, LiveClass, User } from "@/models";
import { Op } from "sequelize";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  // Fetch upcoming classes
  const upcomingEnrollments = await ClassEnrollment.findAll({
    where: { 
      studentId: session.user.id, 
      status: { [Op.notIn]: ['CANCELLED'] },
    },
    include: [{ 
      model: LiveClass,
      as: 'session',
      where: {
        scheduledAt: { [Op.gte]: new Date() },
        status: { [Op.notIn]: ['CANCELLED'] },
      },
      include: [{ model: User, as: 'tutor' }]
    }],
    order: [[{ model: LiveClass, as: 'session' }, 'scheduledAt', 'ASC']],
    limit: 4
  });

  // Fetch past attended / completed classes
  const pastEnrollments = await ClassEnrollment.findAll({
    where: { 
      studentId: session.user.id, 
    },
    include: [{ 
      model: LiveClass,
      as: 'session',
      where: {
        [Op.or]: [
          { scheduledAt: { [Op.lt]: new Date() } },
          { status: 'COMPLETED' },
        ],
      },
      include: [{ model: User, as: 'tutor' }]
    }],
    order: [[{ model: LiveClass, as: 'session' }, 'scheduledAt', 'DESC']],
    limit: 4
  });

  // Fetch active memberships
  const activeMemberships = await Membership.findAll({
    where: { studentId: session.user.id, status: 'ACTIVE' },
  });

  // Fetch paid orders for invoices
  const paidOrders = await Order.findAll({
    where: { studentId: session.user.id, status: 'PAID' },
    order: [['createdAt', 'DESC']]
  });

  const completedCount = pastEnrollments.length;

  const upcomingClasses = upcomingEnrollments.map((e: any) => ({
    id: e.session.id,
    tutor: e.session.tutor?.name || 'Mentor',
    title: e.session.title,
    time: new Date(e.session.scheduledAt).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    initial: e.session.tutor?.name ? e.session.tutor.name[0].toUpperCase() : 'M',
    url: e.session.meetingUrl || '/student/classes'
  }));

  const pastClasses = pastEnrollments.map((e: any) => ({
    id: e.session.id,
    tutor: e.session.tutor?.name || 'Mentor',
    title: e.session.title,
    time: new Date(e.session.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    initial: e.session.tutor?.name ? e.session.tutor.name[0].toUpperCase() : 'M'
  }));

  const nextClass = upcomingClasses.length > 0 ? upcomingClasses[0] : null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/20 pb-6 relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/4 -translate-y-1/2"></div>
        <div>
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span> Fellowship Portal
          </h4>
          <h1 className="text-4xl font-black text-primary tracking-tight font-playfair">Dashboard</h1>
          <p className="text-primary/70 mt-2 text-lg">Welcome back, {session.user.name?.split(' ')[0] || 'Doctor'}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Next Session Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#24104F] to-[#45218C] p-8 sm:p-12 relative overflow-hidden flex flex-col justify-center items-start text-white rounded-[2rem] shadow-2xl shadow-primary/20 group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <Video size={250} className="-rotate-12 transform translate-x-8 -translate-y-8" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 w-full flex flex-col h-full justify-between gap-8">
            <div>
              <span className="inline-block px-4 py-1.5 bg-white/10 text-white border border-white/20 rounded-full text-[10px] font-bold mb-6 uppercase tracking-widest backdrop-blur-md">Next Clinical Session</span>
              
              {nextClass ? (
                <>
                  <h3 className="text-3xl sm:text-5xl font-black mb-4 font-playfair tracking-tight leading-tight">{nextClass.time}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-white/90">
                    <span className="font-bold text-white bg-white/20 px-3 py-1.5 rounded-lg text-sm shadow-sm">{nextClass.tutor}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span className="text-sm font-medium tracking-wide">{nextClass.title}</span>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-3xl sm:text-4xl font-black mb-3 font-playfair tracking-tight text-white/50">No scheduled sessions</h3>
                  {activeMemberships.length > 0 ? (
                    <p className="text-white/60 font-medium font-sans">Your Fellowship is <strong className="text-white">ACTIVE</strong>. Your mentor will schedule your first clinical module shortly!</p>
                  ) : (
                    <p className="text-white/60 font-medium font-sans">You don't have an active fellowship yet. Please enroll to start learning.</p>
                  )}
                </>
              )}
            </div>

            {nextClass && (
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link 
                  href={nextClass.url}
                  className="px-8 py-4 bg-accent hover:bg-white hover:text-primary text-white font-bold uppercase tracking-widest text-xs transition-all rounded-full flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(230,57,70,0.3)] hover:shadow-xl w-full sm:w-auto"
                >
                  <Play size={16} className="fill-current" /> Join Live Session
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Balances / Stats */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-secondary/20 p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(36,16,79,0.03)] hover:shadow-[0_15px_50px_rgba(36,16,79,0.06)] hover:border-accent/30 transition-all flex flex-col justify-center gap-5 group flex-1">
            <div className="flex items-center gap-5">
               <div className="w-14 h-14 rounded-2xl bg-secondary/5 text-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                 <Award size={28} />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-1">Total Completed</p>
                 <h4 className="text-4xl font-black text-primary font-playfair">{completedCount} <span className="text-sm text-primary/40 font-sans font-medium">sessions</span></h4>
               </div>
            </div>
          </div>

          <div className="bg-white border border-secondary/20 p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(36,16,79,0.03)] hover:shadow-[0_15px_50px_rgba(36,16,79,0.06)] hover:border-accent/30 transition-all flex flex-col justify-center gap-5 group flex-1">
             <div className="flex items-center gap-5">
               <div className="w-14 h-14 rounded-2xl bg-secondary/5 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                 <CreditCard size={28} />
               </div>
               <div className="flex-1 overflow-hidden">
                 <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-1">Remaining Modules</p>
                 {activeMemberships.length > 0 ? (
                   <div>
                     <h4 className="text-4xl font-black text-primary font-playfair">{activeMemberships[0].maxClasses - activeMemberships[0].usedClasses} <span className="text-sm text-primary/40 font-sans font-medium">left</span></h4>
                     <p className="text-[10px] text-accent font-bold uppercase mt-1 truncate tracking-widest">Active Fellowship</p>
                   </div>
                 ) : (
                   <h4 className="text-2xl font-black text-primary/40 font-playfair mt-1">None Active</h4>
                 )}
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Ongoing Programs Section */}
      {activeMemberships.length > 0 && (
        <div className="bg-white border border-secondary/20 flex flex-col rounded-[2rem] shadow-[0_10px_40px_rgba(36,16,79,0.03)] overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 group-hover:bg-accent/10 transition-colors"></div>
          <div className="flex justify-between items-center p-8 border-b border-secondary/10 bg-white/50 backdrop-blur-sm">
            <h3 className="text-2xl font-black text-primary font-playfair tracking-tight flex items-center gap-3">
              <Target className="text-accent" size={24} /> Enrolled Programs
            </h3>
          </div>
          <div className="p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-secondary/5 rounded-2xl p-6 border border-secondary/10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-accent shrink-0 border border-secondary/10">
                  <Award size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-primary mb-1">Reproductive Medicine Fellowship</h4>
                  <div className="flex items-center gap-3 text-sm text-primary/60 font-medium">
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500" /> Active status</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/20"></span>
                    <span>Valid till {new Date(activeMemberships[0].validUntil).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-auto text-left sm:text-right">
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-secondary/10 inline-block">
                  <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-1">Progress</p>
                  <p className="text-primary font-bold">{activeMemberships[0].usedClasses} / {activeMemberships[0].maxClasses} Modules</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming Sessions List */}
        <div className="bg-white border border-secondary/20 flex flex-col overflow-hidden rounded-[2rem] shadow-[0_10px_40px_rgba(36,16,79,0.03)] h-full">
          <div className="p-8 border-b border-secondary/10 flex justify-between items-center bg-white/50 backdrop-blur-sm">
            <h3 className="text-2xl font-black text-primary font-playfair tracking-tight flex items-center gap-3">
              <Calendar className="text-accent" size={24} /> Schedule
            </h3>
          </div>
          <div className="flex-1 p-6 flex flex-col gap-3">
            {upcomingClasses.length > 0 ? upcomingClasses.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between p-5 hover:bg-secondary/5 rounded-2xl transition-all duration-300 group border border-transparent hover:border-secondary/20">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-secondary/5 text-primary flex items-center justify-center font-black text-xl font-playfair rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300 border border-secondary/10 group-hover:border-primary">
                    {cls.initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-sm mb-1.5 group-hover:text-accent transition-colors">{cls.title}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-1">
                      <span className="text-[10px] font-bold text-primary/50 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={12} className="text-accent" /> {cls.time}
                      </span>
                    </div>
                  </div>
                </div>
                {cls.url && cls.url !== '#' && (
                  <Link href={cls.url} className="w-12 h-12 shrink-0 bg-secondary/10 flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white rounded-xl transition-colors shadow-sm">
                    <Video size={18} />
                  </Link>
                )}
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center text-primary/20">
                  <Calendar size={32} />
                </div>
                <p className="text-primary/50 text-sm font-medium">Your clinical schedule is clear.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Past Sessions */}
        <div className="bg-white border border-secondary/20 flex flex-col rounded-[2rem] shadow-[0_10px_40px_rgba(36,16,79,0.03)] overflow-hidden h-full">
           <div className="flex justify-between items-center p-8 border-b border-secondary/10 bg-white/50 backdrop-blur-sm">
            <h3 className="text-2xl font-black text-primary font-playfair tracking-tight flex items-center gap-3">
              <History className="text-accent" size={24} /> Recent History
            </h3>
          </div>
          <div className="flex-1 p-6 flex flex-col gap-3">
            {pastClasses.length > 0 ? pastClasses.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between p-5 bg-white border border-secondary/10 rounded-2xl transition-all duration-300 hover:shadow-md hover:border-secondary/30">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-secondary/5 flex items-center justify-center text-primary/50 rounded-2xl border border-secondary/10">
                    <CheckCircle2 size={24} className="text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-sm mb-1">{cls.title}</h4>
                    <div className="flex gap-2 mt-1.5 items-center">
                      <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">{cls.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center text-primary/20">
                  <History size={32} />
                </div>
                <p className="text-primary/50 text-sm font-medium">No completed modules yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}