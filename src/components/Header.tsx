import React from 'react';
import { School as SchoolIcon, Plus, BookOpen, Layers } from 'lucide-react';
import { School } from '../types';

interface HeaderProps {
  schools: School[];
  selectedSchool: string;
  onSelectSchool: (school: string) => void;
  onOpenAddStudent: () => void;
  activePageTitle?: string;
  totalStudents: number;
}

export const Header: React.FC<HeaderProps> = ({
  schools,
  selectedSchool,
  onSelectSchool,
  onOpenAddStudent,
  totalStudents,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand & Logo Section */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 border border-slate-200/80 p-1.5 shadow-xs">
              <img
                src="https://iili.io/CeHysTB.png"
                alt="Logo PPD Penampang"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                  Unit Pendidikan Islam · PPD Penampang
                </span>
                <span className="hidden sm:inline-block text-[11px] font-medium text-slate-400">
                  Sesi 2026
                </span>
              </div>
              <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-slate-900 truncate">
                Portal Pelaporan Bacaan AL-Quran Daerah Penampang
              </h1>
            </div>
          </div>

          {/* Quick Filters & Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* School Selector Dropdown */}
            <div className="relative hidden md:flex items-center">
              <label htmlFor="school-filter" className="sr-only">Pilih Sekolah</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <SchoolIcon className="w-4 h-4" />
                </div>
                <select
                  id="school-filter"
                  value={selectedSchool}
                  onChange={(e) => onSelectSchool(e.target.value)}
                  className="pl-9 pr-8 py-2 bg-slate-100/90 hover:bg-slate-200/70 text-xs font-semibold text-slate-800 rounded-xl border-0 focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="SEMUA">Semua Sekolah (PPD Penampang)</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.name}>
                      {school.name} ({school.code})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                  <Layers className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Quick Record Counter */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 font-mono">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>
                <strong className="text-slate-900 font-semibold">{totalStudents}</strong> Murid Terdaftar
              </span>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onOpenAddStudent}
              className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:shadow-md shadow-blue-500/20 transition-all whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Daftar Murid</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
