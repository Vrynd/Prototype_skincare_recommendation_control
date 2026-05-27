import { useState, useEffect } from 'react';
import type { SkinType, SkinConcern } from '../types';
import { skinService } from '../services/skinService';

export const useSkin = () => {
  const [skinTypes, setSkinTypes] = useState<SkinType[]>([]);
  const [skinConcerns, setSkinConcerns] = useState<SkinConcern[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'types' | 'concerns'>('types');

  // Mengambil data jenis & masalah kulit secara paralel dari Supabase
  useEffect(() => {
    let active = true;
    const fetchSkinData = async () => {
      try {
        setIsLoading(true);
        const [typesData, concernsData] = await Promise.all([
          skinService.getSkinTypes(),
          skinService.getSkinConcerns(),
        ]);

        if (active) {
          setSkinTypes(typesData);
          setSkinConcerns(concernsData);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Gagal memuat data kulit');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchSkinData();
    return () => {
      active = false;
    };
  }, []);

  // Filter pencarian berdasarkan tab aktif (jenis kulit / masalah kulit)
  const filteredItems = (activeTab === 'types' ? skinTypes : skinConcerns).filter((item) => {
    const code = 'skin_type_code' in item ? item.skin_type_code : item.skin_concern_code;
    const name = 'skin_type_name' in item ? item.skin_type_name : item.skin_concern_name;
    const desc = item.description || '';

    const matchesSearch =
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desc.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleTabChange = (tab: 'types' | 'concerns') => {
    setActiveTab(tab);
    setSearchTerm(''); // Kosongkan pencarian saat berpindah tab
  };

  return {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab: handleTabChange,
    filteredItems,
    isLoading,
    error,
    isDbEmpty: (activeTab === 'types' ? skinTypes.length : skinConcerns.length) === 0,
  };
};
