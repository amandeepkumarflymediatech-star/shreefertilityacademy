import { Calendar, Video, Clock, Users, ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LiveClass, ClassEnrollment } from "@/models";
import { Op } from "sequelize";
import { redirect } from "next/navigation";

export default async function TutorDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'TUTOR') {
    redirect('/login');
  }

  const tutorId = session.user.id;

  // Calculate today's date range
  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date();
  endOfDay.setHours(23,59,59,999);

  // Fetch Stats
  const todayClassesCount = await LiveClass.count({
    where: {
      tutorId,
      scheduledAt: { [Op.gte]: startOfDay, [Op.lte]: endOfDay },
      status: { [Op.ne]: 'CANCELLED' }
    }
  });

  const completedClassesCount = await LiveClass.count({
    where: { tutorId, status: 'COMPLETED' },
  });

  const activeStudentsGroup = await ClassEnrollment.count({
    include: [{
      model: LiveClass,
      as: 'session',
      where: { tutorId }
    }],
    distinct: true,
    col: 'studentId'
  });
  const activeStudents = activeStudentsGroup;

  const stats = [
    { name: 'Today\'s Classes', value: todayClassesCount.toString(), icon: Calendar },
    { name: 'Classes Taught', value: completedClassesCount.toString(), icon: Clock },
    { name: 'Active Students', value: activeStudents.toString(), icon: Users },
  ];

  // Fetch upcoming sessions for today
  const upcomingClassesDb = await LiveClass.findAll({
    where: {
      tutorId,
      scheduledAt: { [Op.gte]: new Date(), [Op.lte]: endOfDay },
      status: { [Op.notIn]: ['CANCELLED', 'COMPLETED'] }
    },
    order: [['scheduledAt', 'ASC']],
    limit: 3,
    include: [{
      model: ClassEnrollment,
      as: 'enrollments'
    }]
  });

  const upcomingClasses = upcomingClassesDb.map(c => {
    const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return {
      id: c.id,
      title: c.title,
      studentCount: (c as any).enrollments ? (c as any).enrollments.length : 0,
      time: `${formatTime(c.scheduledAt)}`,
      meetingUrl: c.meetingUrl
    }
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-6">
        <div>
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-sm font-sans bg-accent/10 text-accent px-3 py-1 rounded-full w-fit">Tutor Portal</h4>
          <h1 className="text-4xl font-black text-primary tracking-tight font-playfair">Dashboard</h1>
          <p className="text-primary/70 mt-2 font-sans text-lg">Ready for your classes today?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-primary/40 uppercase tracking-widest group-hover:text-accent transition-colors">{stat.name}</p>
                <h3 className="text-4xl font-black text-primary mt-3 tracking-tight font-playfair">{stat.value}</h3>
              </div>
              <div className={`p-4 bg-secondary/20 text-primary rounded-2xl group-hover:bg-accent group-hover:text-white transition-colors duration-300`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        <div className="bg-white border border-secondary/30 rounded-3xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-8 border-b border-secondary/30 flex justify-between items-center bg-secondary/5">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight">Upcoming Classes Today</h3>
            <Link href="/tutor/classes" className="text-xs font-bold uppercase tracking-widest text-accent hover:text-accent/80 transition-colors bg-accent/10 px-4 py-2 rounded-full">View Classes</Link>
          </div>
          <div className="flex-1 p-2 min-h-[300px]">
            {upcomingClasses.length === 0 ? (
              <div className="flex items-center justify-center h-full flex-col text-primary/40 p-8">
                <Calendar size={48} className="mb-4 opacity-50" />
                <p className="font-bold">No more classes today!</p>
                <p className="text-sm text-center mt-2">Enjoy your free time or prepare for upcoming sessions.</p>
              </div>
            ) : (
              upcomingClasses.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between p-6 hover:bg-secondary/10 rounded-2xl transition-all group mb-2 last:mb-0">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center font-black text-xl font-playfair rounded-2xl`}>
                      C
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-lg mb-1">{cls.title}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs font-bold text-primary/60 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock size={14} className="text-accent" /> {cls.time}
                        </span>
                        <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
                          {cls.studentCount} ENROLLED
                        </span>
                      </div>
                    </div>
                  </div>
                  {cls.meetingUrl ? (
                    <a href={cls.meetingUrl} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border-2 border-secondary/50 flex items-center justify-center text-primary/40 group-hover:text-white group-hover:bg-accent group-hover:border-accent group-hover:scale-110 transition-all shadow-sm">
                      <PlayCircle size={24} />
                    </a>
                  ) : (
                    <div className="text-xs text-primary/40 italic font-bold uppercase tracking-widest px-4">No Link</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions & Activity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-white border border-secondary/30 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/tutor/classes" className="flex flex-col items-center justify-center p-6 bg-secondary/5 hover:bg-primary hover:text-white text-primary rounded-2xl transition-all group shadow-sm hover:-translate-y-1">
                <Video size={28} className="mb-3 text-accent group-hover:text-white transition-colors" />
                <span className="font-bold text-sm text-center">Schedule Class</span>
              </Link>
              <Link href="/tutor/students" className="flex flex-col items-center justify-center p-6 bg-secondary/5 hover:bg-primary hover:text-white text-primary rounded-2xl transition-all group shadow-sm hover:-translate-y-1">
                <Users size={28} className="mb-3 text-accent group-hover:text-white transition-colors" />
                <span className="font-bold text-sm text-center">My Students</span>
              </Link>
              <Link href="/tutor/profile" className="flex flex-col items-center justify-center p-6 bg-secondary/5 hover:bg-primary hover:text-white text-primary rounded-2xl transition-all group shadow-sm hover:-translate-y-1">
                <Calendar size={28} className="mb-3 text-accent group-hover:text-white transition-colors" />
                <span className="font-bold text-sm text-center">Update Profile</span>
              </Link>
            </div>
          </div>
          
          <div className="bg-primary border border-secondary/30 rounded-3xl p-8 shadow-lg text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
             <h3 className="text-xl font-black font-playfair tracking-tight mb-6 flex items-center justify-between">
               Recent Activity
               <Link href="/tutor/students" className="text-xs font-sans font-bold uppercase tracking-widest text-accent hover:text-white transition-colors">See all <ArrowRight size={14} className="inline ml-1" /></Link>
             </h3>
             
             <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-bold">New Student Enrollment</p>
                    <p className="text-xs text-white/60 mt-1">A new student has registered for your upcoming class.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 font-bold">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-bold">Profile Updated</p>
                    <p className="text-xs text-white/60 mt-1">Your teaching headline was successfully updated.</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}