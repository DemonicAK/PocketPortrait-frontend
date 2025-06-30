export interface User {
    _id: string;
    email: string;
    name?: string;
  }
  
  export interface Expense {
    _id?: string;
    amount: number;
    category: string;
    date: string;
    paymentMethod: string;
    notes?: string;
    userId?: string;
    createdAt?: string;
  }
  
  export interface Budget {
    _id?: string;
    category: string;
    limit: number;
    spent: number;
    userId?: string;
  }
  
  export interface DashboardStats {
    totalSpent: number;
    topCategory: string;
    topPaymentMethods: string[];
    categoryData: { [key: string]: number };
    monthlyData: { month: string; amount: number }[];
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
    message?: string;
  }

  export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
  
  export interface TransactionsResponse {
    expenses: Expense[];
    pagination: PaginationInfo;
  }
  
  export interface Budget {
    _id?: string;
    category: string;
    limitAmount: number;
    currentSpent: number;
    month: string;
    year: number;
  }

  // export interface AnalysisData {
  //   total_expenses: number;
  //   expense_count: number;
  //   category_analysis: Record<string, {
  //     total_spent: number;
  //     transaction_count: number;
  //     average_amount: number;
  //     min_amount: number;
  //     max_amount: number;
  //     percentage_of_total: number;
  //   }>;
  //   trends?: {
  //     weekly_spending: Record<string, number>;
  //     daily_average: number;
  //     trend: 'increasing' | 'decreasing' | 'stable' | 'insufficient_data';
  //     recent_weekly_avg: number;
  //     earlier_weekly_avg: number;
  //     highest_spending_day: { date: string; amount: number };
  //     lowest_spending_day: { date: string; amount: number };
  //   };
  //   suggestions: Array<{
  //     type: 'warning' | 'tip' | 'alert' | 'positive' | 'budget' | 'info' | 'error';
  //     category?: string;
  //     message: string;
  //     priority: 'high' | 'medium' | 'low';
  //     current_spending?: number;
  //     suggested_reduction?: number;
  //     transaction_count?: number;
  //     trend?: string;
  //     suggested_budget?: number;
  //   }>;
  //   period: string;
  //   analysis_date: string;
  //   average_daily_spending?: number;
  //   top_category?: string;
  // }
  
  // export interface Suggestion {
  //   type: 'warning' | 'tip' | 'alert' | 'positive' | 'budget' | 'info' | 'error';
  //   category?: string;
  //   message: string;
  //   priority: 'high' | 'medium' | 'low';
  //   current_spending?: number;
  //   suggested_reduction?: number;
  //   transaction_count?: number;
  //   trend?: string;
  //   suggested_budget?: number;
  // }

  export interface AnalysisData { expense_count: number; total_expenses: number; period: string; analysis_date: string; category_analysis: Record<string, any>; trends?: { trend: string; daily_average: number; recent_weekly_avg: number; earlier_weekly_avg: number; highest_spending_day: { date: string; amount: number; }; lowest_spending_day: { date: string; amount: number; }; }; }

export interface Suggestion { message: string; type?: string; }

export interface CategoryInsights { category: string; total_spent: number; transaction_count: number; average_transaction: number; daily_average: number; highest_expense: number; lowest_expense: number; recent_transactions?: Array<{ description: string; date: string; amount: number; }>; }

export interface SpendingSummary { last_7_days?: { total_spent: number; transaction_count: number; average_transaction: number; top_category?: string; }; last_30_days?: { total_spent: number; transaction_count: number; average_transaction: number; top_category?: string; }; last_90_days?: { total_spent: number; transaction_count: number; average_transaction: number; top_category?: string; }; }

export interface SpendingTrends { period_days: number; trends?: Record<string, any>; }