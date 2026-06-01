import { useTimetable } from '../../context/TimetableContext';
import { toast } from 'react-hot-toast';
import { Calendar, Trash2, Eye, BookOpen, Building2, Edit } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DAY_ORDER } from '../../data/sampleData';

const TimetableDetail = ({ timetable, onClose }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
    <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <div>
          <h2 className="font-heading font-bold text-slate-800">
            {timetable.department} — {timetable.program} {timetable.semester} Sem {timetable.section && `(Sec ${timetable.section})`} ({timetable.shift})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{timetable.filename}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">✕</button>
      </div>
      <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
        {DAY_ORDER.filter(d => timetable.days[d]?.length > 0).map(day => (
          <div key={day}>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">{day}</p>
            {timetable.days[day].map((e, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-lg px-3 py-2 mb-1 text-xs">
                <span className="font-mono text-indigo-700 font-semibold shrink-0">{e.time}</span>
                <span className="text-slate-700 flex-1 font-medium">{e.subject}</span>
                <span className="text-slate-500">{e.teacher}</span>
                <span className="text-slate-400 shrink-0">{e.room}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TimetableCard = ({ t, onView, onDelete, onEdit }) => {
  const totalClasses = Object.values(t.days || {}).reduce((s, a) => s + a.length, 0);
  const activeDays = Object.values(t.days || {}).filter(d => d.length > 0).length;
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-indigo-50 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center transition-colors">
          <Calendar size={18} className="text-indigo-600" />
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          t.shift === 'Morning'
            ? 'bg-amber-50 text-amber-700'
            : 'bg-indigo-50 text-indigo-700'
        }`}>
          {t.shift}
        </span>
      </div>
      <h3 className="font-heading font-bold text-slate-800 mb-0.5">{t.program || t.department}</h3>
      <p className="text-slate-500 text-sm">
        {t.semester} Sem
        {t.section && t.section !== 'None' && <span className="ml-1 font-semibold text-indigo-600">· Sec {t.section}</span>}
        {(t.season || t.year) && (
          <span className="ml-1 text-slate-400">· {t.season} {t.year}</span>
        )}
      </p>
      <p className="text-slate-400 text-xs mt-2">{totalClasses} classes · {activeDays} days</p>
      <p className="text-slate-300 text-xs mt-0.5 truncate">{t.filename}</p>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onView(t)}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-lg transition-colors"
        >
          <Eye size={12} /> View
        </button>
        <button
          onClick={() => onEdit(t.id)}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 py-2 rounded-lg transition-colors"
        >
          <Edit size={12} /> Edit
        </button>
        <button
          onClick={() => onDelete(t.id, `${t.program || t.department} ${t.semester}`)}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 py-2 rounded-lg transition-colors"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  );
};

const AllTimetables = () => {
  const { timetables, deleteTimetable } = useTimetable();
  const [viewing, setViewing] = useState(null);
  const navigate = useNavigate();

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete timetable "${name}"?`)) {
      deleteTimetable(id);
      toast.success('Timetable deleted');
    }
  };

  const handleEditSingle = (id) => {
    navigate('/admin/builder', { state: { editIds: [id] } });
  };

  const handleEditDept = (dept) => {
    const ids = grouped[dept].map(t => t.id);
    navigate('/admin/builder', { state: { editIds: ids } });
  };

  // Group timetables by department
  const grouped = timetables.reduce((acc, t) => {
    const dept = t.department || 'Uncategorized';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(t);
    return acc;
  }, {});

  const departments = Object.keys(grouped).sort();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-slate-800">All Timetables</h1>
        <p className="text-slate-500 text-sm mt-1">
          {timetables.length} timetable(s) across {departments.length} department(s)
        </p>
      </div>

      {timetables.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-slate-300" />
          </div>
          <p className="text-slate-500 text-sm">No timetables uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {departments.map(dept => (
            <section key={dept}>
              {/* Department Heading */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                  <Building2 size={17} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-heading text-lg font-bold text-slate-800 truncate">
                    Department of {dept}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {grouped[dept].length} timetable(s)
                  </p>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-slate-200 hidden sm:block mx-2" />
                <button
                  onClick={() => handleEditDept(dept)}
                  className="shrink-0 flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  <Edit size={14} /> Edit All
                </button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {grouped[dept].map(t => (
                  <TimetableCard
                    key={t.id}
                    t={t}
                    onView={setViewing}
                    onEdit={handleEditSingle}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {viewing && <TimetableDetail timetable={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
};

export default AllTimetables;
