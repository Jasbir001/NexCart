'use client';

import React, { useState, useEffect } from 'react';
import { useStore, OrderAddress } from '../../src/context/StoreContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiTrash2, 
  FiPlus, 
  FiMinus, 
  FiArrowLeft, 
  FiFileText, 
  FiCheckCircle, 
  FiShoppingCart,
  FiGift,
  FiAlertTriangle,
  FiTag
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    updateCartQty,
    removeFromCart,
    placeOrder,
    isLoggedIn,
    manualOffers,
    getBestApplicableOffer
  } = useStore();

  // Guard routing: redirect to /auth if not logged in
  useEffect(() => {
    const savedLoggedIn = localStorage.getItem('nexcart-logged-in');
    const checkedLoggedIn = savedLoggedIn ? JSON.parse(savedLoggedIn) : false;
    if (!checkedLoggedIn) {
      router.push('/auth?redirect=/cart');
    }
  }, [isLoggedIn, router]);

  // 1. React States for address form
  const [address, setAddress] = useState<OrderAddress>({
    fullName: '',
    phone: '',
    addressLine: '',
    city: 'Delhi',
    state: 'Delhi',
    pinCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Check out-of-stock items in cart
  const outOfStockItems = cart.filter(item => item.product.stock === 0);
  const hasOutOfStock = outOfStockItems.length > 0;

  // 2. Compute Invoice Metrics
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Calculate best manual offer discount
  const { offer: activeBestOffer, discountAmount: offerDiscountAmount } = getBestApplicableOffer(cart, subtotal);
  const discountedSubtotal = Math.max(0, subtotal - offerDiscountAmount);

  const gst = Math.round(discountedSubtotal * 0.18); // 18% standard India GST
  const deliveryCharge = subtotal > 999 ? 0 : 99; // Free above ₹999
  const grandTotal = discountedSubtotal + gst + deliveryCharge;

  // Total items count
  const totalItemsQty = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 3. Indian Cities & States mapper
  const indianCities = [
    { city: 'Delhi', state: 'Delhi' },
    { city: 'Mumbai', state: 'Maharashtra' },
    { city: 'Bengaluru', state: 'Karnataka' },
    { city: 'Hyderabad', state: 'Telangana' },
    { city: 'Jaipur', state: 'Rajasthan' },
    { city: 'Chandigarh', state: 'Punjab' },
    { city: 'Gurugram', state: 'Haryana' }
  ];

  const handleCityChange = (cityName: string) => {
    const matched = indianCities.find(c => c.city === cityName);
    setAddress(prev => ({
      ...prev,
      city: cityName,
      state: matched ? matched.state : prev.state
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 4. Form validation and checkout place order
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (hasOutOfStock) {
      toast.error('Please remove Out of Stock items before placing order.');
      return;
    }

    // Indian Mobile validation (exactly 10 digits)
    const phoneDigits = address.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      toast.error('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    // Indian PIN Code validation (exactly 6 digits)
    const pinDigits = address.pinCode.replace(/\D/g, '');
    if (pinDigits.length !== 6) {
      toast.error('Please enter a valid 6-digit Indian PIN Code.');
      return;
    }

    try {
      const order = placeOrder(
        {
          ...address,
          phone: '+91 ' + phoneDigits,
          pinCode: pinDigits
        }, 
        paymentMethod
      );

      setPlacedOrderId(order.id);
      setIsOrderSuccess(true);
      toast.success('Order placed successfully!', { icon: '🎉' });
      
      setTimeout(() => {
        router.push('/orders');
      }, 2500);

    } catch (err) {
      toast.error('Failed to process order checkout. Please try again.');
    }
  };

  // Victory screen on order completion
  if (isOrderSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-8 space-y-6">
        <div className="rounded-full bg-green-500/10 p-6 text-green-500 animate-bounce">
          <FiCheckCircle className="text-6xl" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-text">Order Placed Successfully!</h2>
          <p className="text-zinc-500 max-w-sm mx-auto">
            Thank you for shopping with NexCart. Your Order ID is <span className="font-extrabold text-primary">{placedOrderId}</span>.
          </p>
          <p className="text-xs text-zinc-400">Navigating to your Orders Dashboard in 2 seconds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text py-12 transition-colors duration-200">
      <Toaster position="bottom-right" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Checkout</span>
            <h1 className="text-3xl font-extrabold tracking-tight">Shopping Cart</h1>
          </div>
          <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-primary transition-colors">
            <FiArrowLeft /> Back to Store
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center max-w-lg mx-auto space-y-6">
            <div className="inline-flex rounded-full bg-background p-6 text-zinc-400">
              <FiShoppingCart className="text-5xl" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg">Your cart is empty</h3>
              <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                Looks like you haven&apos;t added any Indian premium items yet. Let&apos;s explore the collections!
              </p>
            </div>
            <Link href="/" className="inline-block rounded-full bg-primary px-6 py-3 text-xs font-bold text-white shadow-md">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side: Cart Items list (7 Columns) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Out of Stock Warning Banner */}
              {hasOutOfStock && (
                <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 flex items-center gap-3 text-red-500 text-xs font-bold">
                  <FiAlertTriangle className="text-xl flex-shrink-0" />
                  <div>
                    <p className="font-extrabold">Some items in your cart are OUT OF STOCK!</p>
                    <p className="text-[11px] text-red-400 font-semibold">Please remove them from cart before proceeding to checkout.</p>
                  </div>
                </div>
              )}

              {/* Active Manual Store Offers Banner */}
              {manualOffers.filter(o => o.isActive).length > 0 && (
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-primary uppercase tracking-wider">
                    <FiGift className="text-base" /> Active Store Combo Offers
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {manualOffers.filter(o => o.isActive).map(offer => {
                      const isEligible = totalItemsQty >= offer.minQuantity && subtotal >= offer.minOrderValue;

                      return (
                        <div
                          key={offer.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border ${
                            isEligible
                              ? 'bg-card border-emerald-500/40 text-emerald-500'
                              : 'bg-background/60 border-border text-zinc-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                              {offer.code}
                            </span>
                            <span className="font-bold text-text text-xs">{offer.title}</span>
                          </div>
                          <span className="text-[11px] font-extrabold">
                            {isEligible ? '✓ Unlocked & Applied!' : offer.minQuantity > 1 ? `Buy ${offer.minQuantity} items to unlock` : `Min order ₹${offer.minOrderValue}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {cart.map((item) => {
                const isItemOutOfStock = item.product.stock === 0;

                return (
                  <div 
                    key={item.product.id} 
                    className={`rounded-2xl border p-4 flex gap-4 transition-all relative ${
                      isItemOutOfStock ? 'border-red-500/40 bg-red-500/5' : 'border-border bg-card hover:shadow-xs'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-background flex-shrink-0 relative">
                      <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                      {isItemOutOfStock && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <span className="text-[9px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded uppercase">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between gap-2">
                        <div>
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{item.product.category}</span>
                          <Link href={`/products/${item.product.id}`} className="font-bold text-xs sm:text-sm text-text line-clamp-1 hover:text-primary transition-colors mt-0.5 block">
                            {item.product.name}
                          </Link>
                          {isItemOutOfStock && (
                            <span className="text-[10px] text-red-500 font-bold block mt-0.5">● This item is currently unavailable</span>
                          )}
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer self-start"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>

                      {/* Qty and Individual Subtotal */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-1">
                          <button 
                            onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                            className="p-1 rounded-md hover:bg-card text-zinc-400 hover:text-text cursor-pointer"
                          >
                            <FiMinus className="text-xs" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                            disabled={isItemOutOfStock}
                            className="p-1 rounded-md hover:bg-card text-zinc-400 hover:text-text cursor-pointer disabled:opacity-40"
                          >
                            <FiPlus className="text-xs" />
                          </button>
                        </div>

                        <span className="font-extrabold text-sm text-primary">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right side: Invoice pricing sheet and Address Checkout forms (5 Columns) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Invoice breakdown card */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 pb-3 border-b border-border/50">
                  <FiFileText /> Invoice Summary
                </h3>

                <div className="space-y-2.5 text-xs sm:text-sm font-semibold text-zinc-500">
                  <div className="flex justify-between">
                    <span>Items Subtotal ({totalItemsQty} items)</span>
                    <span className="text-text">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Manual Offer Discount Line */}
                  {offerDiscountAmount > 0 && activeBestOffer && (
                    <div className="flex justify-between text-emerald-500 font-extrabold bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                      <span className="flex items-center gap-1">
                        <FiTag /> {activeBestOffer.title} ({activeBestOffer.code})
                      </span>
                      <span>-₹{offerDiscountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  
                  {/* Tax GST breakdown */}
                  <div className="flex justify-between">
                    <span>GST (18% Integrated standard)</span>
                    <span className="text-text">₹{gst.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    {deliveryCharge === 0 ? (
                      <span className="text-green-500 uppercase font-bold text-[10px]">Free Delivery</span>
                    ) : (
                      <span className="text-text">₹{deliveryCharge}</span>
                    )}
                  </div>

                  <div className="flex justify-between font-black text-sm sm:text-base text-text border-t border-border/50 pt-3">
                    <span>Grand Total</span>
                    <span className="text-primary">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Indian Localization Address form */}
              <form onSubmit={handleCheckout} className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-zinc-400 pb-3 border-b border-border/50">
                  Delivery Address & Payment
                </h3>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={address.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary text-text font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Indian Mobile (+91)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">+91</span>
                      <input 
                        type="tel" 
                        name="phone"
                        value={address.phone}
                        onChange={handleInputChange}
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        className="w-full rounded-xl border border-border bg-background pl-11 pr-3 py-2 text-xs outline-none focus:border-primary text-text font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Delivery Address</label>
                    <input 
                      type="text" 
                      name="addressLine"
                      value={address.addressLine}
                      onChange={handleInputChange}
                      required
                      placeholder="Flat No, Street details, Landmark"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary text-text font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">City</label>
                      <select 
                        value={address.city}
                        onChange={(e) => handleCityChange(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-2.5 py-2 text-xs outline-none focus:border-primary text-text font-semibold"
                      >
                        {indianCities.map(item => (
                          <option key={item.city} value={item.city}>{item.city}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">State</label>
                      <input 
                        type="text" 
                        name="state"
                        value={address.state}
                        readOnly
                        className="w-full rounded-xl border border-border bg-zinc-100 dark:bg-zinc-800 px-3 py-2 text-xs outline-none text-zinc-400 font-semibold cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Indian 6-digit PIN Code</label>
                    <input 
                      type="text" 
                      name="pinCode"
                      value={address.pinCode}
                      onChange={handleInputChange}
                      required
                      maxLength={6}
                      placeholder="e.g. 110001"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary text-text font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Payment Option</label>
                    <select 
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-2.5 py-2 text-xs outline-none focus:border-primary text-text font-semibold"
                    >
                      <option value="UPI">GooglePay / PhonePe (UPI)</option>
                      <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                      <option value="NetBanking">Indian NetBanking</option>
                    </select>
                  </div>

                </div>

                <button 
                  type="submit"
                  disabled={hasOutOfStock}
                  className={`w-full rounded-full py-3 font-bold text-xs text-white shadow-lg transition-all mt-4 cursor-pointer ${
                    hasOutOfStock
                      ? 'bg-zinc-400 cursor-not-allowed'
                      : 'bg-primary hover:scale-103 active:scale-97'
                  }`}
                >
                  {hasOutOfStock ? 'Remove Out of Stock Items to Order' : `Place Order (₹${grandTotal.toLocaleString('en-IN')})`}
                </button>

              </form>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
