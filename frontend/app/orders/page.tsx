'use client';

import React, { useEffect } from 'react';
import { useStore, Order } from '../../src/context/StoreContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FiPackage, 
  FiTruck, 
  FiClock, 
  FiMapPin, 
  FiCheckCircle, 
  FiArrowLeft,
  FiShoppingBag
} from 'react-icons/fi';

export default function OrdersPage() {
  const { orders, isLoggedIn } = useStore();
  const router = useRouter();

  // Guard routing: redirect to /auth if not logged in
  useEffect(() => {
    const savedLoggedIn = localStorage.getItem('nexcart-logged-in');
    const checkedLoggedIn = savedLoggedIn ? JSON.parse(savedLoggedIn) : false;
    if (!checkedLoggedIn) {
      router.push('/auth?redirect=/orders');
    }
  }, [isLoggedIn, router]);

  // 1. Defined Order Status Flow Timeline steps
  const trackingSteps = [
    { key: 'Pending', label: 'Pending', desc: 'Order placed by buyer', icon: FiClock },
    { key: 'Confirmed', label: 'Confirmed', desc: 'Seller accepted order', icon: FiCheckCircle },
    { key: 'Packed', label: 'Packed', desc: 'Items packed in warehouse', icon: FiPackage },
    { key: 'Shipped', label: 'Shipped', desc: 'In transit via courier', icon: FiTruck },
    { key: 'Out For Delivery', label: 'Out For Delivery', desc: 'Nearby delivery hub', icon: FiMapPin },
    { key: 'Delivered', label: 'Delivered', desc: 'Successfully received', icon: FiShoppingBag }
  ];

  // Helper to determine the current step index of the order status
  const getStatusIndex = (status: string) => {
    return trackingSteps.findIndex(s => s.key === status);
  };

  // 2. Default mock order to display if user has placed zero orders yet
  // This guarantees they immediately see a gorgeous timeline and stats!
  const demoOrders: Order[] = [
    {
      id: 'OD827415',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
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
      gst: 882, // 18% GST
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
      status: 'Shipped' // In transit status!
    }
  ];

  // Merge placed orders and demo orders
  const allOrders = orders.length > 0 ? orders : demoOrders;

  return (
    <div className="min-h-screen bg-background text-text py-12 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Dashboard</span>
            <h1 className="text-3xl font-extrabold tracking-tight">Order Tracking</h1>
          </div>
          <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-primary transition-colors">
            <FiArrowLeft /> Back to Store
          </Link>
        </div>

        {/* Orders Stack */}
        <div className="space-y-10">
          {allOrders.map((order) => {
            const currentStatusIndex = getStatusIndex(order.status);

            return (
              <div 
                key={order.id}
                className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs"
              >
                
                {/* 1. Order Card Header details */}
                <div className="bg-background/40 border-b border-border/80 p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs sm:text-sm font-semibold text-zinc-500">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400">Order ID</p>
                    <p className="text-primary font-bold mt-0.5">{order.id}</p>
                  </div>
                  
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400">Date Placed</p>
                    <p className="text-text mt-0.5">{order.date}</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400">Total Amount</p>
                    <p className="text-text mt-0.5">₹{order.grandTotal.toLocaleString('en-IN')}</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400">Payment Option</p>
                    <p className="text-text mt-0.5">{order.paymentMethod}</p>
                  </div>
                </div>

                {/* 2. Order items purchased & Address layout */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-border/60">
                  
                  {/* Purchased items list (7 Columns) */}
                  <div className="lg:col-span-7 space-y-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Purchased Items</p>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="h-14 w-14 rounded-xl overflow-hidden bg-background flex-shrink-0">
                          <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-text line-clamp-1">{item.product.name}</h4>
                          <div className="flex items-center gap-4 text-xs text-zinc-400 font-semibold mt-0.5">
                            <span>Qty: {item.quantity}</span>
                            <span>₹{item.product.price.toLocaleString('en-IN')} each</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Location box (5 Columns) */}
                  <div className="lg:col-span-5 rounded-2xl bg-background/50 border border-border/80 p-4 space-y-3.5 text-xs font-semibold text-zinc-500">
                    <div className="flex items-center gap-1.5 text-text border-b border-border/55 pb-2">
                      <FiMapPin className="text-primary text-sm" />
                      <span className="font-bold text-xs uppercase tracking-wider">Delivery Location</span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-text font-bold">{order.address.fullName}</p>
                      <p className="mt-0.5">{order.address.addressLine}</p>
                      <p>{order.address.city}, {order.address.state} - <span className="font-bold text-text">{order.address.pinCode}</span></p>
                      <p className="text-zinc-400 mt-1 block">Contact: {order.address.phone}</p>
                    </div>
                  </div>

                </div>

                {/* 3. Live tracking timeline bar */}
                <div className="p-6 bg-card">
                  <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-3">
                    <FiClock className="text-primary text-base animate-pulse" />
                    <span className="font-bold text-xs uppercase tracking-widest text-zinc-400">Live Status:</span>
                    <span className="rounded bg-primary/10 px-2.5 py-0.5 text-xs text-primary font-bold">{order.status}</span>
                  </div>

                  {/* Timeline grid timeline tracker */}
                  <div className="relative">
                    {/* Horizontal connector line */}
                    <div className="absolute top-4 left-6 right-6 h-1 bg-border -z-0 hidden md:block" />
                    <div 
                      className="absolute top-4 left-6 h-1 bg-primary -z-0 hidden md:block transition-all duration-500" 
                      style={{ 
                        width: `${(currentStatusIndex / (trackingSteps.length - 1)) * 100}%` 
                      }} 
                    />

                    {/* Timeline steps grid */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
                      {trackingSteps.map((step, idx) => {
                        const isCompleted = idx <= currentStatusIndex;
                        const isCurrent = idx === currentStatusIndex;
                        const StepIcon = step.icon;

                        return (
                          <div key={step.key} className="flex md:flex-col items-center gap-3 md:gap-0 md:text-center group">
                            
                            {/* Bullet Circle */}
                            <div 
                              className={`h-9 w-9 rounded-full flex items-center justify-center border-2 shadow-xs transition-all duration-300 md:mb-3 flex-shrink-0 relative ${
                                isCompleted 
                                  ? 'bg-primary border-primary text-white' 
                                  : 'bg-card border-border text-zinc-400'
                              } ${isCurrent ? 'ring-4 ring-primary/20 scale-105 animate-pulse' : ''}`}
                            >
                              <StepIcon className="text-base" />
                            </div>

                            {/* Details text */}
                            <div className="text-left md:text-center space-y-0.5">
                              <p className={`text-xs font-extrabold transition-colors ${
                                isCompleted ? 'text-text' : 'text-zinc-400'
                              }`}>
                                {step.label}
                              </p>
                              <p className="text-[10px] text-zinc-400 font-semibold leading-normal md:max-w-[110px] md:mx-auto">
                                {step.desc}
                              </p>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}