import React, { useState } from 'react';
import { Scroll, Search, Plus, ArrowUpRight, Edit2, Trash2, Award } from 'lucide-react';
import { Student, ReadingStage } from '../types';
import { BentoCard } from '../components/BentoCard';

interface Juz21to25Props {
  students: Student[];
  selectedSchool: string;
  onOpenAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onPromoteStage: (student: Student, nextStage: ReadingStage) => void;
}

export const Juz21to25: React.FC<Juz21to25Props> = ({
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
    const isStage = s.current_stage === 'J21-25';
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Al-Quran Tahap Mahir
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">Surah Al-Ankabut hingga Fussilat</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Pelaporan Bacaan Juz 21 hingga Juz 25
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Murid telah menguasai sebahagian besar ayat Al-Quran dan berada dalam pecutan akhir menuju fasa Khatam Al-Quran.
          </p>
        </div>

        <button
          onClick={onOpenAddStudent}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all whitespace-nowrap self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rekod Juz 21-25</span>
        </button>
      </div>

      {/* Surah Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-mono text-slate-400">Juz 21</span>
          <p className="text-xs font-bold text-slate-800">Al-Ankabut, Luqman, As-Sajdah</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-mono text-slate-400">Juz 22</span>
          <p className="text-xs font-bold text-slate-800">Al-Ahzab, Saba', Fatir</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-mono text-slate-400">Juz 23</span>
          <p className="text-xs font-bold text-slate-800">Yasin, As-Saffat, Sad, Az-Zumar</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-mono text-slate-400">Juz 24</span>
          <p className="text-xs font-bold text-slate-800">Az-Zumar, Ghafir, Fussilat</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-mono text-slate-400">Juz 25</span>
          <p className="text-xs font-bold text-slate-800">Fussilat, Asy-Syura, Az-Zukhruf</p>
        </div>
      </div>

      {/* Toolbar */}
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
            placeholder="Cari murid Juz 21-25..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Table */}
      <BentoCard
        title={`Senarai Murid Juz 21 hingga Juz 25 (${filtered.length})`}
        subtitle="Tahap Mahir Menuju Khatam"
      >
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <Scroll className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-700">Tiada Murid di Juz 21-25</h4>
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
                  <th className="pb-3">Surah / Ayat</th>
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
                      <div className="font-semibold text-emerald-800">
                        {student.current_surah || `Halaman ${student.current_page || '-'}`}
                      </div>
                      {student.current_page && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          Muka Surat {student.current_page}
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-center font-mono font-bold text-slate-800">
                      Juz {student.current_juz || 21}
                    </td>
                    <td className="py-3 text-slate-700">
                      {student.teacher_in_charge}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPromoteStage(student, 'J26-30')}
                          title="Naik taraf ke Juz 26-30"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
                        >
                          <span>Naik J26-30</span>
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
