'use client';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { AnalysisData, Suggestion, CategoryInsights, SpendingSummary, SpendingTrends } from '@/types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement);

export default function Analysis(): JSX.Element {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [categoryInsights, setCategoryInsights] = useState<CategoryInsights | null>(null);
  const [spendingSummary, setSpendingSummary] = useState<SpendingSummary | null>(null);
  const [spendingTrends, setSpendingTrends] = useState<SpendingTrends | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [trendPeriod, setTrendPeriod] = useState<number>(30);

  useEffect(() => {
    fetchAllAnalysisData();
  }, []);

  const fetchAllAnalysisData = async (): Promise<void> => {
    try {
      await Promise.all([
        getComprehensiveAnalysis(),
        getSpendingSummary(),
        getSpendingTrends()
      ]);
    } catch (error) {
      console.error('Error fetching analysis data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getComprehensiveAnalysis = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PYTHON_URL || 'http://localhost:8000'}/api/v1/analysis/comprehensive`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAnalysisData(result.data);
          setSuggestions(result.data.suggestions || []);
        }
      }
    } catch (error) {
      console.error('Error fetching comprehensive analysis:', error);
    }
  };

  const getCategoryInsights = async (category: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PYTHON_URL || 'http://localhost:8000'}/api/v1/analysis/category/${category}`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCategoryInsights(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching category insights:', error);
    }
  };

  const getSpendingSummary = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PYTHON_URL || 'http://localhost:8000'}/api/v1/analysis/summary`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSpendingSummary(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching spending summary:', error);
    }
  };

  const getSpendingTrends = async (days: number = 30): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PYTHON_URL || 'http://localhost:8000'}/api/v1/analysis/trends?days=${days}`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSpendingTrends(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching spending trends:', error);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleCategorySelect = (category: string): void => {
    setSelectedCategory(category);
    getCategoryInsights(category);
  };

  const handleTrendPeriodChange = (days: number): void => {
    setTrendPeriod(days);
    getSpendingTrends(days);
  };

  // Chart configurations
  const categoryAnalysisChart = analysisData?.category_analysis ? {
    labels: Object.keys(analysisData.category_analysis),
    datasets: [{
      data: Object.values(analysisData.category_analysis).map((cat: any) => cat.total_amount),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#FF6B6B', '#4ECDC4'
      ],
      borderWidth: 1
    }]
  } : null;

  const spendingSummaryChart = spendingSummary ? {
    labels: ['Last 7 Days', 'Last 30 Days', 'Last 90 Days'],
    datasets: [{
      label: 'Total Spent',
      data: [
        spendingSummary.last_7_days?.total_spent || 0,
        spendingSummary.last_30_days?.total_spent || 0,
        spendingSummary.last_90_days?.total_spent || 0
      ],
      backgroundColor: '#36A2EB',
      borderColor: '#36A2EB',
      borderWidth: 1
    }]
  } : null;

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
        <div className="text-lg">Loading analysis...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Expense Analysis</h1>

      {/* Comprehensive Analysis */}
      {analysisData && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Comprehensive Analysis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Expenses</h3>
              <p className="text-3xl font-bold text-blue-600">{analysisData.expense_count}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Amount</h3>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(analysisData.total_expenses)}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Analysis Period</h3>
              <p className="text-xl font-bold text-purple-600">{analysisData.period}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Analysis Date</h3>
              <p className="text-sm font-medium text-gray-600">
                {new Date(analysisData.analysis_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Spending Trends */}
          {analysisData.trends && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Spending Trends</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Trend</p>
                  <p className="text-lg font-semibold capitalize">{analysisData.trends.trend}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Daily Average</p>
                  <p className="text-lg font-semibold">{formatCurrency(analysisData.trends.daily_average)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Recent Weekly Avg</p>
                  <p className="text-lg font-semibold">{formatCurrency(analysisData.trends.recent_weekly_avg)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Earlier Weekly Avg</p>
                  <p className="text-lg font-semibold">{formatCurrency(analysisData.trends.earlier_weekly_avg)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Highest Spending Day</p>
                  <p className="text-sm font-medium">{analysisData.trends.highest_spending_day?.date ?? "no date"}
                  </p>
                  <p className="text-lg font-semibold">{formatCurrency(analysisData.trends.highest_spending_day?.amount ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lowest Spending Day</p>
                  <p className="text-sm font-medium">{analysisData.trends.lowest_spending_day?.date??"no date"}</p>
                  <p className="text-lg font-semibold">{formatCurrency(analysisData.trends.lowest_spending_day?.amount??0)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Category Analysis Chart */}
          {categoryAnalysisChart && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Category Analysis</h3>
              <div className="h-64">
                <Pie data={categoryAnalysisChart} options={chartOptions} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">AI Suggestions</h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, idx) => (
              <div key={idx} className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <p className="text-sm text-blue-800">{suggestion.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spending Summary */}
      {spendingSummary && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Spending Summary</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Period Comparison</h3>
              <div className="space-y-4">
                {Object.entries(spendingSummary).map(([period, data]) => (
                  <div key={period} className="border-b border-gray-200 pb-3 last:border-b-0">
                    <h4 className="font-medium text-gray-800 capitalize">
                      {period.replace('_', ' ')}
                    </h4>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Spent</p>
                        <p className="font-semibold">{formatCurrency(data.total_spent)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Transactions</p>
                        <p className="font-semibold">{data.transaction_count}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Average Transaction</p>
                        <p className="font-semibold">{formatCurrency(data.average_transaction)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Top Category</p>
                        <p className="font-semibold">{data.top_category || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {spendingSummaryChart && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Spending Comparison</h3>
                <div className="h-64">
                  <Bar data={spendingSummaryChart} options={chartOptions} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Insights */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Category Insights</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Category for Detailed Analysis</h3>
          <div className="flex flex-wrap gap-2">
            {analysisData?.category_analysis && Object.keys(analysisData.category_analysis).map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {categoryInsights && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {categoryInsights.category} Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(categoryInsights.total_spent)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-green-600">{categoryInsights.transaction_count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Transaction</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(categoryInsights.average_transaction)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Daily Average</p>
                <p className="text-lg font-semibold">{formatCurrency(categoryInsights.daily_average)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Highest Expense</p>
                <p className="text-lg font-semibold">{formatCurrency(categoryInsights.highest_expense)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Lowest Expense</p>
                <p className="text-lg font-semibold">{formatCurrency(categoryInsights.lowest_expense)}</p>
              </div>
            </div>

            {categoryInsights.recent_transactions && categoryInsights.recent_transactions.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-3">Recent Transactions</h4>
                <div className="space-y-2">
                  {categoryInsights.recent_transactions.map((transaction, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Spending Trends */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Spending Trends</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Time Period</h3>
          <div className="flex gap-2">
            {[7, 30, 60, 90].map((days) => (
              <button
                key={days}
                onClick={() => handleTrendPeriodChange(days)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  trendPeriod === days
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {days} days
              </button>
            ))}
          </div>
        </div>

        {spendingTrends && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Trends for Last {spendingTrends.period_days} Days
            </h3>
            <div className="space-y-4">
              {Object.entries(spendingTrends.trends || {}).map(([key, value]) => (
                <div key={key} className="p-4 border border-gray-200 rounded">
                  <h4 className="font-medium text-gray-800 capitalize mb-2">
                    {key.replace('_', ' ')}
                  </h4>
                  <p className="text-gray-600">{JSON.stringify(value)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}