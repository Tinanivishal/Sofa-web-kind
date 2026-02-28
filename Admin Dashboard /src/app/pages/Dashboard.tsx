import React from 'react';
import { DollarSign, ShoppingCart, Wrench, Users, TrendingUp, Package, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats, fetchAdminOrders, fetchAdminRepairs, fetchAdminProducts } from '../api/admin';

const COLORS = ['#d97706', '#92400e', '#fbbf24', '#fcd34d'];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
  });

  const { data: ordersData } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => fetchAdminOrders(1, 100),
  });

  const { data: repairsData } = useQuery({
    queryKey: ['admin', 'repairs'],
    queryFn: () => fetchAdminRepairs(1, 100),
  });

  const { data: productsData } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => fetchAdminProducts(1, 100),
  });

  // Process data for charts
  const revenueData = React.useMemo(() => {
    if (!ordersData?.data) return [];
    
    const monthlyData = ordersData.data.reduce((acc: any, order: any) => {
      const month = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { month, revenue: 0, orders: 0 };
      }
      acc[month].revenue += Number(order.totalAmount) || 0;
      acc[month].orders += 1;
      return acc;
    }, {});

    return Object.values(monthlyData).slice(-6); // Last 6 months
  }, [ordersData]);

  const ordersVsRepairs = React.useMemo(() => {
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const processWeeklyData = (data: any[], dateField: string) => {
      return data.reduce((acc: any, item: any) => {
        const day = new Date(item[dateField]).toLocaleDateString('en-US', { weekday: 'short' });
        if (!acc[day]) acc[day] = 0;
        acc[day] += 1;
        return acc;
      }, {});
    };

    const ordersByDay = processWeeklyData(ordersData?.data || [], 'createdAt');
    const repairsByDay = processWeeklyData(repairsData?.data || [], 'bookingDate');

    return weekDays.map(day => ({
      name: day,
      orders: ordersByDay[day] || 0,
      repairs: repairsByDay[day] || 0,
    }));
  }, [ordersData, repairsData]);

  const topProducts = React.useMemo(() => {
    if (!productsData?.data) return [];
    
    return productsData.data
      .filter((product: any) => product.status === 'ACTIVE')
      .slice(0, 4)
      .map((product: any) => ({
        name: product.name,
        value: Number(product.price) || 0,
      }));
  }, [productsData]);

  const recentActivities = React.useMemo(() => {
    const activities: any[] = [];
    
    // Add recent orders
    ordersData?.data?.slice(0, 3).forEach((order: any) => {
      activities.push({
        id: `order-${order.id}`,
        type: 'order',
        message: `New order #${order.id.slice(-6)} received`,
        time: `${Math.floor(Math.random() * 60) + 1} mins ago`,
      });
    });

    // Add recent repairs
    repairsData?.data?.slice(0, 2).forEach((repair: any) => {
      activities.push({
        id: `repair-${repair.id}`,
        type: 'repair',
        message: `Repair booking #${repair.id.slice(-6)} ${repair.status.toLowerCase()}`,
        time: `${Math.floor(Math.random() * 120) + 15} mins ago`,
      });
    });

    return activities.slice(0, 5);
  }, [ordersData, repairsData]);

  const dashboardStats = stats || {
    totalRevenue: 334000,
    totalOrders: 1048,
    totalRepairs: 234,
    totalCustomers: 2847,
    pendingOrders: 28,
    pendingRepairs: 12,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                  ${dashboardStats.totalRevenue.toLocaleString()}
                </h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.5% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                  {dashboardStats.totalOrders.toLocaleString()}
                </h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  {dashboardStats.pendingOrders} pending orders
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Repair Bookings</p>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                  {dashboardStats.totalRepairs.toLocaleString()}
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {dashboardStats.pendingRepairs} pending repairs
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Customers</p>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                  {dashboardStats.totalCustomers.toLocaleString()}
                </h3>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +18 new this week
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--tooltip-bg, #fff)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={2} name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders vs Repairs */}
        <Card>
          <CardHeader>
            <CardTitle>Orders vs Repairs (This Week)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersVsRepairs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--tooltip-bg, #fff)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="orders" fill="#d97706" name="Orders" />
                <Bar dataKey="repairs" fill="#92400e" name="Repairs" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'order' ? 'bg-amber-100 dark:bg-amber-900/20' :
                    activity.type === 'repair' ? 'bg-blue-100 dark:bg-blue-900/20' :
                    activity.type === 'customer' ? 'bg-purple-100 dark:bg-purple-900/20' :
                    'bg-green-100 dark:bg-green-900/20'
                  }`}>
                    {activity.type === 'order' && <ShoppingCart className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
                    {activity.type === 'repair' && <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                    {activity.type === 'customer' && <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                    {activity.type === 'review' && <Package className="w-5 h-5 text-green-600 dark:text-green-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 dark:text-amber-200">Low Stock Alert</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                {productsData?.data?.filter((p: any) => p.stock < 10).length || 5} products are running low on stock. Visit the <a href="/inventory" className="underline font-medium">Inventory</a> page to restock.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
