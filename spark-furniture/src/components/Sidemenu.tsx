import React from 'react'
import { FC } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface SidemenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidemenu:FC<SidemenuProps> = ({isOpen, onClose}) => {
  return (
    <div>
        <motion.div
        className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-black/50 shadow-lg ${isOpen ? 'block' : 'hidden'} hoverEffect`}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        ></motion.div>
        <motion.div
        className={`fixed inset-y-0 h-screen left-0 z-50 w-64 bg-white shadow-lg ${isOpen ? 'block' : 'hidden'} hoverEffect`}
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className='p-4'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-bold'>Menu</h2>
                    <button onClick={onClose} className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'>x</button>
                </div>
                <ul className='space-y-2'>
                    <li><Link href="/" onClick={onClose} className='block px-4 py-2 hover:bg-gray-200 rounded'>Home</Link></li>
                    <li><Link href="/products" onClick={onClose} className='block px-4 py-2 hover:bg-gray-200 rounded'>Shop</Link></li>
                    <li><Link href="/about" onClick={onClose} className='block px-4 py-2 hover:bg-gray-200 rounded'>About Us</Link></li>
                    <li><Link href="/contact" onClick={onClose} className='block px-4 py-2 hover:bg-gray-200 rounded'>Contact</Link></li>
                </ul>
            </div>
        </motion.div>
    </div>
  )
}

export default Sidemenu