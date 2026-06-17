"use client";
import {useState} from 'react';
import { AlignLeft } from 'lucide-react';
import Sidemenu from '../Sidemenu';

const MobileMenu = () => {
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  return (
    <div >
        <button className='flex items-center gap-4 md:hidden cursor-pointer' onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}>
            <AlignLeft/>
        </button>
        <div className='md:hidden'>
            <Sidemenu isOpen={isSideMenuOpen} onClose = {() => setIsSideMenuOpen(false)}/>
        </div>
    </div>
  )
}

export default MobileMenu