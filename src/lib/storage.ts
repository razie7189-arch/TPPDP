import { Student, School, Teacher, PPDOfficer, CustomModule, PdfDocument, RecalibrationRow, ReadingStage } from '../types';
import { initialSchools, initialPPDOfficers, initialTeachers, initialCustomModules, initialPdfDocuments, initialStudents, initialDistrictRecalibration } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  STUDENTS: 'portal_penampang_students',
  SCHOOLS: 'portal_penampang_schools',
  TEACHERS: 'portal_penampang_teachers',
  OFFICERS: 'portal_penampang_officers',
  MODULES: 'portal_penampang_modules',
  DOCUMENTS: 'portal_penampang_documents',
  RECALIBRATION: 'portal_penampang_recalibration',
  CURRENT_SCHOOL: 'portal_penampang_selected_school',
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('Listener callback error', e);
    }
  });
}

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Failed to read ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (err) {
    console.error(`Failed to write ${key} to localStorage:`, err);
  }
}

// ---------------- Students CRUD ----------------
export function getStudents(): Student[] {
  return getStoredItem<Student[]>(STORAGE_KEYS.STUDENTS, initialStudents);
}

export async function addStudent(studentData: Omit<Student, 'id' | 'last_updated'>): Promise<Student> {
  const newStudent: Student = {
    ...studentData,
    id: `stu-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    last_updated: new Date().toISOString().split('T')[0],
  };

  const list = getStudents();
  const updated = [newStudent, ...list];
  setStoredItem(STORAGE_KEYS.STUDENTS, updated);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('students').insert([newStudent]);
    } catch (e) {
      console.warn('Supabase sync insert failed, persisted locally', e);
    }
  }

  return newStudent;
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<Student | null> {
  const list = getStudents();
  const index = list.findIndex(s => s.id === id);
  if (index === -1) return null;

  const updatedStudent: Student = {
    ...list[index],
    ...updates,
    last_updated: new Date().toISOString().split('T')[0],
  };

  list[index] = updatedStudent;
  setStoredItem(STORAGE_KEYS.STUDENTS, list);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('students').update(updates).eq('id', id);
    } catch (e) {
      console.warn('Supabase sync update failed, persisted locally', e);
    }
  }

  return updatedStudent;
}

export async function deleteStudent(id: string): Promise<boolean> {
  const list = getStudents();
  const filtered = list.filter(s => s.id !== id);
  if (filtered.length === list.length) return false;

  setStoredItem(STORAGE_KEYS.STUDENTS, filtered);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('students').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase sync delete failed, persisted locally', e);
    }
  }

  return true;
}

// ---------------- Teachers CRUD ----------------
export function getTeachers(): Teacher[] {
  return getStoredItem<Teacher[]>(STORAGE_KEYS.TEACHERS, initialTeachers);
}

export async function addTeacher(teacherData: Omit<Teacher, 'id'>): Promise<Teacher> {
  const newTeacher: Teacher = {
    ...teacherData,
    id: `t-${Date.now()}`,
  };
  const list = getTeachers();
  const updated = [...list, newTeacher];
  setStoredItem(STORAGE_KEYS.TEACHERS, updated);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('teachers').insert([newTeacher]);
    } catch (e) {
      console.warn('Supabase sync insert failed', e);
    }
  }
  return newTeacher;
}

export async function updateTeacher(id: string, updates: Partial<Teacher>): Promise<Teacher | null> {
  const list = getTeachers();
  const index = list.findIndex(t => t.id === id);
  if (index === -1) return null;

  list[index] = { ...list[index], ...updates };
  setStoredItem(STORAGE_KEYS.TEACHERS, list);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('teachers').update(updates).eq('id', id);
    } catch (e) {
      console.warn('Supabase sync update failed', e);
    }
  }
  return list[index];
}

export async function deleteTeacher(id: string): Promise<boolean> {
  const list = getTeachers();
  const filtered = list.filter(t => t.id !== id);
  if (filtered.length === list.length) return false;
  setStoredItem(STORAGE_KEYS.TEACHERS, filtered);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('teachers').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase sync delete failed', e);
    }
  }
  return true;
}

// ---------------- Officers CRUD ----------------
export function getOfficers(): PPDOfficer[] {
  return getStoredItem<PPDOfficer[]>(STORAGE_KEYS.OFFICERS, initialPPDOfficers);
}

export async function addOfficer(officerData: Omit<PPDOfficer, 'id'>): Promise<PPDOfficer> {
  const newOfficer: PPDOfficer = {
    ...officerData,
    id: `ppd-${Date.now()}`,
  };
  const list = getOfficers();
  const updated = [...list, newOfficer];
  setStoredItem(STORAGE_KEYS.OFFICERS, updated);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('ppd_officers').insert([newOfficer]);
    } catch (e) {
      console.warn('Supabase sync insert failed', e);
    }
  }
  return newOfficer;
}

export async function updateOfficer(id: string, updates: Partial<PPDOfficer>): Promise<PPDOfficer | null> {
  const list = getOfficers();
  const index = list.findIndex(o => o.id === id);
  if (index === -1) return null;

  list[index] = { ...list[index], ...updates };
  setStoredItem(STORAGE_KEYS.OFFICERS, list);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('ppd_officers').update(updates).eq('id', id);
    } catch (e) {
      console.warn('Supabase sync update failed', e);
    }
  }
  return list[index];
}

export async function deleteOfficer(id: string): Promise<boolean> {
  const list = getOfficers();
  const filtered = list.filter(o => o.id !== id);
  if (filtered.length === list.length) return false;
  setStoredItem(STORAGE_KEYS.OFFICERS, filtered);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('ppd_officers').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase sync delete failed', e);
    }
  }
  return true;
}

// ---------------- Custom Modules CRUD ----------------
export function getCustomModules(): CustomModule[] {
  return getStoredItem<CustomModule[]>(STORAGE_KEYS.MODULES, initialCustomModules);
}

export async function addCustomModule(moduleData: Omit<CustomModule, 'id'>): Promise<CustomModule> {
  const newModule: CustomModule = {
    ...moduleData,
    id: `mod-${Date.now()}`,
  };
  const list = getCustomModules();
  const updated = [...list, newModule];
  setStoredItem(STORAGE_KEYS.MODULES, updated);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('custom_modules').insert([newModule]);
    } catch (e) {
      console.warn('Supabase sync insert failed', e);
    }
  }
  return newModule;
}

export async function updateCustomModule(id: string, updates: Partial<CustomModule>): Promise<CustomModule | null> {
  const list = getCustomModules();
  const index = list.findIndex(m => m.id === id);
  if (index === -1) return null;

  list[index] = { ...list[index], ...updates };
  setStoredItem(STORAGE_KEYS.MODULES, list);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('custom_modules').update(updates).eq('id', id);
    } catch (e) {
      console.warn('Supabase sync update failed', e);
    }
  }
  return list[index];
}

export async function deleteCustomModule(id: string): Promise<boolean> {
  const list = getCustomModules();
  const filtered = list.filter(m => m.id !== id);
  if (filtered.length === list.length) return false;
  setStoredItem(STORAGE_KEYS.MODULES, filtered);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('custom_modules').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase sync delete failed', e);
    }
  }
  return true;
}

// ---------------- PDF Documents CRUD ----------------
export function getPdfDocuments(): PdfDocument[] {
  return getStoredItem<PdfDocument[]>(STORAGE_KEYS.DOCUMENTS, initialPdfDocuments);
}

export async function addPdfDocument(docData: Omit<PdfDocument, 'id' | 'date_added'>): Promise<PdfDocument> {
  const newDoc: PdfDocument = {
    ...docData,
    id: `doc-${Date.now()}`,
    date_added: new Date().toISOString().split('T')[0],
  };
  const list = getPdfDocuments();
  const updated = [newDoc, ...list];
  setStoredItem(STORAGE_KEYS.DOCUMENTS, updated);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('pdf_documents').insert([newDoc]);
    } catch (e) {
      console.warn('Supabase sync insert failed', e);
    }
  }
  return newDoc;
}

export async function deletePdfDocument(id: string): Promise<boolean> {
  const list = getPdfDocuments();
  const filtered = list.filter(d => d.id !== id);
  if (filtered.length === list.length) return false;
  setStoredItem(STORAGE_KEYS.DOCUMENTS, filtered);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('pdf_documents').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase sync delete failed', e);
    }
  }
  return true;
}

// ---------------- Schools ----------------
export function getSchools(): School[] {
  return getStoredItem<School[]>(STORAGE_KEYS.SCHOOLS, initialSchools);
}

export function getSelectedSchool(): string {
  return getStoredItem<string>(STORAGE_KEYS.CURRENT_SCHOOL, 'SEMUA');
}

export function setSelectedSchool(schoolName: string): void {
  setStoredItem(STORAGE_KEYS.CURRENT_SCHOOL, schoolName);
}

// ---------------- ITQAN Recalibration Matrix Data ----------------
export function getRecalibrationData(): RecalibrationRow[] {
  return getStoredItem<RecalibrationRow[]>(STORAGE_KEYS.RECALIBRATION, initialDistrictRecalibration);
}

export function updateRecalibrationRow(grade: number, updates: Partial<RecalibrationRow>): void {
  const data = getRecalibrationData();
  const index = data.findIndex(r => r.grade === grade);
  if (index !== -1) {
    data[index] = { ...data[index], ...updates };
    // Recalculate total students for that row
    const row = data[index];
    row.total_students =
      (row.i1 || 0) +
      (row.i2 || 0) +
      (row.i3 || 0) +
      (row.i4 || 0) +
      (row.i5 || 0) +
      (row.i6 || 0) +
      (row.j1_5 || 0) +
      (row.j6_10 || 0) +
      (row.j11_15 || 0) +
      (row.j16_20 || 0) +
      (row.j21_25 || 0) +
      (row.j26_30 || 0) +
      (row.khatam || 0);

    setStoredItem(STORAGE_KEYS.RECALIBRATION, data);
  }
}

export function resetAllToDefaults(): void {
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.SCHOOLS);
  localStorage.removeItem(STORAGE_KEYS.TEACHERS);
  localStorage.removeItem(STORAGE_KEYS.OFFICERS);
  localStorage.removeItem(STORAGE_KEYS.MODULES);
  localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
  localStorage.removeItem(STORAGE_KEYS.RECALIBRATION);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_SCHOOL);
  notifyListeners();
}

// ---------------- Stage Helper Utilities ----------------
export const STAGE_CONFIG: Record<ReadingStage, { label: string; group: 'iqra-intervensi' | 'iqra-perkembangan' | 'quran-awal' | 'quran-menengah' | 'khatam'; colorClass: string; bgStyle: string; textStyle: string }> = {
  I1: { label: 'Iqra 1', group: 'iqra-intervensi', colorClass: 'bg-red-600 text-white', bgStyle: '#DC2626', textStyle: '#ffffff' },
  I2: { label: 'Iqra 2', group: 'iqra-intervensi', colorClass: 'bg-red-600 text-white', bgStyle: '#DC2626', textStyle: '#ffffff' },
  I3: { label: 'Iqra 3', group: 'iqra-intervensi', colorClass: 'bg-red-600 text-white', bgStyle: '#DC2626', textStyle: '#ffffff' },
  I4: { label: 'Iqra 4', group: 'iqra-perkembangan', colorClass: 'bg-amber-300 text-amber-950 font-bold', bgStyle: '#FACC15', textStyle: '#422006' },
  I5: { label: 'Iqra 5', group: 'iqra-perkembangan', colorClass: 'bg-amber-300 text-amber-950 font-bold', bgStyle: '#FACC15', textStyle: '#422006' },
  I6: { label: 'Iqra 6', group: 'iqra-perkembangan', colorClass: 'bg-amber-300 text-amber-950 font-bold', bgStyle: '#FACC15', textStyle: '#422006' },
  'J1-5': { label: 'Juz 1-5', group: 'quran-awal', colorClass: 'bg-slate-200 text-slate-800', bgStyle: '#E2E8F0', textStyle: '#1E293B' },
  'J6-10': { label: 'Juz 6-10', group: 'quran-awal', colorClass: 'bg-slate-200 text-slate-800', bgStyle: '#E2E8F0', textStyle: '#1E293B' },
  'J11-15': { label: 'Juz 11-15', group: 'quran-menengah', colorClass: 'bg-emerald-200 text-emerald-950', bgStyle: '#A7F3D0', textStyle: '#064E3B' },
  'J16-20': { label: 'Juz 16-20', group: 'quran-menengah', colorClass: 'bg-emerald-200 text-emerald-950', bgStyle: '#A7F3D0', textStyle: '#064E3B' },
  'J21-25': { label: 'Juz 21-25', group: 'quran-menengah', colorClass: 'bg-emerald-200 text-emerald-950', bgStyle: '#A7F3D0', textStyle: '#064E3B' },
  'J26-30': { label: 'Juz 26-30', group: 'quran-menengah', colorClass: 'bg-emerald-200 text-emerald-950', bgStyle: '#A7F3D0', textStyle: '#064E3B' },
  KHATAM: { label: 'Khatam Al-Quran', group: 'khatam', colorClass: 'bg-amber-400 text-amber-950 font-bold', bgStyle: '#FBBF24', textStyle: '#451A03' },
};
