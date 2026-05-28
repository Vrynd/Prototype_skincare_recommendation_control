import { useState, useEffect } from 'react';
import type { SkinType, SkinConcern } from '../types';
import { skinService } from '../services/skinService';

export const useSkin = (activeTab: 'types' | 'concerns', searchTerm: string) => {
  const [skinTypes, setSkinTypes] = useState<SkinType[]>([]);
  const [skinConcerns, setSkinConcerns] = useState<SkinConcern[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const isType = 'skin_type_code' in item;
    const code = isType ? (item as SkinType).skin_type_code : (item as SkinConcern).skin_concern_code;
    const name = isType ? (item as SkinType).skin_type_name : (item as SkinConcern).skin_concern_name;
    const desc = item.description || '';

    const matchesSearch =
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desc.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const deleteItem = async (id: string, tab: 'types' | 'concerns'): Promise<boolean> => {
    try {
      if (tab === 'types') {
        await skinService.deleteSkinType(id);
        setSkinTypes(prev => prev.filter(item => item.skin_type_id !== id));
      } else {
        await skinService.deleteSkinConcern(id);
        setSkinConcerns(prev => prev.filter(item => item.skin_concern_id !== id));
      }
      return true;
    } catch (err) {
      console.error('[useSkin] Gagal menghapus item:', err);
      throw err;
    }
  };

  return {
    filteredItems,
    isLoading,
    error,
    deleteItem,
    isDbEmpty: (activeTab === 'types' ? skinTypes.length : skinConcerns.length) === 0,
  };
};
