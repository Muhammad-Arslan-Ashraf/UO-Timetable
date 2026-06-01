import { useState } from 'react';
import { toast } from 'react-hot-toast';
import TimetableFilters from '../components/TimetableFilters';
import DaySchedule from '../components/DaySchedule';
import { useTimetable } from '../context/TimetableContext';
import { DAY_ORDER } from '../data/sampleData';
import { Search, BookOpen, Calendar } from 'lucide-react';

const EmptyState = ({ searched }) => (
  <div className="text-center py-16">
    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      {searched ? <Search size={32} className="text-slate-300" /> : <BookOpen size={32} className="text-slate-300" />}
    </div>
    <h3 className="font-heading text-xl font-bold text-slate-700 mb-2">
      {searched ? 'No Timetable Found' : 'Search for a Timetable'}
    </h3>
    <p className="text-slate-400 text-sm max-w-sm mx-auto">
      {searched
        ? 'No timetable matches your selection. Please try different filters or contact the admin office.'
        : 'Select your department, semester, and shift above to find your class schedule.'}
    </p>
  </div>
);

const TimetablePage = () => {
  const { findTimetable } = useTimetable();
  const [filters, setFilters] = useState({ department: '', program: '', semester: '', section: '', shift: '' });
  const [timetable, setTimetable] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!filters.department || !filters.program || !filters.semester || !filters.shift) {
      toast.error('Please select all required filters');
      return;
    }
    setLoading(true);
    // Simulate brief loading for UX
    await new Promise(r => setTimeout(r, 600));
    const result = findTimetable(filters.department, filters.program, filters.semester, filters.section, filters.shift);
    setTimetable(result || null);
    setSearched(true);
    setLoading(false);
    if (result) {
      toast.success(`Found timetable for ${filters.program} ${filters.semester} (${filters.shift})`);
    } else {
      toast.error('No timetable found for this selection');
    }
  };

  const orderedDays = timetable
    ? DAY_ORDER.filter(d => timetable.days[d] && timetable.days[d].length > 0)
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Calendar size={18} className="text-white" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-slate-800">Class Timetable</h1>
          </div>
          <p className="text-slate-500 text-sm ml-12">Select your department and semester to view your schedule</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TimetableFilters
          filters={filters}
          onChange={setFilters}
          onSearch={handleSearch}
          loading={loading}
        />

        {/* Results */}
        <div className="mt-8">
          {timetable ? (
            <div>
              {/* Result header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-slate-800">
                    {timetable.department} <span className="text-indigo-600">({timetable.program})</span>
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 text-sm text-slate-500 font-medium">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">{timetable.semester} Semester</span>
                    {timetable.section && timetable.section !== 'None' && (
                      <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-md">Sec {timetable.section}</span>
                    )}
                    <span className="bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-md">{timetable.shift} Shift</span>
                  </div>
                </div>
                <span className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200">
                  ✓ Timetable Found
                </span>
              </div>

              {orderedDays.map(day => (
                <DaySchedule key={day} day={day} entries={timetable.days[day]} />
              ))}
            </div>
          ) : (
            <EmptyState searched={searched} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
