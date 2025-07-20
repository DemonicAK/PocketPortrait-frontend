'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // type CarouselApi
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"



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
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-4xl">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl mb-4 shadow-md">
            <span className="text-3xl">💼</span>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
            Pocket Portrait
          </h1>
          <p className="text-xl text-gray-600 font-light mb-6">
            Paint the perfect picture of your finances
          </p>
          <p className="text-base text-gray-500 mb-10 max-w-xl mx-auto">
            Transform your financial chaos into a masterpiece with AI-powered insights, smart budgeting, and beautiful analytics that make money management an art.
          </p>

          {/* Feature Display */}
          {/* <div className="bg-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm mb-10">
            <div className="text-4xl mb-2">{features[currentFeature].icon}</div>
            <h3 className="text-xl font-semibold mb-1">{features[currentFeature].title}</h3>
            <p className="text-gray-600 text-sm">{features[currentFeature].desc}</p>
          </div> */}
          {/* Feature Carousel */}
          <Carousel className="w-full max-w-md mx-auto mb-10"
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}>
            <CarouselContent>
              {features.map((feature, index) => (
                <CarouselItem key={index} className="p-4">
                  <div className="bg-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="text-4xl mb-2">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Link
              href="/auth"
              className="bg-blue-500 text-white px-8 py-3 rounded-full text-base font-medium hover:bg-blue-600 transition"
            >
              Start Your Journey
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto text-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold">1+</div>
              <div className="text-sm">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">₹50</div>
              <div className="text-sm">Money Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm">Uptime</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
