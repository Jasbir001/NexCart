'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, StoreOffer, Order } from '../../src/context/StoreContext';
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
  FiShield,
  FiUploadCloud,
  FiLoader,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPercent,
  FiGift,
  FiToggleLeft,
  FiToggleRight,
  FiShoppingBag,
  FiFilter,
  FiUsers,
  FiCalendar
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

interface SpecEntry {
  key: string;
  value: string;
}

const DEMO_ORDERS: Order[] = [
  {
    id: 'OD827415',
    date: '2026-08-06',
    items: [
      {
        product: {
          id: 1,
          name: 'boAt Nirvana Ion ANC Wireless Earbuds',
          price: 2999,
          rating: 4.8,
          reviewsCount: 142,
          category: 'Electronics',
          images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80'],
          description: '',
          stock: 10,
          specs: {},
          reviews: []
        },
        quantity: 1
      },
      {
        product: {
          id: 3,
          name: 'Red Tape Classic Sporty Sneakers',
          price: 1899,
          rating: 4.7,
          reviewsCount: 210,
          category: 'Shoes',
          images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80'],
          description: '',
          stock: 12,
          specs: {},
          reviews: []
        },
        quantity: 1
      }
    ],
    subtotal: 4898,
    gst: 882,
    deliveryCharge: 0,
    grandTotal: 5780,
    address: {
      fullName: 'Rahul Sharma',
      phone: '+91 9876543210',
      addressLine: 'H-12, Sector 62',
      city: 'Gurugram',
      state: 'Haryana',
      pinCode: '122001'
    },
    paymentMethod: 'UPI (PhonePe)',
    status: 'Shipped'
  }
];

