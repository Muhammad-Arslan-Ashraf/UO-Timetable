import { useTimetable } from '../../context/TimetableContext';
import { Calendar, Bell, BookOpen, Clock, TrendingUp, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="font-heading text-3xl font-bold text-slate-800 mt-1">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { timetables, notifications } = useTimetable();
  const navigate = useNavigate();

  const recent = [...timetables].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0, 5);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-heading text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back, Admin · {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Calendar} label="Total Timetables" value={timetables.length} color="bg-indigo-600" sub="All departments" />
        <StatCard icon={Bell} label="Notifications" value={notifications.length} color="bg-blue-600" sub="Published" />
        <StatCard icon={BookOpen} label="Departments" value={[...new Set(timetables.map(t => t.department))].length} color="bg-sky-500" sub="Active" />
        <StatCard icon={TrendingUp} label="Shifts" value={2} color="bg-violet-500" sub="Morning & Evening" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/upload')}
          className="flex items-center gap-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl p-5 hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md text-left group"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload size={22} />
          </div>
          <div>
            <p className="font-bold">Upload Timetable PDF</p>
            <p className="text-blue-200 text-sm">Import new semester schedule</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/admin/notifications')}
          className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all text-left group"
        >
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Bell size={22} className="text-indigo-600" />
          </div>
          <div>
            <p className="font-bold text-slate-800">Manage Notifications</p>
            <p className="text-slate-400 text-sm">Add or edit announcements</p>
          </div>
        </button>
      </div>

      {/* Recent Uploads */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Clock size={16} className="text-indigo-600" /> Recent Uploads
          </h2>
          <button onClick={() => navigate('/admin/timetables')} className="text-xs text-indigo-600 font-medium hover:underline">
            View all
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {recent.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">No timetables uploaded yet</div>
          ) : (
            recent.map(t => (
              <div key={t.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar size={15} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">
                    {t.department} — {t.semester} Semester ({t.shift})
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5 truncate">{t.filename}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">
                  {new Date(t.uploadedAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
