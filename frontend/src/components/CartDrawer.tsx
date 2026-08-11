'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useIsClient } from '../hooks/useIsClient';
import { useRouter } from 'next/navigation';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiTag, FiGift } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const router = useRouter();
  const mounted = useIsClient();
  const [couponInput, setCouponInput] = useState('');

  const {
    cart,
    isCartOpen,
    setCartOpen,
    removeFromCart,
    updateCartQty,
    appliedCoupon,
    couponDiscountPercent,
    applyCoupon,
    removeCoupon
  } = useStore();

  if (!mounted) return null;

  // Calculators
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const gst = Math.round(subtotal * 0.18);
  const deliveryCharge = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const couponDiscount = Math.round(subtotal * (couponDiscountPercent / 100));
  const grandTotal = subtotal + gst + deliveryCharge - couponDiscount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const success = applyCoupon(couponInput);
    if (success) {
      toast.success(`Coupon "${couponInput.toUpperCase()}" applied successfully!`, { icon: '🏷️' });
      setCouponInput('');
    } else {
      toast.error('Invalid coupon code. Try NEXCART10 or WELCOME20.');
    }
  };

  const handleCheckout = () => {
    setCartOpen(false); // Close drawer
    router.push('/cart');
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 z-50 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Cart Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-card shadow-2xl border-l border-border z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-card text-text">
          <div className="flex items-center gap-2">
            <FiShoppingBag className="text-primary text-xl" />
            <h3 className="font-extrabold text-lg">Your Cart</h3>
            <span className="bg-primary/10 text-primary text-xs font-bold rounded-full px-2 py-0.5 ml-1">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </div>
          <button 
            onClick={() => setCartOpen(false)}
            className="p-2 rounded-xl border border-border hover:bg-background text-zinc-400 hover:text-text hover:rotate-90 transition-all duration-300 cursor-pointer"
          >
            <FiX />
          </button>
        </div>

        {/* Scrollable Items Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="rounded-full bg-background p-6 text-zinc-400">
                <FiShoppingBag className="text-4xl" />
              </div>
              <div>
                <h4 className="font-bold text-base">Your cart is empty</h4>
                <p className="text-xs text-zinc-400 max-w-xs mt-1">Add items from our collections to start your creative lifestyle.</p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white px-6 py-2.5 font-bold text-xs transition-all cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.product.id}
                className="flex items-center gap-4 p-3 rounded-2xl border border-border bg-card hover:shadow-xs transition-all"
              >
                {/* Product Thumbnail */}
                <div className="h-16 w-16 rounded-xl overflow-hidden bg-background flex-shrink-0">
                  <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">{item.product.category}</span>
                  <h4 className="font-bold text-xs text-text truncate mt-0.5">{item.product.name}</h4>
                  <p className="text-xs font-bold text-primary mt-1">₹{item.product.price.toLocaleString('en-IN')}</p>
                </div>

                {/* Quantity Adjusters & Delete */}
                <div className="flex flex-col items-end gap-2">
                  <button 
                    onClick={() => {
                      removeFromCart(item.product.id);
                      toast.success(`Removed ${item.product.name} from cart.`);
                    }}
                    className="text-zinc-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                    title="Remove item"
                  >
                    <FiTrash2 className="text-xs" />
                  </button>

                  <div className="flex items-center gap-1 bg-primary/10 text-primary rounded-full p-0.5">
                    <button
                      onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                      className="h-5 w-5 flex items-center justify-center rounded-full hover:bg-primary/20 text-xs font-bold active:scale-90 transition-all cursor-pointer"
                    >
                      <FiMinus className="text-[9px]" />
                    </button>
                    <span className="text-[10px] font-bold w-4 text-center text-text">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                      className="h-5 w-5 flex items-center justify-center rounded-full hover:bg-primary/20 text-xs font-bold active:scale-90 transition-all cursor-pointer"
                    >
                      <FiPlus className="text-[9px]" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Pricing Summary */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-border bg-background/50 space-y-4">
            
            {/* Promo Code System */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Promo Code (WELCOM20...)" 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="w-full text-xs rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 outline-none focus:border-primary text-text font-semibold uppercase placeholder:normal-case"
                />
              </div>
              <button 
                type="submit"
                className="bg-primary hover:bg-primary/95 text-white px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Apply
              </button>
            </form>

            {/* If Coupon Applied */}
            {appliedCoupon && (
              <div className="flex items-center justify-between bg-green-500/10 text-green-600 border border-green-500/20 px-3.5 py-2 rounded-xl text-xs font-bold animate-pulse-slow">
                <div className="flex items-center gap-1.5">
                  <FiGift className="text-sm" />
                  <span>Coupon Applied: {appliedCoupon} ({couponDiscountPercent}% Off)</span>
                </div>
                <button 
                  onClick={removeCoupon}
                  className="text-[10px] underline hover:text-green-700 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations Summary */}
            <div className="space-y-2.5 text-xs font-semibold text-zinc-400">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="text-text font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST (18%)</span>
                <span className="text-text font-bold">₹{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Charge</span>
                <span className="text-text font-bold">
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between text-green-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>- ₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t border-border/80 pt-3 flex items-center justify-between text-sm text-text font-black">
                <span>Total Amount</span>
                <span className="text-primary text-base font-black">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button 
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-primary/95 text-white py-3 font-bold text-xs rounded-full shadow-md hover:scale-101 active:scale-99 transition-all cursor-pointer uppercase tracking-wider"
              >
                Checkout Now
              </button>
              <button 
                onClick={() => setCartOpen(false)}
                className="w-full bg-card hover:bg-background text-zinc-500 hover:text-text border border-border py-2.5 font-bold text-xs rounded-full transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>

          </div>
        )}

      </div>
    </>
  );
}
