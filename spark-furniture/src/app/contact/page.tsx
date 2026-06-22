"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import Container from '@/components/Container';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.message) {
      const targetPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919777915706';
      const cleanTargetPhone = targetPhone.replace(/\D/g, ''); // digits only

      const messageText = `Hello Spark Furniture, I would like to send an inquiry:

*Customer Details:*
• Name: ${formData.name}
• Phone: ${formData.phone}
${formData.email ? `• Email: ${formData.email}\n` : ''}
*Message / Requirement:*
${formData.message}`;

      const encodedMessage = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/${cleanTargetPhone}?text=${encodedMessage}`;

      window.open(whatsappUrl, '_blank');

      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }
  };

  return (
    <div className="bg-[#fdf9f4] py-16 text-[#31170E]">
      <Container className="space-y-12">
        
        {/* Title Section */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Contact Us
          </h1>
          <p className="text-xs md:text-sm text-neutral-500">
            For specialized project requirements, showroom visits, or urgent queries, get in touch with us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Info Card */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
              <h2 className="font-serif text-xl font-bold border-b border-neutral-100 pb-3">Head Office</h2>
              
              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-full bg-[#31170E]/5 text-[#31170E] mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-500 text-xs uppercase tracking-wider">Address</h4>
                    <p className="mt-1 text-neutral-700 leading-relaxed font-medium">
                      Spark Furniture<br />
                      <span className="text-xs text-neutral-500 font-normal">(M/s Spark Furnitures Pvt Ltd)</span><br />
                      492, Service Road south, Dumduma,<br />
                      Beside NH-5, Near Khandagiri Petrol Pump,<br />
                      Bhubaneswar - 751019, Odisha
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-full bg-[#31170E]/5 text-[#31170E] mt-0.5">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-500 text-xs uppercase tracking-wider">Contact Number</h4>
                    <p className="mt-1 text-neutral-700 font-medium hover:text-[#6b4335] transition-colors">
                      <a href="tel:+919777915706">09777915706</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-full bg-[#31170E]/5 text-[#31170E] mt-0.5">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-500 text-xs uppercase tracking-wider">Email Addresses</h4>
                    <p className="mt-1 text-neutral-700 font-medium space-y-0.5">
                      <a href="mailto:info@sparkfurnitures.in" className="block hover:text-[#6b4335]">info@sparkfurnitures.in</a>
                      <a href="mailto:hemantbehera73@yahoo.in" className="block hover:text-[#6b4335] opacity-80">hemantbehera73@yahoo.in</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-neutral-100 shadow-sm">
            <h2 className="font-serif text-xl font-bold border-b border-neutral-100 pb-3 mb-6">Send Us a Message</h2>
            
            {isSubmitted ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center text-center py-12 space-y-3"
              >
                <div className="text-green-600 bg-green-50 p-4 rounded-full">
                  <CheckCircle size={36} />
                </div>
                <h3 className="font-serif text-lg font-bold">Thank You!</h3>
                <p className="text-xs text-neutral-500 max-w-sm">
                  Your message has been sent successfully. Our support team will get in touch with you shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 rounded-full border border-[#31170E] px-6 py-2 text-xs font-bold uppercase tracking-wider text-[#31170E] hover:bg-[#31170E] hover:text-white transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400" htmlFor="name">Full Name *</label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-neutral-200 bg-[#fdf9f4]/40 px-4 py-2.5 text-xs font-semibold text-[#31170E] focus:border-[#31170E] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400" htmlFor="email">Email (Optional)</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-lg border border-neutral-200 bg-[#fdf9f4]/40 px-4 py-2.5 text-xs font-semibold text-[#31170E] focus:border-[#31170E] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400" htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="Your Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-[#fdf9f4]/40 px-4 py-2.5 text-xs font-semibold text-[#31170E] focus:border-[#31170E] focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400" htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="Describe your furniture or project requirement..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-[#fdf9f4]/40 px-4 py-2.5 text-xs font-semibold text-[#31170E] focus:border-[#31170E] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#31170E] py-3 text-xs font-bold uppercase tracking-wider text-[#fdf9f4] hover:bg-[#6b4335] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
                >
                  <Send size={12} />
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
