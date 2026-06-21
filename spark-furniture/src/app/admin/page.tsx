'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, Plus, Trash2, Edit2, Upload, ShoppingBag, 
  Tag, List, User, Phone, Mail, Calendar, DollarSign, MapPin, 
  X, Check, AlertCircle, Image as ImageIcon 
} from 'lucide-react';

interface ProductColor {
  name: string;
  hex: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviewsCount: number;
  category: string;
  description: string;
  colors: ProductColor[];
  imageType: string;
  imageUrl: string | null;
  imageUrls?: string[];
  badge: string | null;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor: string;
  imageType: string;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  customerAddress?: string;
  totalAmount: number;
  status: string;
  items: string; // JSON string
  createdAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Loading states
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  
  // Modals & Form states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Form inputs
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('Chairs');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [imageType, setImageType] = useState('chair');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  // Color adding inputs
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#31170E');
  
  // Uploading state
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRemoveImage = (idx: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const handleMoveImage = (idx: number, direction: 'left' | 'right') => {
    if (direction === 'left' && idx > 0) {
      setImageUrls(prev => {
        const next = [...prev];
        const temp = next[idx];
        next[idx] = next[idx - 1];
        next[idx - 1] = temp;
        return next;
      });
    } else if (direction === 'right' && idx < imageUrls.length - 1) {
      setImageUrls(prev => {
        const next = [...prev];
        const temp = next[idx];
        next[idx] = next[idx + 1];
        next[idx + 1] = temp;
        return next;
      });
    }
  };

  const router = useRouter();

  useEffect(() => {
    // 1. Authenticate check
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/check', { cache: 'no-store' });
        if (!res.ok) {
          router.replace('/admin/login');
        } else {
          setAuthChecking(false);
          // Load data
          fetchProducts();
          fetchOrders();
        }
      } catch (err) {
        router.replace('/admin/login');
      }
    }
    checkAuth();
  }, [router]);

  // Fetch functions
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.replace('/admin/login');
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Open product modal for creation
  const handleNewProduct = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setOriginalPrice('');
    setCategory('Chairs');
    setDescription('');
    setBadge('');
    setImageType('chair');
    setImageUrl(null);
    setImageUrls([]);
    setColors([]);
    setFormError('');
    setIsProductModalOpen(true);
  };

  // Open product modal for editing
  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setPrice(prod.price.toString());
    setOriginalPrice(prod.originalPrice ? prod.originalPrice.toString() : '');
    setCategory(prod.category);
    setDescription(prod.description);
    setBadge(prod.badge || '');
    setImageType(prod.imageType);
    setImageUrl(prod.imageUrl);
    setImageUrls(prod.imageUrls || (prod.imageUrl ? [prod.imageUrl] : []));
    setColors(prod.colors || []);
    setFormError('');
    setIsProductModalOpen(true);
  };

  const handleAddColor = () => {
    if (!colorName.trim()) return;
    setColors([...colors, { name: colorName, hex: colorHex }]);
    setColorName('');
  };

  const handleRemoveColor = (idx: number) => {
    setColors(colors.filter((_, i) => i !== idx));
  };

  // Handle Image Upload to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setFormError('');
    
    try {
      const uploadedUrls: string[] = [];
      let lastMsg = '';
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        const data = await res.json();
        if (data.success) {
          uploadedUrls.push(data.url);
          if (data.message) {
            lastMsg = data.message;
          }
        } else {
          setFormError(prev => (prev ? prev + ' | ' : '') + `Failed to upload ${file.name}: ${data.message}`);
        }
      }
      
      if (uploadedUrls.length > 0) {
        setImageUrls(prev => [...prev, ...uploadedUrls]);
        if (lastMsg) {
          setSuccessMsg(lastMsg);
          setTimeout(() => setSuccessMsg(''), 4000);
        }
      }
    } catch (err) {
      setFormError('Error connecting to upload API');
    } finally {
      setUploading(false);
    }
  };

  // Handle Form Submit
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!name || !price || !description) {
      setFormError('Please fill in Name, Price, and Description.');
      return;
    }
    
    const payload = {
      id: editingProduct?.id,
      name,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      category,
      description,
      colors,
      imageType,
      imageUrl: imageUrls[0] || null,
      imageUrls,
      badge: badge || null
    };
    
    try {
      const isEditing = !!editingProduct;
      const res = await fetch('/api/products', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        setIsProductModalOpen(false);
        fetchProducts(); // reload list
      } else {
        setFormError(data.message || 'Failed to save product');
      }
    } catch (err) {
      setFormError('Failed to connect to backend API');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdf9f4]">
        <div className="text-center animate-pulse">
          <p className="text-xs font-bold uppercase tracking-wider text-[#31170E]/60">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf9f4] text-[#31170E] font-sans pb-16">
      {/* Top Header */}
      <header className="border-b border-[#31170E]/10 bg-white px-4 py-4 md:px-12 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">Spark Furniture</h1>
            <span className="rounded-full bg-[#31170E]/5 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#31170E]">Admin</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-neutral-200 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500 hover:border-red-200 hover:text-red-600 transition-all cursor-pointer"
          >
            <LogOut size={12} />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#31170E]/10 mb-8 gap-4 sm:gap-6 overflow-x-auto whitespace-nowrap scrollbar-none pb-px">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 border-b-2 px-1 py-4 text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors flex-shrink-0 ${
              activeTab === 'products' 
                ? 'border-[#31170E] text-[#31170E]' 
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <List size={14} />
            Catalog Products ({products.length})
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 border-b-2 px-1 py-4 text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors flex-shrink-0 ${
              activeTab === 'orders' 
                ? 'border-[#31170E] text-[#31170E]' 
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <ShoppingBag size={14} />
            Customer Leads ({orders.length})
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'products' ? (
          <div>
            {/* Catalog Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif text-xl font-bold">Manage Products</h2>
                <p className="text-xs text-neutral-500 mt-1">Add, update, or remove items in the showcase catalog.</p>
              </div>
              
              <button
                onClick={handleNewProduct}
                className="flex items-center justify-center gap-2 rounded-full bg-[#31170E] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#fdf9f4] shadow hover:bg-[#6b4335] transition-all cursor-pointer w-full sm:w-auto"
              >
                <Plus size={14} />
                Add Product
              </button>
            </div>

            {loadingProducts ? (
              <div className="py-20 text-center text-xs font-bold uppercase tracking-wider text-neutral-400">Loading catalog...</div>
            ) : products.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#31170E]/10 bg-white p-16 text-center">
                <Tag size={32} className="mx-auto text-neutral-300 mb-4" />
                <h3 className="font-serif text-lg font-semibold">Catalog is empty</h3>
                <p className="text-sm text-neutral-500 mt-2">Get started by creating your first furniture showcase item.</p>
                <button
                  onClick={handleNewProduct}
                  className="mt-6 rounded-full border border-[#31170E] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#31170E] hover:bg-[#31170E] hover:text-white transition-colors cursor-pointer"
                >
                  Create Product
                </button>
              </div>
            ) : (
              <>
                {/* Mobile View: Cards (hidden on desktop) */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {products.map((prod) => (
                    <div key={prod.id} className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm flex flex-col gap-3">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-[#fdf9f4] border border-neutral-100 overflow-hidden flex">
                          {prod.imageUrl ? (
                            <img src={prod.imageUrl} alt={prod.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-neutral-400 uppercase">{prod.imageType}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[#31170E] text-sm truncate">{prod.name}</div>
                          <div className="text-[11px] text-neutral-400 mt-0.5 line-clamp-2 font-normal">{prod.description}</div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="rounded bg-[#31170E]/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#31170E]">
                              {prod.category}
                            </span>
                            {prod.badge && (
                              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700">
                                {prod.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                        <div>
                          <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Price</div>
                          <div className="font-serif text-sm font-bold text-[#31170E] mt-0.5">
                            ₹{prod.price}
                            {prod.originalPrice && <span className="text-xs text-neutral-400 line-through font-normal ml-1.5">₹{prod.originalPrice}</span>}
                          </div>
                        </div>

                        <div>
                          <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Colors</div>
                          <div className="flex gap-1 items-center">
                            {prod.colors && prod.colors.slice(0, 3).map((c, i) => (
                              <span key={i} className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: c.hex }} title={c.name} />
                            ))}
                            {prod.colors && prod.colors.length > 3 && (
                              <span className="text-[10px] text-neutral-400 font-semibold">+{prod.colors.length - 3}</span>
                            )}
                            {(!prod.colors || prod.colors.length === 0) && <span className="text-[10px] text-neutral-400 italic">None</span>}
                          </div>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleEditProduct(prod)}
                            className="rounded-lg p-2 text-neutral-500 hover:bg-[#31170E]/5 hover:text-[#31170E] border border-neutral-100 bg-neutral-50/50 transition-colors cursor-pointer"
                            aria-label="Edit product"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="rounded-lg p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600 border border-neutral-100 bg-neutral-50/50 transition-colors cursor-pointer"
                            aria-label="Delete product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View: Table (hidden on mobile) */}
                <div className="hidden md:block overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                  <table className="min-w-full divide-y divide-neutral-100 text-left text-sm">
                    <thead className="bg-neutral-55 text-xs font-bold uppercase tracking-wider text-[#31170E]/70">
                      <tr>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Colors</th>
                        <th className="px-6 py-4">Badge</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 font-medium text-neutral-600">
                      {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#fdf9f4] border border-neutral-100 overflow-hidden flex">
                                {prod.imageUrl ? (
                                  <img src={prod.imageUrl} alt={prod.name} className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-[10px] font-bold text-neutral-400 uppercase">{prod.imageType}</span>
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-[#31170E]">{prod.name}</div>
                                <div className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1 max-w-xs font-normal">{prod.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold uppercase tracking-wider">{prod.category}</td>
                          <td className="px-6 py-4 font-serif">
                            <div>₹{prod.price}</div>
                            {prod.originalPrice && <div className="text-xs text-neutral-400 line-through mt-0.5">₹{prod.originalPrice}</div>}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                              {prod.colors && prod.colors.map((c, i) => (
                                <span 
                                  key={i} 
                                  className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[10px]"
                                  title={c.name}
                                >
                                  <span className="h-2 w-2 rounded-full border border-black/15" style={{ backgroundColor: c.hex }} />
                                  <span className="text-neutral-500 font-normal">{c.name}</span>
                                </span>
                              ))}
                              {(!prod.colors || prod.colors.length === 0) && <span className="text-xs text-neutral-400 font-normal italic">No colors</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {prod.badge ? (
                              <span className="rounded bg-[#31170E]/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#31170E]">
                                {prod.badge}
                              </span>
                            ) : (
                              <span className="text-neutral-300">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditProduct(prod)}
                                className="rounded-lg p-2 text-neutral-400 hover:bg-[#31170E]/5 hover:text-[#31170E] transition-colors cursor-pointer"
                                aria-label="Edit product"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="rounded-lg p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                                aria-label="Delete product"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        ) : (
          <div>
            {/* Leads Section */}
            <div className="mb-6">
              <h2 className="font-serif text-xl font-bold">Customer Leads</h2>
              <p className="text-xs text-neutral-500 mt-1">Checkout inquiries saved when customers proceeded to WhatsApp checkout.</p>
            </div>

            {loadingOrders ? (
              <div className="py-20 text-center text-xs font-bold uppercase tracking-wider text-neutral-400">Loading leads...</div>
            ) : orders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#31170E]/10 bg-white p-16 text-center">
                <ShoppingBag size={32} className="mx-auto text-neutral-300 mb-4" />
                <h3 className="font-serif text-lg font-semibold">No leads yet</h3>
                <p className="text-sm text-neutral-500 mt-2">Leads will show up here automatically when customers check out.</p>
              </div>
            ) : (
              <>
                {/* Mobile View: Customer Leads Cards (hidden on desktop) */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {orders.map((order) => {
                    let itemsArr: OrderItem[] = [];
                    try {
                      itemsArr = JSON.parse(order.items);
                    } catch (e) {
                      console.error('Failed to parse items for order:', order.id);
                    }
                    const totalItems = itemsArr.reduce((acc, curr) => acc + curr.quantity, 0);

                    return (
                      <div key={order.id} className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-[#31170E] text-sm">{order.customerName}</div>
                            <div className="text-[10px] text-neutral-400 font-normal mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          <span className="rounded bg-[#31170E]/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#31170E] h-fit">
                            {totalItems} items
                          </span>
                        </div>

                        <div className="flex flex-col gap-1 text-[11px] text-neutral-650 bg-[#fdf9f4]/50 rounded-xl p-2.5 border border-[#31170E]/5">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Phone size={12} className="text-[#31170E]/60 flex-shrink-0" />
                            {order.customerPhone}
                          </span>
                          {order.customerEmail && (
                            <span className="flex items-center gap-1.5 text-neutral-500">
                              <Mail size={12} className="text-[#31170E]/40 flex-shrink-0" />
                              {order.customerEmail}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                          <div>
                            <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Total Amount</div>
                            <div className="font-serif font-bold text-base text-[#31170E] mt-0.5">₹{order.totalAmount.toLocaleString()}</div>
                          </div>

                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="rounded-full bg-[#31170E] hover:bg-[#6b4335] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#fdf9f4] shadow-sm transition-all cursor-pointer"
                          >
                            View Items
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop View: Customer Leads Table (hidden on mobile) */}
                <div className="hidden md:block overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                  <table className="min-w-full divide-y divide-neutral-100 text-left text-sm">
                    <thead className="bg-neutral-55 text-xs font-bold uppercase tracking-wider text-[#31170E]/70">
                      <tr>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Total Amount</th>
                        <th className="px-6 py-4">Ordered Items Count</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 font-medium text-neutral-600">
                      {orders.map((order) => {
                        let itemsArr: OrderItem[] = [];
                        try {
                          itemsArr = JSON.parse(order.items);
                        } catch (e) {
                          console.error('Failed to parse items for order:', order.id);
                        }
                        const totalItems = itemsArr.reduce((acc, curr) => acc + curr.quantity, 0);
                        
                        return (
                          <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-[#31170E]">{order.customerName}</td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-0.5 text-xs font-sans font-normal">
                                <span className="flex items-center gap-1 font-semibold text-[#31170E]/80">
                                  <Phone size={11} />
                                  {order.customerPhone}
                                </span>
                                {order.customerEmail && (
                                  <span className="flex items-center gap-1 text-neutral-400">
                                    <Mail size={11} />
                                    {order.customerEmail}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 font-serif font-bold text-[#31170E]">₹{order.totalAmount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-neutral-500 font-normal">{totalItems} items</td>
                            <td className="px-6 py-4 text-xs font-normal text-neutral-400">
                              {new Date(order.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="rounded-full bg-[#31170E]/5 hover:bg-[#31170E] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#31170E] hover:text-[#fdf9f4] transition-all cursor-pointer"
                              >
                                View Items
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Product Add/Edit Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-2xl overflow-y-auto max-h-[90vh] rounded-3xl border border-[#31170E]/10 bg-[#fdf9f4] p-5 sm:p-6 md:p-8 shadow-2xl"
            >
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="absolute right-4 top-4 sm:right-6 sm:top-6 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-black cursor-pointer"
              >
                <X size={20} />
              </button>

              <h3 className="font-serif text-xl sm:text-2xl font-bold mb-6 pr-6">
                {editingProduct ? 'Edit Catalog Piece' : 'Add New Showcase Piece'}
              </h3>

              <form onSubmit={handleProductSubmit} className="space-y-6">
                
                {/* Error Banner */}
                {formError && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-700 border border-red-100">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Upload Image Section */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#31170E]/70">
                    Product Image Gallery (First image is the face of the product)
                  </label>
                  
                  {/* Gallery Grid */}
                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-3 bg-white rounded-2xl border border-neutral-100 shadow-inner">
                      {imageUrls.map((url, index) => (
                        <div key={url + '-' + index} className="group relative aspect-square rounded-xl border border-neutral-200 bg-neutral-50 overflow-hidden shadow-xs flex items-center justify-center">
                          <img src={url} alt={`Gallery ${index}`} className="h-full w-full object-cover" />
                          
                          {/* Face Image Indicator */}
                          {index === 0 ? (
                            <div className="absolute top-1 left-1 bg-[#31170E] text-[#fdf9f4] text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow">
                              Face / Main
                            </div>
                          ) : (
                            <div className="absolute top-1 left-1 bg-black/40 backdrop-blur-xs text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md">
                              #{index + 1}
                            </div>
                          )}
                          
                          {/* Action Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity duration-200">
                            {/* Move Left */}
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(index, 'left')}
                                className="p-1 rounded-full bg-white/20 text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                                title="Move Left"
                              >
                                <span className="text-[10px] font-bold leading-none">←</span>
                              </button>
                            )}
                            
                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="p-1 rounded-full bg-red-655/80 text-white hover:bg-red-600 transition-colors cursor-pointer"
                              title="Remove image"
                            >
                              <Trash2 size={11} />
                            </button>
                            
                            {/* Move Right */}
                            {index < imageUrls.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(index, 'right')}
                                className="p-1 rounded-full bg-white/20 text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                                title="Move Right"
                              >
                                <span className="text-[10px] font-bold leading-none">→</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Upload Area */}
                  <div className="w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-[#31170E]/20 rounded-2xl cursor-pointer bg-white hover:bg-neutral-50 transition-colors py-4 px-6 text-center">
                      <Upload size={20} className="text-neutral-400 mb-1" />
                      <span className="text-xs font-semibold text-[#31170E]">
                        {uploading ? 'Uploading to Cloudinary...' : 'Click to upload product image(s)'}
                      </span>
                      <span className="text-[10px] text-neutral-400 mt-1 font-normal">Supports multiple JPEGs, PNGs, WEBP</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  
                  {successMsg && (
                    <div className="text-[10px] font-semibold text-amber-600 flex items-center gap-1 mt-1 bg-amber-50 px-2 py-1 rounded w-fit">
                      <Check size={10} />
                      {successMsg}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#31170E]/70">Product Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Amber Velvet Accent Chair"
                      className="w-full mt-2 rounded-xl border border-neutral-200 bg-white py-2.5 px-4 text-xs font-semibold text-[#31170E] focus:border-[#31170E] focus:outline-none focus:ring-1 focus:ring-[#31170E]/20 transition-all duration-300"
                    />
                  </div>
                  
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#31170E]/70">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full mt-2 rounded-xl border border-neutral-200 bg-white py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-[#31170E] focus:border-[#31170E] focus:outline-none focus:ring-1 focus:ring-[#31170E]/20 cursor-pointer transition-all duration-300"
                    >
                      <option value="Chairs">Chairs</option>
                      <option value="Workstations">Workstations</option>
                      <option value="Modular Furniture">Modular Furniture</option>
                      <option value="Bed">Bed</option>
                      <option value="Sofa">Sofa</option>
                      <option value="Dinning Sets">Dinning Sets</option>
                      <option value="Mattress">Mattress</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#31170E]/70">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="450"
                      min="0"
                      className="w-full mt-2 rounded-xl border border-neutral-200 bg-white py-2.5 px-4 text-xs font-semibold text-[#31170E] focus:border-[#31170E] focus:outline-none focus:ring-1 focus:ring-[#31170E]/20 transition-all duration-300"
                    />
                  </div>
                  
                  {/* Original Price */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#31170E]/70">Original Price (₹ - Optional)</label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="520"
                      min="0"
                      className="w-full mt-2 rounded-xl border border-neutral-200 bg-white py-2.5 px-4 text-xs font-semibold text-[#31170E] focus:border-[#31170E] focus:outline-none focus:ring-1 focus:ring-[#31170E]/20 transition-all duration-300"
                    />
                  </div>

                  {/* Badge */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#31170E]/70">Promo Badge (Optional)</label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="e.g. Sale, New, Limited"
                      className="w-full mt-2 rounded-xl border border-neutral-200 bg-white py-2.5 px-4 text-xs font-semibold text-[#31170E] focus:border-[#31170E] focus:outline-none focus:ring-1 focus:ring-[#31170E]/20 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#31170E]/70">Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe the styling details, materials, and dimension characteristics..."
                    className="w-full mt-2 rounded-xl border border-neutral-200 bg-white py-2.5 px-4 text-xs font-semibold text-[#31170E] focus:border-[#31170E] focus:outline-none focus:ring-1 focus:ring-[#31170E]/20 transition-all duration-300"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-[#31170E]/10">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="rounded-xl border border-neutral-200 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#31170E] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#fdf9f4] shadow hover:bg-[#6b4335] active:scale-95 transition-all cursor-pointer"
                  >
                    {editingProduct ? 'Save Changes' : 'Publish Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg overflow-y-auto max-h-[85vh] rounded-3xl border border-[#31170E]/10 bg-[#fdf9f4] p-5 sm:p-6 md:p-8 shadow-2xl"
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute right-4 top-4 sm:right-6 sm:top-6 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-black cursor-pointer"
              >
                <X size={20} />
              </button>

              <h3 className="font-serif text-lg sm:text-xl font-bold mb-1 pr-6">Lead Details</h3>
              <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-6">Order ID: {selectedOrder.id}</p>

              {/* Customer summary */}
              <div className="rounded-2xl border border-neutral-100 bg-white p-4 space-y-3 mb-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#31170E]/5 p-2.5 text-[#31170E]">
                    <User size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Customer Name</div>
                    <div className="font-semibold text-sm text-[#31170E]">{selectedOrder.customerName}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#31170E]/5 p-2.5 text-[#31170E]">
                    <Phone size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Phone Number</div>
                    <div className="font-semibold text-sm text-[#31170E]">{selectedOrder.customerPhone}</div>
                  </div>
                </div>

                {selectedOrder.customerEmail && (
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-[#31170E]/5 p-2.5 text-[#31170E]">
                      <Mail size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Email Address</div>
                      <div className="font-semibold text-sm text-[#31170E]">{selectedOrder.customerEmail}</div>
                    </div>
                  </div>
                )}

                {selectedOrder.customerAddress && (
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-[#31170E]/5 p-2.5 text-[#31170E]">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Shipping Address</div>
                      <div className="font-semibold text-sm text-[#31170E]">{selectedOrder.customerAddress}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#31170E]/5 p-2.5 text-[#31170E]">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Received Date</div>
                    <div className="font-semibold text-sm text-[#31170E]">
                      {new Date(selectedOrder.createdAt).toLocaleString(undefined, {
                        dateStyle: 'long',
                        timeStyle: 'short'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ordered items */}
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#31170E]/70 mb-3">List of Materials</h4>
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-1">
                {(() => {
                  let items: OrderItem[] = [];
                  try {
                    items = JSON.parse(selectedOrder.items);
                  } catch (e) {}
                  
                  return items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-neutral-100 bg-white p-3 shadow-xs">
                      <div>
                        <div className="font-semibold text-[#31170E] text-xs">{item.name}</div>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-neutral-400">
                          <span>Qty: <span className="font-bold text-neutral-600">{item.quantity}</span></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            Color: 
                            <span className="inline-block h-2.5 w-2.5 rounded-full border border-black/10" style={{ backgroundColor: item.selectedColor }} />
                          </span>
                        </div>
                      </div>
                      <span className="font-serif text-sm font-bold text-[#31170E]">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ));
                })()}
              </div>

              {/* Total summary */}
              <div className="flex items-center justify-between pt-4 border-t border-[#31170E]/10">
                <span className="font-semibold text-[#31170E]">Subtotal Invoiced</span>
                <span className="font-serif text-xl font-bold text-[#31170E]">₹{selectedOrder.totalAmount.toLocaleString()}</span>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl bg-[#31170E] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#fdf9f4] shadow hover:bg-[#6b4335] active:scale-95 cursor-pointer"
                >
                  Close Summary
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
