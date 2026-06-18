"use client";

import React from 'react';
import { Heart } from "lucide-react";
import { useFavorites } from '@/context/FavoritesContext';
import { motion, AnimatePresence } from 'framer-motion';

const FavoritesIcon = () => {
  const { favoritesCount, toggleFavoritesDrawer } = useFavorites();

  return (
    <button 
      onClick={toggleFavoritesDrawer}
      className='relative p-1.5 rounded-full hover:bg-neutral-100 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#31170E]/20'
      aria-label={`Open favorites list with ${favoritesCount} items`}
    >
      <Heart size={20} className='text-[#31170E] hover:text-[#6b4335] transition-colors duration-200' />
      
      <AnimatePresence>
        {favoritesCount > 0 && (
          <motion.span
            key={favoritesCount}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#31170E] text-[10px] font-bold text-[#fdf9f4] shadow-sm"
          >
            {favoritesCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default FavoritesIcon;
