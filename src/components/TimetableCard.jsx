import { Clock, User, MapPin } from 'lucide-react';

const TimetableCard = ({ entry, color = '#6366f1' }) => (
  <div
    className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
    style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
  >
    {/* Time badge */}
    <div className="flex items-center justify-between mb-3">
      <span
        className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ background: color + '18', color }}
      >
        <Clock size={11} />
        {entry.time}
      </span>
    </div>

    {/* Subject */}
    <h4 className="font-semibold text-slate-800 text-sm mb-2 leading-snug group-hover:text-indigo-700 transition-colors">
      {entry.subject}
    </h4>

    {/* Meta */}
    <div className="space-y-1">
      {entry.teacher && (
        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <User size={11} className="text-slate-400" />
          {entry.teacher}
        </p>
      )}
      {entry.room && (
        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin size={11} className="text-slate-400" />
          {entry.room}
        </p>
      )}
    </div>
  </div>
);

export default TimetableCard;
