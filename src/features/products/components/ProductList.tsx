import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductHeader } from './ProductHeader';
import { ProductTable } from './ProductTable';
import { ProductPagination } from './ProductPagination';
import { ConfirmationModal } from './ConfirmationModal';

export const ProductList: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    totalPages,
    productToDelete,
    setProductToDelete,
    filteredProducts,
    currentItems,
    indexOfFirstItem,
    indexOfLastItem,
    handlePageChange,
    handleDelete,
    handleToggleStatus,
    isLoading,
    isDbEmpty,
  } = useProducts();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4 glass-card rounded-3xl border border-white/5 shadow-2xl">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-brand-accent animate-spin" />
        <p className="text-xs text-gray-400 font-medium tracking-wide">Memuat data produk...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Component Header dan Action Bar */}
      <ProductHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* 2. Component Table */}
      <ProductTable
        currentItems={currentItems}
        isDbEmpty={isDbEmpty}
        onToggleStatus={handleToggleStatus}
        onDeleteClick={setProductToDelete}
      />

      {/* 3. FOOTER (Paginasi) */}
      <ProductPagination
        filteredCount={filteredProducts.length}
        currentPage={currentPage}
        totalPages={totalPages}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        onPageChange={handlePageChange}
      />

      {/* 4. MODAL KONFIRMASI HAPUS */}
      <ConfirmationModal
        product={productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={(id) => {
          handleDelete(id);
          setProductToDelete(null);
        }}
      />
    </div>
  );
};
