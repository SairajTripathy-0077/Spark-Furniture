import React from 'react'
import Image from "next/image";
import Container from '../Container';
import {Playfair_Display} from "next/font/google";
import Logo from './logo';
import HeaderMenu from './HeaderMenu';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import CartIcon from './CartIcon';
import MobileMenu from './MobileMenu';

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
    weight: "400",
})

const Header = () => {
  return (
    <header className='py-4 bg-[#fdf9f4]'>
        <Container className='flex items-center justify-between'>
            {/* logo */}
            <div className={`${playfair.variable} font-serif flex items-center gap-4`}>
                <MobileMenu/>
                <Logo/>
            </div>
            {/* header menu */}
            <HeaderMenu/>
            <div className='flex items-center gap-4'>
                <Link href="/products?favorites=true" title="View Favorites" className="hover:scale-105 active:scale-95 transition-transform">
                    <Heart size={20} className='text-[#31170E] cursor-pointer hover:text-[#6b4335]' />
                </Link>
                <CartIcon/>
            </div>
        </Container>
    </header>
  )
}

export default Header