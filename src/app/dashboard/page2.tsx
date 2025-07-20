'use client';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { DashboardStats, Budget } from '@/types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);



export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    // Core financial metrics
    totalSpent: 0,
    totalIncome: 0,
    netAmount: 0,

    // Category analysis
    topCategory: '',
    topIncomeCategory: '',
    categoryData: {},
    incomeCategoryData: {},

    // Payment methods
    topPaymentMethods: [],
    paymentMethodData: {},

    // Historical data
    monthlyData: []
  });
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    fetchDashboardData();
    fetchBudgets();

  }, []);

  const fetchDashboardData = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/transactions/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data: DashboardStats = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
 

  const fetchBudgets = async (): Promise<void> => {
    try {
      // const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/budgets`,
        {
          // headers: { 'Authorization': `Bearer ${token}` }
          credentials: 'include', // Important: includes cookies in request
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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getBudgetStatus = (budget: Budget): { color: string; text: string; percentage: number } => {
    const percentage = (budget.currentSpent / budget.limitAmount) * 100;

    if (percentage >= 100) {
      return { color: 'text-red-600 bg-red-100', text: 'Over Budget', percentage };
    } else if (percentage >= 80) {
      return { color: 'text-orange-600 bg-orange-100', text: 'Near Limit', percentage };
    } else {
      return { color: 'text-green-600 bg-green-100', text: 'On Track', percentage };
    }
  };

  // Get budgets that need alerts (>80% spent)
  const alertBudgets = budgets.filter(budget => {
    const percentage = (budget.currentSpent / budget.limitAmount) * 100;
    return percentage >= 80;
  });

  // Check if all budgets are on track
  const allBudgetsOnTrack = budgets.length > 0 && alertBudgets.length === 0;

  const pieData = {
    labels: Object.keys(stats.categoryData),
    datasets: [{
      data: Object.values(stats.categoryData),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#FF6384'
      ],
      borderWidth: 1
    }]
  };

  const lineData = {
    labels: stats.monthlyData.map(item => item.month),
    datasets: [{
      label: 'Monthly Spending',
      data: stats.monthlyData.map(item => item.amount),
      borderColor: '#36A2EB',
      backgroundColor: 'rgba(54, 162, 235, 0.1)',
      tension: 0.1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Budget Alerts */}
      {alertBudgets.length > 0 ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Budget Alert!</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>You are approaching or exceeding your budget limits:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {alertBudgets.map((budget) => {
                    const status = getBudgetStatus(budget);
                    const remaining = budget.limitAmount - budget.currentSpent;
                    return (
                      <li key={budget._id}>
                        <strong>{budget.category}</strong>: {status.percentage.toFixed(1)}% used
                        {remaining > 0 ? (
                          <span className="text-green-600"> ({formatCurrency(remaining)} remaining)</span>
                        ) : (
                          <span className="text-red-600"> (Over by {formatCurrency(Math.abs(remaining))})</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : allBudgetsOnTrack ? (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">All Budgets On Track!</h3>
              <p className="mt-1 text-sm text-green-700">
                Great job! All your budgets are within healthy spending limits.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Spent This Month</h3>
          <p className="text-3xl font-bold text-blue-600">₹{stats.totalSpent.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700">Top Category</h3>
          <p className="text-2xl font-bold text-green-600">{stats.topCategory || 'No data'}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700">Top Payment Methods</h3>
          <div className="space-y-1">
            {stats.topPaymentMethods.slice(0, 3).map((method, index) => (
              <p key={index} className="text-sm text-gray-600">{index + 1}. {method}</p>
            ))}
            {stats.topPaymentMethods.length === 0 && (
              <p className="text-sm text-gray-400">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Budget Overview - Replicated from Account Page */}
      {budgets.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Budget Overview - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.text}
                    </span>
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
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Category-wise Spending</h3>
          <div className="h-64">
            {Object.keys(stats.categoryData).length > 0 ? (
              <Pie data={pieData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No Transaction data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Monthly Trend</h3>
          <div className="h-64">
            {stats.monthlyData.length > 0 ? (
              <Line data={lineData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No monthly data available
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Analysis Section
{AnalysisData && (
  <div className="mt-10">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Spending Analysis</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Summary</h3>
        <p><strong>Total Transactions:</strong> {AnalysisData.Transaction_count}</p>
        <p><strong>Total Amount Spent:</strong> {formatCurrency(AnalysisData.total_Transactions)}</p>
        <p><strong>Analysis Period:</strong> {AnalysisData.period}</p>
        <p><strong>Analysis Date:</strong> {new Date(AnalysisData.analysis_date).toLocaleDateString()}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Spending Trend</h3>
        {AnalysisData.trends && (
          <>
            <p><strong>Trend:</strong> {AnalysisData.trends.trend}</p>
            <p><strong>Daily Average:</strong> {formatCurrency(AnalysisData.trends.daily_average)}</p>
            <p><strong>Recent Weekly Avg:</strong> {formatCurrency(AnalysisData.trends.recent_weekly_avg)}</p>
            <p><strong>Earlier Weekly Avg:</strong> {formatCurrency(AnalysisData.trends.earlier_weekly_avg)}</p>
            <p><strong>Highest Spending Day:</strong> {AnalysisData.trends.highest_spending_day.date} ({formatCurrency(AnalysisData.trends.highest_spending_day.amount)})</p>
            <p><strong>Lowest Spending Day:</strong> {AnalysisData.trends.lowest_spending_day.date} ({formatCurrency(AnalysisData.trends.lowest_spending_day.amount)})</p>
          </>
        )}
      </div>
    </div>

    {Suggestions.length > 0 && (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Suggestions</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          {Suggestions.map((suggestion, idx) => (
            <li key={idx}>{suggestion.message}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
)} */}

    </div>
  );
}