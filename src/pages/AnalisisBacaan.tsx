import React from 'react';
import {
  BookOpen,
  Award,
  AlertTriangle,
  TrendingUp,
  School as SchoolIcon,
  Sparkles,
  ArrowRight,
  FileSpreadsheet,
  Download,
  Users,
} from 'lucide-react';
import { Student, School, ActivePage } from '../types';
import { BentoCard } from '../components/BentoCard';
import { StageBadge } from '../components/StageBadge';

interface AnalisisBacaanProps {
  students: Student[];
  schools: School[];
  selectedSchool: string;
  onNavigate: (page: ActivePage) => void;
  onOpenAddStudent: () => void;
}

export const AnalisisBacaan: React.FC<AnalisisBacaanProps> = ({
  students,
  schools,
  selectedSchool,
  onNavigate,
  onOpenAddStudent,
}) => {
  // Filter students based on selected school
  const filteredStudents = selectedSchool === 'SEMUA'
    ? students
    : students.filter((s) => s.school_name === selectedSchool);

  const total = filteredStudents.length;

  // Breakdown counts
  const iqraIntervensi = filteredStudents.filter((s) => ['I1', 'I2', 'I3'].includes(s.current_stage)).length;
  const iqraPerkembangan = filteredStudents.filter((s) => ['I4', 'I5', 'I6'].includes(s.current_stage)).length;
  const quranAwal = filteredStudents.filter((s) => ['J1-5', 'J6-10'].includes(s.current_stage)).length;
  const quranMenengah = filteredStudents.filter((s) => ['J11-15', 'J16-20', 'J21-25', 'J26-30'].includes(s.current_stage)).length;
  const khatam = filteredStudents.filter((s) => s.current_stage === 'KHATAM').length;

  const totalQuran = quranAwal + quranMenengah + khatam;
  const quranPercentage = total > 0 ? ((totalQuran / total) * 100).toFixed(1) : '0';
  const khatamPercentage = total > 0 ? ((khatam / total) * 100).toFixed(1) : '0';
  const intervensiPercentage = total > 0 ? ((iqraIntervensi / total) * 100).toFixed(1) : '0';

  // Grade breakdown
  const grades = [1, 2, 3, 4, 5, 6];
  const gradeBreakdown = grades.map((g) => {
    const list = filteredStudents.filter((s) => s.grade === g);
    const gTotal = list.length;
    const gIqra = list.filter((s) => s.current_stage.startsWith('I')).length;
    const gQuran = list.filter((s) => s.current_stage.startsWith('J')).length;
    const gKhatam = list.filter((s) => s.current_stage === 'KHATAM').length;
    return {
      grade: g,
      total: gTotal,
      iqra: gIqra,
      quran: gQuran,
      khatam: gKhatam,
      quranRate: gTotal > 0 ? (((gQuran + gKhatam) / gTotal) * 100).toFixed(0) : '0',
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Top Welcome / Hero Banner - Apple Minimalist */}
      <div className="relative overflow-hidden bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-lg text-blue-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Rekalibrasi ITQAN Program j-QAF Sesi 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              Analisis Kemajuan Bacaan Al-Quran {selectedSchool === 'SEMUA' ? 'Peringkat Daerah Penampang' : selectedSchool}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Pemantauan berpusat data pencapaian Iqra 1 hingga Iqra 6, peralihan ke Mushaf Al-Quran Juz 1 hingga 30, serta kadar Khatam Al-Quran murid sekolah rendah.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('rekalibrasi-itqan')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Buka Matriks ITQAN</span>
            </button>
            <button
              onClick={onOpenAddStudent}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>+ Rekod Bacaan</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Bento Strip (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Jumlah Murid */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Jumlah Rekod Murid</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {total}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tahun 1 hingga Tahun 6 {selectedSchool === 'SEMUA' ? 'di 8 buah sekolah' : ''}
            </p>
          </div>
        </div>

        {/* KPI 2: Menguasai Al-Quran */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Menguasai Al-Quran</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
                {totalQuran}
              </span>
              <span className="text-sm font-semibold text-emerald-600 font-mono">
                ({quranPercentage}%)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Juz 1 hingga Juz 30 dan Khatam
            </p>
          </div>
        </div>

        {/* KPI 3: Khatam Al-Quran */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Telah Khatam Al-Quran</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-600 font-mono tabular-nums">
                {khatam}
              </span>
              <span className="text-sm font-semibold text-amber-600 font-mono">
                ({khatamPercentage}%)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tamat 30 Juzuk bacaan bertajwid
            </p>
          </div>
        </div>

        {/* KPI 4: Intervensi Iqra */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Intervensi Khas (I1-I3)</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-red-600 font-mono tabular-nums">
                {iqraIntervensi}
              </span>
              <span className="text-sm font-semibold text-red-600 font-mono">
                ({intervensiPercentage}%)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Sasaran program bimbingan KLAQ
            </p>
          </div>
        </div>

      </div>

      {/* Bento Grid: Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card A: Visual Tahap Bacaan Band (Spans 2 Columns) */}
        <BentoCard
          className="lg:col-span-2"
          title="Pengagihan Tahap Bacaan j-QAF"
          subtitle="Pecahan Mengikut Piawaian ITQAN"
          badge={
            <span className="text-xs font-mono text-slate-400">
              {total} murid dinilai
            </span>
          }
        >
          <div className="space-y-5">
            {/* Multi-segment Colored Bar matching PDF color bands */}
            <div className="h-4 w-full bg-slate-100 rounded-lg overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${total > 0 ? (iqraIntervensi / total) * 100 : 0}%` }}
                className="bg-red-600 transition-all"
                title={`Iqra 1-3 (Intervensi): ${iqraIntervensi} murid`}
              />
              <div
                style={{ width: `${total > 0 ? (iqraPerkembangan / total) * 100 : 0}%` }}
                className="bg-amber-300 transition-all"
                title={`Iqra 4-6 (Perkembangan): ${iqraPerkembangan} murid`}
              />
              <div
                style={{ width: `${total > 0 ? (quranAwal / total) * 100 : 0}%` }}
                className="bg-slate-300 transition-all"
                title={`Al-Quran Awal (Juz 1-10): ${quranAwal} murid`}
              />
              <div
                style={{ width: `${total > 0 ? (quranMenengah / total) * 100 : 0}%` }}
                className="bg-emerald-400 transition-all"
                title={`Al-Quran Lanjutan (Juz 11-30): ${quranMenengah} murid`}
              />
              <div
                style={{ width: `${total > 0 ? (khatam / total) * 100 : 0}%` }}
                className="bg-amber-500 transition-all"
                title={`Khatam Al-Quran: ${khatam} murid`}
              />
            </div>

            {/* Legend / Category Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3 bg-red-50/70 border border-red-200/70 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-red-600"></span>
                  <span className="text-[11px] font-bold text-red-900">Iqra 1 - 3</span>
                </div>
                <div className="text-lg font-bold text-red-700 font-mono tabular-nums">
                  {iqraIntervensi}
                </div>
                <div className="text-[10px] text-red-600 font-medium">Intervensi Khas</div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-300 border border-amber-400"></span>
                  <span className="text-[11px] font-bold text-amber-950">Iqra 4 - 6</span>
                </div>
                <div className="text-lg font-bold text-amber-800 font-mono tabular-nums">
                  {iqraPerkembangan}
                </div>
                <div className="text-[10px] text-amber-700 font-medium">Perkembangan</div>
              </div>

              <div className="p-3 bg-slate-100/70 border border-slate-300/70 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300"></span>
                  <span className="text-[11px] font-bold text-slate-800">Juz 1 - 10</span>
                </div>
                <div className="text-lg font-bold text-slate-800 font-mono tabular-nums">
                  {quranAwal}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Al-Quran Awal</div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span>
                  <span className="text-[11px] font-bold text-emerald-950">Juz 11 - 30</span>
                </div>
                <div className="text-lg font-bold text-emerald-800 font-mono tabular-nums">
                  {quranMenengah}
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">Al-Quran Lanjutan</div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-300/70 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
                  <span className="text-[11px] font-bold text-amber-950">Khatam</span>
                </div>
                <div className="text-lg font-bold text-amber-700 font-mono tabular-nums">
                  {khatam}
                </div>
                <div className="text-[10px] text-amber-700 font-medium">Khatam 30 Juz</div>
              </div>
            </div>

            {/* Quick action bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Piawaian rasmi kurikulum j-QAF Bahagian Pendidikan Islam KPM
              </span>
              <button
                onClick={() => onNavigate('iqra')}
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                <span>Lihat Senarai Murid Iqra</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </BentoCard>

        {/* Card B: Quick Actions & PPD Penampang Focus */}
        <BentoCard
          title="Tindakan Strategik"
          subtitle="Pelan Tindakan Sesi 2026"
        >
          <div className="space-y-3.5">
            <div
              onClick={() => onNavigate('rekalibrasi-itqan')}
              className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900">
                  Tapak Rekalibrasi ITQAN
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-blue-700/90 mt-1">
                Kemas kini data matriks kelas Tahun 1 - 6 mengikut borang tapak asal.
              </p>
            </div>

            <div
              onClick={() => onNavigate('juz26-30-khatam')}
              className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/50 hover:bg-amber-50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950">
                  Majlis Khatam Al-Quran Perdana
                </span>
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-[11px] text-amber-800/90 mt-1">
                {khatam} calon telah memenuhi syarat khatam 30 juzuk.
              </p>
            </div>

            <div
              onClick={() => onNavigate('dokumen-pdf')}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Pusat Dokumen & Drive PDF
                </span>
                <Download className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Lihat borang tapak rasmi 2026 dan garis panduan KPM.
              </p>
            </div>
          </div>
        </BentoCard>

      </div>

      {/* Bento Grid: Row 3 - Analisis Mengikut Tahun 1 hingga 6 */}
      <BentoCard
        title="Prestasi Bacaan Mengikut Tahun Persekolahan (Tahun 1 - 6)"
        subtitle="Analisis Perbandingan Darjah"
        badge={
          <span className="text-xs font-medium text-slate-500">
            Penanda Aras j-QAF KPM
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Tahun</th>
                <th className="pb-3 text-right">Bil. Murid</th>
                <th className="pb-3 text-center">Iqra (1-6)</th>
                <th className="pb-3 text-center">Al-Quran (Juz 1-30)</th>
                <th className="pb-3 text-center">Khatam</th>
                <th className="pb-3 text-right pr-2">Kadar Celik Quran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gradeBreakdown.map((row) => (
                <tr key={row.grade} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pl-2 font-bold text-slate-900">
                    Tahun {row.grade}
                  </td>
                  <td className="py-3 text-right font-mono font-medium text-slate-700">
                    {row.total}
                  </td>
                  <td className="py-3 text-center font-mono text-amber-700">
                    {row.iqra}
                  </td>
                  <td className="py-3 text-center font-mono text-emerald-700 font-medium">
                    {row.quran}
                  </td>
                  <td className="py-3 text-center font-mono font-bold text-amber-600">
                    {row.khatam}
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${row.quranRate}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-900 w-8 text-right">
                        {row.quranRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BentoCard>

      {/* Row 4: Recent Murid Readings */}
      <BentoCard
        title="Kemaskini Rekod Bacaan Terkini"
        subtitle="Log Bacaan Harian Tasmik"
        action={
          <button
            onClick={() => onNavigate('iqra')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
          >
            Lihat Semua Murid →
          </button>
        }
      >
        <div className="divide-y divide-slate-100">
          {filteredStudents.slice(0, 5).map((student) => (
            <div
              key={student.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-xl transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {student.name}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    ({student.class_name})
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700">{student.school_name}</span>
                  <span>·</span>
                  <span>{student.current_surah || `Halaman ${student.current_page || 1}`}</span>
                  <span>·</span>
                  <span>Guru: {student.teacher_in_charge}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <StageBadge stage={student.current_stage} showGroup />
              </div>
            </div>
          ))}
        </div>
      </BentoCard>

    </div>
  );
};
