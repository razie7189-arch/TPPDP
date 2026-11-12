import React, { useState } from 'react';
import {
  BookmarkCheck,
  Search,
  Plus,
  ArrowUpRight,
  Filter,
  Trash2,
  Edit2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Student, ReadingStage } from '../types';
import { StageBadge } from '../components/StageBadge';
import { BentoCard } from '../components/BentoCard';

interface IqraTrackerProps {
  students: Student[];
  selectedSchool: string;
  onOpenAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onPromoteStage: (student: Student, nextStage: ReadingStage) => void;
}

const IQRA_STAGES: ReadingStage[] = ['I1', 'I2', 'I3', 'I4', 'I5', 'I6'];

export const IqraTracker: React.FC<IqraTrackerProps> = ({
  students,
  selectedSchool,
  onOpenAddStudent,
  onEditStudent,
  onDeleteStudent,
  onPromoteStage,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>('ALL');
  const [selectedStage, setSelectedStage] = useState<ReadingStage | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter only Iqra students
  const iqraStudents = students.filter((s) => {
    const isIqra = s.current_stage.startsWith('I');
    const matchesSchool = selectedSchool === 'SEMUA' || s.school_name === selectedSchool;
    const matchesGrade = selectedGrade === 'ALL' || s.grade === selectedGrade;
    const matchesStage = selectedStage === 'ALL' || s.current_stage === selectedStage;
    const matchesQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.class_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mykid.includes(searchQuery);

    return isIqra && matchesSchool && matchesGrade && matchesStage && matchesQuery;
  });

  const getNextStage = (stage: ReadingStage): ReadingStage => {
    switch (stage) {
      case 'I1': return 'I2';
      case 'I2': return 'I3';
      case 'I3': return 'I4';
      case 'I4': return 'I5';
      case 'I5': return 'I6';
      case 'I6': return 'J1-5';
      default: return 'J1-5';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Modul Bimbingan Asas
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">Iqra 1 hingga Iqra 6 (Tahun 1-6)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Penjejakan Pembacaan Iqra & Program KLAQ
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Senarai murid yang sedang mengikuti pembelajaran buku Iqra 1 hingga 6 sebelum melangkah ke Mushaf Al-Quran.
          </p>
        </div>

        <button
          onClick={onOpenAddStudent}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all whitespace-nowrap self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Daftar Murid Iqra</span>
        </button>
      </div>

      {/* Stage Fast Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        <button
          onClick={() => setSelectedStage('ALL')}
          className={`p-2.5 rounded-xl text-center text-xs font-semibold transition-all border cursor-pointer ${
            selectedStage === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Semua Iqra ({students.filter((s) => s.current_stage.startsWith('I') && (selectedSchool === 'SEMUA' || s.school_name === selectedSchool)).length})
        </button>

        {IQRA_STAGES.map((stg) => {
          const count = students.filter(
            (s) => s.current_stage === stg && (selectedSchool === 'SEMUA' || s.school_name === selectedSchool)
          ).length;
          const isSelected = selectedStage === stg;
          const isIntervensi = ['I1', 'I2', 'I3'].includes(stg);

          return (
            <button
              key={stg}
              onClick={() => setSelectedStage(stg)}
              className={`p-2.5 rounded-xl text-center text-xs font-mono font-bold transition-all border cursor-pointer ${
                isSelected
                  ? 'ring-2 ring-blue-600 scale-[1.02] shadow-xs'
                  : 'hover:opacity-90'
              } ${
                isIntervensi
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-yellow-50 text-yellow-800 border-yellow-200'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <span>{stg}</span>
                <span className="font-normal font-sans opacity-70">({count})</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Grade Selector & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Grade tabs */}
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

        {/* Search Bar */}
        <div className="relative min-w-[220px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama murid / kelas / MyKid..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Students Data Table */}
      <BentoCard
        title={`Senarai Murid Iqra (${iqraStudents.length})`}
        subtitle="Intervensi & Rekod Tasmik Harian"
      >
        {iqraStudents.length === 0 ? (
          <div className="py-12 text-center">
            <BookmarkCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-700">Tiada Murid Dijumpai</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Tiada rekod murid yang sepadan dengan tapisan semasa atau semua murid dalam kumpulan ini telah berpindah ke Mushaf Al-Quran.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pl-2">Nama Murid & MyKid</th>
                  <th className="pb-3">Sekolah & Kelas</th>
                  <th className="pb-3 text-center">Tahap Semasa</th>
                  <th className="pb-3 text-center">Muka Surat</th>
                  <th className="pb-3">Guru Pembimbing</th>
                  <th className="pb-3 text-right pr-2">Tindakan Pantas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {iqraStudents.map((student) => {
                  const isRedIntervention = ['I1', 'I2', 'I3'].includes(student.current_stage);
                  const nextStage = getNextStage(student.current_stage);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="py-3 pl-2">
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {student.name}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>{student.mykid}</span>
                          <span>·</span>
                          <span>{student.gender}</span>
                          {isRedIntervention && (
                            <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded">
                              KLAQ
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3">
                        <div className="font-medium text-slate-800">{student.class_name}</div>
                        <div className="text-[11px] text-slate-400">{student.school_name}</div>
                      </td>

                      <td className="py-3 text-center">
                        <StageBadge stage={student.current_stage} />
                      </td>

                      <td className="py-3 text-center font-mono font-medium text-slate-700">
                        {student.current_page ? `Hlm. ${student.current_page}` : '-'}
                      </td>

                      <td className="py-3">
                        <div className="text-slate-700 truncate max-w-[160px]">
                          {student.teacher_in_charge}
                        </div>
                        {student.notes && (
                          <div className="text-[10px] text-slate-400 italic truncate max-w-[160px]">
                            {student.notes}
                          </div>
                        )}
                      </td>

                      <td className="py-3 pr-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Promote Button */}
                          <button
                            onClick={() => onPromoteStage(student, nextStage)}
                            title={`Naik taraf ke ${nextStage}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
                          >
                            <span>Naik {nextStage}</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => onEditStudent(student)}
                            title="Sunting Rekod"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              if (confirm(`Adakah anda pasti mahu memadam rekod ${student.name}?`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            title="Padam Rekod"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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

    </div>
  );
};