export default function AdminPage() {
  const router = useRouter();
  const {
    products,
    orders,
    manualOffers,
    isLoggedIn,
    isAdmin,
    updateOrderStatus,
    toggleProductStock,
    addOffer,
    updateOffer,
    deleteOffer,
    toggleOfferActive
  } = useStore();

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'offers'>('overview');

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

  // -------------------------------------------------------------
  // 1. PRODUCTS TAB STATES & LOGIC
  // -------------------------------------------------------------
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [deleteProductConfirm, setDeleteProductConfirm] = useState<number | null>(null);

  // Form States
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formCategory, setFormCategory] = useState('Electronics');
  const [formDescription, setFormDescription] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formSpecs, setFormSpecs] = useState<SpecEntry[]>([{ key: '', value: '' }]);

  const categories = [
    'Electronics', 'Fashion', 'Shoes', 'Watches',
    'Accessories', 'Home & Decor', 'Sports & Fitness', 'Books & Stationery'
  ];

  const allOrdersList = orders.length > 0 ? orders : DEMO_ORDERS;

  // Stats
  const totalProducts = products.length;
  const avgRating = products.length > 0
    ? (products.reduce((acc, p) => acc + p.rating, 0) / products.length).toFixed(1)
    : '0.0';
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalReviews = products.reduce((acc, p) => acc + p.reviewsCount, 0);
  const totalOrderCount = allOrdersList.length;
  const pendingOrderCount = allOrdersList.filter(o => ['Pending', 'Confirmed', 'Packed'].includes(o.status)).length;
  const shippedOrderCount = allOrdersList.filter(o => ['Shipped', 'Out For Delivery'].includes(o.status)).length;
  const deliveredOrderCount = allOrdersList.filter(o => o.status === 'Delivered').length;
  const activeOffersCount = manualOffers.filter(o => o.isActive).length;

  // Spec management
  const addSpecRow = () => setFormSpecs([...formSpecs, { key: '', value: '' }]);
  const removeSpecRow = (index: number) => setFormSpecs(formSpecs.filter((_, i) => i !== index));
  const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...formSpecs];
    updated[index][field] = val;
    setFormSpecs(updated);
  };

  const resetProductForm = () => {
    setFormName('');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormCategory('Electronics');
    setFormDescription('');
    setFormStock('');
    setFormBadge('');
    setUploadedImageUrls([]);
    setFormSpecs([{ key: '', value: '' }]);
    setEditingProduct(null);
    setShowProductForm(false);
  };

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
    setUploadedImageUrls([...product.images]);
    const specEntries = Object.entries(product.specs).map(([key, value]) => ({ key, value }));
    setFormSpecs(specEntries.length > 0 ? specEntries : [{ key: '', value: '' }]);
    setEditingProduct(productId);
    setShowProductForm(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice || !formCategory || !formDescription) {
      toast.error('Please fill all required fields.');
      return;
    }

    if (editingProduct) {
      toast.success(`Product "${formName}" updated!`);
    } else {
      toast.success(`Product "${formName}" created!`);
    }
    resetProductForm();
  };

  const handleToggleStock = (productId: number, currentStock: number) => {
    if (currentStock > 0) {
      toggleProductStock(productId, 0);
      toast.error('Product marked as OUT OF STOCK');
    } else {
      toggleProductStock(productId, 15);
      toast.success('Product marked as IN STOCK (15 units)');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const localUrl = URL.createObjectURL(files[i]);
      newUrls.push(localUrl);
    }
    setUploadedImageUrls(prev => [...prev, ...newUrls]);
    setIsUploading(false);
    toast.success('Images added to preview!');
    e.target.value = '';
  };

  // -------------------------------------------------------------
  // 2. ORDERS MANAGEMENT TAB STATES & LOGIC
  // -------------------------------------------------------------
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  const filteredOrders = orderStatusFilter === 'All'
    ? allOrdersList
    : allOrdersList.filter(o => o.status === orderStatusFilter);

  const orderStatuses: Order['status'][] = [
    'Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'
  ];

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Order #${orderId} status updated to "${newStatus}"!`);
  };

  // -------------------------------------------------------------
  // 3. MANUAL OFFER SYSTEM TAB STATES & LOGIC
  // -------------------------------------------------------------
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);

  const [offerTitle, setOfferTitle] = useState('');
  const [offerCode, setOfferCode] = useState('');
  const [offerDiscountType, setOfferDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [offerDiscountValue, setOfferDiscountValue] = useState('');
  const [offerMinQuantity, setOfferMinQuantity] = useState('1');
  const [offerMinOrderValue, setOfferMinOrderValue] = useState('0');
  const [offerDescription, setOfferDescription] = useState('');
  const [offerIsActive, setOfferIsActive] = useState(true);

  const resetOfferForm = () => {
    setOfferTitle('');
    setOfferCode('');
    setOfferDiscountType('percentage');
    setOfferDiscountValue('');
    setOfferMinQuantity('1');
    setOfferMinOrderValue('0');
    setOfferDescription('');
    setOfferIsActive(true);
    setEditingOfferId(null);
    setShowOfferForm(false);
  };

  const loadOfferForEdit = (offer: StoreOffer) => {
    setOfferTitle(offer.title);
    setOfferCode(offer.code);
    setOfferDiscountType(offer.discountType);
    setOfferDiscountValue(String(offer.discountValue));
    setOfferMinQuantity(String(offer.minQuantity));
    setOfferMinOrderValue(String(offer.minOrderValue));
    setOfferDescription(offer.description);
    setOfferIsActive(offer.isActive);
    setEditingOfferId(offer.id);
    setShowOfferForm(true);
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerTitle || !offerCode || !offerDiscountValue) {
      toast.error('Please fill required offer fields (Title, Code, Discount Value).');
      return;
    }

    const payload = {
      title: offerTitle,
      code: offerCode.toUpperCase().trim(),
      discountType: offerDiscountType,
      discountValue: Number(offerDiscountValue) || 0,
      minQuantity: Number(offerMinQuantity) || 1,
      minOrderValue: Number(offerMinOrderValue) || 0,
      description: offerDescription || `${offerDiscountValue}${offerDiscountType === 'percentage' ? '%' : '₹'} OFF Offer`,
      isActive: offerIsActive
    };

    if (editingOfferId) {
      updateOffer(editingOfferId, payload);
      toast.success(`Offer "${offerTitle}" updated successfully!`);
    } else {
      addOffer(payload);
      toast.success(`New offer "${offerTitle}" created successfully!`);
    }

    resetOfferForm();
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <Toaster position="bottom-right" />

      {/* Admin Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2 rounded-xl hover:bg-background transition-colors text-zinc-400 hover:text-primary">
                <FiChevronLeft className="text-lg" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <FiShield className="text-primary text-xl" />
                  <h1 className="text-xl font-bold text-text">Admin Dashboard</h1>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">Manage products, customer orders & store manual offers</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center bg-background rounded-2xl p-1 border border-border">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border-none ${
                  activeTab === 'overview'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-zinc-400 hover:text-text'
                }`}
              >
                <FiUsers className="text-sm" /> Overview
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border-none ${
                  activeTab === 'products'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-zinc-400 hover:text-text'
                }`}
              >
                <FiPackage className="text-sm" /> Products ({totalProducts})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border-none ${
                  activeTab === 'orders'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-zinc-400 hover:text-text'
                }`}
              >
                <FiTruck className="text-sm" /> Customer Orders ({totalOrderCount})
              </button>
              <button
                onClick={() => setActiveTab('offers')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border-none ${
                  activeTab === 'offers'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-zinc-400 hover:text-text'
                }`}
              >
                <FiGift className="text-sm" /> Manual Offers ({manualOffers.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* ========================================================= */}
        {/* TAB 1: ADMIN OVERVIEW DASHBOARD */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-text">Admin Overview</h2>
                  <p className="text-sm text-zinc-500 mt-1">A quick summary of store health, orders to process, and active offers.</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary">
                  <FiShield className="text-base" /> Admin Mode
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: 'Total Products', value: totalProducts, icon: <FiPackage />, color: 'text-primary' },
                  { label: 'Total Orders', value: totalOrderCount, icon: <FiShoppingBag />, color: 'text-emerald-500' },
                  { label: 'Active Offers', value: activeOffersCount, icon: <FiGift />, color: 'text-amber-500' },
                  { label: 'Out of Stock', value: outOfStockCount, icon: <FiAlertTriangle />, color: 'text-red-500' }
                ].map((stat) => (
                  <div key={stat.label} className="rounded-3xl border border-border bg-background p-5 flex items-center gap-3">
                    <div className={`text-2xl ${stat.color}`}>{stat.icon}</div>
                    <div>
                      <p className="text-3xl font-extrabold text-text">{stat.value}</p>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="rounded-3xl border border-border bg-card p-5 space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-bold">Order Pipeline</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-semibold text-text">
                      <span>Pending / Processing</span>
                      <span>{pendingOrderCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold text-text">
                      <span>Shipped / In Transit</span>
                      <span>{shippedOrderCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold text-text">
                      <span>Delivered</span>
                      <span>{deliveredOrderCount}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-border bg-card p-5 space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-bold">Inventory Health</p>
                  <div className="space-y-3">
                    <div className="text-sm text-text font-semibold">Low stock products: <span className="font-bold text-primary">{lowStockCount}</span></div>
                    <div className="text-sm text-text font-semibold">Avg rating across catalog: <span className="font-bold text-amber-500">{avgRating} ★</span></div>
                  </div>
                </div>
                <div className="rounded-3xl border border-border bg-card p-5 space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-bold">Quick Actions</p>
                  <div className="grid gap-3">
                    <button
                      onClick={() => setActiveTab('products')}
                      className="rounded-2xl bg-primary px-4 py-3 text-xs font-bold text-white hover:bg-primary/95 transition-all"
                    >Manage Products</button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="rounded-2xl bg-background border border-border px-4 py-3 text-xs font-bold text-text hover:border-primary hover:text-primary transition-all"
                    >Review Orders</button>
                    <button
                      onClick={() => setActiveTab('offers')}
                      className="rounded-2xl bg-background border border-border px-4 py-3 text-xs font-bold text-text hover:border-primary hover:text-primary transition-all"
                    >Edit Offers</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-text">Store Inventory & Products</h2>
                <p className="text-xs text-zinc-400">Add products, edit details, and toggle out-of-stock availability</p>
              </div>
              <button
                onClick={() => { resetProductForm(); setShowProductForm(true); }}
                className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary/90 transition-all cursor-pointer border-none shadow-lg"
              >
                <FiPlus className="text-sm" /> Add Product
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Total Products', value: totalProducts, icon: <FiPackage />, color: 'text-primary' },
                { label: 'Avg Rating', value: `${avgRating} ★`, icon: <FiStar />, color: 'text-amber-500' },
                { label: 'Total Reviews', value: totalReviews, icon: <FiFileText />, color: 'text-emerald-500' },
                { label: 'Low Stock (< 5)', value: lowStockCount, icon: <FiAlertTriangle />, color: 'text-orange-500' },
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

            {/* Add / Edit Product Form Overlay */}
            {showProductForm && (
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl relative">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-text">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={resetProductForm}
                    className="p-2 rounded-full hover:bg-background transition-colors text-zinc-400 hover:text-text cursor-pointer border-none bg-transparent"
                  >
                    <FiX className="text-lg" />
                  </button>
                </div>

                <form onSubmit={handleProductSubmit} className="space-y-5">
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
                        <FiBox className="text-xs" /> Stock Units *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="0 for Out of Stock"
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

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-2xl bg-primary py-3.5 font-bold text-xs text-white shadow-lg hover:bg-primary/90 transition-all cursor-pointer border-none"
                    >
                      {editingProduct ? 'Save Changes' : 'Create Product'}
                    </button>
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className="rounded-2xl border border-border bg-background py-3.5 px-6 font-bold text-xs text-text hover:border-primary/40 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => {
                const isOutOfStock = product.stock === 0;

                return (
                  <div
                    key={product.id}
                    className={`rounded-2xl border bg-card overflow-hidden group transition-all relative ${
                      isOutOfStock ? 'border-red-500/40 bg-red-500/5' : 'border-border hover:border-primary/30'
                    }`}
                  >
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
                        <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {product.badge}
                        </span>
                      )}

                      {/* Stock Badge Overlay */}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center gap-1">
                          <span className="text-white text-xs font-extrabold bg-red-500 px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                            Out of Stock
                          </span>
                          <span className="text-[10px] text-red-200 font-semibold">Customers cannot order</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
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

                      {/* Stock Status & Quick Toggle */}
                      <div className="flex items-center justify-between pt-1 border-t border-border/60">
                        <span className={`text-[10px] font-bold ${isOutOfStock ? 'text-red-500' : product.stock < 5 ? 'text-orange-500' : 'text-emerald-500'}`}>
                          {isOutOfStock ? '● 0 Units Left' : `● ${product.stock} in stock`}
                        </span>

                        <button
                          onClick={() => handleToggleStock(product.id, product.stock)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer border ${
                            isOutOfStock
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500 hover:text-white'
                              : 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500 hover:text-white'
                          }`}
                          title="Click to toggle Stock Status"
                        >
                          {isOutOfStock ? 'Set In Stock' : 'Mark Out of Stock'}
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => loadProductForEdit(product.id)}
                          className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-border bg-background py-2 text-[10px] font-bold text-text hover:border-primary hover:text-primary transition-all cursor-pointer"
                        >
                          <FiEdit2 className="text-[10px]" /> Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CUSTOMER ORDERS STATUS UPDATE */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Header & Filter pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-text">Customer Orders Management</h2>
                <p className="text-xs text-zinc-400">View orders placed by buyers and update live delivery status</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                <span className="text-xs text-zinc-400 font-bold flex items-center gap-1 mr-1">
                  <FiFilter className="text-xs" /> Filter:
                </span>
                {['All', ...orderStatuses].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                      orderStatusFilter === st
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'border-border bg-card text-zinc-400 hover:text-text'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Stack */}
            <div className="space-y-6">
              {filteredOrders.length === 0 ? (
                <div className="rounded-3xl border border-border bg-card p-12 text-center text-zinc-400 space-y-3">
                  <FiTruck className="text-4xl mx-auto text-zinc-500" />
                  <p className="font-bold text-sm">No orders found matching &quot;{orderStatusFilter}&quot; status</p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  return (
                    <div
                      key={order.id}
                      className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:border-primary/20 transition-all"
                    >
                      {/* Top Bar: Order ID, Date & Status Update Dropdown */}
                      <div className="bg-background/60 border-b border-border/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4 text-xs">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-zinc-400 block">Order ID</span>
                            <span className="font-extrabold text-primary text-sm">{order.id}</span>
                          </div>
                          <div className="border-l border-border pl-4">
                            <span className="text-[10px] font-bold uppercase text-zinc-400 block">Date</span>
                            <span className="font-bold text-text">{order.date}</span>
                          </div>
                          <div className="border-l border-border pl-4">
                            <span className="text-[10px] font-bold uppercase text-zinc-400 block">Grand Total</span>
                            <span className="font-bold text-emerald-500">₹{order.grandTotal.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="border-l border-border pl-4">
                            <span className="text-[10px] font-bold uppercase text-zinc-400 block">Payment</span>
                            <span className="font-bold text-text">{order.paymentMethod}</span>
                          </div>
                        </div>

                        {/* Interactive Status Update Selector */}
                        <div className="flex items-center gap-2 bg-card p-1.5 rounded-2xl border border-border">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-primary flex items-center gap-1 pl-2">
                            <FiClock className="text-xs" /> Status:
                          </label>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                            className="bg-background border border-border font-bold text-xs text-text rounded-xl px-3 py-1.5 outline-none focus:border-primary cursor-pointer shadow-xs"
                          >
                            {orderStatuses.map((st) => (
                              <option key={st} value={st}>
                                {st} {st === 'Delivered' ? '✓' : st === 'Cancelled' ? '✕' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Buyer Address & Items Breakdown */}
                      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Purchased Items (7 cols) */}
                        <div className="lg:col-span-7 space-y-3">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                            Ordered Items ({order.items.length})
                          </p>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-background/50 p-2.5 rounded-2xl border border-border/60">
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="h-12 w-12 rounded-xl object-cover bg-card flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-text line-clamp-1">{item.product.name}</p>
                                  <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                                    Qty: <span className="text-text font-bold">{item.quantity}</span> | ₹{item.product.price.toLocaleString('en-IN')} each
                                  </p>
                                </div>
                                <span className="text-xs font-bold text-text pr-2">
                                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Customer Delivery Details (5 cols) */}
                        <div className="lg:col-span-5 rounded-2xl bg-background/50 border border-border/80 p-4 space-y-3">
                          <div className="flex items-center gap-1.5 text-text border-b border-border/60 pb-2">
                            <FiMapPin className="text-primary text-xs" />
                            <span className="font-bold text-xs uppercase tracking-wider">Buyer Shipping Info</span>
                          </div>
                          <div className="text-xs space-y-1 text-zinc-400 font-medium">
                            <p className="text-text font-extrabold flex items-center gap-1">
                              <FiUsers className="text-xs text-primary" /> {order.address.fullName}
                            </p>
                            <p>{order.address.addressLine}</p>
                            <p>{order.address.city}, {order.address.state} - <span className="text-text font-bold">{order.address.pinCode}</span></p>
                            <p className="text-text font-semibold pt-1">Phone: {order.address.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: MANUAL OFFER SYSTEM */}
        {/* ========================================================= */}
        {activeTab === 'offers' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-text">Manual Offer & Discount System</h2>
                <p className="text-xs text-zinc-400">Create custom combo offers (e.g. 20% OFF on 5 items), flat discount rules & coupons</p>
              </div>
              <button
                onClick={() => { resetOfferForm(); setShowOfferForm(true); }}
                className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary/90 transition-all cursor-pointer border-none shadow-lg"
              >
                <FiPlus className="text-sm" /> Create New Offer
              </button>
            </div>

            {/* Create/Edit Offer Form Modal */}
            {showOfferForm && (
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-text flex items-center gap-2">
                    <FiGift className="text-primary" />
                    {editingOfferId ? 'Edit Manual Offer' : 'Create New Manual Offer'}
                  </h3>
                  <button
                    onClick={resetOfferForm}
                    className="p-2 rounded-full hover:bg-background transition-colors text-zinc-400 hover:text-text cursor-pointer border-none bg-transparent"
                  >
                    <FiX className="text-lg" />
                  </button>
                </div>

                <form onSubmit={handleOfferSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Offer Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 5+ Items Combo Special"
                        value={offerTitle}
                        onChange={(e) => setOfferTitle(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-background py-3 px-4 text-xs font-semibold outline-none focus:border-primary text-text"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Offer Coupon Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. BUY5GET20"
                        value={offerCode}
                        onChange={(e) => setOfferCode(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-background py-3 px-4 text-xs font-semibold outline-none focus:border-primary text-text uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Discount Type *
                      </label>
                      <select
                        value={offerDiscountType}
                        onChange={(e) => setOfferDiscountType(e.target.value as 'percentage' | 'fixed')}
                        className="w-full rounded-2xl border border-border bg-background py-3 px-4 text-xs font-semibold outline-none focus:border-primary text-text cursor-pointer"
                      >
                        <option value="percentage">Percentage OFF (%)</option>
                        <option value="fixed">Fixed Amount OFF (₹)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Discount Value *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder={offerDiscountType === 'percentage' ? '20 (for 20%)' : '500 (for ₹500)'}
                        value={offerDiscountValue}
                        onChange={(e) => setOfferDiscountValue(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-background py-3 px-4 text-xs font-semibold outline-none focus:border-primary text-text"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Min Quantity (Items)
                      </label>
                      <input
                        type="number"
                        placeholder="5 (Buy 5 items)"
                        value={offerMinQuantity}
                        onChange={(e) => setOfferMinQuantity(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-background py-3 px-4 text-xs font-semibold outline-none focus:border-primary text-text"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Min Order Spend (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="1000 (Min order value)"
                        value={offerMinOrderValue}
                        onChange={(e) => setOfferMinOrderValue(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-background py-3 px-4 text-xs font-semibold outline-none focus:border-primary text-text"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Offer Description & Instructions
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Buy 5 or more items together to unlock 20% discount on cart automatically!"
                      value={offerDescription}
                      onChange={(e) => setOfferDescription(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-background py-3 px-4 text-xs font-semibold outline-none focus:border-primary text-text resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="offerActiveCheck"
                      checked={offerIsActive}
                      onChange={(e) => setOfferIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="offerActiveCheck" className="text-xs font-bold text-text cursor-pointer select-none">
                      Activate this offer immediately for all customers
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-2xl bg-primary py-3.5 font-bold text-xs text-white shadow-lg hover:bg-primary/90 transition-all cursor-pointer border-none"
                    >
                      {editingOfferId ? 'Update Offer' : 'Publish Offer'}
                    </button>
                    <button
                      type="button"
                      onClick={resetOfferForm}
                      className="rounded-2xl border border-border bg-background py-3.5 px-6 font-bold text-xs text-text hover:border-primary/40 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List of Offers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {manualOffers.map((offer) => (
                <div
                  key={offer.id}
                  className={`rounded-3xl border p-6 space-y-4 transition-all relative ${
                    offer.isActive
                      ? 'border-border bg-card hover:border-primary/40'
                      : 'border-border/40 bg-background/50 opacity-70'
                  }`}
                >
                  {/* Top Badge & Code */}
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider border border-primary/20">
                      {offer.code}
                    </span>
                    <button
                      onClick={() => {
                        toggleOfferActive(offer.id);
                        toast.success(`Offer ${offer.code} is now ${!offer.isActive ? 'Active' : 'Inactive'}`);
                      }}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl transition-all cursor-pointer border ${
                        offer.isActive
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                          : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30'
                      }`}
                    >
                      {offer.isActive ? <FiToggleRight className="text-sm text-emerald-500" /> : <FiToggleLeft className="text-sm" />}
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-text">{offer.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{offer.description}</p>
                  </div>

                  {/* Conditions & Discount amount */}
                  <div className="bg-background/80 rounded-2xl p-3 border border-border/60 space-y-1.5 text-xs font-bold">
                    <div className="flex justify-between items-center text-primary">
                      <span>Discount:</span>
                      <span className="text-sm font-black">
                        {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-400 text-[11px]">
                      <span>Required Qty:</span>
                      <span className="text-text">{offer.minQuantity > 1 ? `${offer.minQuantity}+ items together` : 'Any quantity'}</span>
                    </div>
                    {offer.minOrderValue > 0 && (
                      <div className="flex justify-between items-center text-zinc-400 text-[11px]">
                        <span>Min Order Amount:</span>
                        <span className="text-text">₹{offer.minOrderValue.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Edit & Delete Controls */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => loadOfferForEdit(offer)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-border bg-background py-2 text-xs font-bold text-text hover:border-primary hover:text-primary transition-all cursor-pointer"
                    >
                      <FiEdit2 className="text-xs" /> Edit Offer
                    </button>
                    <button
                      onClick={() => {
                        deleteOffer(offer.id);
                        toast.success(`Offer "${offer.title}" deleted.`);
                      }}
                      className="p-2 rounded-xl border border-border bg-background text-red-400 hover:border-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
