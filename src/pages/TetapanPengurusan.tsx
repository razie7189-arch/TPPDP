import React, { useState } from 'react';
import {
  Settings,
  Database,
  Plus,
  Trash2,
  Edit2,
  Check,
  Copy,
  CheckCheck,
  RefreshCw,
  Download,
  AlertCircle,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { CustomModule } from '../types';
import { BentoCard } from '../components/BentoCard';
import {
  isSupabaseConfigured,
  getSupabaseConfig,
  testSupabaseConnection,
} from '../lib/supabase';
import { resetAllToDefaults } from '../lib/storage';

interface TetapanPengurusanProps {
  customModules: CustomModule[];
  onAddModule: (data: Omit<CustomModule, 'id'>) => void;
  onUpdateModule: (id: string, updates: Partial<CustomModule>) => void;
  onDeleteModule: (id: string) => void;
}

const COLOR_OPTIONS = [
  { label: 'Biru Lembut (Blue)', value: 'bg-blue-50 text-blue-700 border-blue-200' },
  { label: 'Hijau Zamrud (Emerald)', value: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { label: 'Kuning Amber (Amber)', value: 'bg-amber-50 text-amber-700 border-amber-200' },
  { label: 'Ungu Moden (Purple)', value: 'bg-purple-50 text-purple-700 border-purple-200' },
  { label: 'Merah Mawar (Rose)', value: 'bg-rose-50 text-rose-700 border-rose-200' },
  { label: 'Kelabu Slate Minimalis', value: 'bg-slate-100 text-slate-800 border-slate-300' },
];

export const TetapanPengurusan: React.FC<TetapanPengurusanProps> = ({
  customModules,
  onAddModule,
  onUpdateModule,
  onDeleteModule,
}) => {
  // Module Form State
  const [appName, setAppName] = useState('');
  const [iconName, setIconName] = useState('BookOpen');
  const [pageUrl, setPageUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState<number>(customModules.length + 1);
  const [bgColor, setBgColor] = useState(COLOR_OPTIONS[0].value);
  const [description, setDescription] = useState('');
  const [moduleSubmitSuccess, setModuleSubmitSuccess] = useState(false);

  // Supabase test status
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const supabaseConfig = getSupabaseConfig();

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim() || !pageUrl.trim()) return;

    onAddModule({
      title: appName.trim(),
      icon_name: iconName.trim() || 'FileText',
      page_url: pageUrl.trim(),
      order_index: Number(orderIndex) || 1,
      bg_color: bgColor,
      description: description.trim(),
      is_active: true,
    });

    setAppName('');
    setPageUrl('');
    setDescription('');
    setOrderIndex(customModules.length + 2);
    setModuleSubmitSuccess(true);
    setTimeout(() => setModuleSubmitSuccess(false), 3000);
  };

  const handleTestSupabase = async () => {
    setTestingConnection(true);
    setConnectionResult(null);
    const res = await testSupabaseConnection();
    setConnectionResult(res);
    setTestingConnection(false);
  };

  const sqlSchemaText = `-- ==========================================
-- SKRIP PANGKALAN DATA SUPABASE
-- Portal Pelaporan Bacaan Al-Quran Penampang
-- ==========================================

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mykid TEXT NOT NULL,
  gender TEXT NOT NULL,
  school_id TEXT,
  school_name TEXT NOT NULL,
  grade INTEGER NOT NULL,
  class_name TEXT NOT NULL,
  current_stage TEXT NOT NULL,
  current_surah TEXT,
  current_page INTEGER,
  current_juz INTEGER,
  teacher_in_charge TEXT NOT NULL,
  notes TEXT,
  last_updated DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS teachers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  school_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  is_jurulatih_utama BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ppd_officers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  order_index INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS custom_modules (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  page_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 1,
  bg_color TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS pdf_documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  source_type TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  badge TEXT,
  date_added DATE DEFAULT CURRENT_DATE
);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleExportJson = () => {
    const data = {
      exported_at: new Date().toISOString(),
      district: 'PPD Penampang',
      modules: customModules,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portal_penampang_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
              Pengurusan Sistem & Tetapan
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">Borang Moden Penambahan Fail / Modul</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Pengurusan Dashboard & Tetapan Sistem
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi penambahan modul tersuai, integrasi pangkalan data Supabase, serta pengurusan sandaran data.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-all cursor-pointer whitespace-nowrap self-start sm:self-center"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Eksport Data JSON</span>
        </button>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Modern Module Input Form (Spans 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <BentoCard
            title="Borang Penambahan Fail / Modul Baharu"
            subtitle="Pengurusan Dashboard & Menu"
            badge={
              <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                Dinamik
              </span>
            }
          >
            {moduleSubmitSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Modul baharu berjaya disimpan ke menu navigasi dan dashboard!</span>
              </div>
            )}

            <form onSubmit={handleAddModule} className="space-y-4">
              {/* Row 1: Nama App */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama App / Modul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="cth: Kem Bestari Solat (KBS) Siri 2"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Row 2: Icon Name & Susunan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Icon Name (Lucide Icons) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    placeholder="cth: BookOpen / Award / FileText / Sparkles"
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Nama ikon standard dari perpustakaan Lucide.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Susunan (Order Index)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Row 3: Pautan URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pautan URL Page Tersebut <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={pageUrl}
                  onChange={(e) => setPageUrl(e.target.value)}
                  placeholder="cth: #/kbs atau https://drive.google.com/..."
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Row 4: Warna Latar */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Warna Latar (Skim Aksyen Kad)
                </label>
                <select
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {COLOR_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 5: Keterangan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keterangan Ringkas
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi objektif dan sasaran modul ini..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Live Preview of Card */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>Pratonton Kad Modul</span>
                </span>
                <div className={`p-4 rounded-xl border ${bgColor} transition-all`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">
                      {appName || 'Nama App / Modul Anda'}
                    </span>
                    <span className="text-[10px] font-mono opacity-80">
                      #{orderIndex}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90 mt-1 line-clamp-1">
                    {description || 'Keterangan modul akan dipaparkan di sini.'}
                  </p>
                  <p className="text-[10px] font-mono opacity-60 mt-2 truncate">
                    Pautan: {pageUrl || '#'}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Modul ke Dashboard</span>
                </button>
              </div>
            </form>
          </BentoCard>

          {/* List of Current Custom Modules */}
          <BentoCard
            title={`Modul Aktif (${customModules.length})`}
            subtitle="Pengurusan Modul Sedia Ada"
          >
            <div className="divide-y divide-slate-100">
              {customModules.map((m) => (
                <div
                  key={m.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {m.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-500">
                        Susunan: {m.order_index}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {m.description || m.page_url}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onUpdateModule(m.id, { is_active: !m.is_active })}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                        m.is_active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {m.is_active ? 'Aktif' : 'Dinyahaktif'}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Padam modul "${m.title}"?`)) onDeleteModule(m.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                      title="Padam Modul"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>

        {/* Right Column: Supabase & Infrastructure (Spans 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Supabase Status Card */}
          <BentoCard
            title="Pangkalan Data Supabase & Vercel"
            subtitle="Integrasi Cloud DB"
            badge={
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  supabaseConfig.isConfigured
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {supabaseConfig.isConfigured ? 'Disambung' : 'Storan Pelayar Aktif'}
              </span>
            }
          >
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Aplikasi ini dibina dengan integrasi <strong>Supabase JavaScript SDK</strong> yang sedia untuk dihoskan ke <strong>Vercel</strong>. Apabila kunci persekitaran belum disetkan, sistem menggunakan storan tempatan (localStorage) yang selamat supaya anda boleh menguruskan data serta-merta tanpa sebarang ralat.
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    VITE_SUPABASE_URL
                  </span>
                  <span className="text-slate-800 truncate block">
                    {supabaseConfig.url || '(Belum ditetapkan di .env)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    VITE_SUPABASE_ANON_KEY
                  </span>
                  <span className="text-slate-800 truncate block">
                    {supabaseConfig.maskedKey}
                  </span>
                </div>
              </div>

              {/* Test Connection Button */}
              <div>
                <button
                  onClick={handleTestSupabase}
                  disabled={testingConnection}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                  <span>Uji Sambungan Supabase</span>
                </button>
              </div>

              {/* Result Notice */}
              {connectionResult && (
                <div
                  className={`p-3 rounded-xl border text-xs leading-relaxed ${
                    connectionResult.success
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}
                >
                  <p className="font-semibold mb-0.5">
                    {connectionResult.success ? 'Berjaya!' : 'Status Sambungan:'}
                  </p>
                  <p>{connectionResult.message}</p>
                </div>
              )}

              {/* Copy SQL Button */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">Skrip SQL Supabase</span>
                  <button
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    {copiedSql ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Skrip SQL</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Salin skrip ini dan tampal ke dalam <strong>SQL Editor</strong> di dashboard Supabase anda untuk menjana kesemua jadual dan polisi secara automatik.
                </p>
              </div>
            </div>
          </BentoCard>

          {/* Reset System Data */}
          <BentoCard
            title="Pengurusan Data & Tetapan Semula"
            subtitle="Penyelenggaraan"
          >
            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Anda boleh menetapkan semula semua data contoh (murid, pegawai PPD, guru, tapak rekalibrasi) ke tetapan asal.
              </p>
              <button
                onClick={() => {
                  if (confirm('Adakah anda pasti mahu menetapkan semula semua data ke tetapan asal?')) {
                    resetAllToDefaults();
                    alert('Data telah ditetapkan semula ke tetapan asal.');
                    window.location.reload();
                  }
                }}
                className="w-full px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-colors cursor-pointer"
              >
                Tetapkan Semula Data Ke Lalai (Reset)
              </button>
            </div>
          </BentoCard>

        </div>

      </div>

    </div>
  );
};
