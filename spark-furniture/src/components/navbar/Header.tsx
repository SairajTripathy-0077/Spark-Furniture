import React from 'react'
import Container from '../Container';
import {Playfair_Display} from "next/font/google";
import Logo from './logo';
import HeaderMenu from './HeaderMenu';
import FavoritesIcon from './FavoritesIcon';
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
                <FavoritesIcon/>
                <CartIcon/>
            </div>
        </Container>
    </header>
  )
}

export default Header