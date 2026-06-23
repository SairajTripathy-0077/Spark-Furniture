"use client";

import React from 'react';
import ProductGrid from '@/components/ProductGrid/ProductGrid';

export default function ProductsClient() {
  return (
    <div className="bg-[#fdf9f4] min-h-screen text-[#31170E] py-0">
      {/* Product Grid with hidden internal header */}
      <ProductGrid hideHeader />
    </div>
  );
}
