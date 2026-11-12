-- ====================================================================
-- SKRIP PANGKALAN DATA SUPABASE
-- Portal Pelaporan Bacaan Al-Quran Daerah Penampang
-- Sistem Rekalibrasi ITQAN Program j-QAF 2026
-- ====================================================================

-- 1. Jadual Sekolah
CREATE TABLE IF NOT EXISTS schools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  location TEXT,
  total_students INTEGER DEFAULT 0,
  guru_penyelaras TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Jadual Murid (Students)
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mykid TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Lelaki', 'Perempuan')),
  school_id TEXT REFERENCES schools(id) ON DELETE SET NULL,
  school_name TEXT NOT NULL,
  grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 6),
  class_name TEXT NOT NULL,
  current_stage TEXT NOT NULL CHECK (current_stage IN (
    'I1', 'I2', 'I3', 'I4', 'I5', 'I6',
    'J1-5', 'J6-10', 'J11-15', 'J16-20', 'J21-25', 'J26-30', 'KHATAM'
  )),
  current_surah TEXT,
  current_page INTEGER,
  current_juz INTEGER,
  last_updated DATE DEFAULT CURRENT_DATE,
  teacher_in_charge TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Jadual Guru (Teachers)
CREATE TABLE IF NOT EXISTS teachers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  school_name TEXT NOT NULL,
  grade_level TEXT,
  phone TEXT,
  email TEXT,
  is_jurulatih_utama BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Jadual Pegawai Unit Pendidikan Islam PPD (PPD Officers)
CREATE TABLE IF NOT EXISTS ppd_officers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  order_index INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Jadual Modul Kustom (Custom Modules / Menu)
CREATE TABLE IF NOT EXISTS custom_modules (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  page_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 1,
  bg_color TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Jadual Dokumen PDF (PDF Documents & Google Drive)
CREATE TABLE IF NOT EXISTS pdf_documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('local', 'google_drive', 'url')),
  url TEXT NOT NULL,
  description TEXT,
  badge TEXT,
  date_added DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Jadual Rekalibrasi ITQAN (Aggregated Matrix)
CREATE TABLE IF NOT EXISTS recalibration_matrix (
  id SERIAL PRIMARY KEY,
  school_name TEXT NOT NULL DEFAULT 'DAERAH_PENAMPANG',
  grade INTEGER NOT NULL,
  grade_label TEXT NOT NULL,
  total_students INTEGER DEFAULT 0,
  i1 INTEGER DEFAULT 0,
  i2 INTEGER DEFAULT 0,
  i3 INTEGER DEFAULT 0,
  i4 INTEGER DEFAULT 0,
  i5 INTEGER DEFAULT 0,
  i6 INTEGER DEFAULT 0,
  j1_5 INTEGER DEFAULT 0,
  j6_10 INTEGER DEFAULT 0,
  j11_15 INTEGER DEFAULT 0,
  j16_20 INTEGER DEFAULT 0,
  j21_25 INTEGER DEFAULT 0,
  j26_30 INTEGER DEFAULT 0,
  khatam INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeks untuk kelajuan carian
CREATE INDEX IF NOT EXISTS idx_students_stage ON students(current_stage);
CREATE INDEX IF NOT EXISTS idx_students_grade ON students(grade);
CREATE INDEX IF NOT EXISTS idx_students_school ON students(school_name);

-- Polisi Keselamatan Akses Baris (Row Level Security - RLS)
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppd_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE recalibration_matrix ENABLE ROW LEVEL SECURITY;

-- Benarkan akses baca dan tulis awam (Anon Key untuk demo portal pendidikan)
CREATE POLICY "Allow public read all" ON schools FOR SELECT USING (true);
CREATE POLICY "Allow public write all" ON schools FOR ALL USING (true);

CREATE POLICY "Allow public read students" ON students FOR SELECT USING (true);
CREATE POLICY "Allow public write students" ON students FOR ALL USING (true);

CREATE POLICY "Allow public read teachers" ON teachers FOR SELECT USING (true);
CREATE POLICY "Allow public write teachers" ON teachers FOR ALL USING (true);

CREATE POLICY "Allow public read officers" ON ppd_officers FOR SELECT USING (true);
CREATE POLICY "Allow public write officers" ON ppd_officers FOR ALL USING (true);

CREATE POLICY "Allow public read modules" ON custom_modules FOR SELECT USING (true);
CREATE POLICY "Allow public write modules" ON custom_modules FOR ALL USING (true);

CREATE POLICY "Allow public read pdfs" ON pdf_documents FOR SELECT USING (true);
CREATE POLICY "Allow public write pdfs" ON pdf_documents FOR ALL USING (true);

CREATE POLICY "Allow public read matrix" ON recalibration_matrix FOR SELECT USING (true);
CREATE POLICY "Allow public write matrix" ON recalibration_matrix FOR ALL USING (true);
