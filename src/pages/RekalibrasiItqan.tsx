import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  RefreshCw,
  Save,
  CheckCircle2,
  Sparkles,
  School as SchoolIcon,
  HelpCircle,
  Calculator,
} from 'lucide-react';
import { RecalibrationRow, Student, School } from '../types';
import { updateRecalibrationRow } from '../lib/storage';

interface RekalibrasiItqanProps {
  recalibrationData: RecalibrationRow[];
  students: Student[];
  schools: School[];
  selectedSchool: string;
}

export const RekalibrasiItqan: React.FC<RekalibrasiItqanProps> = ({
  recalibrationData,
  students,
  schools,
  selectedSchool,
}) => {
  const [data, setData] = useState<RecalibrationRow[]>(recalibrationData);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Calculate totals across all grades
  const totalStudents = data.reduce((acc, r) => acc + (r.total_students || 0), 0);
  const totalI1 = data.reduce((acc, r) => acc + (r.i1 || 0), 0);
  const totalI2 = data.reduce((acc, r) => acc + (r.i2 || 0), 0);
  const totalI3 = data.reduce((acc, r) => acc + (r.i3 || 0), 0);
  const totalI4 = data.reduce((acc, r) => acc + (r.i4 || 0), 0);
  const totalI5 = data.reduce((acc, r) => acc + (r.i5 || 0), 0);
  const totalI6 = data.reduce((acc, r) => acc + (r.i6 || 0), 0);
  const totalJ1_5 = data.reduce((acc, r) => acc + (r.j1_5 || 0), 0);
  const totalJ6_10 = data.reduce((acc, r) => acc + (r.j6_10 || 0), 0);
  const totalJ11_15 = data.reduce((acc, r) => acc + (r.j11_15 || 0), 0);
  const totalJ16_20 = data.reduce((acc, r) => acc + (r.j16_20 || 0), 0);
  const totalJ21_25 = data.reduce((acc, r) => acc + (r.j21_25 || 0), 0);
  const totalJ26_30 = data.reduce((acc, r) => acc + (r.j26_30 || 0), 0);
  const totalKhatam = data.reduce((acc, r) => acc + (r.khatam || 0), 0);

  const calcPercent = (val: number) => {
    if (!totalStudents || totalStudents === 0) return '0.0%';
    return `${((val / totalStudents) * 100).toFixed(1)}%`;
  };

  const handleCellChange = (grade: number, field: keyof RecalibrationRow, val: string) => {
    const num = parseInt(val, 10) || 0;
    const updated = data.map((row) => {
      if (row.grade === grade) {
        const newRow = { ...row, [field]: num };
        newRow.total_students =
          (newRow.i1 || 0) +
          (newRow.i2 || 0) +
          (newRow.i3 || 0) +
          (newRow.i4 || 0) +
          (newRow.i5 || 0) +
          (newRow.i6 || 0) +
          (newRow.j1_5 || 0) +
          (newRow.j6_10 || 0) +
          (newRow.j11_15 || 0) +
          (newRow.j16_20 || 0) +
          (newRow.j21_25 || 0) +
          (newRow.j26_30 || 0) +
          (newRow.khatam || 0);
        return newRow;
      }
      return row;
    });
    setData(updated);
  };

  const handleSave = () => {
    data.forEach((r) => {
      updateRecalibrationRow(r.grade, r);
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Populate matrix directly from individual student records in the system
  const handleSyncFromLiveStudents = () => {
    const filtered = selectedSchool === 'SEMUA'
      ? students
      : students.filter((s) => s.school_name === selectedSchool);

    const grades = [1, 2, 3, 4, 5, 6];
    const generated: RecalibrationRow[] = grades.map((g) => {
      const gStudents = filtered.filter((s) => s.grade === g);
      const countStage = (stg: string) => gStudents.filter((s) => s.current_stage === stg).length;
      const row: RecalibrationRow = {
        grade: g,
        grade_label: `TAHUN ${g}`,
        total_students: gStudents.length,
        i1: countStage('I1'),
        i2: countStage('I2'),
        i3: countStage('I3'),
        i4: countStage('I4'),
        i5: countStage('I5'),
        i6: countStage('I6'),
        j1_5: countStage('J1-5'),
        j6_10: countStage('J6-10'),
        j11_15: countStage('J11-15'),
        j16_20: countStage('J16-20'),
        j21_25: countStage('J21-25'),
        j26_30: countStage('J26-30'),
        khatam: countStage('KHATAM'),
      };
      return row;
    });

    setData(generated);
    generated.forEach((r) => updateRecalibrationRow(r.grade, r));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Toolbar (Hidden during print) */}
      <div className="no-print bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Model Khatam Al-Quran & Tasmik j-QAF
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">Borang Tapak Rekalibrasi Rasmi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Tapak Rekalibrasi Program j-QAF Tahun 2026
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Matriks pelaporan digital piawai bagi {selectedSchool === 'SEMUA' ? 'PPD Penampang' : selectedSchool} dengan pengiraan automatik peratusan dan tahap pencapaian.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              isEditMode
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isEditMode ? '✓ Mod Edit Aktif' : '✎ Sunting Angka Sel'}
          </button>

          <button
            onClick={handleSyncFromLiveStudents}
            title="Kira data secara automatik berdasarkan senarai rekod murid semasa"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-all cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5 text-blue-600" />
            <span>Kira dari Rekod Murid</span>
          </button>

          {isEditMode && (
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Tapak</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="no-print p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Matriks Rekalibrasi berjaya dikemaskini dan disimpan ke pangkalan data!</span>
        </div>
      )}

      {/* Main ITQAN Matrix Sheet - Exact reproduction of PDF Layout */}
      <div className="bg-white rounded-2xl border border-slate-300/80 shadow-md overflow-hidden p-4 sm:p-6 print:border-none print:shadow-none print:p-0">
        
        {/* Top Header of the Table (Matches the PDF header banner) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <img src="https://iili.io/CeHysTB.png" alt="Logo" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 uppercase tracking-tight">
                Tapak Rekalibrasi Program j-QAF Tahun 2026
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                PPD Penampang · {selectedSchool === 'SEMUA' ? 'Data Keseluruhan Daerah' : selectedSchool}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-900 rounded font-mono">
              itQan 2026
            </span>
          </div>
        </div>

        {/* 1. JADUAL UTAMA: KELAS & TAHAP BACAAN */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-slate-900 text-xs font-medium">
            <thead>
              <tr className="text-slate-900 uppercase font-extrabold text-[11px] leading-tight">
                <th className="border border-slate-900 bg-white p-2.5 min-w-[90px] text-left">
                  KELAS
                </th>
                <th className="border border-slate-900 bg-white p-2 min-w-[70px]">
                  BIL.<br />MURID
                </th>
                {/* Red Band: I1 - I3 */}
                <th className="border border-slate-900 bg-red-600 text-white p-2 min-w-[42px] font-black text-sm">
                  I1
                </th>
                <th className="border border-slate-900 bg-red-600 text-white p-2 min-w-[42px] font-black text-sm">
                  I2
                </th>
                <th className="border border-slate-900 bg-red-600 text-white p-2 min-w-[42px] font-black text-sm">
                  I3
                </th>
                {/* Yellow Band: I4 - I6 */}
                <th className="border border-slate-900 bg-yellow-300 text-black p-2 min-w-[42px] font-black text-sm">
                  I4
                </th>
                <th className="border border-slate-900 bg-yellow-300 text-black p-2 min-w-[42px] font-black text-sm">
                  I5
                </th>
                <th className="border border-slate-900 bg-yellow-300 text-black p-2 min-w-[42px] font-black text-sm">
                  I6
                </th>
                {/* Light Silver Band: JUZ 1-5, JUZ 6-10 */}
                <th className="border border-slate-900 bg-slate-200 text-black p-1.5 min-w-[55px] font-bold">
                  JUZ<br />1-5
                </th>
                <th className="border border-slate-900 bg-slate-200 text-black p-1.5 min-w-[55px] font-bold">
                  JUZ<br />6-10
                </th>
                {/* Soft Green Band: JUZ 11-15, 16-20, 21-25, 26-30 */}
                <th className="border border-slate-900 bg-emerald-200 text-black p-1.5 min-w-[55px] font-bold">
                  JUZ<br />11-15
                </th>
                <th className="border border-slate-900 bg-emerald-200 text-black p-1.5 min-w-[55px] font-bold">
                  JUZ<br />16-20
                </th>
                <th className="border border-slate-900 bg-emerald-200 text-black p-1.5 min-w-[55px] font-bold">
                  JUZ<br />21-25
                </th>
                <th className="border border-slate-900 bg-emerald-200 text-black p-1.5 min-w-[55px] font-bold">
                  JUZ<br />26-30
                </th>
                {/* Gold Band: KHATAM */}
                <th className="border border-slate-900 bg-amber-300 text-black p-2 min-w-[70px] font-black">
                  KHATAM
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.map((row) => (
                <tr key={row.grade} className="font-mono text-xs">
                  <td className="border border-slate-900 bg-slate-100 p-2 text-left font-sans font-bold text-slate-900">
                    {row.grade_label}
                  </td>
                  <td className="border border-slate-900 bg-slate-50 p-2 font-bold text-slate-900">
                    {row.total_students}
                  </td>

                  {/* Red Columns */}
                  <td className="border border-slate-900 bg-red-100/70 p-1 font-bold text-red-900">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={row.i1}
                        onChange={(e) => handleCellChange(row.grade, 'i1', e.target.value)}
                        className="w-10 text-center font-bold bg-white rounded border border-red-300 text-xs py-0.5"
                      />
                    ) : (
                      row.i1
                    )}
                  </td>
                  <td className="border border-slate-900 bg-red-100/70 p-1 font-bold text-red-900">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={row.i2}
                        onChange={(e) => handleCellChange(row.grade, 'i2', e.target.value)}
                        className="w-10 text-center font-bold bg-white rounded border border-red-300 text-xs py-0.5"
                      />
                    ) : (
                      row.i2
                    )}
                  </td>
                  <td className="border border-slate-900 bg-red-100/70 p-1 font-bold text-red-900">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={row.i3}
                        onChange={(e) => handleCellChange(row.grade, 'i3', e.target.value)}
                        className="w-10 text-center font-bold bg-white rounded border border-red-300 text-xs py-0.5"
                      />
                    ) : (
                      row.i3
                    )}
                  </td>

                  {/* Yellow Columns */}
                  <td className="border border-slate-900 bg-yellow-100/70 p-1 font-bold text-yellow-950">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={row.i4}
                        onChange={(e) => handleCellChange(row.grade, 'i4', e.target.value)}
                        className="w-10 text-center font-bold bg-white rounded border border-yellow-300 text-xs py-0.5"
                      />
                    ) : (
                      row.i4
                    )}
                  </td>
                  <td className="border border-slate-900 bg-yellow-100/70 p-1 font-bold text-yellow-950">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={row.i5}
                        onChange={(e) => handleCellChange(row.grade, 'i5', e.target.value)}
                        className="w-10 text-center font-bold bg-white rounded border border-yellow-300 text-xs py-0.5"
                      />
                    ) : (
                      row.i5
                    )}
                  </td>
                  <td className="border border-slate-900 bg-yellow-100/70 p-1 font-bold text-yellow-950">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={row.i6}
                        onChange={(e) => handleCellChange(row.grade, 'i6', e.target.value)}
                        className="w-10 text-center font-bold bg-white rounded border border-yellow-300 text-xs py-0.5"
                      />
                    ) : (
                      row.i6
                    )}
                  </td>

                  {/* Silver Columns */}
                  <td className="border border-slate-900 bg-slate-50 p-1 text-slate-800">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={row.j1_5}
                        onChange={(e) => handleCellChange(row.grade, 'j1_5', e.target.value)}
                        className="w-10 text-center bg-white rounded border border-slate-300 text-xs py-0.5"
                      />
                    ) : (
                      row.j1_5
                    )}
                  </td>
                  <td className="border border-slate-900 bg-slate-50 p-1 text-slate-800">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={row.j6_10}
                        onChange={(e) => handleCellChange(row.grade, 'j6_10', e.target.value)}
                        className="w-10 text-center bg-white rounded border border-slate-300 text-xs py-0.5"
                      />
                    ) : (
                      row.j6_10
                    )}
                  </td>

                  {/* Soft Green Columns */}
                  <td className="border border-slate-900 bg-emerald-50 p-1 text-emerald-950 font-medium">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={row.j11_15}
                        onChange={(e) => handleCellChange(row.grade, 'j11_15', e.target.value)}
                        className="w-10 text-center bg-white rounded border border-emerald-300 text-xs py-0.5"
                      />
                    ) : (
                      row.j11_15
                    )}
                  </td>
                  <td className="border border-slate-900 bg-emerald-50 p-1 text-emerald-950 font-medium">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={row.j16_20}
                        onChange={(e) => handleCellChange(row.grade, 'j16_20', e.target.value)}
                        className="w-10 text-center bg-white rounded border border-emerald-300 text-xs py-0.5"
                      />
                    ) : (
                      row.j16_20
                    )}
                  </td>
                  <td className="border border-slate-900 bg-emerald-50 p-1 text-emerald-950 font-medium">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={row.j21_25}
                        onChange={(e) => handleCellChange(row.grade, 'j21_25', e.target.value)}
                        className="w-10 text-center bg-white rounded border border-emerald-300 text-xs py-0.5"
                      />
                    ) : (
                      row.j21_25
                    )}
                  </td>
                  <td className="border border-slate-900 bg-emerald-50 p-1 text-emerald-950 font-medium">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={row.j26_30}
                        onChange={(e) => handleCellChange(row.grade, 'j26_30', e.target.value)}
                        className="w-10 text-center bg-white rounded border border-emerald-300 text-xs py-0.5"
                      />
                    ) : (
                      row.j26_30
                    )}
                  </td>

                  {/* Gold Column */}
                  <td className="border border-slate-900 bg-amber-100/80 p-1 font-bold text-amber-950">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={row.khatam}
                        onChange={(e) => handleCellChange(row.grade, 'khatam', e.target.value)}
                        className="w-10 text-center font-bold bg-white rounded border border-amber-400 text-xs py-0.5"
                      />
                    ) : (
                      row.khatam
                    )}
                  </td>
                </tr>
              ))}

              {/* JUMLAH KESELURUHAN ROW */}
              <tr className="border-t-2 border-slate-900 bg-slate-200 font-extrabold text-xs">
                <td className="border border-slate-900 p-2 text-left font-sans font-black text-slate-900">
                  JUMLAH
                </td>
                <td className="border border-slate-900 p-2 font-mono font-black text-slate-900">
                  {totalStudents}
                </td>
                <td className="border border-slate-900 p-2 font-mono bg-red-200 text-red-950">{totalI1}</td>
                <td className="border border-slate-900 p-2 font-mono bg-red-200 text-red-950">{totalI2}</td>
                <td className="border border-slate-900 p-2 font-mono bg-red-200 text-red-950">{totalI3}</td>
                <td className="border border-slate-900 p-2 font-mono bg-yellow-200 text-yellow-950">{totalI4}</td>
                <td className="border border-slate-900 p-2 font-mono bg-yellow-200 text-yellow-950">{totalI5}</td>
                <td className="border border-slate-900 p-2 font-mono bg-yellow-200 text-yellow-950">{totalI6}</td>
                <td className="border border-slate-900 p-2 font-mono">{totalJ1_5}</td>
                <td className="border border-slate-900 p-2 font-mono">{totalJ6_10}</td>
                <td className="border border-slate-900 p-2 font-mono bg-emerald-200 text-emerald-950">{totalJ11_15}</td>
                <td className="border border-slate-900 p-2 font-mono bg-emerald-200 text-emerald-950">{totalJ16_20}</td>
                <td className="border border-slate-900 p-2 font-mono bg-emerald-200 text-emerald-950">{totalJ21_25}</td>
                <td className="border border-slate-900 p-2 font-mono bg-emerald-200 text-emerald-950">{totalJ26_30}</td>
                <td className="border border-slate-900 p-2 font-mono bg-amber-300 text-amber-950 font-black">{totalKhatam}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 2. JADUAL RINGKASAN & PERATUSAN (Matches Page 2 of the PDF) */}
        <div className="mt-8 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Jadual Analisis Peratusan Suku & Keseluruhan (Format PDF Halaman 2)
          </h3>

          {/* Table A: Iqra 1 - 6 Counts & % */}
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse border border-slate-900 text-xs">
              <thead>
                <tr className="font-extrabold text-slate-900">
                  <th className="border border-slate-900 bg-white p-2 text-left w-36">
                    ITEM / PERKARA
                  </th>
                  <th className="border border-slate-900 bg-red-600 text-white p-2">IQRA 1</th>
                  <th className="border border-slate-900 bg-red-600 text-white p-2">IQRA 2</th>
                  <th className="border border-slate-900 bg-red-600 text-white p-2">IQRA 3</th>
                  <th className="border border-slate-900 bg-yellow-300 text-black p-2">IQRA 4</th>
                  <th className="border border-slate-900 bg-yellow-300 text-black p-2">IQRA 5</th>
                  <th className="border border-slate-900 bg-yellow-300 text-black p-2">IQRA 6</th>
                </tr>
              </thead>
              <tbody>
                <tr className="font-mono font-bold">
                  <td className="border border-slate-900 bg-slate-50 p-2 text-left font-sans font-semibold">
                    Bilangan Murid
                  </td>
                  <td className="border border-slate-900 p-2 bg-red-50 text-red-900">{totalI1}</td>
                  <td className="border border-slate-900 p-2 bg-red-50 text-red-900">{totalI2}</td>
                  <td className="border border-slate-900 p-2 bg-red-50 text-red-900">{totalI3}</td>
                  <td className="border border-slate-900 p-2 bg-yellow-50 text-yellow-950">{totalI4}</td>
                  <td className="border border-slate-900 p-2 bg-yellow-50 text-yellow-950">{totalI5}</td>
                  <td className="border border-slate-900 p-2 bg-yellow-50 text-yellow-950">{totalI6}</td>
                </tr>
                <tr className="font-mono font-bold bg-slate-100">
                  <td className="border border-slate-900 p-2 text-left font-sans font-black">
                    Peratusan (%)
                  </td>
                  <td className="border border-slate-900 p-2 text-red-700">{calcPercent(totalI1)}</td>
                  <td className="border border-slate-900 p-2 text-red-700">{calcPercent(totalI2)}</td>
                  <td className="border border-slate-900 p-2 text-red-700">{calcPercent(totalI3)}</td>
                  <td className="border border-slate-900 p-2 text-amber-800">{calcPercent(totalI4)}</td>
                  <td className="border border-slate-900 p-2 text-amber-800">{calcPercent(totalI5)}</td>
                  <td className="border border-slate-900 p-2 text-amber-800">{calcPercent(totalI6)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table B: Juz 1-5 to Juz 26-30 & Khatam Counts & % */}
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse border border-slate-900 text-xs">
              <thead>
                <tr className="font-extrabold text-slate-900">
                  <th className="border border-slate-900 bg-white p-2 text-left w-36">
                    ITEM / PERKARA
                  </th>
                  <th className="border border-slate-900 bg-slate-200 text-black p-2">J 1-5</th>
                  <th className="border border-slate-900 bg-slate-200 text-black p-2">J 6-10</th>
                  <th className="border border-slate-900 bg-emerald-200 text-black p-2">J 11-15</th>
                  <th className="border border-slate-900 bg-emerald-200 text-black p-2">J 16-20</th>
                  <th className="border border-slate-900 bg-emerald-200 text-black p-2">J 21-25</th>
                  <th className="border border-slate-900 bg-emerald-200 text-black p-2">J 26-30</th>
                  <th className="border border-slate-900 bg-amber-300 text-black p-2">KHATAM</th>
                </tr>
              </thead>
              <tbody>
                <tr className="font-mono font-bold">
                  <td className="border border-slate-900 bg-slate-50 p-2 text-left font-sans font-semibold">
                    Bilangan Murid
                  </td>
                  <td className="border border-slate-900 p-2">{totalJ1_5}</td>
                  <td className="border border-slate-900 p-2">{totalJ6_10}</td>
                  <td className="border border-slate-900 p-2 bg-emerald-50 text-emerald-900">{totalJ11_15}</td>
                  <td className="border border-slate-900 p-2 bg-emerald-50 text-emerald-900">{totalJ16_20}</td>
                  <td className="border border-slate-900 p-2 bg-emerald-50 text-emerald-900">{totalJ21_25}</td>
                  <td className="border border-slate-900 p-2 bg-emerald-50 text-emerald-900">{totalJ26_30}</td>
                  <td className="border border-slate-900 p-2 bg-amber-100 text-amber-950 font-black">{totalKhatam}</td>
                </tr>
                <tr className="font-mono font-bold bg-slate-100">
                  <td className="border border-slate-900 p-2 text-left font-sans font-black">
                    Peratusan (%)
                  </td>
                  <td className="border border-slate-900 p-2">{calcPercent(totalJ1_5)}</td>
                  <td className="border border-slate-900 p-2">{calcPercent(totalJ6_10)}</td>
                  <td className="border border-slate-900 p-2 text-emerald-700">{calcPercent(totalJ11_15)}</td>
                  <td className="border border-slate-900 p-2 text-emerald-700">{calcPercent(totalJ16_20)}</td>
                  <td className="border border-slate-900 p-2 text-emerald-700">{calcPercent(totalJ21_25)}</td>
                  <td className="border border-slate-900 p-2 text-emerald-700">{calcPercent(totalJ26_30)}</td>
                  <td className="border border-slate-900 p-2 text-amber-800 font-black">{calcPercent(totalKhatam)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Signature & Verification Footnote (for Print / Official Report) */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-700">
          <div>
            <p className="font-semibold text-slate-900">Disediakan Oleh:</p>
            <div className="h-12 border-b border-dashed border-slate-300"></div>
            <p className="mt-2 font-medium">Penyelaras j-QAF / Guru Pendidikan Islam</p>
            <p className="text-[11px] text-slate-500">Tarikh: {new Date().toLocaleDateString('ms-MY')}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Disahkan Oleh:</p>
            <div className="h-12 border-b border-dashed border-slate-300"></div>
            <p className="mt-2 font-medium">Pegawai Unit Pendidikan Islam / Guru Besar</p>
            <p className="text-[11px] text-slate-500">PPD Penampang / JPN Sabah</p>
          </div>
        </div>

      </div>

    </div>
  );
};
