import { Search, ChevronDown } from 'lucide-react';
import { DEPARTMENTS, PROGRAMS, SEMESTERS, SHIFTS, SECTIONS } from '../data/sampleData';

const Select = ({ label, value, onChange, options, placeholder }) => (
  <div className="flex-1 min-w-[140px]">
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

const TimetableFilters = ({ filters, onChange, onSearch, loading }) => (
  <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
    <h2 className="font-heading font-bold text-lg text-slate-800 mb-4">Find Your Timetable</h2>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
      <Select
        label="Department"
        value={filters.department}
        onChange={v => onChange({ ...filters, department: v })}
        options={DEPARTMENTS}
        placeholder="Select Department"
      />
      <Select
        label="Program"
        value={filters.program}
        onChange={v => onChange({ ...filters, program: v })}
        options={PROGRAMS}
        placeholder="Select Program"
      />
      <Select
        label="Semester"
        value={filters.semester}
        onChange={v => onChange({ ...filters, semester: v })}
        options={SEMESTERS}
        placeholder="Select Semester"
      />
      <Select
        label="Section"
        value={filters.section}
        onChange={v => onChange({ ...filters, section: v })}
        options={SECTIONS}
        placeholder="Select Section"
      />
      <Select
        label="Shift"
        value={filters.shift}
        onChange={v => onChange({ ...filters, shift: v })}
        options={SHIFTS}
        placeholder="Morning / Evening"
      />
    </div>
    <button
      onClick={onSearch}
      disabled={loading || !filters.department || !filters.program || !filters.semester || !filters.shift}
      className="flex items-center justify-center w-full md:w-auto gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          Searching...
        </span>
      ) : (
        <>
          <Search size={15} />
          Search Timetable
        </>
      )}
    </button>
  </div>
);

export default TimetableFilters;
