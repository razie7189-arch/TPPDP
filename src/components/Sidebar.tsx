import React from 'react';
import {
  LayoutDashboard,
  BookmarkCheck,
  FileSpreadsheet,
  Users,
  Settings,
  FileText,
  Sparkles,
  BookMarked,
  Scroll,
  Award,
  ChevronRight,
  School as SchoolIcon,
} from 'lucide-react';
import { ActivePage, CustomModule } from '../types';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  customModules: CustomModule[];
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  selectedSchool: string;
  onSelectSchool: (school: string) => void;
  schoolList: { id: string; name: string }[];
}

interface NavItem {
  id: ActivePage;
  label: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ComponentType<{ className?: string }>;
  kicker?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  customModules,
  isOpenMobile,
  onCloseMobile,
  selectedSchool,
  onSelectSchool,
  schoolList,
}) => {
  const mainNavItems: NavItem[] = [
    {
      id: 'analisis',
      label: 'Analisis Bacaan',
      kicker: 'Papan Pemuka',
      icon: LayoutDashboard,
    },
    {
      id: 'rekalibrasi-itqan',
      label: 'Rekalibrasi ITQAN',
      badge: 'j-QAF 2026',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      kicker: 'Matriks Rasmi',
      icon: FileSpreadsheet,
    },
    {
      id: 'iqra',
      label: 'Iqra 1 - Iqra 6',
      kicker: 'Tahun 1 hingga 6',
      icon: BookmarkCheck,
    },
    {
      id: 'juz1-5',
      label: 'Juz 1 hingga Juz 5',
      kicker: 'Tahap Awal',
      icon: BookMarked,
    },
    {
      id: 'juz6-10',
      label: 'Juz 6 hingga Juz 10',
      kicker: 'Tahap Pertengahan',
      icon: Scroll,
    },
    {
      id: 'juz11-20',
      label: 'Juz 11 hingga Juz 20',
      kicker: 'Tahap Lanjutan',
      icon: Scroll,
    },
    {
      id: 'juz21-25',
      label: 'Juz 21 hingga Juz 25',
      kicker: 'Tahap Mahir',
      icon: Scroll,
    },
    {
      id: 'juz26-30-khatam',
      label: 'Juz 26-30 & Khatam',
      badge: 'Khatam',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
      kicker: 'Puncak Kejayaan',
      icon: Award,
    },
  ];

  const secondaryNavItems: NavItem[] = [
    {
      id: 'unit-pendidikan-islam',
      label: 'Unit Pendidikan Islam PPD',
      kicker: 'Pengurusan Daerah',
      icon: Users,
    },
    {
      id: 'dokumen-pdf',
      label: 'Pengurusan Dokumen PDF',
      badge: 'e-Fail',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      kicker: 'Drive & Templat',
      icon: FileText,
    },
    {
      id: 'tetapan',
      label: 'Pengurusan Dashboard',
      kicker: 'Tetapan & Modul',
      icon: Settings,
    },
  ];

  const handleItemClick = (pageId: ActivePage) => {
    onNavigate(pageId);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-white">
      {/* Mobile Header Filter */}
      <div className="md:hidden px-4 pt-4 pb-2 border-b border-slate-100">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
          Sekolah Aktif
        </label>
        <div className="relative">
          <select
            value={selectedSchool}
            onChange={(e) => onSelectSchool(e.target.value)}
            className="w-full py-2 pl-3 pr-8 text-xs font-medium bg-slate-100 rounded-lg border-0 text-slate-800"
          >
            <option value="SEMUA">Semua Sekolah (PPD Penampang)</option>
            {schoolList.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {/* Main Section */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Modul Pelaporan Bacaan
            </span>
            <span className="text-[10px] text-blue-600 font-semibold font-mono">
              2026
            </span>
          </div>
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                      }`}
                    />
                    <div className="truncate">
                      <span className="block truncate">{item.label}</span>
                    </div>
                  </div>
                  {item.badge ? (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border font-mono tracking-tight shrink-0 ${
                        isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight
                      className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isActive ? 'text-white opacity-100' : 'text-slate-400'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Panitia & Organisasi Section */}
        <div>
          <div className="px-3 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pengurusan & Sumber
            </span>
          </div>
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border font-mono shrink-0 ${
                        isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Custom Modules Added via Tetapan */}
        {customModules.length > 0 && (
          <div>
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pautan Tambahan
              </span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </div>
            <div className="space-y-1">
              {customModules
                .filter((m) => m.is_active)
                .sort((a, b) => a.order_index - b.order_index)
                .map((module) => {
                  return (
                    <button
                      key={module.id}
                      onClick={() => handleItemClick(module.page_url.replace('#/', '') || 'analisis')}
                      className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span className="truncate">{module.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Modul</span>
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 shrink-0">
            <SchoolIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-900 truncate">
              PPD Penampang
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              Unit Pendidikan Islam
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200/90 shrink-0 h-[calc(100vh-5rem)] sticky top-20 z-20">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://iili.io/CeHysTB.png" alt="Logo" className="w-6 h-6 object-contain" />
            <span className="text-xs font-bold text-slate-900">PPD Penampang</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1 rounded-md"
          >
            Tutup
          </button>
        </div>
        <div className="h-[calc(100%-4rem)]">{content}</div>
      </div>
    </>
  );
};
