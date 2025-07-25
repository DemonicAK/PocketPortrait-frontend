'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@/types';
import { fetchUser } from '@/lib/fetchUser';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();


  const handleLogout = async (): Promise<void> => {


    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', // ✅ Include cookies
      });

      if (response.ok) {
        console.log('User logged out successfully');
      } else {
        console.error('Logout failed');
        alert('Logout failed. Please try again.');
        return; // ❗Avoid redirecting if logout failed
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred while logging out. Please try again.');
      return; // ❗Avoid redirecting if error occurred
    }

    router.push('/auth'); // ✅ Redirect only on successful logout
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-800">Finance Tracker</h1>
            </Link>

            <div className="flex space-x-8">
              <Link
                href="/dashboard/entry"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Entry New
              </Link>
              <Link
                href="/dashboard/transactions"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                transactions
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
              {/* <Link 
                href="/dashboard/analysis" 
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                analysis
              </Link> */}
              <div className="relative group">
                <button className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  Account
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <Link
                    href="/dashboard/account"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}