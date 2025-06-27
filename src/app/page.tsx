'use client';
import Link from 'next/link';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Personal Finance Tracker
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Track expenses, set budgets, and get smart insights
        </p>
        <Link 
          href="/auth"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}