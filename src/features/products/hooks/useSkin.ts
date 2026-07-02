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

  const addItem = async (code: string, name: string, description: string, tab: 'types' | 'concerns'): Promise<boolean> => {
    try {
      if (tab === 'types') {
        const newItem = await skinService.addSkinType(code, name, description);
        setSkinTypes(prev => [...prev, newItem].sort((a, b) => a.skin_type_code.localeCompare(b.skin_type_code)));
      } else {
        const newItem = await skinService.addSkinConcern(code, name, description);
        setSkinConcerns(prev => [...prev, newItem].sort((a, b) => a.skin_concern_code.localeCompare(b.skin_concern_code)));
      }
      return true;
    } catch (err) {
      console.error('[useSkin] Gagal menambah item:', err);
      throw err;
    }
  };

  const updateItem = async (id: string, code: string, name: string, description: string, tab: 'types' | 'concerns'): Promise<boolean> => {
    try {
      if (tab === 'types') {
        const updated = await skinService.updateSkinType(id, code, name, description);
        setSkinTypes(prev => prev.map(item => item.skin_type_id === id ? updated : item).sort((a, b) => a.skin_type_code.localeCompare(b.skin_type_code)));
      } else {
        const updated = await skinService.updateSkinConcern(id, code, name, description);
        setSkinConcerns(prev => prev.map(item => item.skin_concern_id === id ? updated : item).sort((a, b) => a.skin_concern_code.localeCompare(b.skin_concern_code)));
      }
      return true;
    } catch (err) {
      console.error('[useSkin] Gagal mengubah item:', err);
      throw err;
    }
  };

  // Menghitung kode berurutan berikutnya (STxxx / SCxxx) berdasarkan nilai terbesar yang ada
  const getNextSequentialCode = () => {
    const list = activeTab === 'types' ? skinTypes : skinConcerns;
    const prefix = activeTab === 'types' ? 'ST' : 'SC';
    
    let maxNum = 0;
    list.forEach(item => {
      const code = 'skin_type_code' in item 
        ? (item as SkinType).skin_type_code 
        : (item as SkinConcern).skin_concern_code;
      
      // Cocokkan pola prefix + angka, misal ST005 atau SC003
      const match = code.match(new RegExp(`^${prefix}(\\d+)$`, 'i'));
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) {
          maxNum = num;
        }
      }
    });
    
    return `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
  };

  const nextCode = getNextSequentialCode();

  return {
    filteredItems,
    isLoading,
    error,
    deleteItem,
    addItem,
    updateItem,
    nextCode,
    isDbEmpty: (activeTab === 'types' ? skinTypes.length : skinConcerns.length) === 0,
  };
};
