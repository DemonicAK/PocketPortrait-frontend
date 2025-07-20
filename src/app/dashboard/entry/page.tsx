'use client';
import { useState, FormEvent } from 'react';
import { Transaction } from '@/types';

const categories: string[] = ['Food', 'Rent', 'Shopping', 'Transport', 'Entertainment', 'Healthcare', 'Other'];
const incomeCategories: string[] = ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Bonus', 'Other'];
const paymentMethods: string[] = ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking'];

export default function EntryPage() {
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [transaction, setTransaction] = useState<Omit<Transaction, '_id' | 'userId' | 'createdAt'>>({
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    notes: ''
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      // const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // Uncomment if you need to send token in headers
        },
        credentials: 'include', // Important: includes cookies in request
        body: JSON.stringify({
          ...transaction,
          type: transactionType,
          ...(transactionType === 'expense' && { from: 'me' }),
          ...(transactionType === 'income' && { to: 'me' }),
        })
      });

      if (response.ok) {
        alert(`${transactionType} added successfully!`);
        setTransaction({
          amount: 0,
          category: '',
          date: new Date().toISOString().split('T')[0],
          paymentMethod: '',
          notes: ''
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || `Failed to add ${transactionType}`}`);
      }
    } catch (error) {
      alert(`Error adding ${transactionType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof transaction, value: string | number): void => {
    setTransaction(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTransactionTypeChange = (type: 'expense' | 'income'): void => {
    setTransactionType(type);
    // Reset category when switching types
    setTransaction(prev => ({
      ...prev,
      category: ''
    }));
  };

  const currentCategories = transactionType === 'expense' ? categories : incomeCategories;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Transaction</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Transaction Type Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-3">
            Transaction Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="transactionType"
                value="expense"
                checked={transactionType === "expense"}
                onChange={() => handleTransactionTypeChange('expense')}
                className="mr-2 text-red-600 focus:ring-red-500"
                disabled={loading}
              />
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${transactionType === 'expense'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-600'
                }`}>
                💸 Expense
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="transactionType"
                value="income"
                checked={transactionType === 'income'}
                onChange={() => handleTransactionTypeChange('income')}
                className="mr-2 text-green-600 focus:ring-green-500"
                disabled={loading}
              />
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${transactionType === 'income'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
                }`}>
                💰 Income
              </span>
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={transaction.amount || ''}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none text-gray-700 ${transactionType === 'expense'
                  ? 'border-red-200 focus:border-red-500'
                  : 'border-green-200 focus:border-green-500'
                  }`}
                required
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Category
              </label>
              <select
                value={transaction.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none text-gray-700 ${transactionType === 'expense'
                  ? 'border-red-200 focus:border-red-500'
                  : 'border-green-200 focus:border-green-500'
                  }`}
                required
                disabled={loading}
              >
                <option value="">Select Category</option>
                {currentCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date
              </label>
              <input
                type="date"
                value={transaction.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500 text-gray-700"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Payment Method
              </label>
              <select
                value={transaction.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500 text-gray-700"
                required
                disabled={loading}
              >
                <option value="">Select Payment Method</option>
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={transaction.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500 text-gray-700"
              rows={3}
              disabled={loading}
              placeholder={`Add notes about this ${transactionType}...`}
            />
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50 ${transactionType === 'expense'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
                }`}
            >
              {loading
                ? `Adding ${transactionType === 'expense' ? 'Expense' : 'Income'}...`
                : `Add ${transactionType === 'expense' ? 'Expense' : 'Income'}`
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}