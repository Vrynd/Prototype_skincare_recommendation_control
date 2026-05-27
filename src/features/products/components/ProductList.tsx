import React, { useState } from 'react';
import { Search, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  product_id: string;
  brand_name: string;
  product_name: string;
  category: string;
  usage_time: 'Pagi' | 'Malam' | 'Pagi & Malam';
  is_active: boolean;
  spf_value?: number | null;
  pa_grade?: string | null;
  bpom_number: string;
}

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      product_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      brand_name: 'Skintific',
      product_name: '5X Ceramide Barrier Moisture Gel',
      category: 'Moisturizer',
      usage_time: 'Pagi & Malam',
      is_active: true,
      spf_value: null,
      pa_grade: null,
      bpom_number: 'NA18210100084',
    },
    {
      product_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      brand_name: 'COSRX',
      product_name: 'Low pH Good Morning Gel Cleanser',
      category: 'Cleanser',
      usage_time: 'Pagi',
      is_active: true,
      spf_value: null,
      pa_grade: null,
      bpom_number: 'NA26201200561',
    },
    {
      product_id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
      brand_name: 'Anessa',
      product_name: 'Perfect UV Sunscreen Skincare Milk',
      category: 'Sunscreen',
      usage_time: 'Pagi',
      is_active: true,
      spf_value: 50,
      pa_grade: 'PA++++',
      bpom_number: 'NA22201700012',
    },
    {
      product_id: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
      brand_name: 'Some By Mi',
      product_name: 'AHA BHA PHA 30Days Miracle Toner',
      category: 'Toner',
      usage_time: 'Malam',
      is_active: false,
      spf_value: null,
      pa_grade: null,
      bpom_number: 'NA26211200922',
    },
    {
      product_id: 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
      brand_name: 'Wardah',
      product_name: 'UV Shield Essential Sunscreen Gel',
      category: 'Sunscreen',
      usage_time: 'Pagi',
      is_active: true,
      spf_value: 30,
      pa_grade: 'PA+++',
      bpom_number: 'NA18201700056',
    },
    {
      product_id: 'f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c',
      brand_name: 'COSRX',
      product_name: 'AHA/BHA Clarifying Treatment Toner',
      category: 'Toner',
      usage_time: 'Pagi & Malam',
      is_active: true,
      spf_value: null,
      pa_grade: null,
      bpom_number: 'NA26201200742',
    },
    {
      product_id: 'g7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d',
      brand_name: 'Beauty of Joseon',
      product_name: 'Glow Serum: Propolis + Niacinamide',
      category: 'Toner',
      usage_time: 'Malam',
      is_active: true,
      spf_value: null,
      pa_grade: null,
      bpom_number: 'NA26220100114',
    },
    {
      product_id: 'h8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e',
      brand_name: 'Wardah',
      product_name: 'Lightening Whip Facial Foam',
      category: 'Cleanser',
      usage_time: 'Pagi & Malam',
      is_active: false,
      spf_value: null,
      pa_grade: null,
      bpom_number: 'NA18201200155',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Filter & Search Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.bpom_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'Semua' || 
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.product_id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setProducts(products.map(p => 
      p.product_id === id ? { ...p, is_active: !p.is_active } : p
    ));
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER (Action Bar) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Search tool */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 w-full sm:w-80 focus-within:border-brand-primary/50 transition-all duration-300">
          <Search size={14} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari produk atau brand..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent text-xs text-white border-none outline-none w-full placeholder-gray-500 font-medium"
          />
        </div>

        {/* Filters & Add Product Action Group */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Dropdown Category Filter */}
          <select 
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-brand-primary/50 transition-all duration-300 cursor-pointer"
          >
            <option value="Semua" className="bg-brand-bg text-white">Semua Kategori</option>
            <option value="Cleanser" className="bg-brand-bg text-white">Cleanser</option>
            <option value="Moisturizer" className="bg-brand-bg text-white">Moisturizer</option>
            <option value="Sunscreen" className="bg-brand-bg text-white">Sunscreen</option>
            <option value="Toner" className="bg-brand-bg text-white">Toner</option>
          </select>

          {/* Add Product Button */}
          <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-brand-bg bg-brand-accent rounded-xl hover:bg-white hover:shadow-brand-accent/25 transition-all duration-300 shadow-lg shadow-brand-accent/20 cursor-pointer shrink-0">
            <Plus size={16} />
            <span>Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* 2. DIVIDER */}
      <div className="h-px bg-white/5" />

      {/* 3. BODY (Tabel Isi Produk) */}
      <div className="glass-card rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-175">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-6">Brand & Produk</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kategori</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Waktu Pakai</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Proteksi</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">No. BPOM</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center pr-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentItems.length > 0 ? (
                currentItems.map((product) => (
                  <tr key={product.product_id} className="hover:bg-white/2 transition-colors duration-200">
                    {/* Brand & Produk (Tanpa UUID) */}
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wide">{product.brand_name}</span>
                        <h4 className="font-semibold text-xs text-white mt-0.5 line-clamp-1">{product.product_name}</h4>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="p-4 text-xs text-gray-300 font-medium">
                      {product.category}
                    </td>

                    {/* Waktu Pakai */}
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                        product.usage_time === 'Pagi & Malam' 
                          ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' 
                          : product.usage_time === 'Pagi'
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                          : 'text-purple-400 bg-purple-500/10 border-purple-500/20'
                      }`}>
                        {product.usage_time}
                      </span>
                    </td>

                    {/* Proteksi */}
                    <td className="p-4 text-xs text-gray-300 font-medium">
                      {product.spf_value ? (
                        <div className="flex items-center gap-1">
                          <span className="text-white font-semibold">SPF {product.spf_value}</span>
                          {product.pa_grade && <span className="text-[10px] text-brand-accent font-bold">({product.pa_grade})</span>}
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>

                    {/* No. BPOM */}
                    <td className="p-4 text-xs text-gray-400 font-mono">
                      {product.bpom_number}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <button 
                        onClick={() => handleToggleStatus(product.product_id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          product.is_active 
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20' 
                            : 'text-rose-400 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${product.is_active ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {product.is_active ? 'Aktif' : 'Non-Aktif'}
                      </button>
                    </td>

                    {/* Aksi (Hanya Hapus Saja) */}
                    <td className="p-4 text-center pr-6">
                      <button 
                        onClick={() => setProductToDelete(product)}
                        title="Hapus"
                        className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-gray-500 font-medium">
                    Tidak ditemukan produk skincare yang cocok dengan pencarian atau filter Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. DIVIDER */}
      <div className="h-px bg-white/5" />

      {/* 5. FOOTER (Pagination Sentral) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs select-none">
        {/* Pagination details */}
        <div className="text-gray-400 text-center sm:text-left font-medium">
          Menampilkan <span className="text-white font-semibold">{filteredProducts.length > 0 ? indexOfFirstItem + 1 : 0}</span> sampai{' '}
          <span className="text-white font-semibold">
            {indexOfLastItem > filteredProducts.length ? filteredProducts.length : indexOfLastItem}
          </span>{' '}
          dari <span className="text-white font-semibold">{filteredProducts.length}</span> produk
        </div>

        {/* Action Button prev next */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || totalPages <= 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:hover:border-white/10 transition-all duration-300 font-semibold cursor-pointer text-gray-300 hover:text-white"
          >
            <ChevronLeft size={14} />
            <span>Sebelumnya</span>
          </button>
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages <= 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:hover:border-white/10 transition-all duration-300 font-semibold cursor-pointer text-gray-300 hover:text-white"
          >
            <span>Selanjutnya</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 6. MODAL KONFIRMASI HAPUS (Glassmorphism Popup) */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-6 text-center space-y-4">
              {/* Glowing Alert Icon */}
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/5">
                <Trash2 size={20} />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-base text-white tracking-tight">Hapus Produk Skincare?</h3>
                <p className="text-xs text-gray-400 leading-relaxed px-2">
                  Apakah Anda yakin ingin menghapus <span className="font-semibold text-white">"{productToDelete.product_name}"</span>? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 border-t border-white/5 pt-4 mt-6">
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 border border-transparent transition-all duration-300 cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  onClick={() => {
                    handleDelete(productToDelete.product_id);
                    setProductToDelete(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 hover:shadow-rose-500/25 transition-all duration-300 shadow-md shadow-rose-500/10 cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
