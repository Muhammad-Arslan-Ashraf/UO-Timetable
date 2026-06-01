import TimetableCard from './TimetableCard';
import { DAY_COLORS } from '../data/sampleData';
import { Calendar } from 'lucide-react';

const DaySchedule = ({ day, entries }) => {
  const color = DAY_COLORS[day] || '#6366f1';

  return (
    <div className="mb-6">
      {/* Day header */}
      <div
        className="flex items-center gap-2.5 mb-3 px-3 py-2 rounded-xl"
        style={{ background: color + '12' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: color }}
        >
          <Calendar size={14} className="text-white" />
        </div>
        <h3 className="font-heading font-bold text-base" style={{ color }}>
          {day}
        </h3>
        <span className="ml-auto text-xs text-slate-500 font-medium">
          {entries.length} class{entries.length !== 1 ? 'es' : ''}
        </span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-1">
        {entries.map((entry, i) => (
          <TimetableCard key={i} entry={entry} color={color} />
        ))}
      </div>
    </div>
  );
};

export default DaySchedule;
