import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, FileText, CheckCircle, AlertCircle, X, Loader, Database, Save, Edit, Trash2, Plus } from 'lucide-react';
import { useTimetable } from '../../context/TimetableContext';
import { parseTimetableFromPDF, generateFallbackData } from '../../utils/pdfParser';
import { DEPARTMENTS, PROGRAMS, SEMESTERS, SHIFTS, SECTIONS } from '../../data/sampleData';

const Select = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[100px]"
  >
    <option value="">Select...</option>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

const EditableTimetableCard = ({ timetable, onUpdate, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleMetaChange = (field, value) => {
    onUpdate({ ...timetable, [field]: value });
  };

  const handleClassChange = (day, index, field, value) => {
    const newDays = { ...timetable.days };
    newDays[day][index] = { ...newDays[day][index], [field]: value };
    onUpdate({ ...timetable, days: newDays });
  };

  const removeClass = (day, index) => {
    const newDays = { ...timetable.days };
    newDays[day].splice(index, 1);
    onUpdate({ ...timetable, days: newDays });
  };

  const addClass = (day) => {
    const newDays = { ...timetable.days };
    newDays[day].push({ time: '', subject: '', teacher: '', room: '' });
    onUpdate({ ...timetable, days: newDays });
  };

  const countTotalClasses = (days) => {
    return Object.values(days).reduce((sum, arr) => sum + arr.length, 0);
  };

  const daysWithEntries = isEditing 
    ? Object.keys(timetable.days) 
    : Object.entries(timetable.days).filter(([_, entries]) => entries.length > 0).map(([day]) => day);

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border relative flex flex-col ${isEditing ? 'border-indigo-400 ring-4 ring-indigo-50' : 'border-slate-200'}`}>
      <div className="flex flex-col mb-4 pb-3 border-b border-slate-100 gap-3">
        {/* Selectors for override */}
        <div className="flex flex-wrap items-center gap-2">
          <Select value={timetable.department} onChange={v => handleMetaChange('department', v)} options={DEPARTMENTS} />
          <Select value={timetable.program} onChange={v => handleMetaChange('program', v)} options={PROGRAMS} />
          <Select value={timetable.semester} onChange={v => handleMetaChange('semester', v)} options={SEMESTERS} />
          <Select value={timetable.section} onChange={v => handleMetaChange('section', v)} options={SECTIONS} />
          <Select value={timetable.shift} onChange={v => handleMetaChange('shift', v)} options={SHIFTS} />
        </div>

        <div className="flex items-center justify-between">
          <span className="bg-indigo-50 text-indigo-700 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
            {countTotalClasses(timetable.days)} Classes Found
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors border ${
                isEditing ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isEditing ? <CheckCircle size={13} /> : <Edit size={13} />}
              {isEditing ? 'Done Editing' : 'Edit Classes'}
            </button>
            <button
              onClick={() => onSave(timetable)}
              className="text-xs bg-slate-800 hover:bg-slate-900 text-white font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Save size={13} /> Save Table
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto max-h-80 pr-2 custom-scrollbar">
        {daysWithEntries.map(day => (
          <div key={day}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              {day}
              {isEditing && (
                <button onClick={() => addClass(day)} className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 normal-case px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 transition-colors">
                  <Plus size={10} /> Add Class
                </button>
              )}
            </p>
            
            {timetable.days[day].map((e, i) => (
               isEditing ? (
                 <div key={i} className="flex gap-2 bg-indigo-50/50 rounded-lg p-2 mb-2 border border-indigo-100">
                    <input 
                      type="text" placeholder="Time" value={e.time} onChange={(evt) => handleClassChange(day, i, 'time', evt.target.value)}
                      className="w-24 text-[10px] font-mono font-bold px-2 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-indigo-400"
                    />
                    <div className="flex-1 flex flex-col gap-1.5">
                      <input 
                        type="text" placeholder="Subject" value={e.subject} onChange={(evt) => handleClassChange(day, i, 'subject', evt.target.value)}
                        className="w-full text-xs font-semibold px-2 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-indigo-400"
                      />
                      <div className="flex gap-1.5">
                        <input 
                          type="text" placeholder="Teacher" value={e.teacher} onChange={(evt) => handleClassChange(day, i, 'teacher', evt.target.value)}
                          className="flex-1 text-[10px] px-2 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-indigo-400"
                        />
                        <input 
                          type="text" placeholder="Room" value={e.room} onChange={(evt) => handleClassChange(day, i, 'room', evt.target.value)}
                          className="w-20 text-[10px] px-2 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-indigo-400"
                        />
                      </div>
                    </div>
                    <button onClick={() => removeClass(day, i)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded self-start transition-colors">
                      <Trash2 size={14} />
                    </button>
                 </div>
               ) : (
                <div key={i} className="flex gap-3 bg-slate-50 rounded-lg px-3 py-2 mb-1 border border-slate-100/50 hover:bg-slate-100 transition-colors">
                  <span className="font-mono text-indigo-700 font-bold text-[10px] shrink-0 w-20 leading-snug">{e.time}</span>
                  <div className="min-w-0">
                    <p className="text-slate-800 font-semibold text-xs leading-snug truncate">{e.subject}</p>
                    {(e.teacher || e.room) && (
                      <p className="text-slate-500 text-[10px] truncate mt-0.5">
                        {e.teacher} {e.teacher && e.room && '•'} {e.room}
                      </p>
                    )}
                  </div>
                </div>
               )
            ))}
            {timetable.days[day].length === 0 && !isEditing && (
              <p className="text-xs text-slate-400 italic">No classes scheduled.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const UploadPage = () => {
  const { addTimetable } = useTimetable();
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [step, setStep] = useState('idle'); 
  const [progress, setProgress] = useState(0);
  const [parsedList, setParsedList] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.type === 'application/pdf') {
       setFile(f);
    } else {
       toast.error('Please upload a PDF file');
    }
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const handleParse = async () => {
    if (!file) return;
    setStep('uploading');
    setProgress(0);

    try {
      const interval = setInterval(() => setProgress(p => Math.min(p + 15, 85)), 300);

      let dataList;
      try {
        dataList = await parseTimetableFromPDF(file);
        if (dataList.length === 0) throw new Error('Empty result');
      } catch (err) {
        console.warn('Parsing failed, using fallback:', err);
        dataList = [
          { ...generateFallbackData('Computer Science', 'BSIT', '1st', 'Morning', 'A'), id: 'demo1', filename: file.name }
        ];
        toast('PDF parsing used fallback demo data. (Extraction failed)', { icon: 'ℹ️' });
      }

      clearInterval(interval);
      setProgress(100);
      setParsedList(dataList);
      setStep('parsed');
    } catch (err) {
      setStep('error');
      toast.error('Failed to process PDF');
    }
  };

  const handleUpdate = (id, updatedTimetable) => {
    setParsedList(list => list.map(t => t.id === id ? updatedTimetable : t));
  };

  const handleSaveSingle = (timetable) => {
    if (!timetable.department || !timetable.semester || !timetable.shift || !timetable.section) {
      toast.error('Please select Department, Semester, Section, and Shift');
      return;
    }
    
    addTimetable({
      ...timetable,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      filename: file.name,
      uploadedAt: new Date().toISOString(),
    });

    toast.success(`Saved ${timetable.department} ${timetable.semester} Sec-${timetable.section}!`);
    
    setParsedList(list => list.filter(t => t.id !== timetable.id));
    
    if (parsedList.length === 1) { 
      reset();
    }
  };

  const handleSaveAll = () => {
    const invalid = parsedList.find(t => !t.department || !t.semester || !t.shift || !t.section);
    if (invalid) {
      toast.error('Please ensure all timetables have Department, Semester, Section, and Shift selected before saving all.');
      return;
    }

    parsedList.forEach(timetable => {
      addTimetable({
        ...timetable,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        filename: file.name,
        uploadedAt: new Date().toISOString(),
      });
    });
    
    toast.success(`Successfully saved ${parsedList.length} timetables!`);
    reset();
  };

  const reset = () => {
    setFile(null);
    setStep('idle');
    setParsedList([]);
    setProgress(0);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-slate-800">Upload Timetable PDF</h1>
        <p className="text-slate-500 text-sm mt-1">Upload a PDF containing one or more timetables. The system will automatically extract it, and you can edit or correct records before saving.</p>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors mb-6 ${
          file ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50'
        }`}
      >
        {file ? (
          <div>
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FileText size={24} className="text-indigo-600" />
            </div>
            <p className="font-semibold text-slate-800 text-sm">{file.name}</p>
            <p className="text-slate-400 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            <button onClick={reset} className="text-xs text-red-500 hover:underline mt-2 flex items-center gap-1 mx-auto">
              <X size={12} /> Remove file
            </button>
          </div>
        ) : (
          <div>
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Upload size={24} className="text-slate-400" />
            </div>
            <p className="font-semibold text-slate-600 text-sm">Drag & drop PDF here</p>
            <p className="text-slate-400 text-xs mt-1 mb-4">or click to browse</p>
            <button
              onClick={() => fileRef.current?.click()}
              className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Choose File
            </button>
          </div>
        )}
        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} />
      </div>

      {file && step === 'idle' && (
        <button
          onClick={handleParse}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mb-6"
        >
          <Upload size={16} />
          Parse & Extract Timetable Data
        </button>
      )}

      {step === 'uploading' && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Loader size={16} className="text-indigo-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-700">Analyzing layout & extracting grid data...</p>
            <span className="ml-auto text-xs text-slate-400">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {step === 'parsed' && parsedList.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-4">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-indigo-600" />
              <div>
                <p className="font-bold text-indigo-900">Extracted {parsedList.length} timetable{parsedList.length > 1 ? 's' : ''}!</p>
                <p className="text-xs text-indigo-700 mt-0.5">Please review the details. Click <span className="font-bold">Edit Classes</span> if the parser missed anything!</p>
              </div>
            </div>
            
            <button
              onClick={handleSaveAll}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-colors shrink-0"
            >
              <Database size={16} /> Save Final Timetables
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {parsedList.map((timetable) => (
              <EditableTimetableCard 
                key={timetable.id} 
                timetable={timetable} 
                onUpdate={(updated) => handleUpdate(timetable.id, updated)} 
                onSave={handleSaveSingle} 
              />
            ))}
          </div>
          
           <div className="flex justify-end border-t border-slate-100 pt-6 mt-4">
              <button onClick={reset} className="text-slate-500 font-semibold hover:text-slate-800 transition-colors mr-6">
                Cancel / Clear
              </button>
           </div>
        </div>
      )}

      {step === 'error' && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={18} className="text-red-600" />
          <p className="text-sm font-semibold text-red-700">Failed to process PDF. Make sure it contains text and not just scanned images.</p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
