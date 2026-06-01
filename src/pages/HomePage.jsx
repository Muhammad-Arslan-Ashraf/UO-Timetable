import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Bell, ArrowRight, Calendar, Users, Award, Clock } from 'lucide-react';
import { useTimetable } from '../context/TimetableContext';
import heroBg from '../assets/University-Of-Okara.jpeg';

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-white text-center">
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
      <Icon size={18} className="text-white" />
    </div>
    <p className="font-heading text-3xl font-bold">{value}</p>
    <p className="text-sm text-blue-200 mt-1">{label}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow group">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon size={22} className="text-white" />
    </div>
    <h3 className="font-heading font-bold text-slate-800 text-lg mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const { timetables, notifications } = useTimetable();

  return (
    <div>
      {/* Hero */}
      <div 
        className="text-white py-24 px-4 relative overflow-hidden bg-indigo-900"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-indigo-950/70 backdrop-blur-[2px] z-0"></div>
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-blue-200 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Academic Year 2024–2025
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold mb-5 leading-tight">
            University of Okara
            <span className="block text-blue-300 text-3xl sm:text-4xl mt-1">Timetable Portal</span>
          </h1>

          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Access your class schedules, track notifications, and plan your academic journey with ease.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/timetable')}
              className="flex items-center gap-2 bg-white text-indigo-700 font-bold px-7 py-3.5 rounded-xl text-sm hover:bg-blue-50 transition-colors shadow-lg"
            >
              <BookOpen size={16} />
              View Timetable
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => navigate('/notifications')}
              className="flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl text-sm hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <Bell size={16} />
              Notifications
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-700 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={Calendar} value={timetables.length} label="Timetables" color="bg-indigo-500" />
          <StatCard icon={Bell} value={notifications.length} label="Notifications" color="bg-blue-500" />
          <StatCard icon={Users} value="5,000+" label="Students" color="bg-sky-500" />
          <StatCard icon={Award} value="20+" label="Departments" color="bg-violet-500" />
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold text-slate-800 mb-3">Everything You Need</h2>
          <p className="text-slate-500">Access all academic resources in one place</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={BookOpen}
            title="Smart Timetable"
            desc="Instantly find your class schedule by selecting your department, semester, and shift. Clean, readable display."
            color="bg-indigo-600"
          />
          <FeatureCard
            icon={Bell}
            title="Live Notifications"
            desc="Stay updated with the latest university announcements, exam schedules, and timetable changes."
            color="bg-blue-600"
          />
          <FeatureCard
            icon={Clock}
            title="Real-time Updates"
            desc="Timetables are updated by the admin as soon as changes are made — always accurate and current."
            color="bg-sky-600"
          />
        </div>
      </div>

      {/* Latest Notifications */}
      {notifications.length > 0 && (
        <div className="bg-slate-50 py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold text-slate-800">Latest Updates</h2>
              <button onClick={() => navigate('/notifications')} className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight size={13} />
              </button>
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 3).map(n => (
                <div key={n.id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                    <Bell size={14} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{n.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{n.description}</p>
                    <p className="text-slate-400 text-xs mt-1">{n.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
