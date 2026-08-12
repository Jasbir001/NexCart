'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  image?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: string;
  images: string[]; 
  description: string;
  stock: number;
  badge?: string;
  specs: Record<string, string>;
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  gst: number;
  deliveryCharge: number;
  grandTotal: number;
  address: OrderAddress;
  paymentMethod: string;
  status: 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out For Delivery' | 'Delivered' | 'Cancelled';
}

export interface StoreOffer {
  id: string;
  title: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minQuantity: number;
  minOrderValue: number;
  description: string;
  isActive: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  photo: string;
  memberSince: string;
}

export interface RegisteredUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  photo: string;
  memberSince: string;
  isAdmin?: boolean;
}

export interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  landmark?: string;
  isDefault: boolean;
}

export interface CouponItem {
  code: string;
  discount: string;
  minSpend: number;
  description: string;
  expiryDate: string;
}

export interface RewardTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
}

export interface CouponsAndRewards {
  available: CouponItem[];
  used: string[];
  rewardPoints: number;
  cashbackHistory: RewardTransaction[];
}

export interface SavedPayment {
  id: string;
  type: 'upi' | 'card';
  label: string;
  details: string;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQty: (productId: number, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  placeOrder: (address: OrderAddress, paymentMethod: string) => Order;
  clearCart: () => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  appliedCoupon: string | null;
  couponDiscountPercent: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  userProfile: UserProfile;
  updateUserProfile: (profileData: Partial<UserProfile>) => void;
  savedAddresses: SavedAddress[];
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  editAddress: (id: string, address: Omit<SavedAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  couponsAndRewards: CouponsAndRewards;
  savedPayments: SavedPayment[];
  addSavedPayment: (payment: Omit<SavedPayment, 'id'>) => void;
  deleteSavedPayment: (id: string) => void;
  recentlyViewed: number[];
  addRecentlyViewed: (productId: number) => void;
  addProductReview: (productId: number, rating: number, text: string, name: string, image?: string) => void;
  logoutUser: () => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  authToken: string | null;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  loginUserAction: (emailOrPhone: string, password: string) => boolean;
  registerUserAction: (name: string, phone: string, email: string, password: string) => boolean;
  
  // Admin Features: Order status update, Product stock control, Manual Offer system
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  toggleProductStock: (productId: number, setStock?: number) => void;
  manualOffers: StoreOffer[];
  addOffer: (offer: Omit<StoreOffer, 'id'>) => void;
  updateOffer: (id: string, offerData: Partial<StoreOffer>) => void;
  deleteOffer: (id: string) => void;
  toggleOfferActive: (id: string) => void;
  getBestApplicableOffer: (cartItems: CartItem[], subtotal: number) => { offer: StoreOffer | null; discountAmount: number };
}


const StoreContext = createContext<StoreContextType | undefined>(undefined);

const indianProducts: Product[] = [
  {
    id: 1,
    name: 'boAt Nirvana Ion ANC Wireless Earbuds',
    price: 2999,
    originalPrice: 3999,
    rating: 4.8,
    reviewsCount: 142,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Experience absolute sound with boAt Nirvana Ion. Featuring Active Noise Cancellation up to 32dB, massive 120-hour playback time, crystal clear calls with quad mics, and signature boAt deep bass.',
    stock: 15,
    badge: 'Best Seller',
    specs: {
      'Brand': 'boAt',
      'Model': 'Nirvana ANC',
      'Battery Life': '120 Hours Total',
      'Noise Cancellation': 'Yes (Up to 32dB)',
      'Warranty': '1 Year Domestic Warranty'
    },
    reviews: [
      { id: 'r1', name: 'Aarav Sharma', rating: 5, text: 'Amazing sound quality and great battery life. ANC works perfectly in Delhi Metro crowd!', date: '2026-05-15', verified: true, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&auto=format&fit=crop&q=80' },
      { id: 'r2', name: 'Priya Patel', rating: 4, text: 'Bass is very deep. Fitting is good, but white color gets dirty easily.', date: '2026-05-20', verified: true },
      { id: 'r3', name: 'Rahul Verma', rating: 5, text: 'Massive battery. Truly Nirvana!', date: '2026-05-28', verified: false }
    ]
  },
  {
    id: 2,
    name: 'Titan Neo Chronograph Premium Analog Watch',
    price: 7495,
    originalPrice: 9995,
    rating: 4.9,
    reviewsCount: 88,
    category: 'Watches',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Titan Neo Chronograph watch for men is a classic masterpiece. Crafted with a premium silver metal strap, royal blue round dial, built-in date window, and 50m water resistance. A perfect wear for corporate and wedding parties.',
    stock: 8,
    badge: 'Premium',
    specs: {
      'Brand': 'Titan',
      'Series': 'Neo Chronograph',
      'Strap Material': 'Stainless Steel',
      'Water Resistance': '50 Meters',
      'Warranty': '2 Years Manufacturer Warranty'
    },
    reviews: [
      { id: 'r4', name: 'Amit Sengupta', rating: 5, text: 'Very royal look. Titan never fails to impress. Completely worth the price.', date: '2026-05-10', verified: true, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80' },
      { id: 'r5', name: 'Rohan Deshmukh', rating: 5, text: 'Ideal chronograph dial. Looks premium on standard wrist sizes.', date: '2026-05-22', verified: true }
    ]
  },
  {
    id: 3,
    name: 'Red Tape Classic Sporty Comfort Sneakers',
    price: 1899,
    originalPrice: 4799,
    rating: 4.7,
    reviewsCount: 210,
    category: 'Shoes',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Step into absolute comfort with Red Tape sneakers. Designed with a memory foam cushioned sole, premium breathable PU upper, stable grip sole, and lightweight design. Recommended for casual daily college or office walks.',
    stock: 25,
    badge: '30% OFF',
    specs: {
      'Brand': 'Red Tape',
      'Material': 'Synthetic PU upper',
      'Sole Material': 'Eva / Rubber',
      'Cushioning': 'Memory Foam Tech',
      'Closure': 'Lace-Up'
    },
    reviews: [
      { id: 'r6', name: 'Sneha Reddy', rating: 4, text: 'Very comfortable sneakers. Soft cushioning. Fit is exact.', date: '2026-05-12', verified: true },
      { id: 'r7', name: 'Vikram Malhotra', rating: 5, text: 'Best sneakers under 2000 rupees. Red Tape memory foam is exceptionally soft.', date: '2026-05-25', verified: true, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 4,
    name: 'Mokobara The Transit Ergonomic Workpack',
    price: 4999,
    originalPrice: 6999,
    rating: 4.6,
    reviewsCount: 95,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524498250428-ec03307248c8?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Mokobara Transit backpack is built for smart travelers. Features a dedicated 16-inch padded laptop compartment, integrated USB charging socket, hidden security passport pocket, and sleek water-resistant fabric.',
    stock: 12,
    specs: {
      'Brand': 'Mokobara',
      'Capacity': '25 Litres',
      'Laptop Slot': 'Up to 16 Inches',
      'Material': 'Water-Resistant Premium Nylon',
      'Warranty': '1 Year mokobara Warranty'
    },
    reviews: [
      { id: 'r8', name: 'Divya Iyer', rating: 5, text: 'Extremely aesthetic and neat design. Holds my Macbook Pro securely.', date: '2026-05-02', verified: true, image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=300&auto=format&fit=crop&q=80' },
      { id: 'r9', name: 'Karthik Nair', rating: 4, text: 'Nice pockets. Highly functional. Price is slightly premium, but build quality is amazing.', date: '2026-05-18', verified: true }
    ]
  },
  {
    id: 5,
    name: 'Noise ColorFit Pulse 3 Smartwatch',
    price: 1999,
    originalPrice: 2999,
    rating: 4.5,
    reviewsCount: 312,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517502884422-41eaaced0168?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Stay connected with the Noise ColorFit Pulse 3. Features a large 1.96-inch HD display, bluetooth calling, SpO2 sensor, heart rate tracking, 100+ sports modes, and up to 7 days of long battery life.',
    stock: 30,
    badge: 'Popular',
    specs: {
      'Brand': 'Noise',
      'Screen Size': '1.96 Inches TFT HD',
      'Calling': 'Bluetooth Handfree Calling',
      'Battery': 'Up to 7 Days Pack',
      'Waterproof': 'IP68 Certified'
    },
    reviews: [
      { id: 'r10', name: 'Sanjay Dutt', rating: 4, text: 'Calling is clear. Screen is bright under Indian hot sun. Value for money.', date: '2026-05-14', verified: true },
      { id: 'r11', name: 'Ananya Sen', rating: 5, text: 'Very nice tracker. Accurate steps counting. Dial feels light on hand.', date: '2026-05-24', verified: true }
    ]
  },
  {
    id: 6,
    name: 'Wildhorn Premium Leather RFID Wallet',
    price: 699,
    originalPrice: 1299,
    rating: 4.8,
    reviewsCount: 64,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1627124718414-0da7a551c19b?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Wildhorn wallet is handcrafted with 100% genuine hunter leather. Includes dynamic RFID blocking protection to secure your Indian bank debit/credit cards, 6 card slots, and dual cash slots.',
    stock: 50,
    specs: {
      'Brand': 'Wildhorn',
      'Material': '100% Genuine Leather',
      'Technology': 'RFID Blocking Secure',
      'Slots': '6 Card, 2 Cash Slots',
      'Warranty': '6 Months leather warranty'
    },
    reviews: [
      { id: 'r12', name: 'Arjun Kapoor', rating: 5, text: 'Pure leather. Authentic texture. Card slots are tight and secure.', date: '2026-05-08', verified: true }
    ]
  },
  {
    id: 7,
    name: 'Maono AU-A04 USB Professional Mic Kit',
    price: 3499,
    originalPrice: 5999,
    rating: 4.7,
    reviewsCount: 127,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1590608897129-79da98d15969?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590608897224-b0a316887556?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'The Maono USB Microphone kit is designed for Indian podcasters, YouTubers, and voiceover artists. Plug-and-play USB connection, premium metal boom arm stand, pop filter, and studio-grade sound capture.',
    stock: 0,
    badge: 'Out of Stock',
    specs: {
      'Brand': 'Maono',
      'Connection': 'USB Plug and Play',
      'Sensor': '16mm Condenser Transducer',
      'Pattern': 'Cardioid Noise Pickup',
      'Inclusions': 'Boom Arm, Shock Mount, Pop Filter'
    },
    reviews: [
      { id: 'r13', name: 'Harish Kumar', rating: 5, text: 'No static noise. Connected instantly to my Windows PC. Perfect for online teaching!', date: '2026-05-05', verified: true }
    ]
  },
  {
    id: 8,
    name: 'FabIndia Premium Slim Fit Cotton Kurta',
    price: 1499,
    originalPrice: 1999,
    rating: 4.4,
    reviewsCount: 78,
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'FabIndia hand-woven pure cotton slim-fit kurta for men. Crafted with light breathable fabric, band collar, elegant wooden buttons, and a clean finish. Fits perfectly for festive celebrations and everyday ethnic wear.',
    stock: 18,
    specs: {
      'Brand': 'FabIndia',
      'Material': '100% Pure Cotton',
      'Collar': 'Mandarin Band Collar',
      'Fit': 'Slim Fit',
      'Care': 'Hand Wash Separately'
    },
    reviews: [
      { id: 'r14', name: 'Meera Deshmukh', rating: 4, text: 'Fabric is very premium. Elegant fitting. Hand washed, color is stable.', date: '2026-05-19', verified: true }
    ]
  },
  {
    id: 9,
    name: 'Minimalist Ceramic Flower Vase Set',
    price: 1299,
    originalPrice: 1999,
    rating: 4.6,
    reviewsCount: 45,
    category: 'Home & Decor',
    images: [
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Handcrafted minimalist ceramic flower vases. Set of 3 vases in warm beige, terracotta, and soft grey. Perfect for modern living room decor, dry flowers, or pampas grass.',
    stock: 12,
    specs: {
      'Material': 'Stoneware Ceramic',
      'Finish': 'Matte Textured',
      'Set Includes': '3 Vases (Small, Medium, Large)'
    },
    reviews: [
      { id: 'r15', name: 'Nisha Gupta', rating: 5, text: 'Very chic and matches my Scandinavian home decor perfectly.', date: '2026-05-25', verified: true }
    ]
  },
  {
    id: 10,
    name: 'Premium Anti-Slip TPE Yoga Mat',
    price: 1499,
    originalPrice: 2499,
    rating: 4.7,
    reviewsCount: 64,
    category: 'Sports & Fitness',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Eco-friendly dual-layer TPE yoga mat with alignment lines. 6mm thickness offers optimal cushioning and joint protection. Waterproof, sweat-resistant, and comes with a carrying strap.',
    stock: 20,
    specs: {
      'Material': 'Eco-Friendly TPE',
      'Thickness': '6mm',
      'Dimensions': '183cm x 61cm',
      'Features': 'Body Alignment System'
    },
    reviews: [
      { id: 'r16', name: 'Anik Sen', rating: 5, text: 'Excellent grip even when sweaty. Highly recommended!', date: '2026-05-27', verified: true }
    ]
  },
  {
    id: 11,
    name: 'Classic Hardcover Dotted Journal & Pen Set',
    price: 699,
    originalPrice: 999,
    rating: 4.8,
    reviewsCount: 32,
    category: 'Books & Stationery',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Premium hardcover bullet journal with 160 pages of 120GSM ink-proof dotted paper. Comes with an elegant gold-accented metal ballpoint pen, expandible back pocket, and double ribbon bookmarks.',
    stock: 30,
    specs: {
      'Paper Weight': '120 GSM',
      'Pages': '160 Pages',
      'Layout': '5mm Dotted Grid',
      'Pen Included': 'Yes'
    },
    reviews: [
      { id: 'r17', name: 'Kavita Das', rating: 5, text: 'The paper is so thick, no ghosting or bleeding even with fountain pens!', date: '2026-05-29', verified: true }
    ]
  }
];

const defaultProfile: UserProfile = {
  name: 'Jasbir Singh',
  email: 'jasbir@example.com',
  phone: '+91 9876543210',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  memberSince: 'June 2026'
};

const defaultAddresses: SavedAddress[] = [
  {
    id: 'addr-1',
    fullName: 'Rahul Sharma',
    phone: '+91 9876543210',
    houseNumber: 'H-12, Sector 62',
    street: 'Golf Course Extension Road',
    city: 'Gurugram',
    state: 'Haryana',
    pinCode: '122001',
    landmark: 'Near Pioneer Square',
    isDefault: true
  },
  {
    id: 'addr-2',
    fullName: 'Jasbir Singh',
    phone: '+91 9876543210',
    houseNumber: 'Flat 405, Tower B',
    street: 'Vikas Marg, Preet Vihar',
    city: 'New Delhi',
    state: 'Delhi',
    pinCode: '110092',
    landmark: 'Opposite Metro Pillar 102',
    isDefault: false
  }
];

const defaultCouponsAndRewards: CouponsAndRewards = {
  available: [
    { code: 'WELCOME20', discount: '20% OFF', minSpend: 1000, description: 'Enjoy 20% discount on your first shopping spree.', expiryDate: '2026-12-31' },
    { code: 'NEXCART10', discount: '10% OFF', minSpend: 500, description: 'Get 10% off on electronics and apparel products.', expiryDate: '2026-09-30' },
    { code: 'FESTIVE15', discount: '15% OFF', minSpend: 1500, description: 'Special festive discount for our premium members.', expiryDate: '2026-08-15' }
  ],
  used: ['FIRSTBUY', 'FREESHIP'],
  rewardPoints: 450,
  cashbackHistory: [
    { id: 'cb-1', date: '2026-05-10', description: 'Cashback on Order #OD827415', amount: 100, type: 'credit' },
    { id: 'cb-2', date: '2026-05-22', description: 'Points redeemed on checkout', amount: 50, type: 'debit' }
  ]
};

const defaultPayments: SavedPayment[] = [
  { id: 'pay-1', type: 'upi', label: 'Google Pay', details: 'jasbir@okaxis' },
  { id: 'pay-2', type: 'card', label: 'HDFC Bank Credit Card', details: 'Visa ending in 4321' }
];

const defaultManualOffers: StoreOffer[] = [
  {
    id: 'off-1',
    title: '5+ Items Combo Special',
    code: 'BUY5GET20',
    discountType: 'percentage',
    discountValue: 20,
    minQuantity: 5,
    minOrderValue: 0,
    description: 'Buy 5 or more items together and get 20% instant discount on total cart!',
    isActive: true
  },
  {
    id: 'off-2',
    title: 'Mega Savings ₹500 OFF',
    code: 'SAVE500',
    discountType: 'fixed',
    discountValue: 500,
    minQuantity: 1,
    minOrderValue: 2999,
    description: 'Get Flat ₹500 OFF on orders above ₹2,999!',
    isActive: true
  },
  {
    id: 'off-3',
    title: 'Festival Delight 15% OFF',
    code: 'FESTIVE15',
    discountType: 'percentage',
    discountValue: 15,
    minQuantity: 2,
    minOrderValue: 1500,
    description: 'Get 15% OFF when purchasing at least 2 items worth ₹1,500+.',
    isActive: true
  }
];

const defaultRegisteredUsers: RegisteredUser[] = [
  {
    name: 'Admin User',
    email: 'admin@nexcart.com',
    phone: '+91 9876543210',
    password: 'admin123',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    memberSince: 'Just now',
    isAdmin: true
  }
];

function readLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

// Helper to create per-user storage keys. Uses guest when no email.
function makeUserKey(base: string, email?: string) {
  if (!email) return `${base}:guest`;
  return `${base}:${encodeURIComponent(email.trim().toLowerCase())}`;
}

const generateOrderId = () => `OD${Math.floor(100000 + Math.random() * 900000)}`;
const AUTO_LOGOUT_TIMEOUT_MS = 5 * 60 * 1000;
const LAST_ACTIVITY_KEY = 'nexcart-last-activity';

const hasSessionExpired = (lastActivityTs: number, nowTs = Date.now()) => {
  return nowTs - lastActivityTs >= AUTO_LOGOUT_TIMEOUT_MS;
};

const readLastActivity = () => {
  if (typeof window === 'undefined') return Date.now();
  const saved = localStorage.getItem(LAST_ACTIVITY_KEY);
  if (!saved) return Date.now();
  const parsed = Number(saved);
  return Number.isFinite(parsed) ? parsed : Date.now();
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => readLocalStorage('nexcart-products', indianProducts));
  const [cart, setCart] = useState<CartItem[]>(() => readLocalStorage('nexcart-cart', []));
  const [wishlist, setWishlist] = useState<Product[]>(() => readLocalStorage('nexcart-wishlist', []));
  const [orders, setOrders] = useState<Order[]>(() => readLocalStorage('nexcart-orders', []));
  const [isCartOpen, setCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);
  const [manualOffers, setManualOffers] = useState<StoreOffer[]>(() => readLocalStorage('nexcart-manual-offers', defaultManualOffers));

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(() => readLocalStorage('nexcart-logged-in', false));
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => readLocalStorage('nexcart-admin', false));
  const [authToken, setAuthToken] = useState<string | null>(() => readLocalStorage('nexcart-token', null));

  // Account management states
  const [userProfile, setUserProfile] = useState<UserProfile>(() => readLocalStorage('nexcart-profile', defaultProfile));
  // Per-user storage: addresses and payments are stored per-user to avoid cross-user visibility
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => readLocalStorage(makeUserKey('nexcart-addresses'), []));
  const [couponsAndRewards, setCouponsAndRewards] = useState<CouponsAndRewards>(() => readLocalStorage('nexcart-rewards', defaultCouponsAndRewards));
  const [savedPayments, setSavedPayments] = useState<SavedPayment[]>(() => readLocalStorage(makeUserKey('nexcart-payments'), []));
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>(() => readLocalStorage('nexcart-recent', []));
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => readLocalStorage('nexcart-users', defaultRegisteredUsers));

  const saveRegisteredUsersToStorage = (users: RegisteredUser[]) => {
    setRegisteredUsers(users);
    localStorage.setItem('nexcart-users', JSON.stringify(users));
  };

  // Ensure default admin exists if users storage is empty (handles prior empty localStorage)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nexcart-users');
      if (!stored) {
        saveRegisteredUsersToStorage(defaultRegisteredUsers);
      } else {
        const parsed: RegisteredUser[] = JSON.parse(stored);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          saveRegisteredUsersToStorage(defaultRegisteredUsers);
        }
      }
    } catch (err) {
      saveRegisteredUsersToStorage(defaultRegisteredUsers);
    }
  }, []);

