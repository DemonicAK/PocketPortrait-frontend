'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Footer from '@/components/footer';

export default function Landing() {
  const features = [
    { icon: '💰', title: 'Smart Transaction Tracking', desc: 'AI-powered categorization' },
    { icon: '📊', title: 'Budget Management', desc: 'Stay on track with intelligent alerts' },
    { icon: '🎯', title: 'Goal Setting', desc: 'Achieve your financial dreams' },
    { icon: '📈', title: 'Advanced Analytics', desc: 'Deep insights into your spending' },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = features.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900 relative overflow-hidden">
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center py-20">
        <div className="max-w-4xl">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl mb-6 shadow-lg">
            <span className="text-4xl">💼</span>
          </div>
          <h1 className="text-6xl font-extrabold text-gray-800 leading-tight mb-4">
            Finyo
          </h1>
          <p className="text-2xl text-gray-600 font-light mb-6">
            Know Your Flow – Your Personal Finance Companion
          </p>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
            Transform financial chaos into clarity with AI-powered insights, smart budgeting, and elegant analytics.
          </p>

          {/* Feature Carousel */}
          <Carousel
            className="w-full max-w-xl mx-auto mb-14"
            plugins={[Autoplay({ delay: 2500 })]}
          >
            <CarouselContent>
              {features.map((feature, index) => (
                <CarouselItem key={index} className="p-4">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition">
                    <div className="text-4xl mb-2">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/auth"
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-base font-medium hover:bg-blue-700 transition"
            >
              Start Your Journey
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto text-gray-700">
            <div className="text-center">
              <div className="text-3xl font-bold">1+</div>
              <div className="text-sm">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">₹50</div>
              <div className="text-sm">Money Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-sm">Uptime</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
