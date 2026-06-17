"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, SlidersHorizontal, RotateCcw } from 'lucide-react';
import Container from '../Container';
import ProductCard, { Product } from './ProductCard';
import ProductQuickView from './ProductQuickView';

const productsData: Product[] = [
  {
    id: '1',
    name: 'Velvet Amber Lounge Chair',
    price: 450,
    originalPrice: 520,
    rating: 4.8,
    reviewsCount: 124,
    category: 'Chairs',
    description: 'Chic mid-century lounge chair with tapered walnut legs and ergonomic wrap-around cushioning. Upholstered in premium, spill-resistant amber velvet that adds warmth to any living space.',
    colors: [
      { name: 'Amber Velvet', hex: '#d97706' },
      { name: 'Forest Green', hex: '#14532d' },
      { name: 'Classic Slate', hex: '#475569' },
    ],
    imageType: 'chair',
    badge: 'Sale'
  },
  {
    id: '2',
    name: 'Monolith Oak Dining Table',
    price: 1250,
    rating: 4.9,
    reviewsCount: 86,
    category: 'Tables',
    description: 'Solid oak dining table featuring an architectural pedestal base and a clean, live-edge finish. Built to comfortably seat up to 8 guests and endure generations of family meals.',
    colors: [
      { name: 'Natural Oak', hex: '#d2b48c' },
      { name: 'Smoked Oak', hex: '#634832' },
      { name: 'Walnut Stain', hex: '#4a3728' },
    ],
    imageType: 'table',
    badge: 'New'
  },
  {
    id: '3',
    name: 'Bouclé Curve Sofa',
    price: 2100,
    originalPrice: 2450,
    rating: 4.7,
    reviewsCount: 43,
    category: 'Sofas',
    description: 'Organic curved three-seater sofa upholstered in textured cream bouclé fabric. The sculptural silhouette provides an elegant statement piece with deep, plush seating comfort.',
    colors: [
      { name: 'Cream Bouclé', hex: '#f4f1ea' },
      { name: 'Oatmeal Tweed', hex: '#d5cdbe' },
      { name: 'Charcoal Linen', hex: '#2d2d2d' },
    ],
    imageType: 'sofa',
    badge: 'Sale'
  },
  {
    id: '4',
    name: 'Holo Brass Pendant Light',
    price: 280,
    rating: 4.6,
    reviewsCount: 78,
    category: 'Lighting',
    description: 'Sleek brushed brass ceiling fixture with dual hand-blown warm frosted glass globes. Creates a dramatic soft light ideal for hanging over kitchen islands or dining areas.',
    colors: [
      { name: 'Brushed Brass', hex: '#e2b13c' },
      { name: 'Matte Black', hex: '#1c1c1c' },
      { name: 'Polished Chrome', hex: '#c0c0c0' },
    ],
    imageType: 'lamp',
  },
  {
    id: '5',
    name: 'Walnut Slatted Credenza',
    price: 1600,
    rating: 4.9,
    reviewsCount: 92,
    category: 'Storage',
    description: 'Mid-century sideboard featuring walnut veneer, sliding slatted doors, and plenty of adjustable internal shelving. Serves perfectly as an elegant media console or entryway credenza.',
    colors: [
      { name: 'Rich Walnut', hex: '#4e3629' },
      { name: 'Natural Ash', hex: '#e9e4db' },
    ],
    imageType: 'storage',
    badge: 'New'
  },
  {
    id: '6',
    name: 'Elysian Arc Armchair',
    price: 580,
    rating: 4.8,
    reviewsCount: 65,
    category: 'Chairs',
    description: 'Sculptural accent armchair featuring cream performance fabric and a curved wooden back panel. Perfect for creating a cozy, contemporary reading nook in bedrooms or study rooms.',
    colors: [
      { name: 'Pebble White', hex: '#f2ece4' },
      { name: 'Warm Taupe', hex: '#bda895' },
      { name: 'Terracotta', hex: '#c2593f' },
    ],
    imageType: 'chair',
    badge: 'Limited'
  },
  {
    id: '7',
    name: 'Travertine Pillar Side Table',
    price: 390,
    rating: 4.5,
    reviewsCount: 38,
    category: 'Tables',
    description: 'Honed travertine stone side table boasting a block geometric pillar structure. Adds an architectural, minimalist element to your living setup, showcasing organic textures of genuine stone.',
    colors: [
      { name: 'Travertine', hex: '#eae3d2' },
      { name: 'Carrara Marble', hex: '#f0f3f4' },
    ],
    imageType: 'table',
  },
  {
    id: '8',
    name: 'Minimalist Linear Desk Lamp',
    price: 180,
    originalPrice: 220,
    rating: 4.6,
    reviewsCount: 29,
    category: 'Lighting',
    description: 'Sleek matte aluminum desk lamp equipped with premium high-CRI linear LEDs. Features intuitive touch-dimming controls, rotating arms, and USB charging built right into the base.',
    colors: [
      { name: 'Matte Black', hex: '#1c1c1c' },
      { name: 'Anodized Silver', hex: '#cfd2d6' },
    ],
    imageType: 'lamp',
    badge: 'Sale'
  }
];

const categories = ['All', 'Chairs', 'Sofas', 'Tables', 'Lighting', 'Storage'];

export const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
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
  }, []);

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

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <section className="py-16 bg-[#fdf9f4]">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-widest uppercase text-[#6b4335]"
          >
            Handcrafted Signature Collections
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#31170E] mt-3 tracking-tight"
          >
            Timeless Luxury for Every Room
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-1 w-12 bg-[#31170E] mx-auto mt-6"
          />
        </div>

        {/* Filter and Control Panel */}
        <div className="mb-10 flex flex-col gap-6">
          
          {/* Category Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#31170E]/10 pb-6">
            <div className="flex flex-nowrap overflow-x-auto lg:flex-wrap lg:overflow-visible gap-2 py-1 scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0 scroll-smooth">
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
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search pieces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-neutral-200 bg-white py-2 pl-10 pr-4 text-xs font-semibold text-[#31170E] placeholder-neutral-400 focus:border-[#31170E] focus:outline-none focus:ring-1 focus:ring-[#31170E]/20 transition-all duration-300"
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
                  <option value="rating">Highest Rated</option>
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
                />
              ))
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
                <p className="mt-2 text-sm text-neutral-500 max-w-sm mx-auto">
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