  const applyCoupon = (code: string): boolean => {
    const formattedCode = code.toUpperCase().trim();
    if (formattedCode === 'NEXCART10') {
      setAppliedCoupon('NEXCART10');
      setCouponDiscountPercent(10);
      return true;
    } else if (formattedCode === 'WELCOME20') {
      setAppliedCoupon('WELCOME20');
      setCouponDiscountPercent(20);
      return true;
    }
    // Check if code matches any active manual offer code
    const matchingOffer = manualOffers.find(o => o.isActive && o.code.toUpperCase() === formattedCode);
    if (matchingOffer) {
      setAppliedCoupon(matchingOffer.code.toUpperCase());
      setCouponDiscountPercent(matchingOffer.discountType === 'percentage' ? matchingOffer.discountValue : 0);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountPercent(0);
  };

  const saveCartToStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('nexcart-cart', JSON.stringify(newCart));
  };

  const saveWishToStorage = (newWish: Product[]) => {
    setWishlist(newWish);
    localStorage.setItem('nexcart-wishlist', JSON.stringify(newWish));
  };

  const saveOrdersToStorage = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('nexcart-orders', JSON.stringify(newOrders));
  };

  const addToCart = (product: Product, quantity = 1) => {
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    let updatedCart: CartItem[] = [];

    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [...cart, { product, quantity }];
    }

    saveCartToStorage(updatedCart);
    setCartOpen(true); // Automatically open Cart Drawer
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter(item => item.product.id !== productId);
    saveCartToStorage(updatedCart);
  };

  const updateCartQty = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updatedCart = cart.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCartToStorage(updatedCart);
  };

  const toggleWishlist = (product: Product) => {
    const isWishlisted = wishlist.some(item => item.id === product.id);
    let updatedWish: Product[] = [];

    if (isWishlisted) {
      updatedWish = wishlist.filter(item => item.id !== product.id);
    } else {
      updatedWish = [...wishlist, product];
    }

    saveWishToStorage(updatedWish);
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some(item => item.id === productId);
  };

  const placeOrder = (address: OrderAddress, paymentMethod: string): Order => {
    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const gst = Math.round(subtotal * 0.18);
    const deliveryCharge = subtotal > 999 ? 0 : 99;
    const grandTotal = subtotal + gst + deliveryCharge;

    const newOrder: Order = {
      id: generateOrderId(),
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      subtotal,
      gst,
      deliveryCharge,
      grandTotal,
      address,
      paymentMethod,
      status: 'Confirmed'
    };

    const updatedOrders = [newOrder, ...orders];
    saveOrdersToStorage(updatedOrders);
    clearCart();
    removeCoupon();

    // Trigger Order Placed Nodemailer Notification Email
    triggerNotificationEmail('placed', newOrder, userProfile.email || 'customer@example.com');

    return newOrder;
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  // Account operations
  const updateUserProfile = (profileData: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...profileData };
    setUserProfile(updated);
    localStorage.setItem('nexcart-profile', JSON.stringify(updated));
  };

  const addAddress = (address: Omit<SavedAddress, 'id'>) => {
    const newAddr: SavedAddress = {
      ...address,
      id: 'addr-' + Date.now(),
      isDefault: savedAddresses.length === 0 ? true : address.isDefault
    };
    let updated = [...savedAddresses];
    if (newAddr.isDefault) {
      updated = updated.map(a => ({ ...a, isDefault: false }));
    }
    updated.push(newAddr);
    setSavedAddresses(updated);
    const key = makeUserKey('nexcart-addresses', userProfile?.email);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const editAddress = (id: string, address: Omit<SavedAddress, 'id'>) => {
    let updated = savedAddresses.map(a => a.id === id ? { ...address, id } : a);
    if (address.isDefault) {
      updated = updated.map(a => a.id === id ? { ...a, isDefault: true } : { ...a, isDefault: false });
    }
    setSavedAddresses(updated);
    const key = makeUserKey('nexcart-addresses', userProfile?.email);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const deleteAddress = (id: string) => {
    const toDelete = savedAddresses.find(a => a.id === id);
    const updated = savedAddresses.filter(a => a.id !== id);
    if (toDelete?.isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    setSavedAddresses(updated);
    const key = makeUserKey('nexcart-addresses', userProfile?.email);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const setDefaultAddress = (id: string) => {
    const updated = savedAddresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    setSavedAddresses(updated);
    const key = makeUserKey('nexcart-addresses', userProfile?.email);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const addSavedPayment = (payment: Omit<SavedPayment, 'id'>) => {
    const newPay = { ...payment, id: 'pay-' + Date.now() };
    const updated = [...savedPayments, newPay];
    setSavedPayments(updated);
    const key = makeUserKey('nexcart-payments', userProfile?.email);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const deleteSavedPayment = (id: string) => {
    const updated = savedPayments.filter(p => p.id !== id);
    setSavedPayments(updated);
    const key = makeUserKey('nexcart-payments', userProfile?.email);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const addRecentlyViewed = (productId: number) => {
    const filtered = recentlyViewed.filter(id => id !== productId);
    const updated = [productId, ...filtered].slice(0, 8);
    setRecentlyViewed(updated);
    localStorage.setItem('nexcart-recent', JSON.stringify(updated));
  };

  const addProductReview = (productId: number, rating: number, text: string, name: string, image?: string) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        const newReview: Review = {
          id: 'rev-' + Date.now(),
          name,
          rating,
          text,
          date: new Date().toISOString().split('T')[0],
          verified: true,
          image
        };
        const updatedReviews = [newReview, ...p.reviews];
        const newRating = Number(((p.rating * p.reviewsCount + rating) / (p.reviewsCount + 1)).toFixed(1));
        return {
          ...p,
          reviews: updatedReviews,
          rating: newRating,
          reviewsCount: p.reviewsCount + 1
        };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem('nexcart-products', JSON.stringify(updatedProducts));
  };

  const loginUserAction = (emailOrPhone: string, password: string): boolean => {
    if (!emailOrPhone || !password) return false;

    const normalized = emailOrPhone.trim().toLowerCase();
    const normalizedPhone = normalized.replace(/\D/g, '');

    // Use registered users list, but fall back to default seed if it's empty.
    const usersToCheck = (registeredUsers && registeredUsers.length > 0) ? registeredUsers : defaultRegisteredUsers;

    const matchedUser = usersToCheck.find((user) => {
      const userEmail = user.email.trim().toLowerCase();
      const userPhone = user.phone.replace(/\D/g, '');
      return userEmail === normalized || userPhone === normalizedPhone;
    });

    if (!matchedUser || matchedUser.password !== password) {
      // If we had no registered users but matched against default, ensure it's persisted for next attempts
      if ((!registeredUsers || registeredUsers.length === 0) && usersToCheck === defaultRegisteredUsers) {
        try {
          saveRegisteredUsersToStorage(defaultRegisteredUsers);
        } catch (err) {
          // ignore
        }
      }
      return false;
    }

    setIsLoggedIn(true);
    localStorage.setItem('nexcart-logged-in', 'true');
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));

    const isAdminUser = matchedUser.email.toLowerCase() === 'admin@nexcart.com';
    setIsAdmin(isAdminUser);
    localStorage.setItem('nexcart-admin', JSON.stringify(isAdminUser));

    const updatedProfile: UserProfile = {
      name: matchedUser.name,
      email: matchedUser.email,
      phone: matchedUser.phone,
      photo: matchedUser.photo,
      memberSince: matchedUser.memberSince
    };
    setUserProfile(updatedProfile);
    localStorage.setItem('nexcart-profile', JSON.stringify(updatedProfile));

    // Load per-user addresses/payments (if any) instead of global defaults
    const userAddrKey = makeUserKey('nexcart-addresses', matchedUser.email);
    const userPaysKey = makeUserKey('nexcart-payments', matchedUser.email);
    setSavedAddresses(readLocalStorage(userAddrKey, []));
    setSavedPayments(readLocalStorage(userPaysKey, []));
    setCouponsAndRewards(defaultCouponsAndRewards);

    return true;
  };

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Email Notification Helper Triggers (Nodemailer API)
  const triggerNotificationEmail = async (event: string, order: Order, recipientEmail?: string) => {
    try {
      await fetch(`${apiBaseUrl}/api/email/order-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          order,
          recipientEmail: recipientEmail || userProfile.email || 'customer@nexcart.com'
        })
      });
    } catch (err) {
      console.warn('Nodemailer API trigger note:', err);
    }
  };

  const triggerWelcomeEmail = async (name: string, email: string) => {
    try {
      await fetch(`${apiBaseUrl}/api/email/welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
    } catch (err) {
      console.warn('Welcome Email API trigger note:', err);
    }
  };

  const registerUserAction = (name: string, phone: string, email: string, password: string): boolean => {
    if (!name || !phone || !email || !password) return false;

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.replace(/\D/g, '');

    const existingUser = registeredUsers.find((user) => {
      return user.email.trim().toLowerCase() === normalizedEmail || user.phone.replace(/\D/g, '') === normalizedPhone;
    });

    if (existingUser) {
      return false;
    }

    const formattedPhone = phone.startsWith('+91') ? phone : '+91 ' + normalizedPhone;
    const newUser: RegisteredUser = {
      name,
      email: normalizedEmail,
      phone: formattedPhone,
      password,
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      memberSince: 'Just now',
      isAdmin: normalizedEmail === 'admin@nexcart.com'
    };

    saveRegisteredUsersToStorage([newUser, ...registeredUsers]);

    setIsLoggedIn(true);
    localStorage.setItem('nexcart-logged-in', 'true');
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));

    const isAdminUser = newUser.isAdmin ?? false;
    setIsAdmin(isAdminUser);
    localStorage.setItem('nexcart-admin', JSON.stringify(isAdminUser));

    const updatedProfile: UserProfile = {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      photo: newUser.photo,
      memberSince: newUser.memberSince
    };
    setUserProfile(updatedProfile);
    localStorage.setItem('nexcart-profile', JSON.stringify(updatedProfile));

    // New user: ensure per-user storage keys exist and load empty lists
    const userAddrKey = makeUserKey('nexcart-addresses', newUser.email);
    const userPaysKey = makeUserKey('nexcart-payments', newUser.email);
    if (!localStorage.getItem(userAddrKey)) localStorage.setItem(userAddrKey, JSON.stringify([]));
    if (!localStorage.getItem(userPaysKey)) localStorage.setItem(userPaysKey, JSON.stringify([]));
    setSavedAddresses([]);
    setSavedPayments([]);
    setCouponsAndRewards(defaultCouponsAndRewards);

    triggerWelcomeEmail(name, email);

    return true;
  };

  const logoutUser = useCallback(() => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setAuthToken(null);
    localStorage.setItem('nexcart-logged-in', 'false');
    localStorage.removeItem('nexcart-token');
    localStorage.removeItem('nexcart-admin');
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    
    setUserProfile({
      name: 'Guest User',
      email: 'guest@example.com',
      phone: '',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      memberSince: 'Not logged in'
    });
    setSavedAddresses([]);
    setSavedPayments([]);
    setCouponsAndRewards({
      available: [],
      used: [],
      rewardPoints: 0,
      cashbackHistory: []
    });
    clearCart();
    localStorage.removeItem('nexcart-profile');
    localStorage.removeItem('nexcart-addresses');
    localStorage.removeItem('nexcart-payments');
    localStorage.removeItem('nexcart-rewards');
    localStorage.removeItem('nexcart-cart');
  }, [clearCart]);

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      return;
    }

    const checkForAutoLogout = () => {
      if (hasSessionExpired(readLastActivity())) {
        logoutUser();
        return true;
      }
      return false;
    };

    if (checkForAutoLogout()) {
      return;
    }

    markUserActivity();

    const activityEvents = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart', 'mousedown'];
    const handleActivity = () => markUserActivity();

    activityEvents.forEach((eventName) => window.addEventListener(eventName, handleActivity));
    const sessionInterval = window.setInterval(checkForAutoLogout, 30_000);

    return () => {
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, handleActivity));
      window.clearInterval(sessionInterval);
    };
  }, [isLoggedIn, logoutUser]);

  // -------------------------------------------------------------
  // Admin Features: Order status update, Product stock control, Manual Offer System
  // -------------------------------------------------------------
  
  const saveOffersToStorage = (newOffers: StoreOffer[]) => {
    setManualOffers(newOffers);
    localStorage.setItem('nexcart-manual-offers', JSON.stringify(newOffers));
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    saveOrdersToStorage(updatedOrders);

    // Find updated order object and trigger status email notification
    const targetOrder = updatedOrders.find(o => o.id === orderId);
    if (targetOrder) {
      triggerNotificationEmail(newStatus, targetOrder, userProfile.email || 'customer@nexcart.com');
    }
  };

  const toggleProductStock = (productId: number, setStock?: number) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        const newStock = setStock !== undefined ? setStock : (p.stock > 0 ? 0 : 10);
        return { ...p, stock: newStock };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem('nexcart-products', JSON.stringify(updatedProducts));
  };

  const addOffer = (offerData: Omit<StoreOffer, 'id'>) => {
    const newOffer: StoreOffer = {
      ...offerData,
      id: 'off-' + Date.now()
    };
    const updated = [newOffer, ...manualOffers];
    saveOffersToStorage(updated);
  };

  const updateOffer = (id: string, offerData: Partial<StoreOffer>) => {
    const updated = manualOffers.map(o => o.id === id ? { ...o, ...offerData } : o);
    saveOffersToStorage(updated);
  };

  const deleteOffer = (id: string) => {
    const updated = manualOffers.filter(o => o.id !== id);
    saveOffersToStorage(updated);
  };

  const toggleOfferActive = (id: string) => {
    const updated = manualOffers.map(o => o.id === id ? { ...o, isActive: !o.isActive } : o);
    saveOffersToStorage(updated);
  };

  const getBestApplicableOffer = (cartItems: CartItem[], subtotal: number) => {
    const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const activeOffers = manualOffers.filter(o => o.isActive);

    let bestOffer: StoreOffer | null = null;
    let maxDiscount = 0;

    for (const offer of activeOffers) {
      if (totalQty >= offer.minQuantity && subtotal >= offer.minOrderValue) {
        let discount = 0;
        if (offer.discountType === 'percentage') {
          discount = Math.round((subtotal * offer.discountValue) / 100);
        } else {
          discount = offer.discountValue;
        }

        if (discount > maxDiscount) {
          maxDiscount = discount;
          bestOffer = offer;
        }
      }
    }

    return { offer: bestOffer, discountAmount: maxDiscount };
  };

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      wishlist,
      orders,
      addToCart,
      removeFromCart,
      updateCartQty,
      toggleWishlist,
      isInWishlist,
      placeOrder,
      clearCart,
      isCartOpen,
      setCartOpen,
      appliedCoupon,
      couponDiscountPercent,
      applyCoupon,
      removeCoupon,
      userProfile,
      updateUserProfile,
      savedAddresses,
      addAddress,
      editAddress,
      deleteAddress,
      setDefaultAddress,
      couponsAndRewards,
      savedPayments,
      addSavedPayment,
      deleteSavedPayment,
      recentlyViewed,
      addRecentlyViewed,
      addProductReview,
      logoutUser,
      isLoggedIn,
      isAdmin,
      authToken,
      isAuthModalOpen,
      setAuthModalOpen,
      loginUserAction,
      registerUserAction,
      updateOrderStatus,
      toggleProductStock,
      manualOffers,
      addOffer,
      updateOffer,
      deleteOffer,
      toggleOfferActive,
      getBestApplicableOffer
    }}>
      {children}
    </StoreContext.Provider>
  );
}

// 4. Hook to use context
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
