"use client";
import Image from 'next/image';
import Container from '../Container';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/dist/client/link';

const Hero = () => {
  const text = 'spark furniture';

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const letter: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring' as const, damping: 12, stiffness: 100 },
    },
  };
  return (
    <div className="bg-[#fdf9f4]">
      <Container className="relative overflow-hidden h-[30vh] min-h-[220px] md:h-[50vh] md:min-h-[400px] bg-[#fdf9f4]">
        <Image
          src="/hero.png"
          alt="Spark Furniture Luxury Office and Home Furniture Showroom Display in Bhubaneswar, Odisha"
          width={1200}
          height={500}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 gap-4 md:gap-8">
          <motion.h1
            className="max-w-[90%] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#31170E] bg-[#fdf9f4]/60 tracking-tight uppercase text-center"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {text.split('').map((char, index) => {
              if (char === ' ') {
                return (
                  <span key={`space-${index}`} aria-hidden>
                    <br className="block md:hidden" />
                    <span className="hidden md:inline">{' '}</span>
                  </span>
                );
              }
              return (
                <motion.span
                  key={`${char}-${index}`}
                  className="inline-block"
                  variants={letter}
                >
                  {char}
                </motion.span>
              );
            })}
          </motion.h1>
          <Link href="/products">
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, type: 'spring', damping: 12, stiffness: 100 }}
              className="bg-[#31170E] hover:bg-[#6b4335] text-[#fdf9f4] rounded-md text-sm sm:text-base md:text-lg px-6 sm:px-8 py-2.5 sm:py-3 font-playfair-display transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#31170E] cursor-pointer"
            >
              Shop Now
            </motion.button>
          </Link>
        </div>
      </Container>
    </div>
  )
}

export default Hero