import React from 'react'
import Image from "next/image";
import {Playfair_Display} from "next/font/google";
import Link from "next/link";

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
    weight: "400",
})

const Logo = () => {
  return (
    <Link href={"/"} className='flex items-center gap-2'>
        <Image src="/logo.png" alt="Logo" width={35} height={60} />
        <h1 className={`text-xl font-bold ${playfair.className} text-[#31170E]`}>
            Spark Furniture
        </h1>
    </Link>
  )
}

export default Logo