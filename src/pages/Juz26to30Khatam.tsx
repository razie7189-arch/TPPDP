import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Search,
  Plus,
  CheckCircle,
  Edit2,
  Trash2,
  Printer,
  X,
  FileCheck2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, ReadingStage } from '../types';
import { BentoCard } from '../components/BentoCard';
import { StageBadge } from '../components/StageBadge';

interface Juz26to30KhatamProps {
  students: Student[];
  selectedSchool: string;
  onOpenAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onPromoteStage: (student: Student, nextStage: ReadingStage) => void;
}

export const Juz26to30Khatam: React.FC<Juz26to30KhatamProps> = ({
  students,
  selectedSchool,
  onOpenAddStudent,
  onEditStudent,
  onDeleteStudent,
  onPromoteStage,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'J26-30' | 'KHATAM'>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [certificateStudent, setCertificateStudent] = useState<Student | null>(null);

  const filtered = students.filter((s) => {
    const isTargetStage = s.current_stage === 'J26-30' || s.current_stage === 'KHATAM';
    const matchesTab = activeTab === 'ALL' || s.current_stage === activeTab;
    const matchesSchool = selectedSchool === 'SEMUA' || s.school_name === selectedSchool;
    const matchesGrade = selectedGrade === 'ALL' || s.grade === selectedGrade;
    const matchesQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.class_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mykid.includes(searchQuery);

    return isTargetStage && matchesTab && matchesSchool && matchesGrade && matchesQuery;
  });

  const khatamCount = students.filter(
    (s) => s.current_stage === 'KHATAM' && (selectedSchool === 'SEMUA' || s.school_name === selectedSchool)
  ).length;

  const juz26Count = students.filter(
    (s) => s.current_stage === 'J26-30' && (selectedSchool === 'SEMUA' || s.school_name === selectedSchool)
  ).length;

  const handleCelebrateKhatam = (student: Student) => {
    onPromoteStage(student, 'KHATAM');
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.log('Confetti triggered');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Golden Celebration Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Kemuncak Pencapaian Program j-QAF 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Juz 26 hingga 30 & Majlis Khatam Al-Quran
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
              Tahniah kepada semua murid yang telah berjaya menghabiskan bacaan 30 Juzuk Al-Quran dengan tartil dan tajwid di Daerah Penampang.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-xl border border-white/30 text-center w-full sm:w-auto">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-100 block">
                Jumlah Khatam
              </span>
              <span className="text-3xl font-black font-mono">{khatamCount}</span>
              <span className="text-xs text-amber-100 block">Murid</span>
            </div>
            <button
              onClick={onOpenAddStudent}
              className="w-full sm:w-auto px-4 py-3 bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs rounded-xl shadow-md transition-all whitespace-nowrap cursor-pointer"
            >
              + Rekod Calon Khatam
            </button>
          </div>
        </div>
      </div>

      {/* Stage Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">Semua Peringkat</div>
          <div className="text-sm font-bold mt-0.5">Juz 26 - 30 & Khatam ({filtered.length})</div>
        </button>

        <button
          onClick={() => setActiveTab('J26-30')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'J26-30'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">Fasa Akhir</div>
          <div className="text-sm font-bold mt-0.5">Juz 26 hingga Juz 30 ({juz26Count})</div>
        </button>

        <button
          onClick={() => setActiveTab('KHATAM')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'KHATAM'
              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider opacity-75">
            <Award className="w-3.5 h-3.5" />
            <span>Tamat 30 Juzuk</span>
          </div>
          <div className="text-sm font-bold mt-0.5">Khatam Al-Quran ({khatamCount})</div>
        </button>
      </div>

      {/* Grade Selector & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-400 mr-2 shrink-0">Tahun:</span>
          {(['ALL', 1, 2, 3, 4, 5, 6] as const).map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedGrade === g
                  ? 'bg-amber-500 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {g === 'ALL' ? 'Semua Tahun (1-6)' : `Tahun ${g}`}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari murid / kelas / MyKid..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Table */}
      <BentoCard
        title={`Senarai Murid Juz 26-30 & Khatam (${filtered.length})`}
        subtitle="Rekod Pengiktirafan Khatam Al-Quran"
      >
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-700">Tiada Murid Dijumpai</h4>
            <p className="text-xs text-slate-400 mt-1">
              Tiada rekod murid yang sepadan dengan tapisan semasa.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pl-2">Nama Murid</th>
                  <th className="pb-3">Sekolah & Kelas</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3">Surah Terkini</th>
                  <th className="pb-3">Guru Pembimbing</th>
                  <th className="pb-3 text-right pr-2">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((student) => {
                  const isKhatam = student.current_stage === 'KHATAM';

                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isKhatam ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="py-3 pl-2">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {isKhatam && <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                          <span>{student.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {student.mykid} · {student.gender}
                        </div>
                      </td>

                      <td className="py-3">
                        <div className="font-medium text-slate-800">{student.class_name}</div>
                        <div className="text-[11px] text-slate-400">{student.school_name}</div>
                      </td>

                      <td className="py-3 text-center">
                        <StageBadge stage={student.current_stage} />
                      </td>

                      <td className="py-3">
                        <div className="font-semibold text-slate-800">
                          {student.current_surah || (isKhatam ? 'Surah An-Nas (Khatam)' : 'Juz 26-30')}
                        </div>
                        {student.notes && (
                          <div className="text-[10px] text-slate-400 italic">
                            {student.notes}
                          </div>
                        )}
                      </td>

                      <td className="py-3 text-slate-700">
                        {student.teacher_in_charge}
                      </td>

                      <td className="py-3 pr-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* If in J26-30, give option to Khatam with celebration */}
                          {!isKhatam ? (
                            <button
                              onClick={() => handleCelebrateKhatam(student)}
                              title="Sahkan Khatam Al-Quran"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 hover:bg-amber-500 hover:text-white text-amber-900 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>Sahkan Khatam</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setCertificateStudent(student)}
                              title="Lihat & Cetak Sijil Khatam"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
                            >
                              <FileCheck2 className="w-3 h-3 text-amber-300" />
                              <span>Sijil</span>
                            </button>
                          )}

                          <button
                            onClick={() => onEditStudent(student)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Padam rekod ${student.name}?`)) onDeleteStudent(student.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </BentoCard>

      {/* Sijil Khatam Modal Preview */}
      {certificateStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-4 border-amber-300 p-8 text-center">
            <button
              onClick={() => setCertificateStudent(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-center mb-4">
              <img src="https://iili.io/CeHysTB.png" alt="Logo" className="w-16 h-16 object-contain" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 block">
              Pejabat Pendidikan Daerah Penampang · Unit Pendidikan Islam
            </span>

            <h3 className="text-2xl font-black text-slate-900 mt-2 font-serif tracking-tight">
              SIJIL PENGESAHAN KHATAM AL-QURAN
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Program j-QAF Model Khatam Al-Quran Sesi Persekolahan 2026
            </p>

            <div className="my-6 py-4 border-y border-amber-200 bg-amber-50/50 rounded-xl">
              <p className="text-xs text-slate-500">Dengan ini diperakui bahawa</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">
                {certificateStudent.name}
              </p>
              <p className="text-xs font-mono text-slate-600 mt-0.5">
                No. MyKid: {certificateStudent.mykid} · {certificateStudent.class_name}
              </p>
              <p className="text-xs font-semibold text-blue-700 mt-1">
                {certificateStudent.school_name}
              </p>
              <p className="text-xs text-slate-700 mt-3 max-w-md mx-auto">
                Telah berjaya menyempurnakan pembacaan 30 Juzuk Al-Quran dengan baik dan bertajwid di bawah bimbingan Guru Panitia Pendidikan Islam.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 text-xs pt-4 border-t border-slate-100 text-slate-700">
              <div>
                <p className="font-semibold">{certificateStudent.teacher_in_charge}</p>
                <p className="text-[10px] text-slate-500">Guru Tasmik Pembimbing</p>
              </div>
              <div>
                <p className="font-semibold">Pegawai Pendidikan Islam Daerah</p>
                <p className="text-[10px] text-slate-500">PPD Penampang, Sabah</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 no-print">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Sijil</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
