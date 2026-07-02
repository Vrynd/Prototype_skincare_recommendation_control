import React, { useState, useEffect } from 'react';
import { X, Save, Shield, Droplets, HelpCircle, Loader2, Sparkles, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { skinService } from '../services/skinService';
import { productService } from '../services/productService';
import type { Product, SkinType, SkinConcern } from '../types';

interface ProductEditModalProps {
  product: Product | null;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  onClose,
  onSaveSuccess,
}) => {
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Multi-step state (1, 2, or 3)
  const [step, setStep] = useState(1);

  // Form states
  const [brandName, setBrandName] = useState('');
  const [productName, setProductName] = useState('');
  const [bpomNumber, setBpomNumber] = useState('');
  const [spf, setSpf] = useState<number>(0);
  const [paGrade, setPaGrade] = useState('');
  const [sunscreenType, setSunscreenType] = useState('chemical');
  const [texture, setTexture] = useState('gel');
  const [finish, setFinish] = useState('natural');
  const [isWaterResistant, setIsWaterResistant] = useState(false);
  const [isVeryWaterResistant, setIsVeryWaterResistant] = useState(false);
  const [isNonComedogenic, setIsNonComedogenic] = useState(false);
  const [isOilFree, setIsOilFree] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Junction checklist states
  const [allSkinTypes, setAllSkinTypes] = useState<SkinType[]>([]);
  const [allSkinConcerns, setAllSkinConcerns] = useState<SkinConcern[]>([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [selectedSkinConcerns, setSelectedSkinConcerns] = useState<string[]>([]);

  // 1. Fetch skin lists and product detail on mount
  useEffect(() => {
    if (!product) return;

    let active = true;
    const loadData = async () => {
      try {
        setIsLoadingDetail(true);
        setErrorMsg(null);

        // Fetch master skin lists
        const [types, concerns, detail] = await Promise.all([
          skinService.getSkinTypes(),
          skinService.getSkinConcerns(),
          productService.getProductDetail(product.product_id)
        ]);

        if (!active) return;
        setAllSkinTypes(types);
        setAllSkinConcerns(concerns);

        if (detail) {
          // Pre-fill form fields
          setBrandName(detail.brand_name);
          setProductName(detail.product_name);
          setBpomNumber(detail.bpom_number);
          setSpf(detail.spf);
          setPaGrade(detail.pa_grade);
          setSunscreenType(detail.sunscreen_type);
          setTexture(detail.texture);
          setFinish(detail.finish);
          setIsWaterResistant(detail.is_water_resistant);
          setIsVeryWaterResistant(detail.is_very_water_resistant);
          setIsNonComedogenic(detail.is_non_comedogenic);
          setIsOilFree(detail.is_oil_free);
          setIsActive(detail.is_active);

          // Extract selected relation IDs
          const stIds = detail.product_skin_types
            ?.map((st: any) => st.skin_types?.skin_type_id)
            .filter(Boolean) as string[] ?? [];
          setSelectedSkinTypes(stIds);

          const scIds = detail.product_skin_concerns
            ?.map((sc: any) => sc.skin_concerns?.skin_concern_id)
            .filter(Boolean) as string[] ?? [];
          setSelectedSkinConcerns(scIds);
        }
      } catch (err) {
        console.error('[ProductEditModal] Gagal memuat data:', err);
        setErrorMsg('Gagal memuat detail produk.');
      } finally {
        if (active) setIsLoadingDetail(false);
      }
    };

    loadData();
    return () => { active = false; };
  }, [product]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSkinTypeToggle = (id: string) => {
    setSelectedSkinTypes(prev =>
      prev.includes(id) ? prev.filter(stId => stId !== id) : [...prev, id]
    );
  };

  const handleSkinConcernToggle = (id: string) => {
    setSelectedSkinConcerns(prev =>
      prev.includes(id) ? prev.filter(scId => scId !== id) : [...prev, id]
    );
  };

  // Navigasi & Validasi Step
  const nextStep = () => {
    if (step === 1) {
      if (!brandName.trim() || !productName.trim() || !bpomNumber.trim()) {
        setErrorMsg('Field Brand, Nama Produk, dan No. BPOM wajib diisi.');
        return;
      }
    }
    setErrorMsg(null);
    setStep(prev => Math.min(3, prev + 1));
  };

  const prevStep = () => {
    setErrorMsg(null);
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!brandName.trim() || !productName.trim() || !bpomNumber.trim()) {
      setErrorMsg('Field Brand, Nama Produk, dan No. BPOM wajib diisi.');
      setStep(1); // Balik ke step 1 agar bisa mengisi field yang kosong
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      const success = await productService.updateProduct(
        product.product_id,
        {
          brand_name: brandName.trim(),
          product_name: productName.trim(),
          bpom_number: bpomNumber.trim(),
          spf: Number(spf),
          pa_grade: paGrade,
          sunscreen_type: sunscreenType,
          texture,
          finish,
          is_water_resistant: isWaterResistant,
          is_very_water_resistant: isVeryWaterResistant,
          is_non_comedogenic: isNonComedogenic,
          is_oil_free: isOilFree,
          is_active: isActive
        },
        selectedSkinTypes,
        selectedSkinConcerns
      );

      if (success) {
        onSaveSuccess();
      } else {
        setErrorMsg('Gagal memperbarui produk.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-xl rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[85vh] bg-[#0c0f17]/95 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 shrink-0 bg-white/1">
          <div>
            <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Manajemen Produk</span>
            <h2 className="text-sm font-semibold text-white leading-none mt-1">Edit Informasi Produk</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-white/2 border-b border-white/5 text-[9px] font-bold uppercase tracking-widest text-gray-500 select-none shrink-0">
          <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-brand-accent font-extrabold' : ''}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center border text-[8px] ${
              step === 1 ? 'border-brand-accent bg-brand-accent/10 text-brand-accent' : 'border-white/10 bg-white/2'
            }`}>1</span>
            <span>Informasi Utama</span>
          </div>
          <div className="flex-1 h-[1px] bg-white/5 mx-3" />
          <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-brand-accent font-extrabold' : ''}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center border text-[8px] ${
              step === 2 ? 'border-brand-accent bg-brand-accent/10 text-brand-accent' : 'border-white/10 bg-white/2'
            }`}>2</span>
            <span>Karakteristik &amp; Klaim</span>
          </div>
          <div className="flex-1 h-[1px] bg-white/5 mx-3" />
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-brand-accent font-extrabold' : ''}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center border text-[8px] ${
              step === 3 ? 'border-brand-accent bg-brand-accent/10 text-brand-accent' : 'border-white/10 bg-white/2'
            }`}>3</span>
            <span>Target Kulit</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {isLoadingDetail ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="animate-spin text-brand-accent" size={20} />
              <p className="text-xs text-gray-400 font-medium">Memuat detail data produk...</p>
            </div>
          ) : (
            <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-4 text-left">
              {errorMsg && (
                <div className="p-3 text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                  {errorMsg}
                </div>
              )}

              {/* STEP 1: Informasi Utama & Proteksi */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-1 flex items-center gap-1.5 select-none">
                    <Sparkles size={11} className="text-brand-accent animate-pulse" />
                    Informasi Utama
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Brand</label>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        disabled={isSaving}
                        placeholder="Contoh: Azarine"
                        className="w-full bg-white/3 border border-white/8 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:border-brand-primary/50 outline-none transition-all duration-300"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Produk</label>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        disabled={isSaving}
                        placeholder="Contoh: Hydrasoothe Sunscreen Gel"
                        className="w-full bg-white/3 border border-white/8 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:border-brand-primary/50 outline-none transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No. BPOM</label>
                      <input
                        type="text"
                        value={bpomNumber}
                        onChange={(e) => setBpomNumber(e.target.value)}
                        disabled={isSaving}
                        placeholder="Contoh: NA18221701516"
                        className="w-full bg-white/3 border border-white/8 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:border-brand-primary/50 outline-none transition-all duration-300 font-mono tracking-wide"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipe Sunscreen</label>
                      <select
                        value={sunscreenType}
                        onChange={(e) => setSunscreenType(e.target.value)}
                        disabled={isSaving}
                        className="w-full bg-[#0c0f17] border border-white/8 rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary/50 outline-none transition-all duration-300"
                      >
                        <option value="chemical">Chemical</option>
                        <option value="physical">Physical</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nilai SPF</label>
                      <input
                        type="number"
                        value={spf}
                        onChange={(e) => setSpf(Number(e.target.value))}
                        disabled={isSaving}
                        placeholder="0"
                        min={0}
                        className="w-full bg-white/3 border border-white/8 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:border-brand-primary/50 outline-none transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PA Grade</label>
                      <select
                        value={paGrade}
                        onChange={(e) => setPaGrade(e.target.value)}
                        disabled={isSaving}
                        className="w-full bg-[#0c0f17] border border-white/8 rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary/50 outline-none transition-all duration-300"
                      >
                        <option value="PA+">PA+</option>
                        <option value="PA++">PA++</option>
                        <option value="PA+++">PA+++</option>
                        <option value="PA++++">PA++++</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Tekstur, Finish & Klaim Formula */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-1 flex items-center gap-1.5 select-none">
                    <Shield size={11} className="text-brand-accent animate-pulse" />
                    Tekstur &amp; Hasil Akhir
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tekstur</label>
                      <select
                        value={texture}
                        onChange={(e) => setTexture(e.target.value)}
                        disabled={isSaving}
                        className="w-full bg-[#0c0f17] border border-white/8 rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary/50 outline-none transition-all duration-300"
                      >
                        <option value="gel">Gel</option>
                        <option value="cream">Cream</option>
                        <option value="lotion">Lotion</option>
                        <option value="serum">Serum</option>
                        <option value="milk">Milk</option>
                        <option value="watery">Watery</option>
                        <option value="stick">Stick</option>
                        <option value="spray">Spray</option>
                        <option value="mist">Mist</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Finish</label>
                      <select
                        value={finish}
                        onChange={(e) => setFinish(e.target.value)}
                        disabled={isSaving}
                        className="w-full bg-[#0c0f17] border border-white/8 rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-primary/50 outline-none transition-all duration-300"
                      >
                        <option value="matte">Matte</option>
                        <option value="dewy">Dewy</option>
                        <option value="natural">Natural</option>
                        <option value="tone_up">Tone Up</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-1 flex items-center gap-1.5 select-none pt-2">
                    <Droplets size={11} className="text-brand-accent animate-pulse" />
                    Klaim Formula &amp; Status
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/2 border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                      <input
                        type="checkbox"
                        checked={isWaterResistant}
                        onChange={(e) => setIsWaterResistant(e.target.checked)}
                        disabled={isSaving}
                        className="accent-brand-accent rounded"
                      />
                      <span className="text-[10px] font-semibold text-gray-300">Water Resistant</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/2 border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                      <input
                        type="checkbox"
                        checked={isVeryWaterResistant}
                        onChange={(e) => setIsVeryWaterResistant(e.target.checked)}
                        disabled={isSaving}
                        className="accent-brand-accent rounded"
                      />
                      <span className="text-[10px] font-semibold text-gray-300">Very Water Resistant</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/2 border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                      <input
                        type="checkbox"
                        checked={isNonComedogenic}
                        onChange={(e) => setIsNonComedogenic(e.target.checked)}
                        disabled={isSaving}
                        className="accent-brand-accent rounded"
                      />
                      <span className="text-[10px] font-semibold text-gray-300">Non-Comedogenic</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/2 border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                      <input
                        type="checkbox"
                        checked={isOilFree}
                        onChange={(e) => setIsOilFree(e.target.checked)}
                        disabled={isSaving}
                        className="accent-brand-accent rounded"
                      />
                      <span className="text-[10px] font-semibold text-gray-300">Oil Free</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/2 border border-white/5 cursor-pointer hover:bg-white/5 transition-colors col-span-2">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        disabled={isSaving}
                        className="accent-brand-accent rounded"
                      />
                      <span className="text-[10px] font-bold text-emerald-400">Aktifkan Penjualan / Layanan Produk</span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 3: Target Kulit (Jenis & Masalah Kulit) */}
              {step === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Jenis Kulit */}
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-1 flex items-center gap-1.5 select-none">
                      <HelpCircle size={11} className="text-brand-accent animate-pulse" />
                      Kecocokan Jenis Kulit
                    </div>
                    <div className="flex flex-wrap gap-2 py-1">
                      {allSkinTypes.map(st => {
                        const isSelected = selectedSkinTypes.includes(st.skin_type_id);
                        return (
                          <button
                            type="button"
                            key={st.skin_type_id}
                            onClick={() => handleSkinTypeToggle(st.skin_type_id)}
                            disabled={isSaving}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? 'bg-brand-primary/20 border-brand-primary/50 text-brand-accent'
                                : 'bg-white/3 border-white/5 text-gray-400 hover:text-white'
                            }`}
                          >
                            {st.skin_type_name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Masalah Kulit */}
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-1 flex items-center gap-1.5 select-none">
                      <Heart size={11} className="text-brand-accent animate-pulse" />
                      Mengatasi Masalah Kulit
                    </div>
                    <div className="flex flex-wrap gap-2 py-1">
                      {allSkinConcerns.map(sc => {
                        const isSelected = selectedSkinConcerns.includes(sc.skin_concern_id);
                        return (
                          <button
                            type="button"
                            key={sc.skin_concern_id}
                            onClick={() => handleSkinConcernToggle(sc.skin_concern_id)}
                            disabled={isSaving}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                                : 'bg-white/3 border-white/5 text-gray-400 hover:text-white'
                            }`}
                          >
                            {sc.skin_concern_name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-white/5 bg-white/1 shrink-0">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                disabled={isSaving}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-[10px] font-bold text-gray-400 hover:text-white bg-white/3 border border-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer disabled:opacity-50"
              >
                <ChevronLeft size={12} />
                Sebelumnya
              </button>
            )}
            {step === 1 && (
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl text-[10px] font-bold text-gray-400 hover:text-white bg-white/3 border border-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
            )}
          </div>

          <div>
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={isLoadingDetail}
                className="flex items-center gap-1 px-5 py-2 rounded-xl text-[10px] font-bold text-brand-bg bg-brand-accent hover:bg-white hover:shadow-brand-accent/25 transition-all duration-300 shadow-lg shadow-brand-accent/20 cursor-pointer"
              >
                <span>Berikutnya</span>
                <ChevronRight size={12} />
              </button>
            ) : (
              <button
                type="submit"
                form="edit-product-form"
                disabled={isSaving || isLoadingDetail}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-[10px] font-bold text-brand-bg bg-brand-accent hover:bg-white hover:shadow-brand-accent/25 transition-all duration-300 shadow-lg shadow-brand-accent/20 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save size={12} />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
export default ProductEditModal;
