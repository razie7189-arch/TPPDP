import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { CustomModule } from '../types';

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CustomModule, 'id'>) => void;
  initialData?: CustomModule | null;
}

const COLOR_OPTIONS = [
  { label: 'Biru Lembut (Blue)', value: 'bg-blue-50 text-blue-700 border-blue-200' },
  { label: 'Hijau Zamrud (Emerald)', value: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { label: 'Kuning Amber (Amber)', value: 'bg-amber-50 text-amber-700 border-amber-200' },
  { label: 'Ungu Moden (Purple)', value: 'bg-purple-50 text-purple-700 border-purple-200' },
  { label: 'Merah Mawar (Rose)', value: 'bg-rose-50 text-rose-700 border-rose-200' },
  { label: 'Kelabu Slate Minimalis', value: 'bg-slate-100 text-slate-800 border-slate-300' },
];

export const ModuleModal: React.FC<ModuleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [iconName, setIconName] = useState('BookOpen');
  const [pageUrl, setPageUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState<number>(1);
  const [bgColor, setBgColor] = useState(COLOR_OPTIONS[0].value);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setIconName(initialData.icon_name);
      setPageUrl(initialData.page_url);
      setOrderIndex(initialData.order_index);
      setBgColor(initialData.bg_color);
      setDescription(initialData.description);
    } else {
      setTitle('');
      setIconName('BookOpen');
      setPageUrl('');
      setOrderIndex(1);
      setBgColor(COLOR_OPTIONS[0].value);
      setDescription('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      icon_name: iconName.trim() || 'FileText',
      page_url: pageUrl.trim() || '#',
      order_index: Number(orderIndex) || 1,
      bg_color: bgColor,
      description: description.trim(),
      is_active: true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {initialData ? 'Kemaskini Modul / Pautan' : 'Tambah Modul / Fail Baharu'}
            </h3>
            <p className="text-xs text-slate-500">
              Konfigurasi modul tersuai untuk dashboard dan menu sistem
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nama App */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama App / Modul <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="cth: Kem Bestari Solat (KBS) Siri 1"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Icon Name & Order */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Icon Name (Lucide)
              </label>
              <input
                type="text"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                placeholder="cth: BookOpen / Award / FileText"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Susunan (Order Index)
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Pautan URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pautan URL Page / Dokumen <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={pageUrl}
              onChange={(e) => setPageUrl(e.target.value)}
              placeholder="cth: #/kbs atau https://drive.google.com/..."
              className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Warna Latar */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Warna Latar (Accent Card)
            </label>
            <select
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {COLOR_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Keterangan Modul
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi ringkas peranan modul atau capaian fail..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

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
              <span>Simpan Modul</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
