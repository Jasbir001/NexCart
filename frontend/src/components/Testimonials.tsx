'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Product Lead, DesignStudio',
    quote: "NexCart has completely transformed my online shopping experience. The checkout flow is incredibly swift, and my premium noise-cancelling headphones arrived the very next morning! The product quality is unmatched.",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'David Chen',
    role: 'Tech Advisor, InnovateInc',
    quote: "The attention to detail and customer support team is absolute top-tier! They assisted me with choosing the right chronograph leather watch and solved my query in minutes. Absolute 5-star standard.",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Elena Rostova',
    role: 'Creative Director, VogueStyle',
    quote: "The quality of the fashion collections and accessories on NexCart is outstanding. Extremely satisfied with my chelsea boots. The website is gorgeous, highly responsive, and dark mode looks exceptionally premium.",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-background transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black tracking-widest text-primary uppercase">Reviews</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">Loved by Customers</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-[2rem] border border-border bg-card p-8 sm:p-10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full"
            >
              {/* Star Rating Header */}
              <div className="flex text-amber-500 gap-1 mb-6">
                {Array.from({ length: test.rating }).map((_, i) => (
                  <FiStar key={i} className="text-base fill-current" />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm sm:text-base leading-relaxed flex-1 mb-8 italic">
                &quot;{test.quote}&quot;
              </p>

              {/* User Bio */}
              <div className="flex items-center gap-4 pt-6 border-t border-border/55">
                <img 
                  src={test.avatar} 
                  alt={test.name} 
                  className="h-12 w-12 rounded-full object-cover border-2 border-primary/20 shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-text">
                    {test.name}
                  </h4>
                  <p className="text-xs text-zinc-400 font-semibold mt-0.5">
                    {test.role}
                  </p>
                </div>
              </div>

              {/* Glassy border light effect */}
              <div className="absolute inset-0 border border-transparent rounded-[2rem] group-hover:border-primary/20 transition-colors pointer-events-none" />

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
