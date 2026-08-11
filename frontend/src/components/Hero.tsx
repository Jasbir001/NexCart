'use client';

import React from 'react';
import { FiArrowRight, FiShoppingBag, FiCompass } from 'react-icons/fi';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-24 transition-colors duration-200">
      
      {/* Background glow - simple single circle */}
      <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Responsive 12-column grid to give text column more breathing room */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tag badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary uppercase">
              <FiShoppingBag /> New Curated Releases
            </span>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-text leading-tight">
              Discover <span className="text-primary">Premium</span> Products
            </h1>

            {/* Subheading */}
            <p className="max-w-lg mx-auto lg:mx-0 text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
              Elevate your daily lifestyle with NexCart&apos;s curated collection of smart electronics, modern fashion, and premium accessories. Express delivery. Secure checkout.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <a 
                href="#featured"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-bold text-white shadow-md hover:bg-primary/95 transition-all cursor-pointer"
              >
                <span>Shop Now</span>
                <FiArrowRight />
              </a>
              <a 
                href="#categories"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 font-bold text-text hover:bg-background transition-all cursor-pointer"
              >
                <FiCompass className="text-primary" />
                <span>Explore Collection</span>
              </a>
            </div>

            {/* Simplified Stats Block */}
            <div className="flex justify-center lg:justify-start gap-8 pt-6 border-t border-border max-w-sm mx-auto lg:mx-0">
              <div>
                <p className="text-xl font-bold text-text">15k+</p>
                <p className="text-xs text-zinc-400">Happy Buyers</p>
              </div>
              <div>
                <p className="text-xl font-bold text-text">8k+</p>
                <p className="text-xs text-zinc-400">Products</p>
              </div>
              <div>
                <p className="text-xl font-bold text-text">4.9 ★</p>
                <p className="text-xs text-zinc-400">Rating</p>
              </div>
            </div>
            
          </div>

          {/* Right Column: High Quality Curated Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md aspect-square overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-lg">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-background relative">
                <img 
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80" 
                  alt="Curated Product" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                
                {/* Clean static float tag */}
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/50 backdrop-blur-sm p-3 text-white flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xs">Retro Sport Sneakers</h3>
                    <p className="text-[10px] text-white/70">Trending Summer Shoes</p>
                  </div>
                  <span className="text-sm font-black text-primary">₹1,899</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
