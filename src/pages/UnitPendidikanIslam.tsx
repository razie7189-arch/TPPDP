import React, { useState } from 'react';
import {
  Users,
  Award,
  Mail,
  Phone,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  Building,
  School as SchoolIcon,
} from 'lucide-react';
import { PPDOfficer, Teacher } from '../types';
import { BentoCard } from '../components/BentoCard';

interface UnitPendidikanIslamProps {
  officers: PPDOfficer[];
  teachers: Teacher[];
  selectedSchool: string;
  onOpenAddOfficer: () => void;
  onOpenAddTeacher: () => void;
  onEditOfficer: (officer: PPDOfficer) => void;
  onEditTeacher: (teacher: Teacher) => void;
  onDeleteOfficer: (id: string) => void;
  onDeleteTeacher: (id: string) => void;
}

export const UnitPendidikanIslam: React.FC<UnitPendidikanIslamProps> = ({
  officers,
  teachers,
  selectedSchool,
  onOpenAddOfficer,
  onOpenAddTeacher,
  onEditOfficer,
  onEditTeacher,
  onDeleteOfficer,
  onDeleteTeacher,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'officers' | 'jud' | 'teachers'>('all');

  const judTeachers = teachers.filter((t) => t.is_jurulatih_utama);
  const filteredTeachers = selectedSchool === 'SEMUA'
    ? teachers
    : teachers.filter((t) => t.school_name === selectedSchool);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200/60 p-2 shrink-0 flex items-center justify-center">
            <img src="https://iili.io/CeHysTB.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Sektor Pembelajaran
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">PPD Penampang, Sabah</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
              Barisan Unit Pendidikan Islam PPD Penampang
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Direktori kepimpinan, Pegawai Meja j-QAF, Jurulatih Utama Daerah (JUD) Model Khatam Al-Quran, dan Guru-guru Panitia Pendidikan Islam Daerah Penampang.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onOpenAddOfficer}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Pegawai PPD</span>
          </button>
          <button
            onClick={onOpenAddTeacher}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Guru / JUD</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Semua ({officers.length + teachers.length})
        </button>
        <button
          onClick={() => setActiveTab('officers')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'officers' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pegawai PPD Penampang ({officers.length})
        </button>
        <button
          onClick={() => setActiveTab('jud')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'jud' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Jurulatih Utama Daerah ({judTeachers.length})
        </button>
        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'teachers' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Guru Panitia Sekolah ({filteredTeachers.length})
        </button>
      </div>

      {/* Section 1: Pegawai PPD Penampang (Organization Grid) */}
      {(activeTab === 'all' || activeTab === 'officers') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Pegawai Pengurusan Unit Pendidikan Islam PPD Penampang</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{officers.length} Pegawai</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {officers.map((officer) => (
              <div
                key={officer.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      PPD Penampang
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditOfficer(officer)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Padam pegawai ${officer.name}?`)) onDeleteOfficer(officer.id);
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-2.5">
                    {officer.name}
                  </h4>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">
                    {officer.position}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {officer.department}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-[11px]">{officer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px] truncate">{officer.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Jurulatih Utama Daerah (JUD) */}
      {(activeTab === 'all' || activeTab === 'jud') && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Jurulatih Utama Daerah (JUD) j-QAF & Tasmik</span>
            </h3>
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono font-semibold">
              Pakar Rujuk Daerah
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {judTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between bg-gradient-to-br from-white to-amber-50/20"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-600" />
                      <span>JUD Daerah</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditTeacher(teacher)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Padam guru ${teacher.name}?`)) onDeleteTeacher(teacher.id);
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-2.5">
                    {teacher.name}
                  </h4>
                  <p className="text-xs font-semibold text-blue-700 mt-0.5">
                    {teacher.school_name}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {teacher.role}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-[11px]">{teacher.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px] truncate">{teacher.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Semua Guru Panitia Sekolah */}
      {(activeTab === 'all' || activeTab === 'teachers') && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <SchoolIcon className="w-4 h-4 text-slate-600" />
              <span>Senarai Guru Panitia Pendidikan Islam Sekolah ({filteredTeachers.length})</span>
            </h3>
          </div>

          <BentoCard noPadding>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px] bg-slate-50/50">
                    <th className="py-3 pl-4">Nama Guru</th>
                    <th className="py-3">Sekolah</th>
                    <th className="py-3">Peranan</th>
                    <th className="py-3">No. Telefon</th>
                    <th className="py-3">E-mel</th>
                    <th className="py-3 pr-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTeachers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 pl-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{t.name}</span>
                          {t.is_jurulatih_utama && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                              JUD
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 font-medium text-slate-700">
                        {t.school_name}
                      </td>
                      <td className="py-3 text-slate-600">
                        {t.role}
                      </td>
                      <td className="py-3 font-mono text-[11px] text-slate-600">
                        {t.phone}
                      </td>
                      <td className="py-3 text-[11px] text-slate-500">
                        {t.email}
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditTeacher(t)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Padam rekod ${t.name}?`)) onDeleteTeacher(t.id);
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded"
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
          </BentoCard>
        </div>
      )}

    </div>
  );
};
