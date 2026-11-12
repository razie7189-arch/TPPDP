import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  Plus,
  Trash2,
  Maximize2,
  FileSpreadsheet,
  Download,
  CheckCircle,
  HelpCircle,
  X,
} from 'lucide-react';
import { PdfDocument } from '../types';
import { BentoCard } from '../components/BentoCard';

interface DokumenPdfViewerProps {
  documents: PdfDocument[];
  onAddDocument: (data: Omit<PdfDocument, 'id' | 'date_added'>) => void;
  onDeleteDocument: (id: string) => void;
}

export const DokumenPdfViewer: React.FC<DokumenPdfViewerProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<PdfDocument>(documents[0]);
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // New Doc Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pekeliling');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');

  // Process Google Drive URL to preview format if needed
  const getEmbeddableUrl = (rawUrl: string, type: 'local' | 'google_drive' | 'url') => {
    if (type === 'local') {
      return rawUrl;
    }
    // Google Drive share link converter
    if (rawUrl.includes('drive.google.com/file/d/')) {
      const match = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    return rawUrl;
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const isDrive = url.includes('drive.google.com');

    onAddDocument({
      title: title.trim(),
      category: category.trim(),
      source_type: isDrive ? 'google_drive' : 'url',
      url: url.trim(),
      description: description.trim(),
      badge: badge.trim() || undefined,
    });

    setTitle('');
    setUrl('');
    setDescription('');
    setBadge('');
    setIsAddingDoc(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Pusat Dokumen & e-Fail Rasmi
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">Iframe & Google Drive Embed Reader</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Pengurusan Dokumen PDF & Garis Panduan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Membaca dan menyemak templat Tapak Rekalibrasi j-QAF 2026, buku panduan KPM, dan dokumen sokongan secara langsung di dalam aplikasi.
          </p>
        </div>

        <button
          onClick={() => setIsAddingDoc(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all whitespace-nowrap self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pautan PDF / Drive</span>
        </button>
      </div>

      {/* Main Grid: Document List on Left, Interactive Viewer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Document Selector Column */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Senarai Fail ({documents.length})
            </h3>
            <span className="text-[11px] text-blue-600 font-semibold">Terkini 2026</span>
          </div>

          <div className="space-y-2.5">
            {documents.map((doc) => {
              const isSelected = selectedDoc.id === doc.id;

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                          {doc.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {doc.title}
                        </h4>
                      </div>
                    </div>

                    {/* Delete button (except for primary template) */}
                    {doc.id !== 'doc-01' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Padam pautan dokumen "${doc.title}"?`)) {
                            onDeleteDocument(doc.id);
                            if (selectedDoc.id === doc.id && documents[0]) {
                              setSelectedDoc(documents[0]);
                            }
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-opacity"
                        title="Padam fail"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                    {doc.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>
                      {doc.source_type === 'local' ? 'Fail Sistem' : 'Google Drive'}
                    </span>
                    {doc.badge && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-100/70 text-blue-800 font-semibold font-sans">
                        {doc.badge}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Embedded PDF Viewer Column */}
        <div className={`lg:col-span-8 ${isFullscreen ? 'fixed inset-4 z-50 bg-white rounded-2xl shadow-2xl p-4' : ''}`}>
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-[750px]">
            
            {/* Viewer Control Bar */}
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Paparan PDF Semasa
                </span>
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {selectedDoc.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={getEmbeddableUrl(selectedDoc.url, selectedDoc.source_type)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Tab Baharu</span>
                </a>

                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
                  title="Skrin Penuh"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Iframe Viewport */}
            <div className="flex-1 bg-slate-100 relative">
              <iframe
                src={getEmbeddableUrl(selectedDoc.url, selectedDoc.source_type)}
                title={selectedDoc.title}
                className="w-full h-full border-0"
                allow="autoplay"
              />
            </div>

            {/* Bottom Meta Bar */}
            <div className="px-5 py-2.5 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
              <span className="truncate">{selectedDoc.description}</span>
              <span className="font-mono text-[11px] shrink-0 text-slate-400">
                {selectedDoc.date_added}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Add New PDF Document Modal */}
      {isAddingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Tambah Dokumen / Pautan Google Drive
                </h3>
                <p className="text-xs text-slate-500">
                  Masukkan pautan PDF Google Drive atau URL fail untuk dibaca dalam web app
                </p>
              </div>
              <button
                onClick={() => setIsAddingDoc(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tajuk Dokumen <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="cth: Modul Bimbingan Guru j-QAF 2026"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Fail
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Rekalibrasi">Rekalibrasi</option>
                    <option value="Pekeliling KPM">Pekeliling KPM</option>
                    <option value="Garis Panduan">Garis Panduan</option>
                    <option value="Surat Siaran">Surat Siaran</option>
                    <option value="Bahan Bengkel">Bahan Bengkel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Label Lencana (Badge)
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="cth: Rasmi / JPN"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pautan URL / Google Drive Share Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/.../view atau https://..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Pautan Google Drive akan ditukarkan secara automatik kepada format preview iframe.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keterangan Ringkas
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Catatan mengenai kandungan fail ini..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingDoc(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  <span>Simpan Dokumen</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
