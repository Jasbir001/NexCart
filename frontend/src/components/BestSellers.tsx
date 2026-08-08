'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import Link from 'next/link';
import { FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function BestSellers() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Get products, cart, wishlist helpers from context
  const { products, cart, addToCart, updateCartQty, toggleWishlist, isInWishlist, isLoggedIn, setAuthModalOpen } = useStore();

  // Slice the first 4 items from our global products array to represent "Best Sellers"
  const bestSellerProducts = products.slice(0, 4);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); // Prevent navigating to details page
    if (!isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`, { icon: '🛒' });
  };

  const handleToggleWishlist = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event bubbling to parent <Link>
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
    <section id="bestsellers" className="py-16 bg-background transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Top Products</span>
            <h2 className="text-3xl font-extrabold text-text tracking-tight">Best Sellers</h2>
          </div>
          <p className="max-w-xs text-zinc-500 dark:text-zinc-400 text-sm">
            Top-rated items voted by our worldwide customer community.
          </p>
        </div>

        {/* 4-Column Grid layout - clean and simple */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellerProducts.map((product) => {
            const isFavorite = mounted && isInWishlist(product.id);
            const isOutOfStock = product.stock === 0;
            const cartItem = cart.find(item => item.product.id === product.id);

            return (
              <div
                key={product.id}
                className="group relative rounded-2xl border border-border bg-card p-3 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product Image Frame */}
                <div className="relative">
                  <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden rounded-xl bg-background block cursor-pointer">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-550 group-hover:scale-103"
                    />

                    {product.badge && (
                      <span className={`absolute top-2.5 left-2.5 rounded px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider ${
                        isOutOfStock ? 'bg-zinc-500' : 'bg-primary'
                      }`}>
                        {isOutOfStock ? 'Out of Stock' : product.badge}
                      </span>
                    )}
                  </Link>

                  {/* Wishlist Icon Button Overlay */}
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
                </div>

                {/* Product Info details */}
                <div className="pt-3 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">{product.category}</span>
                    <Link href={`/products/${product.id}`} className="font-bold text-xs sm:text-sm text-text mt-1 group-hover:text-primary transition-colors line-clamp-1 h-5 block cursor-pointer">
                      {product.name}
                    </Link>

                    {/* Ratings */}
                    <div className="flex items-center gap-1 mt-1 text-xs">
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar key={i} className="text-[10px] fill-current" />
                        ))}
                      </div>
                      <span className="font-semibold text-text">{product.rating}</span>
                      <span className="text-[9px] text-zinc-400">({product.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Price and Cart */}
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

      </div>
    </section>
  );
}
