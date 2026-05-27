import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkin } from '../hooks/useSkin';
import { SkinHeader } from './SkinHeader';
import { SkinTable } from './SkinTable';

export const SkinList: React.FC = () => {
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    filteredItems,
    isLoading,
  } = useSkin();

  return (
    <div className="space-y-6">
      {/* Header Halaman Jenis & Masalah Kulit */}
      <SkinHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={() => navigate('/products')}
      />

      {/* Tabel Data Real-time dari Supabase */}
      <SkinTable
        items={filteredItems}
        type={activeTab}
        isLoading={isLoading}
        searchTerm={searchTerm}
      />
    </div>
  );
};
export default SkinList;
