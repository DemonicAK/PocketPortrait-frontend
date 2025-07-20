'use client';
import { useState, useEffect } from 'react';
import { Transaction, PaginationInfo, TransactionsResponse } from '@/types';
import {Button } from '@/components/ui/button';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    startDate: '',
    endDate: '',
    type: 'all' // 'all', 'Transaction', 'income'
  });

  const rowOptions = [5, 10, 20, 50, 100];

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async (): Promise<void> => {
    setLoading(true);
    try {
      // const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.type !== 'all' && { type: filters.type })
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/Transactions/transactions?${queryParams}`,
        {
          // headers: { 'Authorization': `Bearer ${token}` }
          credentials: 'include', // Important: includes cookies in request
        }
      );

      if (response.ok) {
        const data: TransactionsResponse = await response.json();
        setTransactions(data.transactions);
        setPagination(data.pagination);
      } else {
        console.error('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number): void => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number): void => {
    setFilters(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleDateFilter = (startDate: string, endDate: string): void => {
    setFilters(prev => ({ ...prev, startDate, endDate, page: 1 }));
  };

  const clearDateFilter = (): void => {
    setFilters(prev => ({ ...prev, startDate: '', endDate: '', type: 'all', page: 1 }));
  };

  const handleEditTransaction = (transaction: Transaction): void => {
    setEditingTransaction({
      ...transaction,
      from: transaction.from || ' ',
      to: transaction.to || ' '
    });
  };

  const handleDelete = async (transactionId?: string): Promise<void> => {
    if (!transactionId) return;

    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      // const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/transactions/${transactionId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
          },
          credentials: 'include' // Important: includes cookies in request
        }
      );

      if (response.ok) {
        // alert('Transaction deleted successfully!');
        fetchTransactions();
        setEditingTransaction(null);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to delete transaction'}`);
      }
    } catch (error) {
      alert(`Error deleting transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (!editingTransaction) return;

    try {
      // const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/transactions/${editingTransaction._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
          },
          credentials: 'include', // Important: includes cookies in request
          body: JSON.stringify(editingTransaction)
        }
      );

      if (response.ok) {
        alert('Transaction updated successfully!');
        setEditingTransaction(null);
        fetchTransactions();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to update transaction'}`);
      }
    } catch (error) {
      alert(`Error updating transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const formatAmount = (amount: number, type?: string): string => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);

    return type === 'income' ? `+${formatted}` : `-${formatted}`;
  };

  const getTransactionTypeColor = (type?: string) => {
    if (type === 'income') return 'text-green-600';
    return 'text-red-600';
  };

  const getTransactionTypeBg = (type?: string) => {
    if (type === 'income') return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">All Transactions</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Transaction Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Transactions</option>
              <option value="Transaction">Transactions Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Rows per page
            </label>
            <select
              value={filters.limit}
              onChange={(e) => handleLimitChange(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              {rowOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleDateFilter(filters.startDate, filters.endDate)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Filter
            </button>
            <button
              onClick={clearDateFilter}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-lg">Loading transactions...</div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">No transactions found</div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From/To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionTypeBg(transaction.type)}`}>
                          {transaction.type === 'income' ? '💰 Income' : '💸 Expense'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(transaction.date)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getTransactionTypeColor(transaction.type)}`}>
                        {formatAmount(transaction.amount, transaction.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="text-xs">
                          <div>From: {transaction.from || ' '}</div>
                          <div>To: {transaction.to || ' '}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.paymentMethod}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {transaction.notes || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEditTransaction(transaction)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-700">
                  <span>
                    Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                    {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                    {pagination.totalItems} results
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        const current = pagination.currentPage;
                        return page === 1 || page === pagination.totalPages ||
                          (page >= current - 2 && page <= current + 2);
                      })
                      .map((page, index, array) => (
                        <div key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 py-1 text-sm text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 text-sm rounded-md ${page === pagination.currentPage
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {page}
                          </button>
                        </div>
                      ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Transaction</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">From</label>
                <input
                  type="text"
                  value={editingTransaction.from || ' '}
                  onChange={(e) => setEditingTransaction(prev => prev ? { ...prev, from: e.target.value } : null)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">To</label>
                <input
                  type="text"
                  value={editingTransaction.to || ' '}
                  onChange={(e) => setEditingTransaction(prev => prev ? { ...prev, to: e.target.value } : null)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  value={editingTransaction.amount}
                  onChange={(e) => setEditingTransaction(prev => prev ? { ...prev, amount: parseFloat(e.target.value) || 0 } : null)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={editingTransaction.notes || ''}
                  onChange={(e) => setEditingTransaction(prev => prev ? { ...prev, notes: e.target.value } : null)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                onClick={() => handleDelete(editingTransaction?._id)}
                variant="destructive"
                className="px-4 py-2   rounded-md hover:bg-gray-400"
              >
                Delete
              </Button>
              <button
                onClick={() => setEditingTransaction(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}