'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore, SavedAddress, SavedPayment } from '../../src/context/StoreContext';
import { useTheme } from '../../src/context/ThemeContext';
import Link from 'next/link';
import { 
  FiUser, 
  FiShoppingBag, 
  FiMapPin, 
  FiGift, 
  FiCreditCard, 
  FiSettings, 
  FiLogOut, 
  FiEdit3, 
  FiPlus, 
  FiTrash2, 
  FiCheck, 
  FiClock, 
  FiCheckCircle, 
  FiTruck, 
  FiPackage, 
  FiLock,
  FiFileText,
  FiArrowLeft
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

function AccountDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  
  const { 
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
    wishlist,
    orders,
    logoutUser,
    isLoggedIn
  } = useStore();

  const validTabs = ['profile', 'orders', 'addresses', 'coupons', 'payments', 'settings'] as const;
  type AccountTab = typeof validTabs[number];
  const tabParam = searchParams.get('tab');
  const activeTab: AccountTab =
    tabParam && validTabs.includes(tabParam as AccountTab) ? (tabParam as AccountTab) : 'profile';
  useEffect(() => {
    const savedLoggedIn = localStorage.getItem('nexcart-logged-in');
    const checkedLoggedIn = savedLoggedIn ? JSON.parse(savedLoggedIn) : false;
    if (!checkedLoggedIn) {
      router.push('/auth?redirect=/account');
    }
  }, [isLoggedIn, router]);

  // Handle tab change
  const handleTabChange = (tabName: AccountTab) => {
    router.push(`/account?tab=${tabName}`);
  };

  // --- PROFILE TAB STATES ---
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(userProfile.name);
  const [profileEmail, setProfileEmail] = useState(userProfile.email);
  const [profilePhone, setProfilePhone] = useState(userProfile.phone);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone
    });
    setIsEditingProfile(false);
    toast.success('Profile updated successfully!');
  };

  // --- ADDRESS BOOK STATES ---
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  
  // Form fields for address
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrHouse, setAddrHouse] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrDefault, setAddrDefault] = useState(false);

  const openAddAddress = () => {
    setEditingAddressId(null);
    setAddrName('');
    setAddrPhone('');
    setAddrHouse('');
    setAddrStreet('');
    setAddrCity('');
    setAddrState('');
    setAddrPincode('');
    setAddrLandmark('');
    setAddrDefault(savedAddresses.length === 0);
    setIsAddressModalOpen(true);
  };

  const openEditAddress = (addr: SavedAddress) => {
    setEditingAddressId(addr.id);
    setAddrName(addr.fullName);
    setAddrPhone(addr.phone);
    setAddrHouse(addr.houseNumber);
    setAddrStreet(addr.street);
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrPincode(addr.pinCode);
    setAddrLandmark(addr.landmark || '');
    setAddrDefault(addr.isDefault);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrPhone || !addrHouse || !addrStreet || !addrCity || !addrState || !addrPincode) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const addrData = {
      fullName: addrName,
      phone: addrPhone,
      houseNumber: addrHouse,
      street: addrStreet,
      city: addrCity,
      state: addrState,
      pinCode: addrPincode,
      landmark: addrLandmark || undefined,
      isDefault: addrDefault
    };

    if (editingAddressId) {
      editAddress(editingAddressId, addrData);
      toast.success('Address updated successfully!');
    } else {
      addAddress(addrData);
      toast.success('New address added!');
    }
    setIsAddressModalOpen(false);
  };

  // --- SAVED PAYMENTS STATES ---
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<'upi' | 'card'>('upi');
  const [payLabel, setPayLabel] = useState('');
  const [payDetails, setPayDetails] = useState('');

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payLabel || !payDetails) {
      toast.error('Please fill in payment account details.');
      return;
    }

    addSavedPayment({
      type: paymentType,
      label: payLabel,
      details: payDetails
    });
    setPayLabel('');
    setPayDetails('');
    setIsPaymentFormOpen(false);
    toast.success('Payment account linked successfully!');
  };

  // --- SETTINGS TAB STATES ---
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordCurrent || !passwordNew || !passwordConfirm) {
      toast.error('All password fields are required.');
      return;
    }
    if (passwordNew !== passwordConfirm) {
      toast.error('New passwords do not match.');
      return;
    }
    toast.success('Password updated successfully!');
    setPasswordCurrent('');
    setPasswordNew('');
    setPasswordConfirm('');
  };

  // Computed Orders summary
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Packed').length;
  const shippedOrdersCount = orders.filter(o => o.status === 'Shipped' || o.status === 'Out For Delivery').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'Delivered').length;

  // Sidebar Tabs Config
  const tabsList: { id: AccountTab; label: string; icon: typeof FiUser }[] = [
    { id: 'profile', label: 'My Profile', icon: FiUser },
    { id: 'orders', label: 'My Orders', icon: FiShoppingBag },
    { id: 'addresses', label: 'Saved Addresses', icon: FiMapPin },
    { id: 'coupons', label: 'Coupons & Rewards', icon: FiGift },
    { id: 'payments', label: 'Payment Options', icon: FiCreditCard },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  return (
    <div className="min-h-screen bg-background text-text py-12 transition-colors duration-200">
      <Toaster position="bottom-right" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Dashboard</span>
            <h1 className="text-3xl font-extrabold tracking-tight">Account & Settings</h1>
          </div>
          <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-primary transition-colors">
            <FiArrowLeft /> Back to Store
          </Link>
        </div>

        {/* Dashboard Frame Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Menu: Sticky (3 Columns) */}
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 space-y-2 lg:sticky lg:top-24">
            
            {/* Sidebar Profile Peek */}
            <div className="flex items-center gap-3 p-3 border-b border-border/60 mb-3 pb-4">
              <div className="h-12 w-12 rounded-full overflow-hidden border border-border/80">
                <img src={userProfile.photo} alt={userProfile.name} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-sm truncate">{userProfile.name}</h4>
                <p className="text-[10px] text-zinc-400 font-semibold truncate">Member since {userProfile.memberSince}</p>
              </div>
            </div>

            {/* Tabs List */}
            <div className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {tabsList.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap lg:w-full border-none ${
                      isActive 
                        ? 'bg-primary text-white shadow-md shadow-primary/20' 
                        : 'bg-transparent text-zinc-400 hover:bg-background hover:text-text'
                    }`}
                  >
                    <TabIcon className="text-base" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  logoutUser();
                  toast.success('Logged out successfully.');
                  router.push('/');
                }}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-extrabold text-red-500 hover:bg-red-500/10 transition-all cursor-pointer whitespace-nowrap lg:w-full border-none bg-transparent lg:mt-4 text-left"
              >
                <FiLogOut className="text-base" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>

          {/* Right Area: Content Panels (9 Columns) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* PROFILE TAB VIEW */}
            {activeTab === 'profile' && (
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-8">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <h2 className="text-xl font-extrabold">Personal Profile</h2>
                  <button 
                    onClick={() => {
                      setIsEditingProfile(!isEditingProfile);
                      setProfileName(userProfile.name);
                      setProfileEmail(userProfile.email);
                      setProfilePhone(userProfile.phone);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline bg-transparent border-none cursor-pointer"
                  >
                    <FiEdit3 /> {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Photo Display Card */}
                  <div className="md:col-span-4 flex flex-col items-center text-center space-y-4">
                    <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-primary/20 relative group">
                      <img src={userProfile.photo} alt={userProfile.name} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold cursor-pointer transition-opacity">
                        Change Photo
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400">REGISTERED CUSTOMER</p>
                      <p className="text-[10px] text-primary font-extrabold mt-0.5">Verified NexCart Account</p>
                    </div>
                  </div>

                  {/* Profile info details */}
                  <div className="md:col-span-8">
                    {isEditingProfile ? (
                      <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-400">Full Name</label>
                          <input 
                            type="text" 
                            value={profileName} 
                            onChange={(e) => setProfileName(e.target.value)} 
                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs outline-none focus:border-primary text-text font-bold" 
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-400">Email Address</label>
                          <input 
                            type="email" 
                            value={profileEmail} 
                            onChange={(e) => setProfileEmail(e.target.value)} 
                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs outline-none focus:border-primary text-text font-bold" 
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-400">Mobile Number</label>
                          <input 
                            type="text" 
                            value={profilePhone} 
                            onChange={(e) => setProfilePhone(e.target.value)} 
                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs outline-none focus:border-primary text-text font-bold" 
                            required
                          />
                        </div>
                        <button 
                          type="submit" 
                          className="rounded-full bg-primary px-6 py-3 font-bold text-white shadow-md hover:bg-primary/95 text-xs transition-all cursor-pointer"
                        >
                          Save Profile Changes
                        </button>
                      </form>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold">
                        <div className="space-y-1">
                          <span className="text-[10px] text-zinc-400 font-bold block uppercase">Full Name</span>
                          <span className="text-text font-bold text-sm block">{userProfile.name}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-zinc-400 font-bold block uppercase">Email Address</span>
                          <span className="text-text font-bold text-sm block truncate">{userProfile.email}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-zinc-400 font-bold block uppercase">Mobile Number</span>
                          <span className="text-text font-bold text-sm block">{userProfile.phone || 'Not Linked'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-zinc-400 font-bold block uppercase">Member Since</span>
                          <span className="text-text font-bold text-sm block">{userProfile.memberSince}</span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* ORDERS TAB VIEW */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                
                {/* Order Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-1 shadow-xs">
                    <p className="text-2xl font-black text-text">{totalOrdersCount}</p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">Total Orders</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-1 shadow-xs">
                    <p className="text-2xl font-black text-amber-500">{pendingOrdersCount}</p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">Pending</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-1 shadow-xs">
                    <p className="text-2xl font-black text-blue-500">{shippedOrdersCount}</p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">In Transit</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-1 shadow-xs">
                    <p className="text-2xl font-black text-green-500">{deliveredOrdersCount}</p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">Delivered</p>
                  </div>
                </div>

                {/* Orders list stack */}
                <div className="space-y-4">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-zinc-400 px-1">Orders History</h3>
                  
                  {orders.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-4 shadow-xs">
                      <FiShoppingBag className="text-4xl text-zinc-300 mx-auto" />
                      <p className="text-xs font-semibold text-zinc-500">You haven&apos;t placed any orders yet.</p>
                      <Link href="/" className="rounded-full bg-primary/10 text-primary px-5 py-2 font-bold text-xs inline-block">
                        Go Shopping
                      </Link>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
                        
                        {/* Header details */}
                        <div className="bg-background/45 border-b border-border/80 p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-zinc-500">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-zinc-400 block">Order ID</span>
                            <span className="text-primary font-bold">{order.id}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-zinc-400 block">Date Placed</span>
                            <span className="text-text">{order.date}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-zinc-400 block">Total Amount</span>
                            <span className="text-text">₹{order.grandTotal.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex items-center gap-1.5 md:justify-end">
                            <span className="text-[9px] uppercase font-bold text-zinc-400 block md:hidden">Status:</span>
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-bold uppercase tracking-wider">{order.status}</span>
                          </div>
                        </div>

                        {/* Items listed */}
                        <div className="p-4 space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-center">
                              <div className="h-10 w-10 rounded-lg overflow-hidden bg-background flex-shrink-0">
                                <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-xs text-text line-clamp-1">{item.product.name}</h4>
                                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Qty: {item.quantity} • ₹{item.product.price.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Footer action */}
                        <div className="bg-background/20 border-t border-border/40 p-3 flex justify-between items-center px-4">
                          <span className="text-[10px] text-zinc-400 font-semibold">Payment: {order.paymentMethod}</span>
                          <Link 
                            href="/orders" 
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            Track Order Status
                          </Link>
                        </div>

                      </div>
                    ))
                  )}

                </div>

              </div>
            )}

            {/* ADDRESSES TAB VIEW */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xl font-extrabold">Address Book</h2>
                  <button 
                    onClick={openAddAddress}
                    className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 font-bold text-white text-xs shadow-md cursor-pointer hover:bg-primary/95 transition-all"
                  >
                    <FiPlus /> Add Address
                  </button>
                </div>

                {/* Saved addresses list grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedAddresses.map((addr) => (
                    <div 
                      key={addr.id} 
                      className={`rounded-2xl border p-5 space-y-4 bg-card shadow-xs relative flex flex-col justify-between ${
                        addr.isDefault ? 'border-primary shadow-xs' : 'border-border'
                      }`}
                    >
                      {/* Address Card Top */}
                      <div className="space-y-2 text-xs font-semibold text-zinc-500">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="font-extrabold text-sm text-text">{addr.fullName}</h4>
                          {addr.isDefault && (
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-[9px] text-primary font-bold uppercase tracking-wider">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 leading-relaxed">
                          <p className="text-text font-bold">{addr.houseNumber}</p>
                          <p>{addr.street}</p>
                          {addr.landmark && <p className="text-[10px] text-zinc-400">Landmark: {addr.landmark}</p>}
                          <p>{addr.city}, {addr.state} - <span className="text-text font-bold">{addr.pinCode}</span></p>
                          <p className="text-zinc-400 mt-2 block">Phone: {addr.phone}</p>
                        </div>
                      </div>

                      {/* Address Card Footer actions */}
                      <div className="flex items-center gap-4 pt-4 border-t border-border/60 mt-2 text-xs font-bold">
                        {!addr.isDefault && (
                          <button 
                            onClick={() => {
                              setDefaultAddress(addr.id);
                              toast.success('Default address updated.');
                            }}
                            className="text-primary hover:underline bg-transparent border-none cursor-pointer p-0"
                          >
                            Set Default
                          </button>
                        )}
                        <button 
                          onClick={() => openEditAddress(addr)}
                          className="text-zinc-400 hover:text-text bg-transparent border-none cursor-pointer p-0"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            deleteAddress(addr.id);
                            toast.success('Address deleted.');
                          }}
                          className="text-red-500 hover:text-red-600 bg-transparent border-none cursor-pointer p-0 ml-auto inline-flex items-center gap-1"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add/Edit Address Form Modal */}
                {isAddressModalOpen && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-card rounded-3xl border border-border p-6 shadow-2xl space-y-6">
                      <div className="border-b border-border pb-3 flex justify-between items-center">
                        <h3 className="font-extrabold text-base">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
                        <button 
                          onClick={() => setIsAddressModalOpen(false)}
                          className="text-zinc-400 hover:text-text border-none bg-transparent cursor-pointer font-bold text-sm"
                        >
                          Close
                        </button>
                      </div>

                      <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-zinc-400">Full Name *</label>
                            <input 
                              type="text" 
                              value={addrName} 
                              onChange={(e) => setAddrName(e.target.value)} 
                              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary text-text font-bold" 
                              placeholder="Receiver's name"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-zinc-400">Mobile Number *</label>
                            <input 
                              type="text" 
                              value={addrPhone} 
                              onChange={(e) => setAddrPhone(e.target.value)} 
                              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary text-text font-bold" 
                              placeholder="10-digit number"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1 sm:col-span-1">
                            <label className="text-[10px] uppercase font-bold text-zinc-400">House/Flat No *</label>
                            <input 
                              type="text" 
                              value={addrHouse} 
                              onChange={(e) => setAddrHouse(e.target.value)} 
                              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary text-text font-bold" 
                              placeholder="Flat/House/Apartment"
                              required
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] uppercase font-bold text-zinc-400">Street Address *</label>
                            <input 
                              type="text" 
                              value={addrStreet} 
                              onChange={(e) => setAddrStreet(e.target.value)} 
                              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary text-text font-bold" 
                              placeholder="Area/Street/Colony"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-zinc-400">City *</label>
                            <input 
                              type="text" 
                              value={addrCity} 
                              onChange={(e) => setAddrCity(e.target.value)} 
                              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary text-text font-bold" 
                              placeholder="City"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-zinc-400">State *</label>
                            <input 
                              type="text" 
                              value={addrState} 
                              onChange={(e) => setAddrState(e.target.value)} 
                              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary text-text font-bold" 
                              placeholder="State"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-zinc-400">Pincode *</label>
                            <input 
                              type="text" 
                              maxLength={6}
                              value={addrPincode} 
                              onChange={(e) => setAddrPincode(e.target.value)} 
                              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary text-text font-bold" 
                              placeholder="6 digits"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-400">Landmark (Optional)</label>
                          <input 
                            type="text" 
                            value={addrLandmark} 
                            onChange={(e) => setAddrLandmark(e.target.value)} 
                            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary text-text font-bold" 
                            placeholder="E.g. near Apollo hospital"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-2 select-none">
                          <input 
                            type="checkbox" 
                            id="default-check" 
                            checked={addrDefault} 
                            onChange={(e) => setAddrDefault(e.target.checked)} 
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                          />
                          <label htmlFor="default-check" className="font-bold text-zinc-500">Set as default delivery address</label>
                        </div>

                        <button 
                          type="submit" 
                          className="w-full rounded-full bg-primary py-3 font-bold text-white shadow-md text-xs hover:bg-primary/95 transition-all cursor-pointer mt-4"
                        >
                          {editingAddressId ? 'Save Address Changes' : 'Save Address'}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* COUPONS & REWARDS TAB VIEW */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                
                {/* Reward Points Card */}
                <div className="rounded-2xl border border-border bg-gradient-to-r from-primary to-blue-600 p-6 text-white shadow-md flex justify-between items-center">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 block">Points Balance</span>
                    <h3 className="text-3xl font-black">{couponsAndRewards.rewardPoints} Points</h3>
                    <p className="text-xs text-white/70">1 Point = ₹1. Spend them during checkout for instant cashback!</p>
                  </div>
                  <FiGift className="text-5xl opacity-20" />
                </div>

                {/* Ledger & Coupons Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Available Coupons list (7 Columns) */}
                  <div className="lg:col-span-7 space-y-4">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-zinc-400 px-1">Available Coupons</h3>
                    
                    <div className="space-y-3">
                      {couponsAndRewards.available.map((c) => (
                        <div key={c.code} className="rounded-xl border border-border bg-card p-4 flex justify-between items-start gap-4 shadow-xs">
                          <div className="space-y-1 text-xs font-semibold text-zinc-500">
                            <span className="text-primary font-black text-sm block">{c.discount}</span>
                            <h4 className="font-bold text-text text-xs uppercase tracking-wider">{c.code}</h4>
                            <p className="leading-relaxed text-[11px]">{c.description}</p>
                            <p className="text-[9px] text-zinc-400 font-medium">Expires on {c.expiryDate} • Min spend ₹{c.minSpend}</p>
                          </div>

                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(c.code);
                              toast.success(`Coupon code ${c.code} copied!`);
                            }}
                            className="rounded-full bg-primary/10 text-primary px-3 py-1.5 font-bold text-[10px] cursor-pointer hover:bg-primary hover:text-white transition-all whitespace-nowrap"
                          >
                            Copy Code
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cashback History ledger (5 Columns) */}
                  <div className="lg:col-span-5 space-y-4">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-zinc-400 px-1">Cashback History</h3>
                    
                    <div className="rounded-xl border border-border bg-card p-4 space-y-4 text-xs font-semibold text-zinc-500 shadow-xs">
                      {couponsAndRewards.cashbackHistory.map((h) => (
                        <div key={h.id} className="flex justify-between items-center border-b border-border/50 last:border-0 pb-3 last:pb-0">
                          <div>
                            <p className="text-text font-bold">{h.description}</p>
                            <p className="text-[9px] text-zinc-400 mt-0.5">{h.date}</p>
                          </div>
                          <span className={`font-bold text-sm ${h.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                            {h.type === 'credit' ? '+' : '-'}₹{h.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* PAYMENT OPTIONS TAB VIEW */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                
                {/* Saved payment list header */}
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xl font-extrabold">Saved Payments</h2>
                  <button 
                    onClick={() => setIsPaymentFormOpen(!isPaymentFormOpen)}
                    className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 font-bold text-white text-xs shadow-md cursor-pointer hover:bg-primary/95 transition-all"
                  >
                    <FiPlus /> Link Account
                  </button>
                </div>

                {/* Link new payment form */}
                {isPaymentFormOpen && (
                  <form onSubmit={handleAddPayment} className="rounded-2xl border border-border bg-card p-5 space-y-4 text-xs">
                    <div className="border-b border-border/80 pb-2 mb-2 font-bold text-sm text-text">Link UPI or Card Account</div>
                    
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentType('upi')}
                        className={`rounded-full px-4 py-2 font-bold text-[10px] cursor-pointer ${
                          paymentType === 'upi' ? 'bg-primary text-white' : 'bg-background text-zinc-400'
                        }`}
                      >
                        UPI ID
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentType('card')}
                        className={`rounded-full px-4 py-2 font-bold text-[10px] cursor-pointer ${
                          paymentType === 'card' ? 'bg-primary text-white' : 'bg-background text-zinc-400'
                        }`}
                      >
                        Debit/Credit Card
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-zinc-400">Account Label (E.g. HDFC Bank)</label>
                        <input 
                          type="text" 
                          value={payLabel} 
                          onChange={(e) => setPayLabel(e.target.value)} 
                          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary text-text font-bold" 
                          placeholder="E.g. PayTM Wallet or SBI Card"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-zinc-400">
                          {paymentType === 'upi' ? 'UPI ID Address (Handle)' : 'Card Number Preview'}
                        </label>
                        <input 
                          type="text" 
                          value={payDetails} 
                          onChange={(e) => setPayDetails(e.target.value)} 
                          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary text-text font-bold" 
                          placeholder={paymentType === 'upi' ? 'username@upi' : 'Visa ending in 1234'}
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="rounded-full bg-primary px-5 py-2.5 font-bold text-white shadow-md text-[10px] transition-all cursor-pointer"
                    >
                      Save Account
                    </button>
                  </form>
                )}

                {/* Saved list stack */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedPayments.map((p) => (
                    <div key={p.id} className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between gap-4 shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-primary text-lg">
                          <FiCreditCard />
                        </div>
                        <div className="text-xs font-semibold text-zinc-500">
                          <h4 className="font-extrabold text-sm text-text">{p.label}</h4>
                          <p className="mt-0.5">{p.details}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          deleteSavedPayment(p.id);
                          toast.success('Account unlinked.');
                        }}
                        className="text-red-500 hover:text-red-600 bg-transparent border-none cursor-pointer p-0"
                        title="Delete Payment Option"
                      >
                        <FiTrash2 className="text-base" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Visual COD & GST Invoice info cards */}
                <div className="rounded-2xl border border-border bg-background p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-zinc-500">
                  <div className="space-y-1">
                    <h4 className="text-text font-bold flex items-center gap-1.5"><FiCheckCircle className="text-green-500" /> Cash on Delivery (COD)</h4>
                    <p className="leading-relaxed">Available on orders under ₹10,000. Verification pin code must support COD deliveries.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-text font-bold flex items-center gap-1.5"><FiFileText className="text-primary" /> GST Invoice available</h4>
                    <p className="leading-relaxed">Verify your corporate GSTIN during product detail checkers to claim 18% input credit.</p>
                  </div>
                </div>

              </div>
            )}

            {/* SETTINGS TAB VIEW */}
            {activeTab === 'settings' && (
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-8">
                
                {/* 1. Theme Configuration section */}
                <div className="space-y-4">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-zinc-400 border-b border-border pb-2">Appearance</h3>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div>
                      <h4 className="text-text font-bold text-sm">Theme Settings</h4>
                      <p className="text-zinc-400 mt-0.5">Toggle between dark mode and light mode preferences.</p>
                    </div>
                    
                    {/* Toggle button */}
                    <button 
                      onClick={toggleTheme}
                      className="rounded-full bg-primary/10 text-primary px-5 py-2.5 font-bold cursor-pointer hover:bg-primary hover:text-white transition-all"
                    >
                      {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    </button>
                  </div>
                </div>

                {/* 2. Password updates */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-zinc-400 border-b border-border pb-2">Security & Credentials</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-zinc-400">Current Password</label>
                        <input 
                          type="password" 
                          value={passwordCurrent}
                          onChange={(e) => setPasswordCurrent(e.target.value)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary text-text font-bold" 
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-zinc-400">New Password</label>
                        <input 
                          type="password" 
                          value={passwordNew}
                          onChange={(e) => setPasswordNew(e.target.value)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary text-text font-bold" 
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-zinc-400">Confirm New Password</label>
                        <input 
                          type="password" 
                          value={passwordConfirm}
                          onChange={(e) => setPasswordConfirm(e.target.value)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary text-text font-bold" 
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="rounded-full bg-primary px-5 py-2.5 font-bold text-white shadow-md text-[10px] transition-all cursor-pointer"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                {/* 3. General switches */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-zinc-400 border-b border-border pb-2">Notifications & Privacy</h3>
                  <div className="space-y-3 text-xs font-semibold text-zinc-500">
                    <div className="flex justify-between items-center">
                      <span>Enable promotional email newsletters and discount coupons alerts</span>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-primary border-border focus:ring-primary rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Send delivery updates and tracking steps via SMS notifications</span>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-primary border-border focus:ring-primary rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Anonymous analytics reporting for premium shopping recommendations</span>
                      <input type="checkbox" className="h-4 w-4 text-primary border-border focus:ring-primary rounded" />
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default function AccountDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-bold text-zinc-400">Loading Account...</div>}>
      <AccountDashboardContent />
    </Suspense>
  );
}
