"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import FurnitureSketch from './FurnitureSketch';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: string;
  description: string;
  colors: { name: string; hex: string }[];
  imageType: 'chair' | 'table' | 'sofa' | 'lamp' | 'storage';
  badge?: 'New' | 'Sale' | 'Limited';
  imageUrl?: string | null;
  imageUrls?: string[];
}

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

const DEFAULT_COLOR = { name: 'Default', hex: '#31170E' };

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, isWishlisted, onToggleWishlist }) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : DEFAULT_COLOR
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering any card click events
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      selectedColor: selectedColor ? selectedColor.hex : DEFAULT_COLOR.hex,
      imageType: product.imageType,
      imageUrl: product.imageUrl || undefined,
    });
  };

  const discountedPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm hover:shadow-xl hover:border-neutral-200/80 transition-all duration-300 cursor-pointer"
      onClick={() => onQuickView(product)}
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-50 flex items-center justify-center">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.badge === 'New' && (
            <span className="rounded-full bg-[#31170E] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#fdf9f4]">
              New
            </span>
          )}
          {product.badge === 'Sale' && (
            <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Sale -{discountedPercentage}%
            </span>
          )}
          {product.badge === 'Limited' && (
            <span className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Limited
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-neutral-600 shadow-sm transition-all hover:bg-white hover:text-red-500 active:scale-90 cursor-pointer"
          aria-label="Add to wishlist"
        >
          <Heart size={15} fill={isWishlisted ? '#ef4444' : 'transparent'} className={isWishlisted ? 'text-red-500' : ''} />
        </button>

        {/* Sketch Placeholder or Cloudinary Image */}
        <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03] flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <FurnitureSketch type={product.imageType} className="h-full w-full" />
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-4 flex flex-col flex-1 justify-between px-1">
        <div>
          {/* Category */}
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            {product.category}
          </span>

          {/* Title */}
          <div className="mt-1">
            <h3 className="font-sans text-base font-semibold text-[#31170E] line-clamp-1 group-hover:text-[#6b4335] transition-colors duration-200">
              {product.name}
            </h3>
          </div>

          {/* Price */}
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-serif text-lg font-bold text-[#31170E]">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Color Swatches (Permanent) */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-4 border-t border-neutral-100 pt-3">
            <div className="flex gap-1.5">
              {product.colors.map((color) => (
                <button
                  key={color.hex}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(color);
                  }}
                  className={`relative h-5 w-5 rounded-full border border-black/10 p-0.5 transition-all duration-200 cursor-pointer ${
                    selectedColor && selectedColor.hex === color.hex ? 'ring-1 ring-[#31170E] ring-offset-1' : 'hover:scale-110'
                  }`}
                  title={color.name}
                >
                  <span
                    className="block h-full w-full rounded-full"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons (Permanent, Desktop & Mobile) */}
        <div className="mt-3.5 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#31170E] py-2 text-xs font-bold uppercase tracking-wider text-[#fdf9f4] hover:bg-[#6b4335] active:scale-[0.97] transition-all duration-200 cursor-pointer shadow-sm"
          >
            <ShoppingCart size={13} />
            <span>Add to Cart</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-[#31170E] hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.97] transition-all duration-200 cursor-pointer"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default ProductCard;
