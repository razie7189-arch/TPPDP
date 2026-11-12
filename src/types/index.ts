export type ReadingStage =
  | 'I1'
  | 'I2'
  | 'I3'
  | 'I4'
  | 'I5'
  | 'I6'
  | 'J1-5'
  | 'J6-10'
  | 'J11-15'
  | 'J16-20'
  | 'J21-25'
  | 'J26-30'
  | 'KHATAM';

export interface Student {
  id: string;
  name: string;
  mykid: string;
  gender: 'Lelaki' | 'Perempuan';
  school_id: string;
  school_name: string;
  grade: number; // 1 to 6
  class_name: string;
  current_stage: ReadingStage;
  current_surah?: string;
  current_page?: number;
  current_juz?: number;
  last_updated: string;
  teacher_in_charge: string;
  notes?: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  location: string;
  total_students: number;
  guru_penyelaras: string;
  phone: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  school_name: string;
  grade_level?: string;
  phone: string;
  email: string;
  is_jurulatih_utama?: boolean;
}

export interface PPDOfficer {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  avatar_url?: string;
  order_index: number;
}

export interface CustomModule {
  id: string;
  title: string;
  icon_name: string;
  page_url: string;
  order_index: number;
  bg_color: string;
  description: string;
  is_active: boolean;
}

export interface PdfDocument {
  id: string;
  title: string;
  category: string;
  source_type: 'local' | 'google_drive' | 'url';
  url: string;
  description: string;
  date_added: string;
  badge?: string;
}

export interface RecalibrationRow {
  grade: number; // 1 to 6
  grade_label: string; // "TAHUN 1", etc.
  total_students: number;
  i1: number;
  i2: number;
  i3: number;
  i4: number;
  i5: number;
  i6: number;
  j1_5: number;
  j6_10: number;
  j11_15: number;
  j16_20: number;
  j21_25: number;
  j26_30: number;
  khatam: number;
}

export type ActivePage =
  | 'analisis'
  | 'iqra'
  | 'juz1-5'
  | 'juz6-10'
  | 'juz11-20'
  | 'juz21-25'
  | 'juz26-30-khatam'
  | 'rekalibrasi-itqan'
  | 'unit-pendidikan-islam'
  | 'dokumen-pdf'
  | 'tetapan'
  | string;
