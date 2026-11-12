import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { Student, ReadingStage, School, Teacher } from '../types';
import { STAGE_CONFIG } from '../lib/storage';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Student, 'id' | 'last_updated'>) => void;
  initialData?: Student | null;
  schools: School[];
  teachers: Teacher[];
  defaultSchool?: string;
}

const ALL_STAGES: ReadingStage[] = [
  'I1', 'I2', 'I3', 'I4', 'I5', 'I6',
  'J1-5', 'J6-10', 'J11-15', 'J16-20', 'J21-25', 'J26-30', 'KHATAM'
];

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  schools,
  teachers,
  defaultSchool,
}) => {
  const [name, setName] = useState('');
  const [mykid, setMykid] = useState('');
  const [gender, setGender] = useState<'Lelaki' | 'Perempuan'>('Lelaki');
  const [schoolName, setSchoolName] = useState('');
  const [grade, setGrade] = useState<number>(1);
  const [className, setClassName] = useState('');
  const [currentStage, setCurrentStage] = useState<ReadingStage>('I1');
  const [currentSurah, setCurrentSurah] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentJuz, setCurrentJuz] = useState<number>(1);
  const [teacherInCharge, setTeacherInCharge] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setMykid(initialData.mykid);
      setGender(initialData.gender);
      setSchoolName(initialData.school_name);
      setGrade(initialData.grade);
      setClassName(initialData.class_name);
      setCurrentStage(initialData.current_stage);
      setCurrentSurah(initialData.current_surah || '');
      setCurrentPage(initialData.current_page || 1);
      setCurrentJuz(initialData.current_juz || 1);
      setTeacherInCharge(initialData.teacher_in_charge);
      setNotes(initialData.notes || '');
    } else {
      setName('');
      setMykid('');
      setGender('Lelaki');
      const fallbackSchool = defaultSchool && defaultSchool !== 'SEMUA' ? defaultSchool : (schools[0]?.name || 'SK Penampang');
      setSchoolName(fallbackSchool);
      setGrade(1);
      setClassName('1 Arif');
      setCurrentStage('I1');
      setCurrentSurah('');
      setCurrentPage(1);
      setCurrentJuz(1);
      setTeacherInCharge(teachers[0]?.name || 'Ustaz Guru Pembimbing');
      setNotes('');
    }
    setError(null);
  }, [initialData, isOpen, schools, defaultSchool, teachers]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Sila masukkan nama penuh murid.');
      return;
    }
    if (!schoolName) {
      setError('Sila pilih sekolah.');
      return;
    }

    const matchedSchool = schools.find((s) => s.name === schoolName);

    onSubmit({
      name: name.trim(),
      mykid: mykid.trim() || 'TIADA-MYKID',
      gender,
      school_id: matchedSchool ? matchedSchool.id : 'sch-gen',
      school_name: schoolName,
      grade,
      class_name: className.trim() || `Tahun ${grade}`,
      current_stage: currentStage,
      current_surah: currentSurah.trim() || undefined,
      current_page: currentPage ? Number(currentPage) : undefined,
      current_juz: currentJuz ? Number(currentJuz) : undefined,
      teacher_in_charge: teacherInCharge.trim() || 'Guru Panitia Pendidikan Islam',
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {initialData ? 'Kemaskini Rekod Bacaan Murid' : 'Daftar Rekod Murid Baharu'}
            </h2>
            <p className="text-xs text-slate-500">
              Borang pelaporan kemajuan Iqra & Al-Quran j-QAF Daerah Penampang
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Name & MyKid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Penuh Murid <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth: Muhammad Adam bin Zulkifli"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. MyKid / Sijil Lahir
              </label>
              <input
                type="text"
                value={mykid}
                onChange={(e) => setMykid(e.target.value)}
                placeholder="cth: 190312-12-5501"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 2: Gender, Grade & Class */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jantina
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Lelaki' | 'Perempuan')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Lelaki">Lelaki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tahun Persekolahan <span className="text-red-500">*</span>
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value={1}>Tahun 1</option>
                <option value={2}>Tahun 2</option>
                <option value={3}>Tahun 3</option>
                <option value={4}>Tahun 4</option>
                <option value={5}>Tahun 5</option>
                <option value={6}>Tahun 6</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Kelas
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="cth: 1 Arif / 1 Bestari"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 3: School */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sekolah Daerah Penampang <span className="text-red-500">*</span>
            </label>
            <select
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {schools.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.code}) - {s.location}
                </option>
              ))}
            </select>
          </div>

          {/* Row 4: Reading Stage Selector with Interactive Colors */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Tahap Bacaan Semasa (Mengikut Kod Warna ITQAN j-QAF) <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {ALL_STAGES.map((stg) => {
                const conf = STAGE_CONFIG[stg];
                const isSelected = currentStage === stg;
                return (
                  <button
                    type="button"
                    key={stg}
                    onClick={() => setCurrentStage(stg)}
                    className={`p-2.5 rounded-xl text-center text-xs font-mono font-bold transition-all relative border cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-blue-600 scale-[1.03] shadow-md'
                        : 'opacity-85 hover:opacity-100 hover:scale-[1.01]'
                    }`}
                    style={{
                      backgroundColor: conf.bgStyle,
                      color: conf.textStyle,
                      borderColor: isSelected ? '#2563eb' : 'rgba(0,0,0,0.1)',
                    }}
                  >
                    <span className="block text-xs">{conf.label}</span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 5: Detailed Reading Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Surah / Ayat Terkini
              </label>
              <input
                type="text"
                value={currentSurah}
                onChange={(e) => setCurrentSurah(e.target.value)}
                placeholder="cth: Al-Baqarah: 141"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Muka Surat (Page)
              </label>
              <input
                type="number"
                min={1}
                max={604}
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Juzuk (1-30)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={currentJuz}
                onChange={(e) => setCurrentJuz(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Row 6: Teacher in Charge */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Guru Tasmik / Guru Pembimbing
            </label>
            <input
              type="text"
              value={teacherInCharge}
              onChange={(e) => setTeacherInCharge(e.target.value)}
              placeholder="cth: Ustazah Siti Aminah binti Razak"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Row 7: Notes / Intervensi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan / Intervensi Khusus
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="cth: Perlu bimbingan makhraj huruf, mengikuti sesi bimbingan KLAQ..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Simpan Perubahan' : 'Daftar Murid'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
