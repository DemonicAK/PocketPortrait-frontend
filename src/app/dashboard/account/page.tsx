'use client';
import { useState, useEffect } from 'react';
import { User } from '@/types';

interface Budget {
  _id?: string;
  category: string;
  limitAmount: number;
  currentSpent: number;
  month: string;
  year: number;
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showBudgetForm, setShowBudgetForm] = useState<boolean>(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [budgetForm, setBudgetForm] = useState({
    category: '',
    limitAmount: '',
    month: new Date().toISOString().slice(0, 7) // Current month YYYY-MM
  });

  const categories = ['Food', 'Rent', 'Shopping', 'Transport', 'Entertainment', 'Healthcare', 'Other'];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    fetchBudgets();
  }, []);

  const fetchBudgets = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/budgets`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const handleSubmitBudget = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/budgets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            category: budgetForm.category,
            limitAmount: parseFloat(budgetForm.limitAmount),
            month: budgetForm.month
          })
        }
      );

      if (response.ok) {
        await fetchBudgets(); // Refresh budgets
        resetBudgetForm();
        alert(editingBudget ? 'Budget updated successfully!' : 'Budget created successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save budget');
      }
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Error saving budget');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBudget = (budget: Budget): void => {
    setEditingBudget(budget);
    setBudgetForm({
      category: budget.category,
      limitAmount: budget.limitAmount.toString(),
      month: budget.month
    });
    setShowBudgetForm(true);
  };

  const resetBudgetForm = (): void => {
    setBudgetForm({
      category: '',
      limitAmount: '',
      month: new Date().toISOString().slice(0, 7)
    });
    setEditingBudget(null);
    setShowBudgetForm(false);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getBudgetStatus = (budget: Budget): { color: string; text: string } => {
    const percentage = (budget.currentSpent / budget.limitAmount) * 100;

    if (percentage >= 100) {
      return { color: 'text-red-600 bg-red-100', text: 'Over Budget' };
    } else if (percentage >= 80) {
      return { color: 'text-orange-600 bg-orange-100', text: 'Near Limit' };
    } else {
      return { color: 'text-green-600 bg-green-100', text: 'On Track' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Account Settings</h1>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <p className="text-gray-900">{user?.email || 'Loading...'}</p>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                User ID
              </label>
              <p className="text-gray-600 text-sm font-mono">{user?._id || 'Loading...'}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
              Change Password
            </button>
            <button className="w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors">
              Export Data
            </button>
            <button className="w-full text-left px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Budget Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Budget Management</h2>
          <button
            onClick={() => setShowBudgetForm(!showBudgetForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showBudgetForm ? 'Cancel' : 'Add Budget'}
          </button>
        </div>

        {/* Budget Form */}
        {showBudgetForm && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium mb-4">
              {editingBudget ? 'Edit Budget' : 'Create New Budget'}
            </h3>
            <form onSubmit={handleSubmitBudget} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Category
                  </label>
                  <select
                    value={budgetForm.category}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, category: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Budget Limit (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={budgetForm.limitAmount}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, limitAmount: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Month
                  </label>
                  <input
                    type="month"
                    value={budgetForm.month}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, month: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : (editingBudget ? 'Update Budget' : 'Create Budget')}
                </button>
                <button
                  type="button"
                  onClick={resetBudgetForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Budgets List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Current Budgets</h3>
          {budgets.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No budgets created yet</p>
          ) : (
            <div className="grid gap-4">
              {budgets.map((budget) => {
                const status = getBudgetStatus(budget);
                const percentage = (budget.currentSpent / budget.limitAmount) * 100;

                return (
                  <div key={budget._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{budget.category}</h4>
                        <p className="text-gray-600 text-sm">
                          {new Date(budget.month + '-01').toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.text}
                        </span>
                        <button
                          onClick={() => handleEditBudget(budget)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spent: {formatCurrency(budget.currentSpent)}</span>
                        <span>Limit: {formatCurrency(budget.limitAmount)}</span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${percentage >= 100 ? 'bg-red-500' :
                              percentage >= 80 ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>

                      <div className="text-right text-sm text-gray-600">
                        {percentage.toFixed(1)}% used
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}