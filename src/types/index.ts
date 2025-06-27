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
  