"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product } from './ProductCard';
import { useCart } from '@/context/CartContext';
import FurnitureSketch from './FurnitureSketch';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [quantity, setQuantity] = useState(1);

  // Sync selected color when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]);
      setQuantity(1);
    }
  }, [product]);

  // Handle Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product || !selectedColor) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        selectedColor: selectedColor.hex,
        imageType: product.imageType,
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          className="relative z-10 flex flex-col md:flex-row w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto rounded-3xl border border-neutral-100 bg-[#fdf9f4] shadow-2xl"
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 rounded-full bg-white/80 p-2 text-neutral-500 shadow-sm transition-colors hover:bg-white hover:text-black cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Left Panel: Image Gallery */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center bg-white md:rounded-l-3xl border-b md:border-b-0 md:border-r border-neutral-100">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <FurnitureSketch type={product.imageType} className="h-full w-full" />
              )}
              {product.badge && (
                <span className="absolute top-4 left-4 rounded-full bg-[#31170E] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#fdf9f4]">
                  {product.badge}
                </span>
              )}
            </div>
            
            {/* Visual sketch gallery tabs (purely decorative/premium aesthetic) */}
            <div className="flex gap-3 mt-4 justify-center">
              <div className="h-14 w-14 rounded-lg border border-[#31170E] p-0.5 cursor-pointer overflow-hidden flex items-center justify-center bg-[#fdf9f4]">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt="Thumbnail 1" className="h-full w-full object-cover rounded-md" />
                ) : (
                  <FurnitureSketch type={product.imageType} className="h-full w-full rounded-md" />
                )}
              </div>
              <div className="h-14 w-14 rounded-lg border border-transparent hover:border-neutral-200 p-0.5 opacity-60 cursor-pointer overflow-hidden flex items-center justify-center bg-[#fdf9f4]">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt="Thumbnail 2" className="h-full w-full object-cover rounded-md grayscale" />
                ) : (
                  <FurnitureSketch type={product.imageType} className="h-full w-full rounded-md grayscale" />
                )}
              </div>
              <div className="h-14 w-14 rounded-lg border border-transparent hover:border-neutral-200 p-0.5 opacity-60 cursor-pointer overflow-hidden flex items-center justify-center bg-[#fdf9f4]">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt="Thumbnail 3" className="h-full w-full object-cover rounded-md sepia" />
                ) : (
                  <FurnitureSketch type={product.imageType} className="h-full w-full rounded-md sepia" />
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Content Details */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category */}
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                {product.category}
              </span>

              {/* Title */}
              <h2 className="mt-1 font-serif text-2xl md:text-3xl font-bold text-[#31170E] leading-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < Math.floor(product.rating) ? 'currentColor' : 'transparent'}
                      className={i < Math.floor(product.rating) ? 'text-amber-500' : 'text-neutral-300'}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-600">
                  {product.rating} ({product.reviewsCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-serif text-2xl font-bold text-[#31170E]">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Divider */}
              <hr className="my-5 border-[#31170E]/10" />

              {/* Description */}
              <p className="text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>

              {/* Interactive Color selector */}
              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  Finish: <span className="text-[#31170E] font-semibold font-sans normal-case">{selectedColor.name}</span>
                </h4>
                <div className="flex gap-2 mt-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setSelectedColor(color)}
                      className={`relative h-7 w-7 rounded-full border border-black/10 p-0.5 transition-all duration-200 cursor-pointer ${
                        selectedColor.hex === color.hex ? 'ring-2 ring-[#31170E] ring-offset-2' : 'hover:scale-105'
                      }`}
                    >
                      <span
                        className="block h-full w-full rounded-full"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="mt-8 space-y-4">
              <div className="flex gap-4 items-center">
                {/* Quantity */}
                <div className="flex items-center rounded-lg border border-neutral-200 bg-white px-2 py-1 shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 hover:text-black text-neutral-400 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <X size={12} className="rotate-45" /> {/* Use X rotated or similar since we have minus */}
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-[#31170E]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1.5 hover:text-black text-neutral-400 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <span className="font-bold text-sm">+</span>
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#31170E] py-3 text-sm font-semibold text-[#fdf9f4] shadow-md transition-all hover:bg-[#6b4335] active:scale-[0.98] cursor-pointer"
                >
                  <ShoppingCart size={16} />
                  Add to Cart - ${(product.price * quantity).toLocaleString()}
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-neutral-500 font-medium border-t border-neutral-100/50">
                <div className="flex items-center gap-1.5 justify-center">
                  <ShieldCheck size={14} className="text-[#31170E]/60" />
                  <span>5-Year Warranty</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <Truck size={14} className="text-[#31170E]/60" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <RefreshCw size={14} className="text-[#31170E]/60" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default ProductQuickView;
