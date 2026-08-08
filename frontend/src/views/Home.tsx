'use client';

import React, { lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Hero from '../components/Hero';
import Categories from '../components/Categories';

// Load heavy interactive lists only on client to avoid SSR/client hydration mismatches
const FeaturedProducts = dynamic(() => import('../components/FeaturedProducts'), { ssr: false });
const BestSellers = dynamic(() => import('../components/BestSellers'), { ssr: false });

const PromoBanner = lazy(() => import('../components/PromoBanner'));
const WhyChooseUs = lazy(() => import('../components/WhyChooseUs'));
const Testimonials = lazy(() => import('../components/Testimonials'));


export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
   
      <Hero />
      
      <Categories />

      <Suspense fallback={<div className="py-12 text-center text-xs font-semibold text-zinc-400">Loading Products...</div>}>
        <FeaturedProducts />
      </Suspense>

      <BestSellers />

      <Suspense fallback={<div className="py-12 text-center text-xs font-semibold text-zinc-400">Loading Offer...</div>}>
        <PromoBanner />
      </Suspense>

      <Suspense fallback={<div className="py-12 text-center text-xs font-semibold text-zinc-400">Loading Features...</div>}>
        <WhyChooseUs />
      </Suspense>

      <Suspense fallback={<div className="py-12 text-center text-xs font-semibold text-zinc-400">Loading Reviews...</div>}>
        <Testimonials />
      </Suspense>
    </div>
  );
}
