"use client";

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import FurnitureSketch from './ProductGrid/FurnitureSketch';

const DEFAULT_COLOR = { name: 'Default', hex: '#31170E' };

export const FavoritesDrawer: React.FC = () => {
  const {
    favorites,
    isFavoritesOpen,
    setIsFavoritesOpen,
    toggleFavorite,
  } = useFavorites();

  const { addToCart } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on pressing Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFavoritesOpen(false);
      }
    };
    if (isFavoritesOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFavoritesOpen, setIsFavoritesOpen]);

  const handleAddToCart = (product: any) => {
    const defaultColorHex = product.colors && product.colors.length > 0
      ? product.colors[0].hex
      : DEFAULT_COLOR.hex;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      selectedColor: defaultColorHex,
      imageType: product.imageType,
      imageUrl: product.imageUrl || undefined,
    });
  };

  return (
    <AnimatePresence>
      {isFavoritesOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFavoritesOpen(false)}
          />

          {/* Drawer Container */}
          <motion.div
            ref={drawerRef}
            className="fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col border-l border-neutral-200 bg-[#fdf9f4] shadow-2xl sm:max-w-md"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#31170E]/10 p-6">
              <div className="flex items-center gap-2">
                <Heart size={20} className="text-red-500 fill-red-500 animate-pulse" />
                <h2 className="font-serif text-xl font-bold tracking-tight text-[#31170E]">
                  Your Favorites
                </h2>
              </div>
              <button
                onClick={() => setIsFavoritesOpen(false)}
                className="rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-black cursor-pointer"
                aria-label="Close favorites"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {favorites.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-12">
                  <div className="mb-4 rounded-full bg-red-50 p-6 text-red-500/50">
                    <Heart size={40} />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#31170E]">
                    No favorites yet
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500 max-w-[240px]">
                    Explore our collection and add pieces you love to your wishlist.
                  </p>
                  <button
                    onClick={() => setIsFavoritesOpen(false)}
                    className="mt-6 rounded-md bg-[#31170E] px-5 py-2.5 text-sm font-medium text-[#fdf9f4] shadow-sm transition-all hover:bg-[#6b4335] active:scale-95 cursor-pointer"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                favorites.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex gap-4 rounded-xl border border-neutral-100 bg-white p-3 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Item Image */}
                    <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border border-neutral-100 flex items-center justify-center bg-[#fdf9f4]">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <FurnitureSketch type={product.imageType} className="h-full w-full" />
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between gap-1">
                        <div>
                          <h4 className="font-sans text-xs font-bold text-[#31170E] line-clamp-1">
                            {product.name}
                          </h4>
                          <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                            {product.category}
                          </span>
                        </div>
                        <span className="font-serif text-xs font-bold text-[#31170E]">
                          ₹{product.price}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-50">
                        {/* Add to Cart quick button */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex items-center gap-1 rounded bg-[#31170E]/5 hover:bg-[#31170E] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#31170E] hover:text-[#fdf9f4] transition-all cursor-pointer"
                        >
                          <ShoppingCart size={11} />
                          <span>Add to Cart</span>
                        </button>

                        {/* Remove from favorites */}
                        <button
                          onClick={() => toggleFavorite(product)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                          aria-label="Remove from favorites"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {favorites.length > 0 && (
              <div className="border-t border-[#31170E]/10 bg-white p-6 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
                <button
                  onClick={() => setIsFavoritesOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[#31170E] py-3 text-sm font-semibold text-[#fdf9f4] shadow-sm transition-all hover:bg-[#6b4335] active:scale-[0.98] cursor-pointer"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FavoritesDrawer;
