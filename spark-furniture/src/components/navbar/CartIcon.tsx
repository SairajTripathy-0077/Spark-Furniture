"use client";

import React from 'react';
import { ShoppingCart } from "lucide-react";
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const CartIcon = () => {
  const { cartCount, toggleCart } = useCart();

  return (
    <button 
      onClick={toggleCart}
      className='relative p-1.5 rounded-full hover:bg-neutral-100 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#31170E]/20'
      aria-label={`Open shopping cart with ${cartCount} items`}
    >
      <ShoppingCart size={20} className='text-[#31170E] hover:text-[#6b4335] transition-colors duration-200' />
      
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.span
            key={cartCount} // Key based on count ensures it re-triggers the entry animation when count changes!
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#31170E] text-[10px] font-bold text-[#fdf9f4] shadow-sm"
          >
            {cartCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default CartIcon;