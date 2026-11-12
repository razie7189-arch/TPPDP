import React, { useState } from 'react';
import { BookMarked, Search, Plus, ArrowUpRight, Edit2, Trash2 } from 'lucide-react';
import { Student, ReadingStage } from '../types';
import { StageBadge } from '../components/StageBadge';
import { BentoCard } from '../components/BentoCard';

interface Juz1to5Props {
  students: Student[];
  selectedSchool: string;
  onOpenAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onPromoteStage: (student: Student, nextStage: ReadingStage) => void;
}

export const Juz1to5: React.FC<Juz1to5Props> = ({
  students,
  selectedSchool,
  onOpenAddStudent,
  onEditStudent,
  onDeleteStudent,
  onPromoteStage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>('ALL');

  const filtered = students.filter((s) => {
    const isStage = s.current_stage === 'J1-5';
    const matchesSchool = selectedSchool === 'SEMUA' || s.school_name === selectedSchool;
    const matchesGrade = selectedGrade === 'ALL' || s.grade === selectedGrade;
    const matchesQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.class_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mykid.includes(searchQuery);

    return isStage && matchesSchool && matchesGrade && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
              Al-Quran Tahap Awal
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">Surah Al-Fatihah hingga Surah An-Nisa'</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Pelaporan Bacaan Juz 1 hingga Juz 5
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Fasa transisi penting murid daripada buku Iqra kepada pembacaan Mushaf Al-Quran dengan tumpuan hukum tajwid asas.
          </p>
        </div>

        <button
          onClick={onOpenAddStudent}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all whitespace-nowrap self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rekod Juz 1-5</span>
        </button>
      </div>

      {/* Info Surah Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Juz 1</span>
          <p className="text-xs font-bold text-slate-800 mt-0.5">Al-Fatihah & Al-Baqarah: 1-141</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Juz 2</span>
          <p className="text-xs font-bold text-slate-800 mt-0.5">Al-Baqarah: 142-252</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Juz 3 & 4</span>
          <p className="text-xs font-bold text-slate-800 mt-0.5">Ali-Imran & An-Nisa' Awal</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Juz 5</span>
          <p className="text-xs font-bold text-slate-800 mt-0.5">An-Nisa': 24-147</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-400 mr-2 shrink-0">Tahun:</span>
          {(['ALL', 1, 2, 3, 4, 5, 6] as const).map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedGrade === g
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {g === 'ALL' ? 'Semua Tahun' : `Tahun ${g}`}
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
            placeholder="Cari murid Juz 1-5..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Table */}
      <BentoCard
        title={`Senarai Murid Juz 1 hingga Juz 5 (${filtered.length})`}
        subtitle="Tahap Permulaan Al-Quran"
      >
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <BookMarked className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-700">Tiada Murid di Juz 1-5</h4>
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
                  <th className="pb-3">Surah / Ayat / Halaman</th>
                  <th className="pb-3 text-center">Juzuk</th>
                  <th className="pb-3">Guru Pembimbing</th>
                  <th className="pb-3 text-right pr-2">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 pl-2 font-bold text-slate-900">
                      <div>{student.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{student.mykid} · {student.gender}</div>
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-slate-800">{student.class_name}</div>
                      <div className="text-[11px] text-slate-400">{student.school_name}</div>
                    </td>
                    <td className="py-3">
                      <div className="font-semibold text-blue-700">
                        {student.current_surah || `Halaman ${student.current_page || 1}`}
                      </div>
                      {student.current_page && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          Muka Surat {student.current_page}
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-center font-mono font-bold text-slate-800">
                      Juz {student.current_juz || 1}
                    </td>
                    <td className="py-3 text-slate-700">
                      {student.teacher_in_charge}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPromoteStage(student, 'J6-10')}
                          title="Naik taraf ke Juz 6-10"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
                        >
                          <span>Naik J6-10</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </BentoCard>

    </div>
  );
};
