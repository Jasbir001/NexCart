'use client';

import React, { useEffect } from 'react';
import { useStore, Product } from '../../src/context/StoreContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FiTrash2, 
  FiShoppingCart, 
  FiHeart, 
  FiArrowLeft, 
  FiStar 
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

export default function WishlistPage() {
  // 1. Get wishlist and shopping cart triggers from context
  const { wishlist, toggleWishlist, addToCart, isLoggedIn } = useStore();
  const router = useRouter();

  // Guard routing: redirect to /auth if not logged in
  useEffect(() => {
    const savedLoggedIn = localStorage.getItem('nexcart-logged-in');
    const checkedLoggedIn = savedLoggedIn ? JSON.parse(savedLoggedIn) : false;
    if (!checkedLoggedIn) {
      router.push('/auth?redirect=/wishlist');
    }
  }, [isLoggedIn, router]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toggleWishlist(product); // Remove from wishlist (move to cart)
    toast.success(`${product.name} moved to cart!`, { icon: '🛒' });
  };

  const handleRemoveItem = (product: Product) => {
    toggleWishlist(product);
    toast.success('Removed from Wishlist.');
  };

  return (
    <div className="min-h-screen bg-background text-text py-12 transition-colors duration-200">
      <Toaster position="bottom-right" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Favourites</span>
            <h1 className="text-3xl font-extrabold tracking-tight">My Wishlist</h1>
          </div>
          <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-primary transition-colors">
            <FiArrowLeft /> Back to Store
          </Link>
        </div>

        {wishlist.length === 0 ? (
          // Empty Wishlist State
          <div className="rounded-3xl border border-border bg-card p-12 text-center max-w-lg mx-auto space-y-6">
            <div className="inline-flex rounded-full bg-background p-6 text-zinc-400">
              <FiHeart className="text-5xl" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg">Your Wishlist is empty</h3>
              <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                Explore the latest boAt audio devices, Titan watches, and FabIndia fashion to add products to your wishlist!
              </p>
            </div>
            <Link href="/" className="inline-block rounded-full bg-primary px-6 py-3 text-xs font-bold text-white shadow-md">
              Discover Products
            </Link>
          </div>
        ) : (
          // Favourites Product Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => {
              const isOutOfStock = product.stock === 0;

              return (
                <div 
                  key={product.id}
                  className="group relative rounded-2xl border border-border bg-card p-3 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image Frame */}
                  <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden rounded-xl bg-background block cursor-pointer">
                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-500" />
                    
                    {product.badge && (
                      <span className="absolute top-2.5 left-2.5 rounded bg-primary px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                        {product.badge}
                      </span>
                    )}
                  </Link>

                  {/* Meta details */}
                  <div className="pt-3 flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">{product.category}</span>
                      <Link href={`/products/${product.id}`} className="font-bold text-xs sm:text-sm text-text line-clamp-1 hover:text-primary mt-0.5 block cursor-pointer">
                        {product.name}
                      </Link>

                      {/* Ratings stars review counts */}
                      <div className="flex items-center gap-1 mt-1 text-xs">
                        <div className="flex text-amber-500">
                          <FiStar className="text-[10px] fill-current" />
                        </div>
                        <span className="font-semibold text-text">{product.rating}</span>
                        <span className="text-[9px] text-zinc-400">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Price and Action triggers */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-zinc-400 font-medium">Price</span>
                        <span className="text-base font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex gap-2">
                        {/* Remove item */}
                        <button 
                          onClick={() => handleRemoveItem(product)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>

                        {/* Quick add */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={isOutOfStock}
                          className={`rounded-full p-2 transition-all cursor-pointer ${
                            isOutOfStock 
                              ? 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800 cursor-not-allowed' 
                              : 'bg-primary text-white hover:bg-primary/95'
                          }`}
                        >
                          <FiShoppingCart className="text-xs" />
                        </button>
                      </div>
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
