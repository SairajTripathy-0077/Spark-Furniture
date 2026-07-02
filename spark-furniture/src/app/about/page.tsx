"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, MapPin, User } from 'lucide-react';
import Container from '@/components/Container';

export default function AboutPage() {
  const directors = [
    { name: 'Hemanta Kumar Behera', role: 'Managing Director', bio: 'Over a decade of industry expertise guiding design innovation and strategic operations.' },
    { name: 'Sadananda Behera', role: 'Director', bio: 'Managing corporate accounts, client relations, and public institution developments.' },
    { name: 'Pratima Behera', role: 'Director', bio: 'Directing retail expansions, warehouse operations, and quality management protocols.' },
  ];

  const coreCertifications = [
    'ISO 9001-2015 (Quality)',
    'ISO 45001-2018 (Safety)',
    'ISO 14001-2015 (Environment)',
    'NSIC Certified',
    'ANSI/BIFMA Standards compliant',
  ];

  const curatedClients = [
    'AIIMS, Bhubaneswar',
    'IISER, Berhampur',
    'College of Engineering & Tech (CET)',
    'Central Reserve Police Force (CRPF)',
    'Aditya Birla Group of Companies',
    'State Forest Department, Odisha',
    'AMRI Hospital',
    'Border Security Force (BSF)',
    'Berhampur University',
    'IL&FS Technologies Limited',
    'State Crime Record Bureau',
    'Annapurna Finance Pvt Ltd',
  ];

  const keyBrands = [
    'Zorin Interiors',
    'Rasente Furnitures',
    'Nilkamal Systems',
    'Supreme Plastics',
    'SpringFit Mattress',
    'Godrej Securities',
    'Vinar Systems',
    'Triveni Almirahs',
  ];

  return (
    <div className="bg-[#fdf9f4] py-16 text-[#31170E] overflow-hidden">
      <Container className="space-y-24">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold tracking-widest uppercase text-[#6b4335]"
          >
            Established 2012
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight uppercase"
          >
            SPARK FURNITURE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-neutral-600 leading-relaxed"
          >
            A leading ISO-certified manufacturer of business and home furniture, serving domestic and corporate markets across Odisha with a reputation built on honesty, affordability, and quality.
          </motion.p>
        </div>

        {/* Certifications & Trust */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 md:p-12 rounded-3xl border border-neutral-100 shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Award className="text-[#6b4335]" size={28} />
              <h2 className="font-serif text-2xl font-bold">Quality Standards</h2>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">
              We adhere to the highest global benchmarks in quality management, occupational health & safety, and environmental protection. Our certifications reflect our commitment to excellence.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {coreCertifications.map((cert) => (
                <span
                  key={cert}
                  className="rounded-full bg-[#fdf9f4] border border-[#31170E]/10 px-4.5 py-1.5 text-xs font-semibold text-[#31170E]"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#31170E]/10 shadow-sm group">
            <Image
              src="/showroom.jpeg"
              alt="Spark Furniture Luxury Showroom in Bhubaneswar, Odisha"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </section>

        {/* Infrastructure & Showroom */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="flex items-center justify-center gap-2 text-[#6b4335]">
              <MapPin size={20} />
              <h2 className="font-serif text-2xl md:text-3xl font-bold">Bhubaneswar Campus</h2>
            </div>
            <p className="text-xs md:text-sm text-neutral-500">
              Corporate showroom, custom workshops, and central warehouse.
            </p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <h3 className="font-serif text-xl font-bold">11,500 Sq. Ft. Showroom</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Our central showroom in Bhubaneswar displays our full range of official and household furniture. Coupled with our central warehouse and manufacturing workshops, we offer a dedicated service that values deadlines and creative designs.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
                <span className="flex items-center gap-1.5">✓ Showroom BBSR</span>
                <span className="flex items-center gap-1.5">✓ Central Warehouse</span>
                <span className="flex items-center gap-1.5">✓ Custom Workshops</span>
                <span className="flex items-center gap-1.5">✓ Design Office</span>
              </div>
            </div>
            <div className="w-full md:w-1/3 relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#31170E]/10 shadow-sm group">
              <Image
                src="/outphoto.jpeg"
                alt="Spark Furniture Bhubaneswar Head Office Campus"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
        </section>

        {/* 1. Leadership Board Static Cards Grid */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl md:text-3xl font-bold">Leadership Board</h2>
            <p className="text-xs md:text-sm text-neutral-500">
              Experienced directors driving development and manufacturing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {directors.map((director, index) => (
              <motion.div
                key={director.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="bg-white rounded-3xl border border-neutral-100 p-8 text-center shadow-sm hover:shadow-md hover:border-neutral-200/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4 flex flex-col items-center">
                  {/* Photo Placeholder Container */}
                  <div className="h-28 w-28 rounded-full bg-neutral-50 border border-neutral-200/50 flex items-center justify-center text-neutral-400 relative overflow-hidden shadow-inner">
                    <User size={40} className="text-[#31170E]/20" />
                  </div>
                  <div>
                    <h3 className="font-sans text-lg font-bold text-[#31170E]">
                      {director.name}
                    </h3>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#6b4335] mt-1 inline-block">
                      {director.role}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
                    {director.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 2. Infinite Scrolling Marquee for Prestigious Clients */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl md:text-3xl font-bold">Trusted Partnerships</h2>
            <p className="text-xs md:text-sm text-neutral-500">
              Trusted by government departments, universities, hospitals, and corporate organizations.
            </p>
          </div>

          <div className="relative w-full overflow-hidden py-4 bg-white border-y border-neutral-100 shadow-sm">
            {/* Fade gradients at edges */}
            <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-[#fdf9f4] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-[#fdf9f4] to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee gap-4 flex flex-row whitespace-nowrap">
              {/* First loop */}
              {curatedClients.map((client, idx) => (
                <div
                  key={`client-1-${idx}`}
                  className="bg-[#fdf9f4] border border-neutral-100 px-6 py-4 rounded-xl flex items-center justify-center text-xs font-bold text-[#31170E]/80 shadow-sm min-w-[200px]"
                >
                  {client}
                </div>
              ))}
              {/* Second loop */}
              {curatedClients.map((client, idx) => (
                <div
                  key={`client-2-${idx}`}
                  className="bg-[#fdf9f4] border border-neutral-100 px-6 py-4 rounded-xl flex items-center justify-center text-xs font-bold text-[#31170E]/80 shadow-sm min-w-[200px]"
                >
                  {client}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Reverse Infinite Scrolling Marquee for Brand Partners */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-[#6b4335]">
              Dealership Brands
            </h2>
          </div>

          <div className="relative w-full overflow-hidden py-4 border-y border-[#31170E]/10 bg-white">
            {/* Fade gradients */}
            <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-[#fdf9f4] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-[#fdf9f4] to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee-reverse gap-8 flex flex-row whitespace-nowrap items-center">
              {/* First loop */}
              {keyBrands.map((brand, idx) => (
                <span
                  key={`brand-1-${idx}`}
                  className="text-sm font-serif font-extrabold uppercase tracking-widest text-[#31170E]/50 hover:text-[#31170E] transition-colors px-4 min-w-[150px] text-center"
                >
                  {brand}
                </span>
              ))}
              {/* Second loop */}
              {keyBrands.map((brand, idx) => (
                <span
                  key={`brand-2-${idx}`}
                  className="text-sm font-serif font-extrabold uppercase tracking-widest text-[#31170E]/50 hover:text-[#31170E] transition-colors px-4 min-w-[150px] text-center"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
