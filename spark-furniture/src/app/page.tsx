import Hero from "@/components/Hero/Hero";
import ProductGrid from "@/components/ProductGrid/ProductGrid";
import { prisma } from "@/lib/prisma";
import Container from "@/components/Container";
import { MapPin, Shield, Sparkles } from "lucide-react";

export const dynamic = 'force-dynamic';

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

      {/* Local SEO Section */}
      <section className="bg-white border-t border-[#31170E]/5 py-16 text-[#31170E]">
        <Container className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold tracking-widest uppercase text-[#6b4335]">
              Premium Showroom in Bhubaneswar, Odisha
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#31170E]">
              Discover Premium & Custom Furniture in Bhubaneswar
            </h2>
            <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
              Welcome to <strong>Spark Furniture</strong> (also known as Spark Furnitures), Odisha's premium destination for custom-built office and home furniture. From our state-of-the-art 11,500 sq. ft. showroom in Bhubaneswar, we manufacture and design furniture that brings luxury, ergonomic comfort, and durability to your spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#fdf9f4] p-8 rounded-2xl border border-neutral-100/50 space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-white shadow-sm text-[#6b4335]">
                <Sparkles size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold">Custom Office Seating</h3>
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                Design the ideal workspace with our premium, high-back ergonomic office chairs, executive desks, and modular office workstations. We customize designs to boost productivity and comfort in corporate offices across Bhubaneswar.
              </p>
            </div>

            <div className="bg-[#fdf9f4] p-8 rounded-2xl border border-neutral-100/50 space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-white shadow-sm text-[#6b4335]">
                <Shield size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold">Handcrafted Home Furniture</h3>
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                Transform your living spaces with bespoke teak wood and premium quality wooden sofas, dining table sets, modular kitchens, king-size beds, and interior decor tailored to fit your home's unique layout and aesthetic.
              </p>
            </div>

            <div className="bg-[#fdf9f4] p-8 rounded-2xl border border-neutral-100/50 space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-white shadow-sm text-[#6b4335]">
                <MapPin size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold">Bhubaneswar Showroom</h3>
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                Visit our local furniture showroom at Dumduma, beside NH-5, Khandagiri, Bhubaneswar. Explore physical showcases of our premium collections, speak to our interior designers, and place custom furniture orders.
              </p>
            </div>
          </div>

          <div className="bg-[#fdf9f4] rounded-3xl p-8 md:p-12 border border-neutral-100 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="space-y-3 max-w-xl">
              <h3 className="font-serif text-2xl font-bold">Looking for Custom Interior Solutions in Odisha?</h3>
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                We specialize in complete turnkey office interiors and custom household projects. Get a free catalog consultation with our Bhubaneswar design team.
              </p>
            </div>
            <div className="flex gap-4">
              <a
                href="/contact"
                className="bg-[#31170E] hover:bg-[#6b4335] text-[#fdf9f4] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm whitespace-nowrap"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
