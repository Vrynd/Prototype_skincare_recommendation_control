import React, { useState, useEffect } from 'react';
import { Save, X, Code2, Tag, FileText, Loader2 } from 'lucide-react';
import type { SkinType, SkinConcern } from '../types';

interface SkinFormProps {
  type: 'types' | 'concerns';
  initialData?: SkinType | SkinConcern | null;
  suggestedCode?: string;
  onSave: (code: string, name: string, description: string) => Promise<boolean>;
  onClose: () => void;
}

export const SkinForm: React.FC<SkinFormProps> = ({
  type,
  initialData,
  suggestedCode = '',
  onSave,
  onClose,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Efek untuk mengisi data awal jika sedang mengedit atau otomatisasi kode baru
  useEffect(() => {
    if (initialData) {
      const isType = 'skin_type_code' in initialData;
      setCode(isType ? (initialData as SkinType).skin_type_code : (initialData as SkinConcern).skin_concern_code);
      setName(isType ? (initialData as SkinType).skin_type_name : (initialData as SkinConcern).skin_concern_name);
      setDescription(initialData.description || '');
    } else {
      setCode(suggestedCode);
      setName('');
      setDescription('');
    }
    setFormError(null);
  }, [initialData, suggestedCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !description.trim()) {
      setFormError('Semua field wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      const success = await onSave(
        code.trim().toLowerCase().replace(/[-\s]+/g, '_'), // Kode diseragamkan ke lowercase snake_case
        name.trim(),
        description.trim()
      );
      if (success) {
        onClose();
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formTitle = initialData
    ? `Edit ${type === 'types' ? 'Jenis Kulit' : 'Masalah Kulit'}`
    : `Tambah ${type === 'types' ? 'Jenis Kulit' : 'Masalah Kulit'} Baru`;

  return (
    <div className="glass-card rounded-3xl p-6 border border-white/5 shadow-2xl space-y-4 bg-white/1 backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Header Form */}
      <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <h3 className="font-semibold text-xs text-white uppercase tracking-widest flex items-center gap-2">
          <Tag size={13} className="text-brand-accent animate-pulse" />
          <span>{formTitle}</span>
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="p-3 text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Field Kode */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Code2 size={11} className="text-brand-accent animate-pulse" />
              Kode
            </label>
            <input
              type="text"
              value={code}
              disabled={true}
              className="w-full bg-white/1 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-gray-500 font-mono focus:border-brand-primary/50 outline-none transition-all duration-300 cursor-not-allowed select-none"
            />
          </div>


          {/* Field Nama */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Tag size={11} className="text-brand-accent" />
              Nama {type === 'types' ? 'Jenis Kulit' : 'Masalah Kulit'}
            </label>
            <input
              type="text"
              placeholder={type === 'types' ? 'Contoh: Berminyak, Kering' : 'Contoh: Berjerawat, Kerutan'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-medium focus:border-brand-primary/50 outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Field Deskripsi */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <FileText size={11} className="text-brand-accent" />
            Deskripsi Singkat
          </label>
          <textarea
            placeholder="Tuliskan deskripsi lengkap atau karakteristik karakteristiknya..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            rows={3}
            className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-medium focus:border-brand-primary/50 outline-none transition-all duration-300 resize-none custom-scrollbar"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-[10px] font-bold text-gray-400 hover:text-white bg-white/3 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-[10px] font-bold text-brand-bg bg-brand-accent hover:bg-white hover:shadow-brand-accent/25 transition-all duration-300 shadow-lg shadow-brand-accent/20 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save size={12} />
                <span>Simpan Data</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
export default SkinForm;
