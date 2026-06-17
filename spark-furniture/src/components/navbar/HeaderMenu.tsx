"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import Link from "next/link";
import {headerMenuItems} from "@/constants/data";

const HeaderMenu = () => {
  const pathname = usePathname()
  return (
    <div className='hidden md:inline-flex mx-2 -translate-x-15'>
        {headerMenuItems?.map((item) => (
            <Link key={item?.title} href={item?.href} className={`px-3 text-[#31170E] hover:text-[#31170E]/80 hover:underline transition ${pathname === item?.href && "underline" }`}>
                {item?.title}
            </Link>
        ))}
    </div>
  )
}

export default HeaderMenu