'use client';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { DashboardStats, Budget } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    PiggyBank,
    CreditCard,
    Target,
    AlertTriangle,
    CheckCircle,
    DollarSign,
    BarChart3,
    PieChart,
    Activity
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement);

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
            // const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/transactions/dashboard`, {
                // headers: { 'Authorization': `Bearer ${token}` }
                credentials: 'include', // Important: includes cookies in request

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
                // console.log('Fetched budgets:', data);
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

    const getBudgetStatus = (budget: Budget): { color: string; text: string; percentage: number; variant: "default" | "secondary" | "destructive" | "outline" } => {
        const percentage = (budget.currentSpent / budget.limitAmount) * 100;

        if (percentage >= 100) {
            return { color: 'text-red-600', text: 'Over Budget', percentage, variant: 'destructive' };
        } else if (percentage >= 80) {
            return { color: 'text-orange-600', text: 'Near Limit', percentage, variant: 'outline' };
        } else {
            return { color: 'text-green-600', text: 'On Track', percentage, variant: 'default' };
        }
    };

    // Get budgets that need alerts (>80% spent)
    const alertBudgets = budgets.filter(budget => {
        const percentage = (budget.currentSpent / budget.limitAmount) * 100;
        return percentage >= 80;
    });

    const allBudgetsOnTrack = budgets.length > 0 && alertBudgets.length === 0;

    // Chart configurations
    const expensePieData = {
        labels: Object.keys(stats.categoryData),
        datasets: [{
            data: Object.values(stats.categoryData),
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                '#9966FF', '#FF9F40', '#FF6B6B', '#4ECDC4'
            ],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    };

    const incomePieData = {
        labels: Object.keys(stats.incomeCategoryData || {}),
        datasets: [{
            data: Object.values(stats.incomeCategoryData || {}),
            backgroundColor: [
                '#10B981', '#059669', '#047857', '#065F46',
                '#064E3B', '#022C22', '#14B8A6', '#0D9488'
            ],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    };

    const monthlyTrendData = {
        labels: stats.monthlyData.map(item => item.month),
        datasets: [
            {
                label: 'Expenses',
                data: stats.monthlyData.map(item => item.amount),
                borderColor: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4
            },
            ...(stats.monthlyData.some(item => item.income) ? [{
                label: 'Income',
                data: stats.monthlyData.map(item => item.income || 0),
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            }] : []),
            ...(stats.monthlyData.some(item => item.net) ? [{
                label: 'Net Amount',
                data: stats.monthlyData.map(item => item.net || 0),
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }] : [])
        ]
    };

    const paymentMethodData = {
        labels: Object.keys(stats.paymentMethodData),
        datasets: [{
            label: 'Amount',
            data: Object.values(stats.paymentMethodData),
            backgroundColor: [
                '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE',
                '#EDE9FE', '#F3F4F6'
            ],
            borderColor: '#6366F1',
            borderWidth: 1
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 20,
                    usePointStyle: true
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <div className="text-lg font-medium">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
                <Badge variant="outline" className="text-sm">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Badge>
            </div>

            {/* Budget Alerts */}
            {alertBudgets.length > 0 ? (
                <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">Budget Alert!</AlertTitle>
                    <AlertDescription className="text-red-700">
                        <p className="mb-2">You are approaching or exceeding your budget limits:</p>
                        <ul className="space-y-1">
                            {alertBudgets.map((budget) => {
                                const status = getBudgetStatus(budget);
                                const remaining = budget.limitAmount - budget.currentSpent;
                                return (
                                    <li key={budget._id} className="flex items-center justify-between">
                                        <span>
                                            <strong>{budget.category}</strong>: {status.percentage.toFixed(1)}% used
                                        </span>
                                        {remaining > 0 ? (
                                            <Badge variant="outline" className="text-green-600 border-green-600">
                                                {formatCurrency(remaining)} remaining
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive">
                                                Over by {formatCurrency(Math.abs(remaining))}
                                            </Badge>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </AlertDescription>
                </Alert>
            ) : allBudgetsOnTrack ? (
                <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">All Budgets On Track!</AlertTitle>
                    <AlertDescription className="text-green-700">
                        Great job! All your budgets are within healthy spending limits.
                    </AlertDescription>
                </Alert>
            ) : null}

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
                        <Wallet className="h-5 w-5 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">
                            {formatCurrency(stats.totalSpent)}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">This month</p>
                    </CardContent>
                </Card>

                {stats.totalIncome !== undefined && (
                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Income</CardTitle>
                            <DollarSign className="h-5 w-5 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">
                                {formatCurrency(stats.totalIncome)}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">This month</p>
                        </CardContent>
                    </Card>
                )}

                {stats.netAmount !== undefined && (
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Net Amount</CardTitle>
                            {stats.netAmount >= 0 ? (
                                <TrendingUp className="h-5 w-5 text-blue-500" />
                            ) : (
                                <TrendingDown className="h-5 w-5 text-blue-500" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-bold ${stats.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(Math.abs(stats.netAmount))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {stats.netAmount >= 0 ? 'Positive' : 'Negative'} balance
                            </p>
                        </CardContent>
                    </Card>
                )}

                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Top Categories</CardTitle>
                        <Target className="h-5 w-5 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {stats.topCategory && (
                                <div>
                                    <Badge variant="outline" className="mb-1">Expense</Badge>
                                    <p className="text-lg font-semibold text-purple-600">{stats.topCategory}</p>
                                </div>
                            )}
                            {stats.topIncomeCategory && (
                                <div>
                                    <Badge variant="outline" className="mb-1">Income</Badge>
                                    <p className="text-lg font-semibold text-green-600">{stats.topIncomeCategory}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payment Methods Card */}
            {stats.topPaymentMethods.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Top Payment Methods
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {stats.topPaymentMethods.slice(0, 6).map((method, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">{method}</span>
                                    <Badge variant="secondary">#{index + 1}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Budget Overview */}
            {budgets.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PiggyBank className="h-5 w-5" />
                            Budget Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {budgets.map((budget) => {
                            const status = getBudgetStatus(budget);
                            const remaining = budget.limitAmount - budget.currentSpent;

                            return (
                                <div key={budget._id} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-semibold text-lg">{budget.category}</h4>
                                            <p className="text-sm text-gray-500">
                                                {new Date(budget.month + '-01').toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <Badge variant={status.variant}>{status.text}</Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Spent: <strong>{formatCurrency(budget.currentSpent)}</strong></span>
                                            <span>Limit: <strong>{formatCurrency(budget.limitAmount)}</strong></span>
                                        </div>

                                        <Progress
                                            value={Math.min(status.percentage, 100)}
                                            className="h-3"
                                        />

                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>{status.percentage.toFixed(1)}% used</span>
                                            {remaining > 0 ? (
                                                <span className="text-green-600">{formatCurrency(remaining)} remaining</span>
                                            ) : (
                                                <span className="text-red-600">Over by {formatCurrency(Math.abs(remaining))}</span>
                                            )}
                                        </div>
                                    </div>
                                    {budgets.indexOf(budget) < budgets.length - 1 && <Separator />}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Expense Categories Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5 text-red-500" />
                            Expense Categories
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            {Object.keys(stats.categoryData).length > 0 ? (
                                <Pie data={expensePieData} options={chartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center">
                                        <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p>No expense data available</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Income Categories Pie Chart */}
                {Object.keys(stats.incomeCategoryData || {}).length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-green-500" />
                                Income Sources
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <Pie data={incomePieData} options={chartOptions} />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Payment Methods Bar Chart */}
                {Object.keys(stats.paymentMethodData).length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-purple-500" />
                                Payment Method Usage
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <Bar data={paymentMethodData} options={chartOptions} />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Monthly Trends Line Chart */}
                <Card className={Object.keys(stats.incomeCategoryData || {}).length > 0 ? "lg:col-span-1" : "lg:col-span-2"}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-blue-500" />
                            Monthly Financial Trends
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            {stats.monthlyData.length > 0 ? (
                                <Line data={monthlyTrendData} options={chartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center">
                                        <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p>No monthly trend data available</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}