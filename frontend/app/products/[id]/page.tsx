'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore, Product } from '../../../src/context/StoreContext';
import { useIsClient } from '../../../src/hooks/useIsClient';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiHeart, 
  FiShoppingCart, 
  FiStar, 
  FiShield, 
  FiCheckCircle, 
  FiAlertTriangle,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiCalendar,
  FiPlus,
  FiGift,
  FiRotateCcw,
  FiInfo
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const mounted = useIsClient();
  
  // 1. Get products and dynamic states from global StoreContext
  const { 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    cart, 
    updateCartQty,
    recentlyViewed,
    addRecentlyViewed,
    addProductReview,
    isLoggedIn,
    setAuthModalOpen
  } = useStore();

  // Resolve ID from parameters
  const productId = Number(params.id);
  const product = products.find(p => p.id === productId);

  // Add current product to recently viewed on load
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
    }
  }, [productId, product]);

  // 2. React state for thumbnail selector
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // 3. React state for sorting reviews
  const [reviewSort, setReviewSort] = useState<'recent' | 'highest' | 'lowest'>('recent');

  // 4. Delivery pincode checker states
  const [pincode, setPincode] = useState('');
  const [pinChecked, setPinChecked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [deliveryDays, setDeliveryDays] = useState(3);

  // 5. GST Invoice states
  const [claimGst, setClaimGst] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');

  // 6. Write review form states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewImage, setReviewImage] = useState('');

  // 7. Lightbox image viewer state
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // 8. Frequently Bought Together (Bundle Checkout) state
  const [bundleOverrides, setBundleOverrides] = useState<{ productId: number; values: Record<number, boolean> } | null>(null);

  // Related & Bundle Products logic (others in same category, max 2 for bundle)
  const bundleItems = product 
    ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 2)
    : [];

  const bundleChecked = useMemo(() => {
    if (!product || bundleItems.length === 0) return {} as Record<number, boolean>;
    const base: Record<number, boolean> = { [product.id]: true };
    bundleItems.forEach(item => {
      base[item.id] = true;
    });
    if (bundleOverrides?.productId === product.id) {
      return { ...base, ...bundleOverrides.values };
    }
    return base;
  }, [product, bundleItems, bundleOverrides]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-8 space-y-4">
        <FiAlertTriangle className="text-red-500 text-5xl animate-bounce" />
        <h2 className="text-2xl font-bold text-text">Product Not Found</h2>
        <p className="text-zinc-500 max-w-xs">The premium gear you are looking for does not exist or has been removed from our catalog.</p>
        <Link href="/" className="rounded-full bg-primary px-6 py-3 font-bold text-white shadow-md">
          Back to Homepage
        </Link>
      </div>
    );
  }

  const isFavorite = mounted && isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;
  const cartItem = cart.find(item => item.product.id === product.id);

  // Add item to cart
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }
    addToCart(product);
    toast.success('Added to your Shopping Cart!', { icon: '🛒' });
  };

  // Buy Now: adds to cart and redirects immediately to Cart page
  const handleBuyNow = () => {
    if (!isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }
    addToCart(product);
    router.push('/cart');
  };

  const handleToggleWishlist = () => {
    if (!isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }
    toggleWishlist(product);
    if (!isFavorite) {
      toast.success('Added to Wishlist!');
    } else {
      toast.success('Removed from Wishlist.');
    }
  };

  // Gallery Navigation (Carousel controls)
  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  // Pincode validation & delivery checker
  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setPinError(true);
      setPinChecked(false);
      toast.error('Invalid Pincode! Please enter a 6-digit Indian PIN.');
      return;
    }
    setPinError(false);
    setPinChecked(true);
    
    // Simulate different delivery days based on first digit
    const firstDigit = Number(pincode[0]);
    if (firstDigit === 1 || firstDigit === 2) {
      setDeliveryDays(2); // Delhi NCR
    } else if (firstDigit === 4 || firstDigit === 5 || firstDigit === 6) {
      setDeliveryDays(3); // Mumbai, Maharashtra, South
    } else {
      setDeliveryDays(5); // Other regions
    }
    toast.success('Pincode verified.');
  };

  const getEstimatedDeliveryDate = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
    return deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  // Write a Review submit
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewText) {
      toast.error('Please enter your name and review text.');
      return;
    }
    addProductReview(product.id, reviewRating, reviewText, reviewerName, reviewImage || undefined);
    toast.success('Thank you for submitting your review!');
    setReviewerName('');
    setReviewText('');
    setReviewImage('');
    setReviewRating(5);
    setShowReviewForm(false);
  };

  const toggleBundleItem = (id: number) => {
    setBundleOverrides(prev => {
      const currentValues = prev?.productId === product.id ? prev.values : {};
      return {
        productId: product.id,
        values: { ...currentValues, [id]: !(bundleChecked[id] ?? true) }
      };
    });
  };

  // Calculate prices
  const specialPrice = product.price;
  const originalPrice = product.originalPrice || Math.round(specialPrice * 1.35);
  const discountPercent = Math.round(((originalPrice - specialPrice) / originalPrice) * 100);

  // Bundle checkout price
  const bundleTotal = specialPrice + bundleItems.reduce((acc, item) => {
    if (bundleChecked[item.id]) {
      return acc + item.price;
    }
    return acc;
  }, 0);

  // Add checked bundle items to cart
  const handleAddBundleToCart = () => {
    if (!isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }
    addToCart(product);
    let count = 1;
    bundleItems.forEach(item => {
      if (bundleChecked[item.id]) {
        addToCart(item);
        count++;
      }
    });
    toast.success(`Added ${count} bundle items to your Cart!`, { icon: '🎁' });
  };

  // Recently Viewed list
  const recentProducts = recentlyViewed
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => !!p && p.id !== product.id)
    .slice(0, 4);

  // Related products recommendations list
  const relatedProductsList = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const finalRelated = relatedProductsList.length > 0 
    ? relatedProductsList 
    : products.filter(p => p.id !== product.id).slice(0, 4);

  // Sorted reviews
  const sortedReviews = [...product.reviews].sort((a, b) => {
    if (reviewSort === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (reviewSort === 'highest') return b.rating - a.rating;
    if (reviewSort === 'lowest') return a.rating - b.rating;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background text-text py-12 transition-colors duration-200">
      <Toaster position="bottom-right" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-primary transition-colors mb-8 uppercase tracking-wider">
          <FiArrowLeft className="text-sm" /> Back to Store
        </Link>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Left Column: Image Gallery Carousel (6 Columns) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Image View with Carousel Arrows */}
            <div className="w-full aspect-square overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-sm flex items-center justify-center relative group">
              <button 
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-card/85 text-text border border-border/80 shadow-md hover:bg-primary hover:text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100 duration-300 z-10"
              >
                <FiChevronLeft className="text-lg" />
              </button>

              <img 
                src={product.images[activeImageIndex]} 
                alt={product.name} 
                className="w-full h-full object-cover rounded-2xl"
              />

              <button 
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-card/85 text-text border border-border/80 shadow-md hover:bg-primary hover:text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100 duration-300 z-10"
              >
                <FiChevronRight className="text-lg" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-6 flex gap-1.5 z-10">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'w-4 bg-primary' : 'w-1.5 bg-zinc-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Selectors */}
            <div className="flex gap-3">
              {product.images.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`h-20 w-20 rounded-xl overflow-hidden border-2 bg-card p-1 transition-all cursor-pointer ${
                    activeImageIndex === index ? 'border-primary scale-103' : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Specifications & Checkouts (6 Columns) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Product Meta Slogans */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{product.category}</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text leading-tight">
                {product.name}
              </h1>

              {/* Reviews Summary Header */}
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500 items-center">
                  <FiStar className="fill-current text-sm" />
                  <span className="text-sm font-bold text-text ml-1">{product.rating}</span>
                </div>
                <span className="text-xs text-zinc-400 font-medium">| {product.reviewsCount} Customer Reviews</span>
              </div>
            </div>

            {/* Price & Discount info */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-3 shadow-xs">
              <div className="flex items-end justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase">Special Price</span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl font-black text-primary">₹{specialPrice.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-zinc-400 line-through font-semibold">₹{originalPrice.toLocaleString('en-IN')}</span>
                    <span className="rounded bg-green-500/10 px-2 py-0.5 text-[10px] text-green-500 font-black uppercase">
                      {discountPercent}% OFF
                    </span>
                  </div>
                </div>

                {/* Stock availability tag */}
                <div>
                  {isOutOfStock ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-950/40 px-3 py-1 text-xs font-bold text-red-500">
                      <FiAlertTriangle /> Out of Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-950/40 px-3 py-1 text-xs font-bold text-green-500">
                      <FiCheckCircle /> In Stock ({product.stock} left)
                    </span>
                  )}
                </div>
              </div>

              {/* Indian E-Commerce Badges Info */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50 text-[10px] text-zinc-400 font-extrabold text-center uppercase tracking-wider">
                <div className="flex flex-col items-center gap-1">
                  <FiGift className="text-sm text-primary" />
                  <span>COD Available</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <FiRotateCcw className="text-sm text-primary" />
                  <span>7 Days Easy Returns</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <FiShield className="text-sm text-primary" />
                  <span>GST Invoice Available</span>
                </div>
              </div>
            </div>

            {/* Pincode Delivery Checker */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-3.5 shadow-xs">
              <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Delivery Pincode Checker</span>
              
              <form onSubmit={handleCheckPincode} className="flex gap-2 text-xs">
                <input 
                  type="text" 
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit PIN (e.g. 110001)"
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 outline-none focus:border-primary text-text font-bold"
                />
                <button 
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2.5 font-bold text-white text-xs cursor-pointer hover:bg-primary/95 transition-all shadow-xs border-none"
                >
                  Verify
                </button>
              </form>

              {pinChecked && (
                <div className="flex items-start gap-2 text-xs text-zinc-500 bg-background/50 border border-border/60 p-3 rounded-xl leading-normal font-semibold">
                  <FiCalendar className="text-primary text-base flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-text font-extrabold">Delivery available at this zone!</p>
                    <p className="text-[11px] mt-0.5">Estimated delivery by: <strong className="text-primary">{getEstimatedDeliveryDate()}</strong></p>
                    <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider flex items-center gap-1 font-extrabold"><FiCheckCircle className="text-green-500 text-xs" /> Cash on Delivery available</p>
                  </div>
                </div>
              )}

              {pinError && (
                <p className="text-[10px] font-bold text-red-500 flex items-center gap-1"><FiAlertTriangle /> Verification failed. Please input a valid numeric PIN code.</p>
              )}
            </div>

            {/* GST Invoice Claim Form Option */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 select-none">
                <input 
                  type="checkbox" 
                  id="gst-check"
                  checked={claimGst}
                  onChange={(e) => setClaimGst(e.target.checked)}
                  className="h-4 w-4 text-primary border-border focus:ring-primary rounded"
                />
                <label htmlFor="gst-check" className="text-xs font-bold text-zinc-500 cursor-pointer">
                  Claim GST Invoice (Get 18% Input Tax Credit)
                </label>
              </div>

              {claimGst && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1.5 animate-in fade-in-50 slide-in-from-top-1 duration-150">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-zinc-400">Company Name *</label>
                    <input 
                      type="text" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="E.g. NexCart Tech Pvt Ltd"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:border-primary text-text font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-zinc-400">GSTIN *</label>
                    <input 
                      type="text" 
                      maxLength={15}
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="15-digit GSTIN"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:border-primary text-text font-bold uppercase"
                    />
                  </div>
                  {gstin.length > 0 && gstin.length !== 15 && (
                    <span className="sm:col-span-2 text-[9px] text-amber-500 font-bold flex items-center gap-1"><FiInfo /> Standard GSTIN must be exactly 15 characters.</span>
                  )}
                  {gstin.length === 15 && (
                    <span className="sm:col-span-2 text-[9px] text-green-500 font-bold flex items-center gap-1"><FiCheckCircle /> Valid GSTIN format. Details will be printed on receipt.</span>
                  )}
                </div>
              )}
            </div>

            {/* Product Description */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-zinc-400">Description</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            {/* Action Buttons Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              
              {mounted && cartItem ? (
                <div className="flex items-center justify-between gap-3 bg-primary/10 text-primary rounded-full py-2.5 px-4 font-bold text-xs select-none">
                  <button
                    onClick={() => {
                      updateCartQty(product.id, cartItem.quantity - 1);
                      toast.success(`Removed one ${product.name} from cart.`);
                    }}
                    className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-primary/20 active:scale-90 font-bold transition-all text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-text font-bold">{cartItem.quantity} in Cart</span>
                  <button
                    onClick={() => {
                      updateCartQty(product.id, cartItem.quantity + 1);
                      toast.success(`Added another ${product.name} to cart!`);
                    }}
                    className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-primary/20 active:scale-90 font-bold transition-all text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`rounded-full py-3 px-4 font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                    isOutOfStock 
                      ? 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800 cursor-not-allowed' 
                      : 'bg-primary/10 text-primary hover:bg-primary/20 hover:scale-103 active:scale-97 transition-all'
                  }`}
                >
                  <FiShoppingCart className="text-sm" /> Add to Cart
                </button>
              )}

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`rounded-full py-3 px-4 font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  isOutOfStock 
                    ? 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800 cursor-not-allowed' 
                    : 'bg-primary text-white hover:bg-primary/95 hover:scale-103 active:scale-97 transition-all'
                }`}
              >
                Buy Now
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`rounded-full py-3 px-4 font-bold text-xs border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isFavorite 
                    ? 'bg-red-500 border-red-500 text-white shadow-xs' 
                    : 'border-border bg-card text-text hover:bg-background hover:scale-103 active:scale-97'
                }`}
              >
                <FiHeart className="text-sm" />
                <span>{isFavorite ? 'Wishlisted' : 'Wishlist'}</span>
              </button>

            </div>

            {/* Product Specifications Table */}
            <div className="space-y-3 pt-4 border-t border-border/80">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-zinc-400">Specifications</h3>
              <div className="rounded-2xl border border-border/80 overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value], idx) => (
                      <tr 
                        key={key} 
                        className={`border-b border-border/80 ${idx % 2 === 0 ? 'bg-card/25' : 'bg-transparent'}`}
                      >
                        <td className="px-4 py-3 font-bold text-zinc-400 w-1/3 border-r border-border/80">{key}</td>
                        <td className="px-4 py-3 font-semibold text-text">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

        {/* 3. Frequently Bought Together (Bundle checkout card) */}
        {bundleItems.length > 0 && (
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-6 mb-16 shadow-xs">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Bundle & Save</span>
              <h2 className="text-xl font-extrabold tracking-tight">Frequently Bought Together</h2>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
              
              {/* Bundle items list */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6">
                
                {/* Main Product */}
                <div className="flex items-center gap-3 bg-background/50 border border-border/60 p-3 rounded-2xl">
                  <input 
                    type="checkbox" 
                    checked={true} 
                    disabled 
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-not-allowed"
                  />
                  <div className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 bg-card p-1">
                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover rounded-lg" />
                  </div>
                  <div className="text-xs font-semibold text-zinc-500 max-w-[150px]">
                    <p className="text-text font-bold truncate">{product.name}</p>
                    <p className="mt-0.5">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {bundleItems.map((item) => (
                  <React.Fragment key={item.id}>
                    <FiPlus className="text-zinc-400 text-lg flex-shrink-0" />
                    
                    <div 
                      onClick={() => toggleBundleItem(item.id)}
                      className={`flex items-center gap-3 bg-background/50 border p-3 rounded-2xl cursor-pointer hover:border-primary transition-all select-none ${
                        bundleChecked[item.id] ? 'border-primary' : 'border-border/60'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={!!bundleChecked[item.id]} 
                        onChange={() => {}} // Controlled by click
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                      />
                      <div className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 bg-card p-1">
                        <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover rounded-lg" />
                      </div>
                      <div className="text-xs font-semibold text-zinc-500 max-w-[150px]">
                        <p className="text-text font-bold truncate">{item.name}</p>
                        <p className="mt-0.5">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </React.Fragment>
                ))}

              </div>

              {/* Bundle calculations card */}
              <div className="w-full lg:w-auto rounded-2xl bg-background border border-border/80 p-5 flex flex-col sm:flex-row items-center gap-6 justify-between lg:min-w-[320px]">
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Bundle Total</span>
                  <span className="text-2xl font-black text-primary">₹{bundleTotal.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={handleAddBundleToCart}
                  className="w-full sm:w-auto rounded-full bg-primary px-6 py-3 font-bold text-white shadow-md hover:bg-primary/95 text-xs transition-all cursor-pointer border-none"
                >
                  Add Bundle to Cart
                </button>
              </div>

            </div>
          </div>
        )}

        {/* 4. Customer Reviews section */}
        <div className="pt-10 border-t border-border/80 space-y-8 mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Feedback</span>
              <h2 className="text-2xl font-extrabold tracking-tight">Ratings & Reviews</h2>
            </div>
            
            {/* Action buttons (Write Review Form trigger & Sort) */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
              <button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="rounded-full bg-primary px-4 py-2 font-bold text-white shadow-xs hover:bg-primary/95 transition-all cursor-pointer border-none"
              >
                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
              </button>

              <div className="flex items-center gap-1 bg-card border border-border rounded-xl px-2.5 py-1 text-zinc-400">
                <span>Sort by:</span>
                <select 
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value as 'recent' | 'highest' | 'lowest')}
                  className="bg-transparent border-none outline-none text-text font-bold p-0.5"
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Write review form (expandable) */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="rounded-2xl border border-border bg-card p-5 space-y-4 text-xs font-semibold text-zinc-500 animate-in fade-in-50 slide-in-from-top-2 duration-200">
              <div className="border-b border-border/80 pb-2 mb-2 font-bold text-sm text-text">Submit Customer Review</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400">Your Name *</label>
                  <input 
                    type="text" 
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary text-text font-bold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400">Rating (1 to 5 Stars) *</label>
                  <div className="flex text-amber-500 gap-1 mt-1 text-lg">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReviewRating(i + 1)}
                        className="bg-transparent border-none p-0 cursor-pointer text-amber-500 outline-none flex"
                      >
                        <FiStar className={`fill-current ${i < reviewRating ? 'text-amber-500' : 'text-zinc-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400">Attach Product Image URL (Optional)</label>
                  <input 
                    type="text" 
                    value={reviewImage}
                    onChange={(e) => setReviewImage(e.target.value)}
                    placeholder="Paste unspash or static image URL"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary text-text font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400">Review Comments *</label>
                <textarea 
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details of your experience with this premium product..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary text-text font-bold"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="rounded-full bg-primary px-6 py-2.5 font-bold text-white shadow-md text-xs hover:bg-primary/95 transition-all cursor-pointer border-none"
              >
                Submit Review
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Rating Breakdown block (4 Columns) */}
            <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-6 flex flex-col justify-between space-y-6">
              <div className="text-center space-y-1">
                <p className="text-5xl font-black text-primary">{product.rating}</p>
                <div className="flex justify-center text-amber-500 gap-0.5 text-base">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} className={`fill-current ${i < Math.floor(product.rating) ? 'text-amber-500' : 'text-zinc-300'}`} />
                  ))}
                </div>
                <p className="text-xs text-zinc-400 font-semibold mt-1">Based on {product.reviewsCount} verified user ratings</p>
              </div>

              {/* Rating breakdown bars */}
              <div className="space-y-2 text-xs font-semibold text-zinc-400">
                {[
                  { stars: 5, pct: '75%', count: 106 },
                  { stars: 4, pct: '18%', count: 25 },
                  { stars: 3, pct: '5%', count: 7 },
                  { stars: 2, pct: '1%', count: 3 },
                  { stars: 1, pct: '1%', count: 1 }
                ].map((row) => (
                  <div key={row.stars} className="flex items-center gap-2">
                    <span className="w-3 text-right">{row.stars}</span>
                    <FiStar className="text-[10px] text-amber-500 fill-current" />
                    <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: row.pct }} />
                    </div>
                    <span className="w-8 text-right text-[10px]">{row.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews list (8 Columns) */}
            <div className="lg:col-span-8 space-y-4">
              {sortedReviews.map((rev) => (
                <div key={rev.id} className="rounded-2xl border border-border bg-card p-6 space-y-3 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base">{rev.name}</h4>
                      <div className="flex text-amber-500 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar key={i} className={`text-[10px] ${i < rev.rating ? 'fill-current' : 'text-zinc-300'}`} />
                        ))}
                      </div>
                    </div>
                    
                    <span className="text-[10px] text-zinc-400 font-semibold">{rev.date}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                    {rev.text}
                  </p>

                  {/* Customer Review Image rendering */}
                  {rev.image && (
                    <div className="pt-1.5 flex gap-2">
                      <div 
                        onClick={() => setLightboxImage(rev.image || null)}
                        className="h-16 w-16 rounded-xl overflow-hidden border border-border bg-background p-1 cursor-pointer hover:border-primary transition-all flex-shrink-0"
                        title="Click to view full review image"
                      >
                        <img src={rev.image} alt="User Review Attachment" className="h-full w-full object-cover rounded-lg" />
                      </div>
                    </div>
                  )}

                  {/* Verified purchase badge */}
                  {rev.verified && (
                    <div className="inline-flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md">
                      <FiShield /> Verified Purchase
                    </div>
                  )}

                </div>
              ))}
            </div>

          </div>
        </div>

        {/* 5. Recently Viewed Products section */}
        {recentProducts.length > 0 && (
          <div className="pt-10 border-t border-border/80 mb-16">
            <div className="space-y-1 mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Recently Viewed</span>
              <h2 className="text-2xl font-extrabold tracking-tight">Your Search History</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {recentProducts.map((item) => (
                <Link 
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group rounded-2xl border border-border bg-card p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-background relative">
                    <img src={item.images[0]} alt={item.name} loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-103" />
                  </div>
                  <div className="pt-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">{item.category}</span>
                      <h3 className="font-bold text-xs sm:text-sm text-text line-clamp-1 group-hover:text-primary transition-colors mt-0.5">{item.name}</h3>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                      <span className="text-sm font-bold text-primary">₹{item.price.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-zinc-400 font-semibold">{item.rating} ★</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 6. Related Products section */}
        <div className="pt-10 border-t border-border/80">
          <div className="space-y-1 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Recommendations</span>
            <h2 className="text-2xl font-extrabold tracking-tight">You Might Also Like</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {finalRelated.map((item) => (
              <Link 
                key={item.id}
                href={`/products/${item.id}`}
                className="group rounded-2xl border border-border bg-card p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-background relative">
                  <img src={item.images[0]} alt={item.name} loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-103" />
                </div>
                <div className="pt-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">{item.category}</span>
                    <h3 className="font-bold text-xs sm:text-sm text-text line-clamp-1 group-hover:text-primary transition-colors mt-0.5">{item.name}</h3>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <span className="text-sm font-bold text-primary">₹{item.price.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-zinc-400 font-semibold">{item.rating} ★</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Full Screen Lightbox Modal for Review Images */}
        {lightboxImage && (
          <div className="fixed inset-0 z-55 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-2.5 rounded-full bg-card/85 text-text border border-border shadow-md hover:bg-primary hover:text-white transition-all cursor-pointer z-55"
              title="Close View"
            >
              <FiX className="text-xl" />
            </button>
            <div className="max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-2xl relative">
              <img src={lightboxImage} alt="User Upload Attachment Expanded" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
