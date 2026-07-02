import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useSkin } from '../hooks/useSkin';
import { SkinTable } from './SkinTable';
import { ContextualCTA } from './ContextualCTA';
import { SkinForm } from './SkinForm';
import type { SkinType, SkinConcern } from '../types';

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
    deleteItem,
    addItem,
    updateItem,
    nextCode,
  } = useSkin(skinActiveTab, skinSearchTerm);

  // State untuk form tambah/edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SkinType | SkinConcern | null>(null);

  // Reset state form jika berpindah tab (Jenis Kulit <-> Masalah Kulit)
  React.useEffect(() => {
    setIsFormOpen(false);
    setEditingItem(null);
  }, [skinActiveTab]);

  const handleEditClick = (item: SkinType | SkinConcern) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleSave = async (code: string, name: string, description: string): Promise<boolean> => {
    if (editingItem) {
      // Edit mode
      const isType = 'skin_type_code' in editingItem;
      const id = isType ? (editingItem as SkinType).skin_type_id : (editingItem as SkinConcern).skin_concern_id;
      return await updateItem(id, code, name, description, skinActiveTab);
    } else {
      // Add mode
      return await addItem(code, name, description, skinActiveTab);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

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
        onDelete={(id) => deleteItem(id, skinActiveTab)}
        onEdit={handleEditClick}
      />

      {/* Reusable Contextual CTA Block */}
      {!isFormOpen && (
        <ContextualCTA
          title={ctaTitle}
          description={ctaDescription}
          primaryButtonText={ctaPrimaryButtonText}
          onPrimaryClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          onSecondaryClick={() => navigate('/products')}
          isLoading={isLoading}
        />
      )}

      {/* Form Tambah / Edit */}
      {isFormOpen && (
        <SkinForm
          type={skinActiveTab}
          initialData={editingItem}
          suggestedCode={nextCode}
          onSave={handleSave}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};
export default SkinList;
