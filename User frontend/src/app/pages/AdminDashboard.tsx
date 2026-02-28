import { motion } from 'motion/react';
import { Package, Users, DollarSign, Wrench, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { apiFetch, PaginatedResponse } from '../api/client';

const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 19000 },
  { month: 'Mar', revenue: 15000 },
  { month: 'Apr', revenue: 22000 },
  { month: 'May', revenue: 28000 },
  { month: 'Jun', revenue: 32000 },
];

interface AdminOrder {
  id: string;
  totalAmount: number | string;
  status: string;
  userId: string;
}

interface AdminRepair {
  id: string;
  status: string;
  repairType: string;
}

export const AdminDashboard = () => {
  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => apiFetch<PaginatedResponse<AdminOrder>>('/admin/orders?page=1&limit=50'),
  });

  const {
    data: repairsData,
    isLoading: repairsLoading,
    isError: repairsError,
  } = useQuery({
    queryKey: ['admin', 'repairs'],
    queryFn: () => apiFetch<PaginatedResponse<AdminRepair>>('/admin/repairs?page=1&limit=50'),
  });

  const totalOrders = ordersData?.meta.total ?? 0;
  const totalRevenue =
    ordersData?.data.reduce((sum, order) => {
      const amount =
        typeof order.totalAmount === 'string'
          ? Number(order.totalAmount)
          : order.totalAmount;
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0) ?? 0;

  const activeCustomers =
    ordersData?.data.reduce((set, order) => {
      set.add(order.userId);
      return set;
    }, new Set<string>()).size ?? 0;

  const repairBookings = repairsData?.meta.total ?? 0;

  const stats = [
    {
      label: 'Total Orders',
      value: totalOrders.toLocaleString('en-US'),
      icon: Package,
      change: '+12%',
      color: 'bg-blue-500',
    },
    {
      label: 'Total Revenue',
      value: `$${Math.round(totalRevenue).toLocaleString('en-US')}`,
      icon: DollarSign,
      change: '+18%',
      color: 'bg-green-500',
    },
    {
      label: 'Active Customers',
      value: activeCustomers.toLocaleString('en-US'),
      icon: Users,
      change: '+8%',
      color: 'bg-purple-500',
    },
    {
      label: 'Repair Bookings',
      value: repairBookings.toLocaleString('en-US'),
      icon: Wrench,
      change: '+24%',
      color: 'bg-orange-500',
    },
  ];

  const loading = ordersLoading || repairsLoading;
  const error = ordersError || repairsError;

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your business performance</p>
          {loading && (
            <p className="mt-2 text-sm text-muted-foreground">
              Loading latest admin data...
            </p>
          )}
          {error && !loading && (
            <p className="mt-2 text-sm text-destructive">
              Unable to load admin data. Make sure you are logged in with an admin account.
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">{stat.change}</span>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-card rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6">Revenue Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8B6F47" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <div className="font-semibold text-sm">Order #ORD{1000 + i}</div>
                    <div className="text-xs text-muted-foreground">Customer Name</div>
                  </div>
                  <div className="text-sm font-bold text-primary">$299</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold mb-4">Pending Repairs</h3>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <div className="font-semibold text-sm">Booking #BK{2000 + i}</div>
                    <div className="text-xs text-muted-foreground">Foam Replacement</div>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Pending</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold mb-4">Top Products</h3>
            <div className="space-y-3">
              {['Italian Leather', 'Velvet Fabric', 'Memory Foam'].map((product, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="font-semibold text-sm">{product}</div>
                  <div className="text-xs text-muted-foreground">{50 - i * 10} sold</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
