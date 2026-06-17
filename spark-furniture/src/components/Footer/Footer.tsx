import React from 'react';
import Container from '../Container';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#fdf9f4] border-t border-[#31170E]/10 py-12 text-[#31170E]">
      <Container className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Left: Brand info */}
        <div className="space-y-3">
          <h3 className="font-serif text-lg font-bold tracking-tight">Spark Furniture</h3>
          <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
            Exquisite designs, premium wood materials, and unique aesthetics for your beautiful home.
          </p>
          <div className="text-[11px] text-neutral-400 pt-2">
            <span>&copy; {new Date().getFullYear()} Spark Furniture. All rights reserved.</span>
          </div>
        </div>

        {/* Center: Minimalist links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b4335]">Explore</h4>
          <div className="flex flex-col gap-2 text-xs font-semibold">
            <Link href="/" className="hover:text-[#6b4335] transition-colors w-max">Home</Link>
            <Link href="/products" className="hover:text-[#6b4335] transition-colors w-max">Products</Link>
            <Link href="/about" className="hover:text-[#6b4335] transition-colors w-max">About Us</Link>
            <Link href="/contact" className="hover:text-[#6b4335] transition-colors w-max">Contact</Link>
          </div>
        </div>

        {/* Right: Contact Details */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b4335]">Contact Details</h4>
          <div className="text-xs text-neutral-600 space-y-2">
            <p className="leading-relaxed font-medium">
              492, Service Road south, Dumduma,<br />
              Near Khandagiri Petrol Pump, Beside NH-5,<br />
              Bhubaneswar - 751019, Odisha
            </p>
            <div className="pt-1 space-y-1 font-semibold text-[#31170E]">
              <p>
                Phone: <a href="tel:+919777915706" className="hover:text-[#6b4335] transition-colors">09777915706</a>
              </p>
              <p>
                Email: <a href="mailto:info@sparkfurnitures.in" className="hover:text-[#6b4335] transition-colors">info@sparkfurnitures.in</a>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;