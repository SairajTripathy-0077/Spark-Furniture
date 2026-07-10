import { Metadata } from "next";
import Hero from "@/components/Hero/Hero";
import ProductGrid from "@/components/ProductGrid/ProductGrid";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "https://www.sparkfurnitures.in",
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
    console.error("Error in server-side getProducts:", err);
    return [];
  }
}

export default async function Home() {
  const initialProducts = await getProducts();

  return (
    <div>
      <Hero />
      <ProductGrid initialProducts={initialProducts} />
    </div>
  );
}
