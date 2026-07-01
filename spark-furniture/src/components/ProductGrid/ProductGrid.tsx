"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, SlidersHorizontal, RotateCcw, Heart } from 'lucide-react';
import Container from '../Container';
import ProductCard, { Product } from './ProductCard';
import ProductQuickView from './ProductQuickView';
import { useFavorites } from '@/context/FavoritesContext';

const productsData: Product[] = [];

const DEFAULT_CATEGORIES = ['All', 'Chairs', 'Workstations', 'Modular Furniture', 'Bed', 'Sofa', 'Dinning Sets', 'Mattress'];

interface ProductGridProps {
  hideHeader?: boolean;
  initialProducts?: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ hideHeader = false, initialProducts }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    // Read client-side URL query parameters to toggle favorites
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('favorites') === 'true') {
        setShowOnlyFavorites(true);
      }
    }
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const dynamicNames = data.map((c: any) => c.name);
          if (dynamicNames.length > 0) {
            setCategories(['All', ...dynamicNames]);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic categories, using default fallback:', err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      return;
    }

    async function loadProducts() {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          setProducts(productsData);
        }
      } catch (err) {
        console.error('Failed to load products from database, using static fallback:', err);
        setProducts(productsData);
      }
    }
    loadProducts();
  }, [initialProducts]);

  // Filter and sort logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(
        (product) => product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Filter by Favorites
    if (showOnlyFavorites) {
      result = result.filter((product) => isFavorite(product.id));
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy, favorites, showOnlyFavorites, isFavorite]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    setShowOnlyFavorites(false);
  };

  return (
    <section className={`${hideHeader ? 'pt-2 pb-16' : 'py-16'} bg-[#fdf9f4]`}>
      <Container>


        {/* Filter and Control Panel */}
        <div className="mb-10 flex flex-col gap-6">
          
          {/* Category Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#31170E]/10 pb-6">
            <div className="flex flex-nowrap overflow-x-auto gap-2 py-1 scrollbar-none -mx-4 px-4 scroll-smooth">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`relative px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors duration-300 rounded-full cursor-pointer whitespace-nowrap focus:outline-none ${
                      isActive ? 'text-[#fdf9f4]' : 'text-[#31170E]/70 hover:text-[#31170E]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-[#31170E] rounded-full z-0 shadow-sm"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{category}</span>
                  </button>
                );
              })}
            </div>

            {/* Sorting & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Box */}
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Search pieces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-neutral-200 bg-white py-2 pl-5 pr-4 text-xs font-semibold text-[#31170E] placeholder-neutral-400 focus:border-[#31170E] focus:outline-none focus:ring-1 focus:ring-[#31170E]/20 transition-all duration-300"
                />
              </div>



              {/* Sort Selector */}
              <div className="relative flex-shrink-0">
                <SlidersHorizontal size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full rounded-full border border-neutral-200 bg-white py-2 pl-9 pr-8 text-xs font-bold uppercase tracking-wider text-[#31170E] focus:border-[#31170E] focus:outline-none focus:ring-1 focus:ring-[#31170E]/20 cursor-pointer transition-all duration-300"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>

                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 min-h-[400px]"
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setSelectedProduct}
                  isWishlisted={isFavorite(product.id)}
                  onToggleWishlist={() => toggleFavorite(product)}
                />
              ))
            ) : products.length === 0 ? (
              <motion.div
                key="catalog-empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl border border-neutral-100 p-8 shadow-sm"
              >
                <SlidersHorizontal size={36} className="text-[#31170E]/30 mb-4" />
                <h3 className="font-serif text-lg font-semibold text-[#31170E]">Catalog is Empty</h3>
                <p className="mt-2 text-xs md:text-sm text-neutral-500 max-w-sm mx-auto font-sans leading-relaxed">
                  Our collections are currently being updated. Please check back soon or contact us to discuss custom orders.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl border border-neutral-100 p-8 shadow-sm"
              >
                <SlidersHorizontal size={36} className="text-[#31170E]/30 mb-4" />
                <h3 className="font-serif text-lg font-semibold text-[#31170E]">No products match your search</h3>
                <p className="mt-2 text-xs md:text-sm text-neutral-500 max-w-sm mx-auto font-sans leading-relaxed">
                  Try clearing your search or expanding your filters to discover our premium collections.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 flex items-center gap-2 rounded-full border border-[#31170E] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#31170E] transition-all hover:bg-[#31170E] hover:text-[#fdf9f4] active:scale-95 cursor-pointer"
                >
                  <RotateCcw size={12} />
                  Reset Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick View Modal */}
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </Container>
    </section>
  );
};

export default ProductGrid;