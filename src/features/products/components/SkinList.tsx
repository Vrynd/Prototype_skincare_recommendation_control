import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useSkin } from '../hooks/useSkin';
import { SkinTable } from './SkinTable';
import { ContextualCTA } from './ContextualCTA';

export const SkinList: React.FC = () => {
  const navigate = useNavigate();
  
  // Mengambil state tab aktif dan pencarian dari context floating navbar AdminLayout
  const { skinActiveTab, skinSearchTerm } = useOutletContext<{
    skinActiveTab: 'types' | 'concerns';
    skinSearchTerm: string;
  }>();

  const {
    filteredItems,
    isLoading,
  } = useSkin(skinActiveTab, skinSearchTerm);

  // Parameterisasi data untuk dikirim ke reusable component
  const ctaTitle = skinActiveTab === 'types' 
    ? 'Ingin Menambah Jenis Kulit Baru?' 
    : 'Ingin Menambah Masalah Kulit Baru?';

  const ctaDescription = skinActiveTab === 'types' 
    ? 'Tambah jenis kulit baru untuk memperluas kriteria rekomendasi skincare agar penargetan produk lebih akurat.' 
    : 'Tambah masalah kulit baru untuk mendeteksi keluhan pengguna dan memberikan kecocokan formula yang tepat.';

  const ctaPrimaryButtonText = skinActiveTab === 'types' 
    ? 'Tambah Jenis Kulit' 
    : 'Tambah Masalah Kulit';

  return (
    <div className="space-y-6">
      {/* Tabel Data Glassmorphic Premium */}
      <SkinTable
        items={filteredItems}
        type={skinActiveTab}
        isLoading={isLoading}
        searchTerm={skinSearchTerm}
      />

      {/* Reusable Contextual CTA Block */}
      <ContextualCTA
        title={ctaTitle}
        description={ctaDescription}
        primaryButtonText={ctaPrimaryButtonText}
        onPrimaryClick={() => console.log('Tambah data diklik')}
        onSecondaryClick={() => navigate('/products')}
        isLoading={isLoading}
      />
    </div>
  );
};
export default SkinList;
