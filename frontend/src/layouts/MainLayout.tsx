'use client';

import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { StoreProvider } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import AuthModal from '../components/AuthModal';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <ThemeProvider>
      <StoreProvider>
        <div className="flex min-h-screen flex-col bg-background text-text transition-colors duration-200">
          <Navbar />
          <CartDrawer />
          <AuthModal />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </div>
      </StoreProvider>
    </ThemeProvider>
  );
}

