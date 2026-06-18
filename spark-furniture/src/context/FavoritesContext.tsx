"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/components/ProductGrid/ProductCard';

interface FavoritesContextType {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: string) => boolean;
  isFavoritesOpen: boolean;
  setIsFavoritesOpen: (isOpen: boolean) => void;
  toggleFavoritesDrawer: () => void;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('spark_furniture_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage', error);
    }
  }, []);

  // Save favorites to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('spark_furniture_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites to localStorage', error);
    }
  }, [favorites]);

  const toggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some((item) => item.id === id);
  };

  const toggleFavoritesDrawer = () => setIsFavoritesOpen((prev) => !prev);

  const favoritesCount = favorites.length;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        isFavoritesOpen,
        setIsFavoritesOpen,
        toggleFavoritesDrawer,
        favoritesCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
