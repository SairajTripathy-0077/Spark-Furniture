"use client";

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import FurnitureSketch from './ProductGrid/FurnitureSketch';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Checkout Form States
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Close on pressing Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };
    if (isCartOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Reset checkout state when cart closes
  React.useEffect(() => {
    if (!isCartOpen) {
      setIsCheckingOut(false);
      setError('');
    }
  }, [isCartOpen]);

  const handleCheckoutSubmit = async () => {
    setError('');
    if (!name.trim() || !phone.trim()) {
      setError('Please fill in your Name and WhatsApp phone number.');
      return;
    }

    setLoading(true);
    try {
      // 1. Submit to checkout API to save lead
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerEmail: email || null,
          totalAmount: cartTotal,
          items: cart,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to record checkout. Please try again.');
      }

      // 2. Generate WhatsApp redirection
      const targetPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
      const cleanTargetPhone = targetPhone.replace(/\D/g, ''); // digits only

      const itemsText = cart
        .map(
          (item, idx) =>
            `${idx + 1}. *${item.name}*\n   - Color: ${item.selectedColor}\n   - Qty: ${item.quantity}\n   - Price: $${(
              item.price * item.quantity
            ).toLocaleString()}`
        )
        .join('\n\n');

      const messageText = `Hello Spark Furniture, I would like to place an order:

*Customer Contact Details:*
• Name: ${name}
• Phone: ${phone}
${email ? `• Email: ${email}\n` : ''}
*Showcase Items Ordered:*
${itemsText}

*Subtotal Amount:* $${cartTotal.toLocaleString()}
*Shipping Type:* Complimentary

Please confirm my order progress. Thank you!`;

      const encodedMessage = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/${cleanTargetPhone}?text=${encodedMessage}`;

      // Open in a new tab/window
      window.open(whatsappUrl, '_blank');

      // 3. Clear cart and close drawer
      clearCart();
      setIsCheckingOut(false);
      setIsCartOpen(false);
      
      // Reset form fields
      setName('');
      setPhone('');
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer Container */}
          <motion.div
            ref={drawerRef}
            className="fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col border-l border-neutral-200 bg-[#fdf9f4] shadow-2xl sm:max-w-md"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#31170E]/10 p-6">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#31170E]" />
                <h2 className="font-serif text-xl font-bold tracking-tight text-[#31170E]">
                  {isCheckingOut ? 'Checkout Details' : 'Your Cart'}
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-black cursor-pointer"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items Area / Checkout Form */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {isCheckingOut ? (
                <div className="space-y-4 py-2">
                  <button
                    onClick={() => setIsCheckingOut(false)}
                    className="text-xs font-bold uppercase tracking-wider text-[#31170E]/60 hover:text-[#31170E] transition-colors flex items-center gap-1"
                  >
                    <span>←</span> Back to Cart
                  </button>
                  <p className="text-xs text-neutral-500 leading-normal">
                    Please provide your contact details. We will save your lead in our catalog system and redirect you to WhatsApp to finalize details.
                  </p>

                  {error && (
                    <div className="rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-700 border border-red-100">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#31170E]/60">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full mt-1.5 rounded-xl border border-neutral-200 bg-white py-2.5 px-4 text-xs font-semibold text-[#31170E] focus:border-[#31170E] focus:outline-none focus:ring-1 focus:ring-[#31170E]/20"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#31170E]/60">WhatsApp Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full mt-1.5 rounded-xl border border-neutral-200 bg-white py-2.5 px-4 text-xs font-semibold text-[#31170E] focus:border-[#31170E] focus:outline-none focus:ring-1 focus:ring-[#31170E]/20"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#31170E]/60">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full mt-1.5 rounded-xl border border-neutral-200 bg-white py-2.5 px-4 text-xs font-semibold text-[#31170E] focus:border-[#31170E] focus:outline-none focus:ring-1 focus:ring-[#31170E]/20"
                      />
                    </div>
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-12">
                  <div className="mb-4 rounded-full bg-[#31170E]/5 p-6 text-[#31170E]/50">
                    <ShoppingBag size={40} />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#31170E]">
                    Your cart is empty
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500 max-w-[240px]">
                    Looks like you haven't added any luxury pieces to your cart yet.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 rounded-md bg-[#31170E] px-5 py-2.5 text-sm font-medium text-[#fdf9f4] shadow-sm transition-all hover:bg-[#6b4335] active:scale-95 cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.selectedColor}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex gap-4 rounded-xl border border-neutral-100 bg-white p-3 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Item Image Sketch or Cloudinary Image */}
                    <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border border-neutral-100 flex items-center justify-center bg-[#fdf9f4]">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <FurnitureSketch type={item.imageType} className="h-full w-full" />
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between gap-1">
                        <div>
                          <h4 className="font-sans text-xs font-bold text-[#31170E] line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="mt-0.5 text-[10px] text-neutral-500 capitalize flex items-center gap-1.5">
                            <span>Color:</span>
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full border border-black/10"
                              style={{ backgroundColor: item.selectedColor }}
                              title={item.selectedColor}
                            />
                          </p>
                        </div>
                        <span className="font-serif text-xs font-bold text-[#31170E]">
                          ${item.price}
                        </span>
                      </div>

                      {/* Item Actions */}
                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center rounded-md border border-neutral-200 bg-neutral-50">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.selectedColor, item.quantity - 1)
                            }
                            className="p-1 hover:text-black text-neutral-500 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-xs font-medium text-neutral-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.selectedColor, item.quantity + 1)
                            }
                            className="p-1 hover:text-black text-neutral-500 cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedColor)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary (Sticky at bottom) */}
            {cart.length > 0 && (
              <div className="border-t border-[#31170E]/10 bg-white p-6 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between font-sans text-sm font-medium text-neutral-500 mb-2">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold uppercase text-xs">Complimentary</span>
                </div>
                <div className="flex items-end justify-between mb-6">
                  <span className="font-serif text-base font-semibold text-[#31170E]">
                    Subtotal
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#31170E]">
                    ${cartTotal.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3">
                  {isCheckingOut ? (
                    <button
                      onClick={handleCheckoutSubmit}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-[#31170E] py-3 text-sm font-semibold text-[#fdf9f4] shadow-sm transition-all hover:bg-[#6b4335] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Processing Order...' : 'Confirm & Order via WhatsApp'}
                      {!loading && <ArrowRight size={16} />}
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsCheckingOut(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-[#31170E] py-3 text-sm font-semibold text-[#fdf9f4] shadow-sm transition-all hover:bg-[#6b4335] active:scale-[0.98] cursor-pointer"
                    >
                      Proceed to Checkout
                      <ArrowRight size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (isCheckingOut) {
                        setIsCheckingOut(false);
                      } else {
                        setIsCartOpen(false);
                      }
                    }}
                    className="w-full text-center text-xs text-[#31170E]/60 hover:text-[#31170E] underline transition-colors cursor-pointer py-1.5"
                  >
                    {isCheckingOut ? 'Back to Cart' : 'Continue Shopping'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default CartDrawer;

