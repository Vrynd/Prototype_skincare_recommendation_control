import React, { useState, useCallback } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductHeader } from './ProductHeader';
import { ProductTable } from './ProductTable';
import { ProductPagination } from './ProductPagination';
import { ConfirmationModal } from './ConfirmationModal';
import { ProductDetailSidebar } from './ProductDetailSidebar';
import { productService } from '../services/productService';
import type { Product, ProductDetail } from '../types';

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

  // Sidebar state
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleRowClick = useCallback(async (product: Product) => {
    // Jika klik produk yang sama, tutup sidebar
    if (selectedProductId === product.product_id) {
      setSelectedProduct(null);
      setSelectedProductId(null);
      return;
    }

    setSelectedProductId(product.product_id);
    setSidebarLoading(true);
    setSelectedProduct(null);

    const detail = await productService.getProductDetail(product.product_id);
    setSelectedProduct(detail);
    setSidebarLoading(false);
  }, [selectedProductId]);

  const handleCloseSidebar = useCallback(() => {
    setSelectedProduct(null);
    setSelectedProductId(null);
  }, []);

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
      {/* Header dan Action Bar */}
      <ProductHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Tabel produk */}
      <ProductTable
        currentItems={currentItems}
        isDbEmpty={isDbEmpty}
        onToggleStatus={handleToggleStatus}
        onDeleteClick={setProductToDelete}
        onEditClick={(product) => {
          // TODO: buka modal/form edit produk
          console.log('Edit produk:', product.product_id);
        }}
        onRowClick={handleRowClick}
        selectedProductId={selectedProductId}
      />

      {/* Paginasi */}
      <ProductPagination
        filteredCount={filteredProducts.length}
        currentPage={currentPage}
        totalPages={totalPages}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        onPageChange={handlePageChange}
      />

      {/* Modal konfirmasi hapus */}
      <ConfirmationModal
        product={productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={(id) => {
          handleDelete(id);
          setProductToDelete(null);
          // Tutup sidebar jika produk yang dihapus sedang terbuka
          if (selectedProductId === id) handleCloseSidebar();
        }}
      />

      {/* Sidebar detail produk */}
      {(selectedProductId) && (
        <ProductDetailSidebar
          product={selectedProduct}
          isLoading={sidebarLoading}
          onClose={handleCloseSidebar}
        />
      )}
    </div>
  );
};
