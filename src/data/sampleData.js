
export const SAMPLE_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Mid-Term Examinations Schedule',
    description: 'Mid-term examinations for all departments will commence from November 15, 2024.',
    date: '2024-11-01',
    createdAt: new Date().toISOString(),
  },
];

export const DEPARTMENT_PROGRAMS = {

  // ── Undergraduate Programs (BS) ──────────────────────────────────────

  // Faculty of Sciences
  'Chemistry': ['BS Chemistry (Morning)', 'BS Chemistry (Self-Support)'],
  'Applied Chemistry': ['BS Applied Chemistry (Morning)', 'BS Applied Chemistry (Self-Support)'],
  'Mathematics': ['BS Mathematics (Morning)', 'BS Mathematics (Self-Support)'],
  'Physics': ['BS Physics (Morning)', 'BS Physics (Self-Support)'],
  'Computational Physics': ['BS Computational Physics (Morning)', 'BS Computational Physics (Self-Support)'],
  'Statistics': ['BS Statistics (Morning)', 'BS Statistics (Self-Support)'],
  'Botany': ['BS Botany (Morning)', 'BS Botany (Self-Support)'],
  'Zoology': ['BS Zoology (Morning)', 'BS Zoology (Self-Support)'],

  // Faculty of Life Sciences
  'Biology': ['BS Biology (Morning)', 'BS Biology (Self-Support)'],
  'Wildlife & Ecology': ['BS Wildlife & Ecology (Morning)', 'BS Wildlife & Ecology (Self-Support)'],
  'Forestry & Agriculture': ['BS Forestry & Agriculture (Morning)', 'BS Forestry & Agriculture (Self-Support)'],
  'Fisheries & Aquaculture': ['BS Fisheries & Aquaculture (Morning)', 'BS Fisheries & Aquaculture (Self-Support)'],
  'Biochemistry': ['BS Biochemistry (Morning)', 'BS Biochemistry (Self-Support)'],
  'Biotechnology': ['BS Biotechnology (Morning)', 'BS Biotechnology (Self-Support)'],
  'Microbiology': ['BS Microbiology (Morning)', 'BS Microbiology (Self-Support)'],
  'Molecular Genetics': ['BS Molecular Genetics (Morning)', 'BS Molecular Genetics (Self-Support)'],
  'Bioinformatics': ['BS Bioinformatics (Morning)', 'BS Bioinformatics (Self-Support)'],
  'Environmental Sciences': ['BS Environmental Sciences (Morning)', 'BS Environmental Sciences (Self-Support)'],

  // Faculty of Arts & Social Sciences
  'Fine Arts': ['BFA Painting (Morning)', 'BFA Graphic Design (Morning)', 'BFA Aptitude Test for Painting (Self-Support)'],
  'Management Sciences': ['BS Public Administration (Morning)', 'BS Public Administration (Self-Support)'],
  'Commerce': ['BS Commerce (Morning)', 'BS Commerce (Self-Support)', 'BS Commerce (Morning, Self-Support)'],
  'Tourism & Hospitality Management': ['BS Tourism & Hospitality Management (Morning)', 'BS Tourism & Hospitality Management (Self-Support)'],
  'Economics': ['BS Economics (Morning)', 'BS Economics (Self-Support)'],
  'Law': ['LLB (5 Years) (Morning)', 'LLB Eligibility: FA/I.A. 24 Hour Right (Morning, Self-Support)'],
  'Political Science': ['BS Political Science (Morning)', 'BS Political Science (Self-Support)'],
  'International Relations': ['BS International Relations (Morning)', 'BS International Relations (Self-Support)'],

  // Faculty of Languages
  'English Language & Learning': ['BA English (Morning)', 'BA English (Self-Support)'],
  'English Linguistics': ['BA English – Literature & Language (Morning)', 'BA English – Literature & Language (Self-Support)'],
  'English Literature': ['BA English Literature (Morning)', 'BA English Literature (Self-Support)'],
  'English Language & Literature': ['BS English (Morning)', 'BS English (Self-Support)'],
  'Sociology': ['BS Sociology (Morning)', 'BS Sociology (Self-Support)'],
  'Mass Communication': ['BS Mass Communication (Morning)', 'BS Mass Communication (Self-Support)'],
  'Social Work': ['BS Social Work (Morning)', 'BS Social Work (Self-Support)'],
  'Library & Information Science': ['BS Library & Information Science (Morning)', 'BS Library & Information Science (Self-Support)'],

  // Faculty of Health Sciences
  'Psychology': ['BS Psychology (Morning)', 'BS Psychology (Self-Support)'],
  'Sport Science & Physical Education': ['BS Sport Science & Physical Education (Morning)', 'BS Sport Science & Physical Education (Self-Support)'],
  'Teacher Education': ['B.Ed. (Hons) (Morning)', 'B.Ed. Revised Program (Morning)', 'B.Ed. Revised Program (Self-Support)'],

  // Faculty of Education
  'Special Education': ['BS Special Education (Morning)', 'BS Special Education (Self-Support)'],
  'Educational Planning & Management': ['BS Educational Planning & Management (Morning)', 'BS Educational Planning & Management (Self-Support)'],
  'Educational Studies': ['BS Education (Morning)', 'BS Education (Self-Support)'],
  'Early Childhood Education': ['BS Early Childhood Education Network Program (Self-Support)'],

  // Faculty of Computing
  'Computer Science': ['BSCS (Morning)', 'BSCS (Self-Support)'],
  'Information Technology': ['BSIT (Morning)', 'BSIT (Self-Support)'],
  'Software Engineering': ['BSSE (Morning)', 'BSSE (Self-Support)'],
  'Remote Sensing': ['BS Remote Sensing (Morning)', 'BS Remote Sensing (Self-Support)'],

  // ── MPhil / MS Programs ──────────────────────────────────────────────

  // Faculty of Sciences (MPhil)
  'MPhil Mathematics': ['MPhil Mathematics (Self-Support)'],
  'MPhil Physics': ['MPhil Physics (Self-Support)'],
  'MPhil Chemistry': ['MPhil Chemistry (Self-Support)'],
  'MPhil Botany': ['MPhil Botany (Morning)', 'MPhil Botany (Self-Support)'],
  'MPhil Biochemistry': ['MPhil Biochemistry (Morning)', 'MPhil Biochemistry (Self-Support)'],
  'MPhil Zoology': ['MPhil Zoology (Morning)', 'MPhil Zoology (Self-Support)'],
  'MPhil Wildlife & Ecology': ['MPhil Wildlife & Ecology (Morning)', 'MPhil Wildlife & Ecology (Self-Support)'],
  'MPhil Fisheries & Aquaculture': ['MPhil Fisheries & Aquaculture (Morning)', 'MPhil Fisheries & Aquaculture (Self-Support)'],
  'MPhil Molecular Biology': ['MPhil Molecular Biology (Morning)', 'MPhil Molecular Biology (Self-Support)'],
  'MPhil Microbiology': ['MPhil Microbiology (Morning)', 'MPhil Microbiology (Self-Support)'],
  'MPhil Biotechnology': ['MPhil Biotechnology (Morning)', 'MPhil Biotechnology (Self-Support)'],
  'MPhil Molecular & Pharmaceutical Genetics': ['MPhil Molecular & Pharmaceutical Genetics (Morning)', 'MPhil Molecular & Pharmaceutical Genetics (Self-Support)'],
  'MPhil Forestry & Aquaculture': ['MPhil Forestry & Aquaculture (Morning)', 'MPhil Forestry & Aquaculture (Self-Support)'],
  'MPhil Wildlife': ['MPhil Wildlife & Ecology (Morning)', 'MPhil Wildlife & Ecology (Self-Support)'],

  // Faculty of Management & Social Sciences (MPhil)
  'MPhil Management Sciences': ['MPhil Management Sciences (Self-Support)'],
  'MPhil Urdu': ['MPhil Urdu (Self-Support)'],
  'MPhil Islamic Studies': ['MPhil Islamic Studies (Morning)', 'MPhil Islamic Studies (Self-Support)'],
  'MPhil Pakistan Studies': ['MPhil Pakistan Studies (Morning)', 'MPhil Pakistan Studies (Self-Support)'],

  // Faculty of Education (MPhil)
  'MPhil Education': ['MPhil Education (Morning)', 'MPhil Education (Self-Support)'],
  'MPhil Educational Research & Assessment': ['MPhil Educational Research & Assessment (Morning)', 'MPhil Educational Research & Assessment (Self-Support)'],

  // Faculty of Computing (MPhil)
  'MPhil Computer Science': ['MPhil Computer Science (Morning)', 'MPhil Computer Science (Self-Support)'],

  // ── PhD Programs ─────────────────────────────────────────────────────

  // Faculty of Sciences (PhD)
  'PhD Chemistry': ['PhD Chemistry'],
  'PhD Physics': ['PhD Physics'],
  'PhD Botany': ['PhD Botany'],
  'PhD Zoology': ['PhD Zoology'],
  'PhD Biochemistry': ['PhD Biochemistry'],
  'PhD Biotechnology': ['PhD Biotechnology'],

  // Faculty of Education (PhD)
  'PhD Education': ['PhD Education'],

  // ── UO City Block Specific Admissions ────────────────────────────────

  'Computational Biology': ['BS Computational Biology (Morning)', 'BS Computational Biology (Self-Support)'],
  'Industrial Biotechnology': ['BS Biotechnology Industrial (Morning)', 'BS Biotechnology Industrial (Self-Support)'],
  'Human Nutrition & Dietetics': ['BS Human Nutrition & Dietetics (Morning)', 'BS Human Nutrition & Dietetics (Self-Support)'],
  'Medical Lab Technology': ['BS Medical Lab Technology (Morning)', 'BS Medical Lab Technology (Self-Support)'],
  'Poultry Science': ['BS Poultry Science (Morning)', 'BS Poultry Science (Self-Support)'],
  'Zoology (City Block)': [
    'BS Zoology (Warning, Self-Support)',
    'BS Zoology – 5th Semester Intake (Morning, Self-Support)',
    'BS Zoology – With Specialization in Wildlife & Ecology (Morning, Self-Support)',
    'BS Zoology – With Specialization in Fisheries & Aquaculture (Morning, Self-Support)'
  ],
  'Wildlife & Ecology (City Block)': ['BS Wildlife & Ecology (Morning)', 'BS Wildlife & Ecology (Self-Support)'],
  'Fisheries & Aquaculture (City Block)': ['BS Fisheries & Aquaculture (Morning)', 'BS Fisheries & Aquaculture (Self-Support)'],

  // ── BS 5th Semester Intake (Replacement of MA/MSc) ───────────────────

  'BS 5th Semester - Mathematics': ['BS Mathematics (Morning)', 'BS Mathematics (Self-Support)'],
  'BS 5th Semester - Statistics': ['BS Statistics (Morning)', 'BS Statistics (Self-Support)'],
  'BS 5th Semester - Chemistry': ['BS Chemistry (Morning)', 'BS Chemistry (Self-Support)'],
  'BS 5th Semester - Computational Physics': ['BS Computational Physics (Morning)', 'BS Computational Physics (Self-Support)'],
  'BS 5th Semester - Botany': ['BS Botany (Morning)', 'BS Botany (Self-Support)'],
  'BS 5th Semester - Zoology': ['BS Zoology (Morning)', 'BS Zoology (Self-Support)'],
  'BS 5th Semester - Biology': ['BS Biology (Morning)', 'BS Biology (Self-Support)'],
  'BS 5th Semester - Ecology': ['BS Ecology (Morning)', 'BS Ecology (Self-Support)'],
  'BS 5th Semester - Microbiology & Molecular Sciences': ['BS Microbiology (Morning)', 'BS Microbiology (Self-Support)'],
  'BS 5th Semester - Environmental Sciences': ['BS Environmental Sciences (Morning)', 'BS Environmental Sciences (Self-Support)'],
  'BS 5th Semester - Applied Chemistry': ['BS Applied Chemistry (Morning)', 'BS Applied Chemistry (Self-Support)'],
  'BS 5th Semester - Urdu': ['BS Urdu (Morning)', 'BS Urdu (Self-Support)'],
  'BS 5th Semester - Urdu (Management)': ['BS Urdu (Morning)', 'BS Urdu (Self-Support)'],
  'BS 5th Semester - Islamic Studies': ['BS Islamic Studies (Morning)', 'BS Islamic Studies (Self-Support)'],
  'BS 5th Semester - Educational Studies': ['BS Education (Morning)', 'BS Education (Self-Support)'],
  'BS 5th Semester - Sport Science & Physical Education': ['BS Sport Science & Physical Education (Morning)', 'BS Sport Science & Physical Education (Self-Support)'],

};

export const DEPARTMENTS = Object.keys(DEPARTMENT_PROGRAMS);
export const PROGRAMS = [...new Set(Object.values(DEPARTMENT_PROGRAMS).flat())];
export const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
export const SECTIONS = ['None', 'A', 'B', 'C', 'D', 'A+B', 'C+D', 'All'];
export const SHIFTS = ['Morning', 'Evening'];
export const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const DAY_COLORS = {
  Monday: '#6366f1',
  Tuesday: '#c64089df',
  Wednesday: '#0ea5e9',
  Thursday: '#10b981',
  Friday: '#f59e0b',
  Saturday: '#ec4899',
  Sunday: '#8b5cf6',
};
