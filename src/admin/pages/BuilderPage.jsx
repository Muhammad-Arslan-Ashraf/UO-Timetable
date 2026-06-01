import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, AlertTriangle, Save, PlusCircle, Copy, Download, ArrowRight, ArrowLeft, Settings } from 'lucide-react';
import { useTimetable } from '../../context/TimetableContext';
import { DEPARTMENTS, PROGRAMS, SEMESTERS, SHIFTS, SECTIONS, DAY_ORDER } from '../../data/sampleData';
import { detectClash } from '../../utils/clashDetector';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

const Select = ({ value, onChange, options, label }) => (
  <div className="flex bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex-1 min-w-[120px]">
    <div className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold px-2 py-2 border-r border-slate-200 flex items-center shrink-0">
      {label}
    </div>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="px-2 py-2 text-xs font-semibold text-slate-800 focus:outline-none bg-transparent flex-1"
      title={label}
    >
      <option value="">...</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const TimetableGrid = ({ builder, onUpdate, allTimetables, onDelete, onDuplicate }) => {
  const [editingCell, setEditingCell] = useState(null); // {day, time}
  const gridRef = useRef(null);

  const handleMeta = (field, val) => {
    onUpdate({ ...builder, meta: { ...builder.meta, [field]: val } });
  };

  const addTimeSlot = () => {
    const time = window.prompt("Enter new time slot (e.g., 2:00-3:30)");
    if (!time) return;
    if (builder.timeSlots.includes(time)) {
      toast.error('Time slot already exists in this grid');
      return;
    }
    const newSlots = [...builder.timeSlots, time];
    onUpdate({ ...builder, timeSlots: newSlots });
  };

  const removeTimeSlot = (timeToRemove) => {
    if (!window.confirm(`Remove column ${timeToRemove}?`)) return;
    const newSlots = builder.timeSlots.filter(t => t !== timeToRemove);
    const newGrid = { ...builder.grid };
    DAY_ORDER.forEach(d => {
       if (newGrid[d] && newGrid[d][timeToRemove]) {
          delete newGrid[d][timeToRemove];
       }
    });
    onUpdate({ ...builder, timeSlots: newSlots, grid: newGrid });
  };

  const updateCell = (day, time, field, val) => {
    const newGrid = { ...builder.grid };
    if (!newGrid[day]) newGrid[day] = {};
    if (!newGrid[day][time]) newGrid[day][time] = { subject: '', teacher: '', room: '', span: 1 };
    newGrid[day][time][field] = val;
    onUpdate({ ...builder, grid: newGrid });
  };

  const adjustSpan = (day, time, delta) => {
    const newGrid = { ...builder.grid };
    if (!newGrid[day]) newGrid[day] = {};
    if (!newGrid[day][time]) return;
    const currentSpan = newGrid[day][time].span || 1;
    const newSpan = Math.max(1, currentSpan + delta);
    newGrid[day][time].span = newSpan;
    onUpdate({ ...builder, grid: newGrid });
  };

  const clearCell = (day, time) => {
    if (!window.confirm('Delete this class?')) return;
    const newGrid = { ...builder.grid };
    if (newGrid[day]) delete newGrid[day][time];
    onUpdate({ ...builder, grid: newGrid });
    setEditingCell(null);
  };

  // Drag and drop mechanics
  const handleDragStart = (e, day, time) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ day, time, sourceId: builder.id }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, targetDay, targetTime) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.sourceId !== builder.id) {
         toast.error("Can only drag within the same timetable grid for now.");
         return;
      }
      
      const sourceDay = data.day;
      const sourceTime = data.time;
      
      if (sourceDay === targetDay && sourceTime === targetTime) return;

      const newGrid = { ...builder.grid };
      const draggedData = { ...(newGrid[sourceDay]?.[sourceTime] || {}) };
      
      // Remove from source
      if (newGrid[sourceDay]) delete newGrid[sourceDay][sourceTime];
      
      // Place in target
      if (!newGrid[targetDay]) newGrid[targetDay] = {};
      newGrid[targetDay][targetTime] = draggedData;

      onUpdate({ ...builder, grid: newGrid });
    } catch(err) {
      console.error(err);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 overflow-hidden flex flex-col">
      {/* Header Bar */}
      <div className="bg-indigo-900 border-b border-indigo-800 p-4 flex flex-col gap-3">
        {/* Row 1: Timetable Metadata */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <Select label="Dept" value={builder.meta.department} onChange={v => handleMeta('department', v)} options={DEPARTMENTS} />
          <Select label="Prog" value={builder.meta.program} onChange={v => handleMeta('program', v)} options={PROGRAMS} />
          <Select label="Sem" value={builder.meta.semester} onChange={v => handleMeta('semester', v)} options={SEMESTERS} />
          <Select label="Sec" value={builder.meta.section} onChange={v => handleMeta('section', v)} options={SECTIONS} />
          <Select label="Shift" value={builder.meta.shift} onChange={v => handleMeta('shift', v)} options={SHIFTS} />
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={onDuplicate} className="text-indigo-200 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors">
              <Copy size={13} /> Dup Grid
            </button>
            <button onClick={onDelete} className="text-red-300 hover:text-red-100 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors">
              <Trash2 size={13} /> Remove
            </button>
          </div>
        </div>
        {/* Row 2: University Header Controls */}
        <div className="flex flex-wrap items-center gap-2 border-t border-indigo-800 pt-3">
          <span className="text-indigo-300 text-[10px] font-bold uppercase tracking-wider shrink-0">Header:</span>
          <Select label="Season" value={builder.meta.season || 'Fall'} onChange={v => handleMeta('season', v)} options={['Fall', 'Spring', 'Summer']} />
          <div className="flex bg-slate-50 border border-slate-200 rounded-lg overflow-hidden min-w-[110px]">
            <div className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold px-2 py-2 border-r border-slate-200 flex items-center shrink-0">Year</div>
            <input
              type="number"
              min="2000" max="2099"
              value={builder.meta.year || new Date().getFullYear()}
              onChange={e => handleMeta('year', e.target.value)}
              className="flex-1 px-2 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none bg-white w-16"
            />
          </div>
          <div className="flex bg-slate-50 border border-slate-200 rounded-lg overflow-hidden min-w-[200px]">
            <div className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold px-2 py-2 border-r border-slate-200 flex items-center shrink-0">W.E.F</div>
            <input
              type="text"
              placeholder="e.g. 11th November, 2024"
              value={builder.meta.wef || ''}
              onChange={e => handleMeta('wef', e.target.value)}
              className="flex-1 px-2 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none bg-white"
            />
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="p-4 overflow-x-auto custom-scrollbar timetable-grid-export bg-white" ref={gridRef}>
        {/* Formal University Letterhead */}
        <div className="mb-5 text-center border-b-2 border-slate-800 pb-4">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">University of Okara</p>
          <h2 className="font-heading text-xl font-extrabold uppercase tracking-wider text-slate-900">
            Department of {builder.meta.department || 'Computer Science'}
          </h2>
          <p className="text-sm font-bold text-slate-700 mt-1">
            TIME TABLE {(builder.meta.season || 'Fall').toUpperCase()} {builder.meta.year || new Date().getFullYear()}
            {builder.meta.wef ? ` W.E.F ${builder.meta.wef}` : ''}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {builder.meta.program || 'PROGRAM'} &bull; {builder.meta.semester || 'X'} Semester &bull; {builder.meta.shift || 'Morning'} Shift &bull; Section {builder.meta.section || 'A'}
          </p>
        </div>
        <table className="w-full min-w-max border-collapse table-fixed">
          <thead>
            <tr>
              <th className="bg-slate-50 border border-slate-200 w-24 p-3 text-left">
                <span className="text-xs font-bold text-slate-500 uppercase">Day \ Time</span>
              </th>
              {builder.timeSlots.map(time => (
                <th key={time} className="bg-slate-50 border border-slate-200 p-2 align-top text-center relative group min-w-[200px]">
                  <span className="font-mono text-indigo-700 font-bold block mb-1">{time}</span>
                  <button onClick={() => removeTimeSlot(time)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <XIcon />
                  </button>
                </th>
              ))}
              <th className="add-col-th bg-slate-50 border border-slate-200 p-2 w-32 border-l-2 border-l-slate-300 border-dashed">
                <button onClick={addTimeSlot} className="flex items-center justify-center gap-1 w-full text-indigo-600 hover:text-indigo-800 text-xs font-bold py-2 hover:bg-indigo-50 rounded transition-colors">
                  <Plus size={14} /> Add Col
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {DAY_ORDER.map(day => {
              const skip = new Set();
              
              const dayCells = builder.timeSlots.map((time, index) => {
                if (skip.has(time)) return null;

                const cellData = builder.grid[day]?.[time];
                const span = cellData?.span || 1;
                let actualSpan = 1;
                
                for (let i = 1; i < span; i++) {
                  if (index + i < builder.timeSlots.length) {
                    skip.add(builder.timeSlots[index + i]);
                    actualSpan++;
                  }
                }

                const isEditing = editingCell?.day === day && editingCell?.time === time;
                const hasData = cellData?.subject || cellData?.teacher || cellData?.room;
                const clashes = hasData ? detectClash(allTimetables, day, time, cellData.teacher, cellData.room, builder.id) : [];

                return (
                  <td 
                    key={time} 
                    colSpan={actualSpan}
                    className={`border border-slate-200 p-2 align-top h-28 transition-colors ${
                      !hasData ? 'hover:bg-slate-50' : ''
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day, time)}
                  >
                    <div className="relative w-full h-full flex flex-col justify-between">
                      {isEditing ? (
                        <div className={`bg-white border-2 border-indigo-400 p-3 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] absolute top-0 z-30 flex flex-col gap-1.5 w-64 ${
                          index >= builder.timeSlots.length - 1 ? 'right-0' : 'left-0'
                        }`}>
                          <input autoFocus type="text" placeholder="Subject / LAB" value={cellData?.subject || ''} onChange={e => updateCell(day, time, 'subject', e.target.value)} className="w-full text-xs font-semibold border-b border-slate-200 pb-1 focus:outline-none focus:border-indigo-500" />
                          <input type="text" placeholder="Teacher" value={cellData?.teacher || ''} onChange={e => updateCell(day, time, 'teacher', e.target.value)} className="w-full text-[10px] border-b border-slate-200 pb-1 focus:outline-none focus:border-indigo-500" />
                          <input type="text" placeholder="Room" value={cellData?.room || ''} onChange={e => updateCell(day, time, 'room', e.target.value)} className="w-full text-[10px] border-b border-slate-200 pb-1 focus:outline-none focus:border-indigo-500" />
                          
                          {/* Span Controls */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Merge Cols:</span>
                            <div className="flex items-center gap-1 bg-slate-100 rounded p-0.5">
                              <button onClick={() => adjustSpan(day, time, -1)} className="p-1 hover:bg-slate-200 rounded text-slate-600"><ArrowLeft size={10} /></button>
                              <span className="text-[10px] w-4 text-center font-bold">{span}</span>
                              <button onClick={() => adjustSpan(day, time, 1)} className="p-1 hover:bg-slate-200 rounded text-slate-600"><ArrowRight size={10} /></button>
                            </div>
                          </div>

                          <div className="flex gap-1 mt-auto shrink-0 pt-2">
                            <button onClick={() => setEditingCell(null)} className="flex-1 bg-indigo-600 text-white text-[10px] font-bold py-1.5 rounded hover:bg-indigo-700">Done</button>
                            <button onClick={() => clearCell(day, time)} className="bg-red-100 text-red-600 px-3 rounded hover:bg-red-200" title="Delete Content"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      ) : hasData ? (
                        <div 
                          draggable 
                          onDragStart={(e) => handleDragStart(e, day, time)}
                          className="group cursor-move h-full bg-white hover:bg-indigo-50/30 border border-slate-200 hover:border-indigo-300 rounded-lg p-2.5 flex flex-col shadow-sm transition-all text-center relative"
                        >
                           <button onClick={() => setEditingCell({day, time})} className="absolute top-1 right-1 text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded-md shadow-sm">
                             <Settings size={12} />
                           </button>
                           <p className="font-semibold text-slate-800 text-xs leading-snug mb-2 mt-1">{cellData.subject}</p>
                           <p className="text-slate-500 text-[10px] mt-auto font-medium">
                              {cellData.teacher} <br/> <strong className="text-slate-600">{cellData.room}</strong>
                           </p>
                           {clashes.length > 0 && (
                             <div className="mt-2 pt-1 border-t border-red-100">
                               {clashes.map((err, errIdx) => (
                                 <p key={errIdx} className="text-[9px] text-red-600 font-bold flex items-center justify-center gap-1 leading-tight mb-0.5">
                                   <AlertTriangle size={10} className="shrink-0" /> {err}
                                 </p>
                               ))}
                             </div>
                           )}
                        </div>
                      ) : (
                        <div 
                          className="h-full border-2 border-transparent hover:border-slate-300 border-dashed rounded-lg flex items-center justify-center cursor-pointer text-slate-300 hover:text-slate-500 transition-colors"
                          onClick={() => setEditingCell({day, time})}
                        >
                          <PlusCircle size={20} />
                        </div>
                      )}
                    </div>
                  </td>
                );
              });

              return (
                <tr key={day}>
                  <td className="bg-slate-50 border border-slate-200 p-3 text-sm font-bold text-slate-700 sticky left-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                    {day}
                  </td>
                  {dayCells}
                  <td className="add-col-th bg-slate-50 border border-slate-200 border-l-2 border-l-slate-300 border-dashed"></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const BuilderPage = () => {
  const { timetables, addTimetable, updateTimetable } = useTimetable();
  const location = useLocation();
  
  const generateBlankBuilder = (prevMeta = null) => ({
    id: `b_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    meta: prevMeta ? { ...prevMeta } : {
      department: DEPARTMENTS[0],
      program: PROGRAMS[1],
      semester: SEMESTERS[0],
      section: SECTIONS[0],
      shift: SHIFTS[0],
      season: 'Fall',
      year: new Date().getFullYear().toString(),
      wef: ''
    },
    timeSlots: ['8:30-10:00', '10:00-11:30', '11:30-1:00'],
    grid: {}
  });

  const [builders, setBuilders] = useState(() => {
    if (location.state?.editIds) return []; // Let useEffect handle it
    return [generateBlankBuilder()];
  });

  useEffect(() => {
    if (location.state?.editIds && timetables.length > 0) {
      const editBuilders = location.state.editIds.map(id => {
        const t = timetables.find(x => x.id === id);
        if (!t) return null;
        
        const timeSlotsSet = new Set();
        const grid = {};
        
        DAY_ORDER.forEach(day => {
          grid[day] = {};
          const dayClasses = t.days[day] || [];
          dayClasses.forEach(cls => {
            timeSlotsSet.add(cls.time);
            grid[day][cls.time] = {
              subject: cls.subject,
              teacher: cls.teacher,
              room: cls.room,
              span: 1
            };
          });
        });
        
        let timeSlots = Array.from(timeSlotsSet);
        if (timeSlots.length === 0) {
          timeSlots = ['8:30-10:00', '10:00-11:30', '11:30-1:00'];
        }
        
        return {
          id: t.id,
          meta: {
            department: t.department || DEPARTMENTS[0],
            program: t.program || PROGRAMS[0],
            semester: t.semester || SEMESTERS[0],
            section: t.section || SECTIONS[0],
            shift: t.shift || SHIFTS[0],
            season: t.season || 'Fall',
            year: t.year || new Date().getFullYear().toString(),
            wef: t.wef || ''
          },
          timeSlots,
          grid
        };
      }).filter(Boolean);

      if (editBuilders.length > 0) {
        setBuilders(editBuilders);
      } else {
        setBuilders([generateBlankBuilder()]);
      }
    } else if (builders.length === 0) {
      setBuilders([generateBlankBuilder()]);
    }
  }, [location.state, timetables]);

  const handleUpdate = (id, newBuilder) => {
    setBuilders(prev => prev.map(b => b.id === id ? newBuilder : b));
  };

  const handleRemove = (id) => {
    if (window.confirm("Remove this completely?")) {
      setBuilders(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleDuplicate = (id) => {
    const toCopy = builders.find(b => b.id === id);
    if (!toCopy) return;
    
    const newBuilder = JSON.parse(JSON.stringify(toCopy));
    newBuilder.id = `b_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    setBuilders(prev => [...prev, newBuilder]);
  };

  const handleCreateNew = () => {
    const lastBuilder = builders[builders.length - 1];
    setBuilders(prev => [...prev, generateBlankBuilder(lastBuilder?.meta)]);
  };

  const handleSaveAllToDatabase = () => {
    let savedCount = 0;
    
    for (const b of builders) {
      if (!b.meta.department || !b.meta.program || !b.meta.semester || !b.meta.shift) {
        toast.error(`Please fill all metadata dropdowns for ${b.meta.program || 'Grid'}! (Section is optional)`);
        return;
      }
      
      const flatDays = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [], };
      let hasClass = false;
      
      DAY_ORDER.forEach(day => {
        b.timeSlots.forEach(time => {
           const cell = b.grid[day]?.[time];
           if (cell && (cell.subject || cell.teacher || cell.room)) {
              hasClass = true;
              flatDays[day].push({ time, ...cell }); 
           }
        });
      });

      if (!hasClass) {
        toast.error(`Grid for Section ${b.meta.section} is totally empty!`);
        return;
      }

      const exists = timetables.some(t => t.id === b.id);
      const newTimetable = {
        id: exists ? b.id : `t_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        ...b.meta,
        days: flatDays,
        filename: exists ? (timetables.find(t => t.id === b.id)?.filename || 'Built Manually') : 'Built Manually',
        uploadedAt: new Date().toISOString()
      };

      if (exists) {
        updateTimetable(b.id, newTimetable);
      } else {
        addTimetable(newTimetable);
      }
      savedCount++;
    }

    toast.success(`Successfully committed ${savedCount} timetable(s) to the server!`);
    setBuilders([generateBlankBuilder(builders[builders.length - 1]?.meta)]);
  };

  const handleClearAll = () => {
    if (window.confirm('Clear ALL workspaces and start from scratch? This cannot be undone.')) {
      setBuilders([generateBlankBuilder()]);
      toast.success('Workspace cleared. Starting fresh!');
    }
  };

  const downloadAllPDF = async () => {
    const grids = document.querySelectorAll('.timetable-grid-export');
    if (grids.length === 0) {
      toast.error('No grids to download');
      return;
    }
    
    const loadId = toast.loading(`Generating HD PDF for ${grids.length} grids...`);
    try {
      const pdf = new jsPDF('l', 'mm', 'a4');
      
      // Use opacity to hide elements without breaking table layout structure
      const buttons = document.querySelectorAll('.timetable-grid-export button');
      const addCols = document.querySelectorAll('.timetable-grid-export .add-col-th');
      buttons.forEach(b => b.style.opacity = '0');
      addCols.forEach(b => b.style.opacity = '0');

      for (let i = 0; i < grids.length; i++) {
        const grid = grids[i];
        
        // Temporarily unset overflow to capture full width
        const originalOverflow = grid.style.overflowX;
        grid.style.overflowX = 'visible';
        
        await new Promise(r => setTimeout(r, 100)); // allow DOM to settle

        const imgData = await htmlToImage.toJpeg(grid, { 
          backgroundColor: '#ffffff',
          quality: 0.85,
          pixelRatio: 2
        });
        
        grid.style.overflowX = originalOverflow;

        const img = new Image();
        img.src = imgData;
        await new Promise(r => { img.onload = r; });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (img.height * pdfWidth) / img.width;
        
        if (i > 0) pdf.addPage();
        
        if (pdfHeight > pdf.internal.pageSize.getHeight()) {
           pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdf.internal.pageSize.getHeight(), undefined, 'FAST');
        } else {
           pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        }
      }

      // Restore UI elements
      buttons.forEach(b => b.style.opacity = '');
      addCols.forEach(b => b.style.opacity = '');

      pdf.save(`All_Timetables_Export_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Successfully downloaded PDF!', { id: loadId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF.', { id: loadId });
      const buttons = document.querySelectorAll('.timetable-grid-export button');
      const addCols = document.querySelectorAll('.timetable-grid-export .add-col-th');
      buttons.forEach(b => b.style.opacity = '');
      addCols.forEach(b => b.style.opacity = '');
    }
  };

  // Convert live builders to standard format for real-time cross-grid clash detection
  const activeTimetables = builders.map(b => {
    const flatDays = {};
    DAY_ORDER.forEach(day => {
      flatDays[day] = [];
      b.timeSlots.forEach(time => {
         const cell = b.grid[day]?.[time];
         if (cell && (cell.subject || cell.teacher || cell.room)) {
            flatDays[day].push({ time, ...cell }); 
         }
      });
    });
    return {
      id: b.id,
      ...b.meta,
      days: flatDays
    };
  });

  const combinedTimetables = [...timetables, ...activeTimetables];

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-800">Visual Grid Builder</h1>
          <p className="text-slate-500 text-sm mt-1">Easily configure complex timetables with cell-merging and drag-and-drop.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={downloadAllPDF}
            className="bg-white border border-green-200 text-green-700 hover:bg-green-50 font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Download size={16} /> Download All as PDF
          </button>
          <button
            onClick={handleCreateNew}
            className="bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Grid Workspace
          </button>
          <button
            onClick={handleSaveAllToDatabase}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Save size={16} /> Commit All to Live Server
          </button>
          <button
            onClick={handleClearAll}
            className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={16} /> Clear All
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-8 custom-scrollbar">
        {builders.map(b => (
          <TimetableGrid 
            key={b.id} 
            builder={b} 
            onUpdate={(u) => handleUpdate(b.id, u)} 
            onDelete={() => handleRemove(b.id)}
            onDuplicate={() => handleDuplicate(b.id)}
            allTimetables={combinedTimetables}
          />
        ))}

        {builders.length === 0 && (
          <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
            <button onClick={handleCreateNew} className="bg-indigo-600 text-white font-bold rounded-lg px-6 py-3">Start Building</button>
          </div>
        )}
      </div>

    </div>
  );
};

export default BuilderPage;
