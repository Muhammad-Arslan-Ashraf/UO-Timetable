import * as pdfjsLib from 'pdfjs-dist';
import { DEPARTMENTS, PROGRAMS, SEMESTERS, SHIFTS, SECTIONS } from '../data/sampleData';

// Configure the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const detectDepartment = (text) => {
  const normalizedText = text.toUpperCase().replace(/\s+/g, '');
  for (const dept of DEPARTMENTS) {
    if (normalizedText.includes(dept.toUpperCase().replace(/\s+/g, ''))) return dept;
  }
  return 'General';
};

const detectProgram = (text) => {
  const normalizedText = text.toUpperCase().replace(/\s+/g, '');
  if (normalizedText.includes('MSCCS')) return 'MSCS';
  
  for (const prog of PROGRAMS) {
    if (normalizedText.includes(prog)) return prog;
  }
  return 'General';
};

const detectSemester = (text) => {
  for (const sem of SEMESTERS) {
    if (text.includes(sem)) return sem;
  }
  const m = text.match(/(\d+)(st|nd|rd|th)\s+Semester/i);
  if (m) return m[1] + m[2];
  return '1st';
};

const detectSection = (text) => {
  // Try to match specific sections A+B, C+D, A, B, C etc. Wait, we should look for "Section A" or just standalone ' A ' after the program name
  // Since Okara often writes "BSCS A" or "M.Sc IT A+B"
  let uText = text.toUpperCase();
  if (uText.includes('A+B')) return 'A+B';
  if (uText.includes('C+D')) return 'C+D';
  if (/\bSECTION\s+A\b/.test(uText) || /\bBSCS\s+A\b/.test(uText) || /\bBSIT\s+A\b/.test(uText)) return 'A';
  if (/\bSECTION\s+B\b/.test(uText) || /\bBSCS\s+B\b/.test(uText) || /\bBSIT\s+B\b/.test(uText)) return 'B';
  if (/\bSECTION\s+C\b/.test(uText) || /\bBSCS\s+C\b/.test(uText) || /\bBSIT\s+C\b/.test(uText)) return 'C';
  
  return 'A'; // Fallback
};

const detectShift = (text) => {
  if (/evening/i.test(text)) return 'Evening';
  if (/morning/i.test(text)) return 'Morning';
  return 'Morning';
};

