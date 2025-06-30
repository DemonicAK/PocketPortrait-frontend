'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Landing() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    { icon: "💰", title: "Smart Expense Tracking", desc: "AI-powered categorization" },
    { icon: "📊", title: "Budget Management", desc: "Stay on track with intelligent alerts" },
    { icon: "🎯", title: "Goal Setting", desc: "Achieve your financial dreams" },
    { icon: "📈", title: "Advanced Analytics", desc: "Deep insights into your spending" }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 text-4xl animate-float">💳</div>
        <div className="absolute top-1/3 right-1/4 text-3xl animate-float animation-delay-1000">📱</div>
        <div className="absolute bottom-1/3 left-1/3 text-2xl animate-float animation-delay-2000">💎</div>
        <div className="absolute bottom-1/4 right-1/3 text-3xl animate-float animation-delay-3000">🏦</div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className={`text-center max-w-4xl transition-all duration-1000 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
          
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl mb-4 shadow-2xl">
              <span className="text-3xl">💼</span>
            </div>
            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 mb-2 tracking-tight">
              Pocket Portrait
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
          </div>

          {/* Tagline */}
          <p className="text-2xl text-blue-100 mb-4 font-light">
            Paint the perfect picture of your finances
          </p>
          <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform your financial chaos into a masterpiece with AI-powered insights, 
            smart budgeting, and beautiful analytics that make money management an art.
          </p>

          {/* Feature Showcase */}
          <div className="mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-blue-300/20 shadow-2xl">
              <div className="text-6xl mb-4 transform transition-all duration-500">
                {features[currentFeature].icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {features[currentFeature].title}
              </h3>
              <p className="text-blue-100">
                {features[currentFeature].desc}
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="/auth"
              className="group relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-12 py-4 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            {/* <button className="text-white border-2 border-blue-300/30 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-blue-500/10 hover:border-blue-300/50 transition-all duration-300 backdrop-blur-sm">
              Watch Demo
            </button> */}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">1+</div>
              <div className="text-blue-200 text-sm">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">₹50</div>
              <div className="text-blue-200 text-sm">Money Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">99.9%</div>
              <div className="text-blue-200 text-sm">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                fill="rgba(59, 130, 246, 0.1)"></path>
        </svg>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );}