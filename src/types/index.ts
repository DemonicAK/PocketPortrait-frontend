export interface User {
    id: string;
    email: string;
    name?: string;
  }
  
  export interface Transaction {
    _id?: string;
    userId?: string;
    amount: number;
    from?: string;
    to?: string;
    date: string;
    paymentMethod: string;
    createdAt?: string;
    secondpartyId?: string;

    category: string;
    notes?: string;
    type?: 'expense' | 'income';
    tags?: string[];
    recurring?: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    secondpartyType?: 'individual' | 'business';
  }
  
  export interface Budget {
    _id?: string;
    category: string;
    limit: number;
    spent: number;
    userId?: string;
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
    transactions: Transaction[];
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
  //   total_Transactions: number;
  //   Transaction_count: number;
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

  export interface AnalysisData { Transaction_count: number; total_Transactions: number; period: string; analysis_date: string; category_analysis: Record<string, any>; trends?: { trend: string; daily_average: number; recent_weekly_avg: number; earlier_weekly_avg: number; highest_spending_day: { date: string; amount: number; }; lowest_spending_day: { date: string; amount: number; }; }; }

export interface Suggestion { message: string; type?: string; }

export interface CategoryInsights { category: string; total_spent: number; transaction_count: number; average_transaction: number; daily_average: number; highest_Transaction: number; lowest_Transaction: number; recent_transactions?: Array<{ description: string; date: string; amount: number; }>; }

export interface SpendingSummary { last_7_days?: { total_spent: number; transaction_count: number; average_transaction: number; top_category?: string; }; last_30_days?: { total_spent: number; transaction_count: number; average_transaction: number; top_category?: string; }; last_90_days?: { total_spent: number; transaction_count: number; average_transaction: number; top_category?: string; }; }

export interface SpendingTrends { period_days: number; trends?: Record<string, any>; }



export interface DashboardStats {
  // Core financial metrics
  totalSpent: number;
  totalIncome?: number;
  netAmount?: number;
  
  // Category analysis
  topCategory: string;
  topIncomeCategory?: string;
  categoryData: { [key: string]: number };
  incomeCategoryData?: { [key: string]: number };
  
  // Payment methods
  topPaymentMethods: string[];
  paymentMethodData: { [key: string]: number };
  
  // Historical data
  monthlyData: { 
    month: string; 
    amount: number; // Expenses for backward compatibility
    income?: number;
    net?: number;
  }[];
}