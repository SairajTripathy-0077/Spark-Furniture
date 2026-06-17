import Image from "next/image";
import Hero from "@/components/Hero/Hero";
import ProductGrid from "@/components/ProductGrid/ProductGrid";


export default function Home() {
  return (
    <div>
      <Hero/>
      <ProductGrid />
    </div>
  );
}
