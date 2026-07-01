'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../src/context/StoreContext';
import Link from 'next/link';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiStar,
  FiAlertTriangle,
  FiX,
  FiChevronLeft,
  FiImage,
  FiTag,
  FiDollarSign,
  FiLayers,
  FiBox,
  FiFileText,
  FiShield
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

interface SpecEntry {
  key: string;
  value: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { products, isLoggedIn, isAdmin } = useStore();

  // Route protection
  useEffect(() => {
    const savedLoggedIn = localStorage.getItem('nexcart-logged-in');
    const savedAdmin = localStorage.getItem('nexcart-admin');
    const checkedLoggedIn = savedLoggedIn ? JSON.parse(savedLoggedIn) : false;
    const checkedAdmin = savedAdmin ? JSON.parse(savedAdmin) : false;

    if (!checkedLoggedIn || !checkedAdmin) {
      router.push('/auth?redirect=/admin');
    }
  }, [isLoggedIn, isAdmin, router]);

  // UI States
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Form States
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formCategory, setFormCategory] = useState('Electronics');
  const [formDescription, setFormDescription] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formImageUrls, setFormImageUrls] = useState('');
  const [formSpecs, setFormSpecs] = useState<SpecEntry[]>([{ key: '', value: '' }]);

  const categories = [
    'Electronics', 'Fashion', 'Shoes', 'Watches',
    'Accessories', 'Home & Decor', 'Sports & Fitness', 'Books & Stationery'
  ];

  // Stats
  const totalProducts = products.length;
  const avgRating = products.length > 0
    ? (products.reduce((acc, p) => acc + p.rating, 0) / products.length).toFixed(1)
    : '0.0';
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalReviews = products.reduce((acc, p) => acc + p.reviewsCount, 0);

  // Spec management
  const addSpecRow = () => setFormSpecs([...formSpecs, { key: '', value: '' }]);
  const removeSpecRow = (index: number) => setFormSpecs(formSpecs.filter((_, i) => i !== index));
  const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...formSpecs];
    updated[index][field] = val;
    setFormSpecs(updated);
  };

  // Reset form
  const resetForm = () => {
    setFormName('');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormCategory('Electronics');
    setFormDescription('');
    setFormStock('');
    setFormBadge('');
    setFormImageUrls('');
    setFormSpecs([{ key: '', value: '' }]);
    setEditingProduct(null);
    setShowAddForm(false);
  };

  // Load product into edit form
  const loadProductForEdit = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setFormName(product.name);
    setFormPrice(String(product.price));
    setFormOriginalPrice(product.originalPrice ? String(product.originalPrice) : '');
    setFormCategory(product.category);
    setFormDescription(product.description);
    setFormStock(String(product.stock));
    setFormBadge(product.badge || '');
    setFormImageUrls(product.images.join('\n'));
    const specEntries = Object.entries(product.specs).map(([key, value]) => ({ key, value }));
    setFormSpecs(specEntries.length > 0 ? specEntries : [{ key: '', value: '' }]);
    setEditingProduct(productId);
    setShowAddForm(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName || !formPrice || !formCategory || !formDescription) {
      toast.error('Please fill all required fields.');
      return;
    }

    const imageArray = formImageUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const specs: Record<string, string> = {};
    formSpecs.forEach(s => {
      if (s.key.trim() && s.value.trim()) {
        specs[s.key.trim()] = s.value.trim();
      }
    });

    if (editingProduct) {
      // TODO: Will connect to PUT /api/products/:id when backend is connected
      toast.success(`Product "${formName}" updated! (Backend connection required for persistence)`);
    } else {
      // TODO: Will connect to POST /api/products when backend is connected
      toast.success(`Product "${formName}" created! (Backend connection required for persistence)`);
    }

    resetForm();
  };

  // Handle delete
  const handleDelete = (productId: number) => {
    // TODO: Will connect to DELETE /api/products/:id when backend is connected
    const product = products.find(p => p.id === productId);
    toast.success(`Product "${product?.name}" deleted! (Backend connection required for persistence)`);
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <Toaster position="bottom-right" />

      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2 rounded-xl hover:bg-background transition-colors text-zinc-400 hover:text-primary">
                <FiChevronLeft className="text-lg" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <FiShield className="text-primary text-xl" />
                  <h1 className="text-xl font-bold text-text">Admin Dashboard</h1>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">Manage products, reviews & store inventory</p>
              </div>
            </div>
            <button
              onClick={() => { resetForm(); setShowAddForm(true); }}
              className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary/90 transition-all cursor-pointer border-none shadow-lg"
            >
              <FiPlus className="text-sm" /> Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Products', value: totalProducts, icon: <FiPackage />, color: 'text-primary' },
            { label: 'Avg Rating', value: `${avgRating} ★`, icon: <FiStar />, color: 'text-amber-500' },
            { label: 'Total Reviews', value: totalReviews, icon: <FiFileText />, color: 'text-emerald-500' },
            { label: 'Low Stock', value: lowStockCount, icon: <FiAlertTriangle />, color: 'text-orange-500' },
            { label: 'Out of Stock', value: outOfStockCount, icon: <FiAlertTriangle />, color: 'text-red-500' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
              <div className={`text-xl ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-lg font-bold text-text">{stat.value}</p>
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add / Edit Product Form (Overlay Panel) */}
        {showAddForm && (
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 rounded-full hover:bg-background transition-colors text-zinc-400 hover:text-text cursor-pointer border-none bg-transparent"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Row 1: Name + Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <FiTag className="text-xs" /> Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. boAt Airdopes 441 TWS Earbuds"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background py-3 px-4 text-xs font-semibold outline-none focus:border-primary text-text"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <FiLayers className="text-xs" /> Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background py-3 px-4 text-xs font-semibold outline-none focus:border-primary text-text cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Price + Original Price + Stock + Badge */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <FiDollarSign className="text-xs" /> Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="2999"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background py-3 px-4 text-xs font-semibold outline-none focus:border-primary text-text"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="3999"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background py-3 px-4 text-xs font-semibold outline-none focus:border-primary text-text"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <FiBox className="text-xs" /> Stock *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="25"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background py-3 px-4 text-xs font-semibold outline-none focus:border-primary text-text"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Badge
                  </label>
                  <input
                    type="text"
                    placeholder="Best Seller"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background py-3 px-4 text-xs font-semibold outline-none focus:border-primary text-text"
                  />
                </div>
              </div>

              {/* Row 3: Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <FiFileText className="text-xs" /> Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write a compelling product description..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background py-3 px-4 text-xs font-semibold outline-none focus:border-primary text-text resize-none"
                />
              </div>

              {/* Row 4: Image URLs */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <FiImage className="text-xs" /> Image URLs (one per line)
                </label>
                <textarea
                  rows={3}
                  placeholder={"https://images.unsplash.com/photo-xxx?w=500\nhttps://images.unsplash.com/photo-yyy?w=500"}
                  value={formImageUrls}
                  onChange={(e) => setFormImageUrls(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background py-3 px-4 text-xs font-semibold outline-none focus:border-primary text-text resize-none font-mono"
                />
              </div>

              {/* Row 5: Specifications */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Specifications
                  </label>
                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer bg-transparent border-none"
                  >
                    <FiPlus className="text-xs" /> Add Spec
                  </button>
                </div>
                <div className="space-y-2">
                  {formSpecs.map((spec, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="e.g. Brand"
                        value={spec.key}
                        onChange={(e) => updateSpec(index, 'key', e.target.value)}
                        className="flex-1 rounded-xl border border-border bg-background py-2.5 px-3 text-xs font-semibold outline-none focus:border-primary text-text"
                      />
                      <input
                        type="text"
                        placeholder="e.g. boAt"
                        value={spec.value}
                        onChange={(e) => updateSpec(index, 'value', e.target.value)}
                        className="flex-1 rounded-xl border border-border bg-background py-2.5 px-3 text-xs font-semibold outline-none focus:border-primary text-text"
                      />
                      {formSpecs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpecRow(index)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none"
                        >
                          <FiX className="text-xs" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-primary py-3.5 font-bold text-xs text-white shadow-lg hover:bg-primary/90 transition-all cursor-pointer border-none"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-border bg-background py-3.5 px-6 font-bold text-xs text-text hover:border-primary/40 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Product Grid */}
        <div>
          <h2 className="text-sm font-bold text-text mb-4">All Products ({totalProducts})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-border bg-card overflow-hidden group hover:border-primary/30 transition-all"
              >
                {/* Product Image */}
                <div className="relative h-40 bg-background overflow-hidden">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      <FiImage className="text-3xl" />
                    </div>
                  )}
                  {product.badge && (
                    <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      {product.badge}
                    </span>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-bold bg-red-500 px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-2">
                  <h3 className="text-xs font-bold text-text line-clamp-2 leading-relaxed">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-text">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-zinc-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-500">
                      <FiStar className="text-[10px]" /> {product.rating}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-zinc-400">{product.category}</span>
                    <span className={`text-[10px] font-bold ${product.stock === 0 ? 'text-red-500' : product.stock < 5 ? 'text-orange-500' : 'text-emerald-500'}`}>
                      {product.stock === 0 ? 'No Stock' : `${product.stock} in stock`}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-semibold">
                    {product.reviewsCount} review{product.reviewsCount !== 1 ? 's' : ''}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => loadProductForEdit(product.id)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-border bg-background py-2 text-[10px] font-bold text-text hover:border-primary hover:text-primary transition-all cursor-pointer"
                    >
                      <FiEdit2 className="text-[10px]" /> Edit
                    </button>
                    {deleteConfirm === product.id ? (
                      <div className="flex-1 flex gap-1">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex-1 rounded-xl bg-red-500 py-2 text-[10px] font-bold text-white hover:bg-red-600 transition-all cursor-pointer border-none"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="rounded-xl border border-border bg-background py-2 px-2 text-[10px] font-bold text-text hover:border-primary transition-all cursor-pointer"
                        >
                          <FiX className="text-[10px]" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="flex items-center justify-center gap-1 rounded-xl border border-border bg-background py-2 px-3 text-[10px] font-bold text-red-400 hover:border-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                      >
                        <FiTrash2 className="text-[10px]" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