export const parseTimetableFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const timetables = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items.filter(item => item.str.trim() !== '');

    if (items.length === 0) continue;

    let rows = [];
    items.forEach(item => {
      const x = item.transform[4];
      const y = item.transform[5];
      let row = rows.find(r => Math.abs(r.y - y) <= 4); 
      if (!row) {
        row = { y, items: [] };
        rows.push(row);
      }
      row.items.push({ x, y, str: item.str.trim() });
    });

    // Sort rows top-to-bottom
    rows.sort((a, b) => b.y - a.y);
    rows.forEach(r => r.items.sort((a, b) => a.x - b.x));

    const timeRegex = /\d{1,2}:\d{2}\s*[-–—]\s*\d{1,2}:\d{2}/;
    
    // Group into Time Blocks to support multiple timetables per page
    const blocks = [];
    let currentBlock = null;

    rows.forEach((row, rowIndex) => {
      let timeItems = row.items.filter(i => timeRegex.test(i.str));
      if (timeItems.length >= 2) { 
        let columns = timeItems.map(i => {
           const match = i.str.match(/\d{1,2}:\d{2}\s*[-–—]\s*\d{1,2}:\d{2}/);
           return { 
             x: i.x, 
             timeSlot: match ? match[0].replace(/\s/g, '').replace(/[–—]/g, '-') : i.str 
           };
        });
        
        columns.sort((a, b) => a.x - b.x);

        currentBlock = {
          timeRowIndex: rowIndex,
          columns: columns,
          rows: [],
          headerRows: rows.slice(Math.max(0, rowIndex - 10), rowIndex)
        };
        blocks.push(currentBlock);
      } else if (currentBlock) {
        currentBlock.rows.push(row);
      }
    });

    if (blocks.length === 0) {
      console.warn(`No timetable time header found on page ${pageNum}`);
      continue;
    }

    blocks.forEach((block, blockIndex) => {
      const headerText = block.headerRows.map(r => r.items.map(i => i.str).join(' ')).join('\n');
      const searchContext = headerText + ' ' + file.name;

      const department = detectDepartment(searchContext);
      const program = detectProgram(searchContext);
      const semester = detectSemester(searchContext);
      const section = detectSection(searchContext);
      const shift = detectShift(searchContext);

      const daysSchedule = {
        Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
      };
      
      // Step A: Find all Day Row Y-Coordinates natively
      let dayBands = [];
      block.rows.forEach(row => {
         let dayItem = row.items.find(item => DAYS.some(d => item.str.includes(d)) && item.x < block.columns[0].x + 60);
         if (dayItem) {
            dayBands.push({
               day: DAYS.find(d => dayItem.str.includes(d)),
               y: dayItem.y
            });
         }
      });

      // Sort daybands top to bottom and merge duplicates
      dayBands.sort((a, b) => b.y - a.y);
      let mergedBands = [];
      dayBands.forEach(b => {
         if (mergedBands.length === 0 || Math.abs(mergedBands[mergedBands.length-1].y - b.y) > 20) {
            mergedBands.push(b);
         }
      });

      if (mergedBands.length === 0) return; // Malformed block
      
      // Calculate strict mathematical Y boundaries for each day
      for (let r = 0; r < mergedBands.length; r++) {
         mergedBands[r].maxY = r === 0 ? mergedBands[0].y + 150 : (mergedBands[r-1].y + mergedBands[r].y) / 2;
         mergedBands[r].minY = r === mergedBands.length - 1 ? mergedBands[r].y - 150 : (mergedBands[r].y + mergedBands[r+1].y) / 2;
      }

      // Step B: Route VERY single piece of cell text into the perfect 2D grid box!
      block.rows.forEach(row => {
        row.items.forEach(item => {
          // Ignore the Left-Axis day text
          if (DAYS.some(d => item.str.includes(d)) && item.x < block.columns[0].x + 60) return;

          // Which Day does this belong to vertically?
          const band = mergedBands.find(b => item.y <= b.maxY && item.y > b.minY);
          if (!band) return;

          // Which Time slot does this belong to horizontally?
          let matchingCol = block.columns.reduce((prev, curr) => {
             return Math.abs(curr.x - item.x) < Math.abs(prev.x - item.x) ? curr : prev;
          });
          
          if (Math.abs(matchingCol.x - item.x) > 250) return; // Only discard if way off the page

          let entry = daysSchedule[band.day].find(e => e.time === matchingCol.timeSlot);
          if (!entry) {
            entry = { time: matchingCol.timeSlot, items: [] };
            daysSchedule[band.day].push(entry);
          }
          entry.items.push(item);
        });
      });

      // Step C: Compile each cell's text sequentially from top to bottom
      const finalDays = {};
      Object.keys(daysSchedule).forEach(day => {
        finalDays[day] = [];
        daysSchedule[day].forEach(cell => {
          // Sort items inside the cell physically top-to-bottom so subjects are separated from rooms properly!
          cell.items.sort((a, b) => b.y - a.y);
          
          let subject = '';
          let teacher = '';
          let room = '';
          
          cell.items.forEach(item => {
            const lineStr = item.str;
            const lower = lineStr.toLowerCase();
            
            if (/(dr\.|mr\.|ms\.|prof\.|sir|mrs\.|rana |usman |inaam |hafiz |engr\.|muhammad |syed )/i.test(lineStr)) {
              teacher = (teacher ? teacher + ' ' : '') + lineStr;
            } 
            else if (/(lab|room|hall|lec|#|cr|class)/i.test(lineStr) && !lower.includes('engineering') && !lower.includes('analysis') && !lower.includes('management') && !lower.includes('practices')) {
              room = (room ? room + ' ' : '') + lineStr;
            } 
            else {
              subject = (subject ? subject + ' ' : '') + lineStr;
            }
          });

          if (subject || room || teacher) {
             finalDays[day].push({ 
               time: cell.time, 
               subject: subject.trim(), 
               teacher: teacher.trim(), 
               room: room.trim() 
             });
          }
        });
      });

      timetables.push({
        id: `t_${Date.now()}_p${pageNum}_b${blockIndex}`,
        department,
        program,
        semester,
        section,
        shift,
        days: finalDays
      });
    });
  }

  return timetables;
};

export const generateFallbackData = (department, program, semester, shift, section = 'A') => ({
  department,
  program,
  semester,
  section,
  shift,
  days: {
    Monday: [
      { time: '8:30-10:00', subject: 'Data Structures', teacher: 'Dr. Ahmed Reza', room: 'Room #101' },
      { time: '10:00-11:30', subject: 'Database Systems', teacher: 'Ms. Fatima Malik', room: 'LAB 2' },
    ]
  },
});
