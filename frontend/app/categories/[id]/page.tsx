'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useStore, Product } from '../../../src/context/StoreContext';
import { useIsClient } from '../../../src/hooks/useIsClient';
import Link from 'next/link';
import { FiHeart, FiShoppingCart, FiStar, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

export default function CategoryPage() {
  const params = useParams();
  const mounted = useIsClient();

  const categoryId = params.id ? String(params.id).toLowerCase() : '';

  const { products, cart, addToCart, updateCartQty, toggleWishlist, isInWishlist, isLoggedIn, setAuthModalOpen } = useStore();

  // Sorting & Filtering States
  const [sortBy, setSortBy] = useState<string>('default');
  const [minRating, setMinRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<string>('all');

  // 1. Get base category products
  const baseProducts = products.filter((product) => {
    const slug = product.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
    return slug === categoryId;
  });

  // 2. Filter products
  const filteredProducts = baseProducts.filter((product) => {
    if (product.rating < minRating) return false;

    if (priceRange === 'under-1500') {
      return product.price < 1500;
    } else if (priceRange === '1500-5000') {
      return product.price >= 1500 && product.price <= 5000;
    } else if (priceRange === 'over-5000') {
      return product.price > 5000;
    }
    return true;
  });

  // 3. Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low-high') {
      return a.price - b.price;
    } else if (sortBy === 'price-high-low') {
      return b.price - a.price;
    } else if (sortBy === 'rating-high-low') {
      return b.rating - a.rating;
    }
    return 0;
  });

  const categoryTitle = baseProducts.length > 0
    ? baseProducts[0].category
    : categoryId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' & ');

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`, { icon: '🛒' });
  };

  const handleToggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }
    toggleWishlist(product);
    const wishlisted = isInWishlist(product.id);
    if (!wishlisted) {
      toast.success(`Added ${product.name} to Wishlist!`);
    } else {
      toast.success(`Removed ${product.name} from Wishlist.`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text py-12 transition-colors duration-200">
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-primary transition-colors mb-8 uppercase tracking-wider cursor-pointer"
        >
          <FiArrowLeft className="text-sm" /> Back to Store
        </Link>

        {/* Section Header */}
        <div className="border-b border-border/80 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Category Collection</span>
            <h1 className="text-3xl font-extrabold tracking-tight">{categoryTitle}</h1>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold">
            Showing {sortedProducts.length} of {baseProducts.length} premium {baseProducts.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Filters and Sorting controls */}
        {baseProducts.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-semibold">
            <div className="flex flex-wrap items-center gap-4">
              
              {/* Price Range Filter */}
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Price:</span>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="bg-background border border-border rounded-xl px-3 py-2 outline-none text-text focus:border-primary transition-all font-bold cursor-pointer"
                >
                  <option value="all">All Prices</option>
                  <option value="under-1500">Under ₹1,500</option>
                  <option value="1500-5000">₹1,500 - ₹5,000</option>
                  <option value="over-5000">Over ₹5,000</option>
                </select>
              </div>

              {/* Rating Filter Toggle */}
              <button
                onClick={() => setMinRating(prev => (prev === 4 ? 0 : 4))}
                className={`rounded-xl border px-3 py-2 transition-all font-bold cursor-pointer ${
                  minRating === 4 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-background border-border text-text hover:border-primary'
                }`}
              >
                ★ 4.0 & Above
              </button>

            </div>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border border-border rounded-xl px-3 py-2 outline-none text-text focus:border-primary transition-all font-bold cursor-pointer"
              >
                <option value="default">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating-high-low">Rating: High to Low</option>
              </select>
            </div>
          </div>
        )}

        {sortedProducts.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center max-w-md mx-auto space-y-6">
            <div className="inline-flex rounded-full bg-background p-6 text-amber-500 animate-pulse">
              <FiAlertCircle className="text-5xl" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg">No Products Found</h3>
              <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                We couldn&apos;t find any premium gear under this category matching your filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSortBy('default');
                setMinRating(0);
                setPriceRange('all');
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-primary/95 transition-all cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => {
              const isFavorite = mounted && isInWishlist(product.id);
              const isOutOfStock = product.stock === 0;
              const cartItem = cart.find(item => item.product.id === product.id);

              return (
                <div
                  key={product.id}
                  className="group relative rounded-2xl border border-border bg-card p-3 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
   
                  <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden rounded-xl bg-background block cursor-pointer">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />

       
                    {product.badge && (
                      <span className={`absolute top-2.5 left-2.5 rounded px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider ${
                        isOutOfStock ? 'bg-zinc-500' : 'bg-primary'
                      }`}>
                        {isOutOfStock ? 'Out of Stock' : product.badge}
                      </span>
                    )}

                    <button 
                      onClick={(e) => handleToggleWishlist(e, product)}
                      className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md shadow-xs border transition-colors z-20 cursor-pointer ${
                        isFavorite 
                          ? 'bg-red-500 text-white border-red-500' 
                          : 'bg-card/85 text-text/80 border-border hover:text-red-500'
                      }`}
                    >
                      <FiHeart className={`text-xs ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </Link>

                  <div className="pt-3 flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">{product.category}</span>
                      <Link href={`/products/${product.id}`} className="font-bold text-xs sm:text-sm text-text mt-1 group-hover:text-primary transition-colors line-clamp-2 h-10 block cursor-pointer">
                        {product.name}
                      </Link>

                      {/* Ratings */}
                      <div className="flex items-center gap-1 mt-1 text-xs">
                        <div className="flex text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FiStar key={i} className={`text-[10px] ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <span className="font-semibold text-text">{product.rating}</span>
                        <span className="text-[9px] text-zinc-400">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Price & Add to Cart Trigger */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-zinc-400 font-medium">Price</span>
                        <span className="text-base font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</span>
                      </div>

                      {mounted && cartItem ? (
                        <div className="flex items-center gap-1 bg-primary/10 text-primary rounded-full p-0.5 select-none z-20">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              updateCartQty(product.id, cartItem.quantity - 1);
                              toast.success(`Removed one ${product.name} from cart.`);
                            }}
                            className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-primary/20 active:scale-90 font-bold transition-all text-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-4 text-center text-text">{cartItem.quantity}</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              updateCartQty(product.id, cartItem.quantity + 1);
                              toast.success(`Added another ${product.name} to cart!`);
                            }}
                            className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-primary/20 active:scale-90 font-bold transition-all text-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={isOutOfStock}
                          className={`rounded-full p-2 transition-all shadow-xs cursor-pointer ${
                            isOutOfStock 
                              ? 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800 cursor-not-allowed' 
                              : 'bg-primary text-white hover:bg-primary/95 hover:scale-105 active:scale-95'
                          }`}
                        >
                          <FiShoppingCart className="text-xs" />
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
