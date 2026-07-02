import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { productService } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat produk');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products from database / service
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter & Search Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.bpom_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Semua' ||
      product.sunscreen_type === selectedCategory;

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

  const handleDelete = async (id: string) => {
    const previousProducts = [...products];
    // Optimistic update
    setProducts(prev => prev.filter(p => p.product_id !== id));

    const success = await productService.deleteProduct(id);
    if (!success) {
      // Revert if failed
      setProducts(previousProducts);
    }
  };

  const handleToggleStatus = async (id: string) => {
    const product = products.find(p => p.product_id === id);
    if (!product) return;

    const previousStatus = product.is_active;

    // Optimistic update
    setProducts(prev => prev.map(p =>
      p.product_id === id ? { ...p, is_active: !p.is_active } : p
    ));

    const success = await productService.toggleProductStatus(id, previousStatus);
    if (!success) {
      // Revert if failed
      setProducts(prev => prev.map(p =>
        p.product_id === id ? { ...p, is_active: previousStatus } : p
      ));
    }
  };

  // Helper to handle search with page reset
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Helper to handle category filter with page reset
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  return {
    searchTerm,
    setSearchTerm: handleSearchChange,
    selectedCategory,
    setSelectedCategory: handleCategoryChange,
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
    error,
    isDbEmpty: products.length === 0,
    refreshProducts: fetchProducts,
    nextProductCode: (() => {
      let maxNum = 0;
      products.forEach(p => {
        const match = p.product_code.match(/^S(\d+)$/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) {
            maxNum = num;
          }
        }
      });
      return `S${String(maxNum + 1).padStart(3, '0')}`;
    })(),
  };
};
