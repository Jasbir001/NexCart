'use client';

import React from 'react';
import { useStore, Product } from '../context/StoreContext';
import { useIsClient } from '../hooks/useIsClient';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiHeart, FiShoppingCart, FiStar, FiAlertCircle, FiXCircle } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

export default function FeaturedProducts() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mounted = useIsClient();
  
  // 1. Get search query from URL query parameters
  const searchQuery = searchParams ? searchParams.get('search') || '' : '';

  // Get products, cart, wishlist helpers from global Store Context
  const { products, addToCart, toggleWishlist, isInWishlist, cart, updateCartQty, isLoggedIn, setAuthModalOpen } = useStore();

  // 2. Filter products dynamically based on the search input query
  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigating to details page
    if (!isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`, { icon: '🛒' });
  };

  const handleToggleWishlist = (e: React.MouseEvent, product: Product) => {
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

  const handleClearSearch = () => {
    router.push('/');
  };

  return (
    <section id="featured" className="py-16 bg-card/30 border-y border-border/50 transition-colors duration-200">
      <Toaster position="bottom-right" reverseOrder={false} />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-md mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            {searchQuery ? 'Search Results' : 'Trending Products'}
          </span>
          <h2 className="text-3xl font-extrabold text-text tracking-tight">
            {searchQuery ? `Results for "${searchQuery}"` : 'Our Featured Gear'}
          </h2>
          <div className="h-0.5 w-12 bg-primary mx-auto rounded-full" />
        </div>

        {/* If no search results are found */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center max-w-md mx-auto space-y-6">
            <div className="inline-flex rounded-full bg-background p-6 text-amber-500 animate-pulse">
              <FiAlertCircle className="text-5xl" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg">No Products Found</h3>
              <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                We couldn&apos;t find any premium gear matching your search. Try adjusting spelling or using generic words.
              </p>
            </div>
            <button 
              onClick={handleClearSearch}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-primary/95 transition-all cursor-pointer"
            >
              <FiXCircle /> Clear Search
            </button>
          </div>
        ) : (
          /* Product Responsive Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isFavorite = mounted && isInWishlist(product.id);
              const isOutOfStock = product.stock === 0;
              const cartItem = cart.find(item => item.product.id === product.id);

              return (
                <div
                  key={product.id}
                  className="group relative rounded-2xl border border-border bg-card p-3 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Product Image Link Box */}
                  <div className="relative">
                    <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden rounded-xl bg-background block cursor-pointer">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                      />

                      {/* Left Tag Badge */}
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

                  {/* Product Details Info */}
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
    </section>
  );
}
