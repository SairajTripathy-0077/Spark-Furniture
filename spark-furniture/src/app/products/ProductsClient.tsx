"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/Container';
import ProductGrid from '@/components/ProductGrid/ProductGrid';

export default function ProductsClient() {
  return (
    <div className="bg-[#fdf9f4] min-h-screen text-[#31170E] py-16">
      <Container>
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-2 space-y-5">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#31170E] leading-tight"
          >
            Timeless <span className="italic font-serif text-[#6b4335] font-normal">Luxury</span> Furniture
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs md:text-sm text-neutral-500 leading-relaxed max-w-2xl mx-auto font-sans"
          >
            Explore our handcrafted collections designed for homes and modern workspaces. Use the filters below to refine your search by category and price.
          </motion.p>
        </div>
      </Container>

      {/* Product Grid with hidden internal header */}
      <ProductGrid hideHeader />
    </div>
  );
}
