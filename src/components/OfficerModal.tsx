import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { PPDOfficer, Teacher } from '../types';

interface OfficerModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'officer' | 'teacher';
  onSubmitOfficer?: (data: Omit<PPDOfficer, 'id'>) => void;
  onSubmitTeacher?: (data: Omit<Teacher, 'id'>) => void;
  initialOfficer?: PPDOfficer | null;
  initialTeacher?: Teacher | null;
}

export const OfficerModal: React.FC<OfficerModalProps> = ({
  isOpen,
  onClose,
  type,
  onSubmitOfficer,
  onSubmitTeacher,
  initialOfficer,
  initialTeacher,
}) => {
  const [name, setName] = useState('');
  const [roleOrPosition, setRoleOrPosition] = useState('');
  const [schoolOrDept, setSchoolOrDept] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isJud, setIsJud] = useState(false);

  useEffect(() => {
    if (type === 'officer' && initialOfficer) {
      setName(initialOfficer.name);
      setRoleOrPosition(initialOfficer.position);
      setSchoolOrDept(initialOfficer.department);
      setPhone(initialOfficer.phone);
      setEmail(initialOfficer.email);
    } else if (type === 'teacher' && initialTeacher) {
      setName(initialTeacher.name);
      setRoleOrPosition(initialTeacher.role);
      setSchoolOrDept(initialTeacher.school_name);
      setPhone(initialTeacher.phone);
      setEmail(initialTeacher.email);
      setIsJud(initialTeacher.is_jurulatih_utama || false);
    } else {
      setName('');
      setRoleOrPosition('');
      setSchoolOrDept(type === 'officer' ? 'Unit Pendidikan Islam PPD Penampang' : 'SK Penampang');
      setPhone('');
      setEmail('');
      setIsJud(false);
    }
  }, [isOpen, type, initialOfficer, initialTeacher]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (type === 'officer' && onSubmitOfficer) {
      onSubmitOfficer({
        name: name.trim(),
        position: roleOrPosition.trim() || 'Pegawai Unit Pendidikan Islam',
        department: schoolOrDept.trim() || 'Unit Pendidikan Islam PPD Penampang',
        phone: phone.trim() || '-',
        email: email.trim() || '-',
        order_index: 10,
      });
    } else if (type === 'teacher' && onSubmitTeacher) {
      onSubmitTeacher({
        name: name.trim(),
        role: roleOrPosition.trim() || 'Guru Pendidikan Islam / j-QAF',
        school_name: schoolOrDept.trim() || 'SK Penampang',
        grade_level: 'Tahun 1-6',
        phone: phone.trim() || '-',
        email: email.trim() || '-',
        is_jurulatih_utama: isJud,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-900">
            {type === 'officer' ? 'Daftar Pegawai PPD Penampang' : 'Daftar Guru / Jurulatih Utama'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Penuh & Gelaran <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="cth: Ustaz Ahmad bin Zakaria"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {type === 'officer' ? 'Jawatan / Portfolio PPD' : 'Jawatan / Peranan Panitia'}
            </label>
            <input
              type="text"
              value={roleOrPosition}
              onChange={(e) => setRoleOrPosition(e.target.value)}
              placeholder={type === 'officer' ? 'cth: Penolong PPD j-QAF' : 'cth: Ketua Panitia / Jurulatih Utama'}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {type === 'officer' ? 'Sektor / Pejabat' : 'Nama Sekolah'}
            </label>
            <input
              type="text"
              value={schoolOrDept}
              onChange={(e) => setSchoolOrDept(e.target.value)}
              placeholder={type === 'officer' ? 'cth: Unit Pendidikan Islam PPD Penampang' : 'cth: SK Bahang'}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. Telefon / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01X-XXXXXXX"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mel Rasmi
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@moe.gov.my"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {type === 'teacher' && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isJud"
                checked={isJud}
                onChange={(e) => setIsJud(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isJud" className="text-xs font-medium text-slate-700 cursor-pointer">
                Tandakan jika merupakan <strong>Jurulatih Utama Daerah (JUD)</strong> Penampang
              </label>
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Maklumat</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
