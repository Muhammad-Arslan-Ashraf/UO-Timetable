import { Bell, Calendar } from 'lucide-react';
import { useTimetable } from '../context/TimetableContext';

const NotificationsPage = () => {
  const { notifications } = useTimetable();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Bell size={18} className="text-white" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-slate-800">Notifications</h1>
          </div>
          <p className="text-slate-500 text-sm ml-12">Latest announcements and updates from the university</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-slate-300" />
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-700 mb-2">No Notifications</h3>
            <p className="text-slate-400 text-sm">There are no notifications at the moment. Check back later.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n, i) => (
              <div
                key={n.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                    <Bell size={16} className="text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-800 text-sm leading-snug">{n.title}</h3>
                      {i === 0 && (
                        <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">{n.description}</p>
                    <div className="flex items-center gap-1.5 mt-3 text-slate-400 text-xs">
                      <Calendar size={11} />
                      {n.date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
