 'use client';

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { useIsClient } from '../hooks/useIsClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiHeart, 
  FiUser, 
  FiSun, 
  FiMoon, 
  FiMenu, 
  FiX, 
  FiChevronDown,
  FiMapPin,
  FiGift,
  FiSettings,
  FiLogOut,
  FiInfo,
  FiShield
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const mounted = useIsClient();

  // 1. Get global cart and wishlist items from the Store Context
  const { cart, wishlist, setCartOpen, userProfile, logoutUser, isLoggedIn, isAdmin } = useStore();
  
  // 2. React states for menus
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // 3. Dynamically compute the total quantity of items in the cart
  // Guard with `mounted` so server/client initial render stays consistent
  const cartCount = mounted ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  // Wishlist count is simply the length of the wishlist array
  const wishlistCount = mounted ? wishlist.length : 0;

  const categories = [
    'Electronics',
    'Fashion',
    'Shoes',
    'Watches',
    'Accessories',
    'Home & Decor',
    'Sports & Fitness',
    'Books & Stationery'
  ];

  // 4. Handle search form submit (routes to home page search query)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}#featured`);
      setIsMobileMenuOpen(false); // Close mobile drawer if open
    } else {
      router.push('/');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-1.5 text-2xl font-bold tracking-tight text-primary cursor-pointer">
              <span>Nex</span>
              <span className="text-text font-medium">Cart</span>
            </Link>
          </div>

          {/* Navigation Links (Desktop only) */}
          <div className="hidden lg:flex items-center gap-6 font-medium text-sm">
            {/* Category Dropdown Trigger */}
            <div className="relative">
              <button 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
              >
                Categories <FiChevronDown className={`transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Simple Category List Dropdown box */}
              {isCategoryOpen && (
                <div className="absolute left-0 mt-3 w-48 rounded-xl border border-border bg-card p-1 shadow-lg">
                  {categories.map((cat) => (
                    <Link 
                      key={cat} 
                      href={`/categories/${cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                      onClick={() => setIsCategoryOpen(false)}
                      className="block rounded-lg px-4 py-2 hover:bg-background hover:text-primary transition-colors cursor-pointer"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/#featured" className="hover:text-primary transition-colors">Featured</Link>
            <Link href="/#bestsellers" className="hover:text-primary transition-colors">Best Sellers</Link>
          </div>

          {/* Search Bar Input Form (Desktop/Tablet only) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-4 text-xs outline-none focus:border-primary transition-all text-text"
            />
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary text-sm cursor-pointer border-none bg-transparent outline-none p-0 flex items-center">
              <FiSearch />
            </button>
          </form>

          {/* Action Icons Panel */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-background transition-colors text-text/80 hover:text-primary cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
            </button>

            {/* Wishlist Button with Dynamic Count */}
            <Link 
              href="/wishlist"
              className="p-2 rounded-full hover:bg-background transition-colors text-text/80 hover:text-primary relative cursor-pointer"
            >
              <FiHeart className="text-lg" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button with Dynamic Count */}
            <button 
              onClick={() => setCartOpen(true)}
              className="p-2 rounded-full hover:bg-background transition-colors text-text/80 hover:text-primary relative cursor-pointer border-none bg-transparent outline-none flex items-center"
            >
              <FiShoppingCart className="text-lg" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Profile Dropdown (Desktop only) */}
            <div className="relative hidden sm:block">
              {!mounted || !isLoggedIn ? (
                // Guest Menu Button
                <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-bold text-xs cursor-pointer border-none outline-none"
                >
                  <FiUser />
                  <span>Account</span>
                  <FiChevronDown className={`transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                // Logged-in Menu Button
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-bold text-xs cursor-pointer border-none outline-none"
                >
                    {mounted && userProfile.photo ? (
                      <img src={userProfile.photo} alt={userProfile.name} className="h-5 w-5 rounded-full object-cover" />
                    ) : (
                      <FiUser />
                    )}
                    <span className="max-w-[80px] truncate">{mounted ? userProfile.name.split(' ')[0] : 'Account'}</span>
                  <FiChevronDown className={`transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              )}

              {isProfileDropdownOpen && (
                !isLoggedIn ? (
                  // Guest Dropdown Options
                  <div className="absolute right-0 mt-3 w-48 rounded-2xl border border-border bg-card p-2 shadow-xl z-50 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                    <Link 
                      href="/auth?tab=login" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-background hover:text-primary transition-colors cursor-pointer"
                    >
                      <FiUser className="text-sm" />
                      <span>Login</span>
                    </Link>

                    <Link 
                      href="/auth?tab=register" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-background hover:text-primary transition-colors cursor-pointer"
                    >
                      <FiUser className="text-sm" />
                      <span>Register</span>
                    </Link>

                    <button 
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        toast('Help Center: Call 1800-NEX-CART for support.', { icon: '📞' });
                      }}
                      className="w-full text-left flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-background hover:text-primary transition-colors cursor-pointer border-none bg-transparent outline-none mt-1 pt-2 border-t border-border/40"
                    >
                      <FiInfo className="text-sm" />
                      <span>Help Center</span>
                    </button>
                  </div>
                ) : (
                  // Logged-in Dropdown Options
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-border bg-card p-2 shadow-xl z-50 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-border/60 mb-1">
                      <p className="text-xs font-bold text-text truncate">{userProfile.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{userProfile.email}</p>
                    </div>
                    
                    <Link 
                      href="/account?tab=profile" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-background hover:text-primary transition-colors cursor-pointer"
                    >
                      <FiUser className="text-sm" />
                      <span>My Profile</span>
                    </Link>

                    <Link 
                      href="/account?tab=orders" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-background hover:text-primary transition-colors cursor-pointer"
                    >
                      <FiShoppingCart className="text-sm" />
                      <span>My Orders</span>
                    </Link>

                    <Link 
                      href="/wishlist" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-background hover:text-primary transition-colors cursor-pointer"
                    >
                      <FiHeart className="text-sm" />
                      <span>Wishlist</span>
                    </Link>

                    <Link 
                      href="/account?tab=addresses" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-background hover:text-primary transition-colors cursor-pointer"
                    >
                      <FiMapPin className="text-sm" />
                      <span>Saved Addresses</span>
                    </Link>

                    <Link 
                      href="/account?tab=coupons" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-background hover:text-primary transition-colors cursor-pointer"
                    >
                      <FiGift className="text-sm" />
                      <span>Coupons & Rewards</span>
                    </Link>

                    <Link 
                      href="/account?tab=settings" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-background hover:text-primary transition-colors cursor-pointer"
                    >
                      <FiSettings className="text-sm" />
                      <span>Settings</span>
                    </Link>

                    {isAdmin && (
                      <Link 
                        href="/admin" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        <FiShield className="text-sm" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button 
                      onClick={() => {
                        logoutUser();
                        setIsProfileDropdownOpen(false);
                        toast.success('Logged out successfully.');
                        router.push('/');
                      }}
                      className="w-full text-left flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer border-none bg-transparent outline-none mt-1 pt-2 border-t border-border/40"
                    >
                      <FiLogOut className="text-sm" />
                      <span>Logout</span>
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Hamburger Button (Mobile only) */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full hover:bg-background transition-colors text-text/80 hover:text-primary lg:hidden cursor-pointer"
            >
              {isMobileMenuOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (Renders only when open) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card py-4 px-6 space-y-4">
          
          {/* Mobile Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary transition-all text-text"
            />
            <button type="submit" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary border-none bg-transparent outline-none p-0 flex items-center">
              <FiSearch />
            </button>
          </form>
          
          {/* Categories Links */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Categories</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link 
                  key={cat} 
                  href={`/categories/${cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg bg-background px-3 py-2 text-xs font-semibold hover:text-primary transition-colors text-center cursor-pointer"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Drawer Account Links */}
          <div className="border-t border-border pt-3 space-y-2.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">My Account</p>
            {!isLoggedIn ? (
              // Guest Mobile Links
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <Link href="/auth?tab=login" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg bg-background px-3 py-2 hover:text-primary transition-colors text-center cursor-pointer">
                  Login
                </Link>
                <Link href="/auth?tab=register" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg bg-background px-3 py-2 hover:text-primary transition-colors text-center cursor-pointer">
                  Register
                </Link>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    toast('Help Center: Call 1800-NEX-CART for support.', { icon: '📞' });
                  }}
                  className="block w-full rounded-lg bg-background px-3 py-2 hover:text-primary transition-colors text-center cursor-pointer text-xs font-semibold border-none outline-none col-span-2"
                >
                  Help Center
                </button>
              </div>
            ) : (
              // Logged-In Mobile Links
              <>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <Link href="/account?tab=profile" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg bg-background px-3 py-2 hover:text-primary transition-colors text-center cursor-pointer">
                    Profile
                  </Link>
                  <Link href="/account?tab=orders" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg bg-background px-3 py-2 hover:text-primary transition-colors text-center cursor-pointer">
                    Orders
                  </Link>
                  <Link href="/account?tab=addresses" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg bg-background px-3 py-2 hover:text-primary transition-colors text-center cursor-pointer">
                    Addresses
                  </Link>
                  <Link href="/account?tab=coupons" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg bg-background px-3 py-2 hover:text-primary transition-colors text-center cursor-pointer">
                    Coupons
                  </Link>
                  <Link href="/account?tab=settings" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg bg-background px-3 py-2 hover:text-primary transition-colors text-center cursor-pointer col-span-2">
                    Settings
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg bg-primary/10 text-primary px-3 py-2 hover:bg-primary hover:text-white transition-colors text-center cursor-pointer col-span-2 font-bold">
                      ⚙️ Admin Dashboard
                    </Link>
                  )}
                </div>
                <div className="border-t border-border/60 pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {userProfile.photo ? (
                      <img src={userProfile.photo} alt={userProfile.name} className="h-7 w-7 rounded-full object-cover" />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                        {userProfile.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs font-bold text-text truncate max-w-[120px]">{userProfile.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logoutUser();
                      setIsMobileMenuOpen(false);
                      toast.success('Logged out successfully.');
                      router.push('/');
                    }}
                    className="text-xs font-bold text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full border-none cursor-pointer hover:bg-red-500 hover:text-white transition-all flex items-center gap-1"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      )}
    </nav>
  );
}
