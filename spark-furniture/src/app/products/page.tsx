import { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Premium Furniture Showcase | Spark Furniture",
  description: "Browse our complete catalog of handcrafted signature furniture collections from Spark Furniture (also known as Spark Furnitures). Find custom office chairs, modular desks, sofas, beds, and ergonomic workspace designs.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Premium Furniture Showcase | Spark Furniture",
    description: "Browse our complete catalog of handcrafted signature furniture collections from Spark Furniture (also known as Spark Furnitures). Find custom office chairs, modular desks, sofas, beds, and ergonomic workspace designs.",
    url: "https://www.sparkfurnitures.in/products",
  },
};

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return products.map((p: any) => {
      let colorsParsed = [];
      try {
        colorsParsed = typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors;
      } catch (e) {
        console.error(`Failed to parse colors for product ${p.id}:`, e);
      }
      return {
        ...p,
        colors: colorsParsed
      };
    });
  } catch (err) {
    console.error("Error fetching products server-side:", err);
    return [];
  }
}

export default async function ProductsPage() {
  const initialProducts = await getProducts();
  return <ProductsClient initialProducts={initialProducts} />;
}
