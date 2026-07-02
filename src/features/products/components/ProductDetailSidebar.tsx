import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X, ShieldCheck, Droplets, Layers, BadgeCheck,
  Calendar, Hash, CheckCircle2, XCircle, FlaskConical
} from 'lucide-react';
import type { ProductDetail } from '../types';

interface ProductDetailSidebarProps {
  product: ProductDetail | null;
  isLoading: boolean;
  onClose: () => void;
}

// ─── Label map helpers ────────────────────────────────────────────────────────
const TEXTURE_LABEL: Record<string, string> = {
  gel: 'Gel', cream: 'Cream', lotion: 'Lotion', serum: 'Serum',
  milk: 'Milk', watery: 'Watery', stick: 'Stick', spray: 'Spray', mist: 'Mist',
};

const FINISH_LABEL: Record<string, string> = {
  matte: 'Matte', dewy: 'Dewy', natural: 'Natural', tone_up: 'Tone Up',
};

const SUNSCREEN_LABEL: Record<string, string> = {
  chemical: 'Chemical', physical: 'Physical', hybrid: 'Hybrid',
};

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({
  icon, title, children,
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
      <span className="text-brand-accent">{icon}</span>
      {title}
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

// ─── Info row ─────────────────────────────────────────────────────────────────
const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-start gap-4">
    <span className="text-[11px] text-gray-400 shrink-0">{label}</span>
    <span className="text-[11px] text-white text-right">{value}</span>
  </div>
);

// ─── Boolean badge ────────────────────────────────────────────────────────────
const BoolBadge: React.FC<{ value: boolean; label: string }> = ({ value, label }) => (
  <div className="flex items-center justify-between">
    <span className="text-[11px] text-gray-400">{label}</span>
    {value ? (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
        <CheckCircle2 size={12} /> Ya
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500">
        <XCircle size={12} /> Tidak
      </span>
    )}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
export const ProductDetailSidebar: React.FC<ProductDetailSidebarProps> = ({
  product,
  isLoading,
  onClose,
}) => {
  // Tutup sidebar saat tekan Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const skinTypes = product?.product_skin_types
    ?.map((st) => st.skin_types?.skin_type_name)
    .filter(Boolean) ?? [];

  const skinConcerns = product?.product_skin_concerns
    ?.map((sc) => sc.skin_concerns?.skin_concern_name)
    .filter(Boolean) ?? [];

  const formattedDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside className="fixed top-0 bottom-0 right-0 z-[100] h-screen w-[360px] flex flex-col bg-[#0f1410] border-l border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-white/8 shrink-0">
          {isLoading || !product ? (
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-white/10 rounded animate-pulse w-2/3" />
              <div className="h-4 bg-white/10 rounded animate-pulse w-full" />
            </div>
          ) : (
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">
                {product.brand_name}
              </span>
              <h2 className="text-sm font-semibold text-white leading-snug mt-0.5">
                {product.product_name}
              </h2>
              <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">
                {product.product_code}
              </span>
            </div>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0 cursor-pointer mt-0.5"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-6">
          {isLoading || !product ? (
            // Loading skeleton
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-2 bg-white/10 rounded animate-pulse w-1/3" />
                  <div className="h-3 bg-white/5 rounded animate-pulse w-full" />
                  <div className="h-3 bg-white/5 rounded animate-pulse w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Status */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                <span className="text-[11px] text-gray-400">Status Produk</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  product.is_active
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${product.is_active ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  {product.is_active ? 'Aktif' : 'Non-Aktif'}
                </span>
              </div>

              <div className="border-t border-white/5" />

              {/* Proteksi */}
              <Section icon={<ShieldCheck size={13} />} title="Proteksi Matahari">
                <InfoRow label="Tipe Sunscreen" value={SUNSCREEN_LABEL[product.sunscreen_type] ?? product.sunscreen_type} />
                <InfoRow label="SPF" value={<span className="font-semibold">SPF {product.spf}</span>} />
                <InfoRow label="PA Grade" value={<span className="font-bold text-brand-accent">{product.pa_grade}</span>} />
                <InfoRow label="No. BPOM" value={<span className="font-mono text-gray-300">{product.bpom_number}</span>} />
              </Section>

              <div className="border-t border-white/5" />

              {/* Tekstur & Finish */}
              <Section icon={<Droplets size={13} />} title="Tekstur &amp; Finish">
                <InfoRow label="Tekstur" value={TEXTURE_LABEL[product.texture] ?? product.texture} />
                <InfoRow label="Finish" value={FINISH_LABEL[product.finish] ?? product.finish} />
              </Section>

              <div className="border-t border-white/5" />

              {/* Klaim Produk */}
              <Section icon={<BadgeCheck size={13} />} title="Klaim Produk">
                <BoolBadge value={product.is_water_resistant} label="Water Resistant" />
                <BoolBadge value={product.is_very_water_resistant} label="Very Water Resistant" />
                <BoolBadge value={product.is_non_comedogenic} label="Non-Comedogenic" />
                <BoolBadge value={product.is_oil_free} label="Oil Free" />
              </Section>

              <div className="border-t border-white/5" />

              {/* Jenis Kulit */}
              <Section icon={<Layers size={13} />} title="Cocok untuk Jenis Kulit">
                {skinTypes.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {skinTypes.map((name) => (
                      <span key={name} className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-primary/15 border border-brand-primary/30 text-brand-accent">
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-500 italic">Belum ada data jenis kulit</p>
                )}
              </Section>

              {/* Masalah Kulit */}
              <Section icon={<FlaskConical size={13} />} title="Mengatasi Masalah Kulit">
                {skinConcerns.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {skinConcerns.map((name) => (
                      <span key={name} className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/10 border border-violet-500/20 text-violet-300">
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-500 italic">Belum ada data masalah kulit</p>
                )}
              </Section>

              <div className="border-t border-white/5" />

              {/* Timestamp */}
              <Section icon={<Calendar size={13} />} title="Riwayat Data">
                <InfoRow label="Ditambahkan" value={formattedDate(product.created_at)} />
                <InfoRow label="Diperbarui" value={formattedDate(product.updated_at)} />
              </Section>

              {/* Product code bottom */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/3 border border-white/5">
                <Hash size={12} className="text-gray-500 shrink-0" />
                <div>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest">Kode Produk</p>
                  <p className="text-[11px] font-mono text-gray-300">{product.product_code}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/8 shrink-0">
          <p className="text-[10px] text-gray-500 text-center">Tekan <kbd className="px-1 py-0.5 rounded bg-white/10 text-[9px] font-mono">Esc</kbd> atau klik di luar untuk menutup</p>
        </div>
      </aside>
    </>,
    document.body
  );
};
