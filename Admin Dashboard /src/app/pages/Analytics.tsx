import React from 'react';
import { Download, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const salesData = [
  { month: 'Jan', sales: 45000, orders: 120, repairs: 35 },
  { month: 'Feb', sales: 52000, orders: 145, repairs: 42 },
  { month: 'Mar', sales: 48000, orders: 130, repairs: 38 },
  { month: 'Apr', sales: 61000, orders: 168, repairs: 51 },
  { month: 'May', sales: 58000, orders: 155, repairs: 48 },
  { month: 'Jun', sales: 70000, orders: 190, repairs: 60 },
];

const categoryRevenue = [
  { name: 'Sofa Materials', value: 125000, percentage: 38 },
  { name: 'Curtains', value: 85000, percentage: 26 },
  { name: 'Cushions', value: 65000, percentage: 20 },
  { name: 'Repair Services', value: 55000, percentage: 16 },
];

const topCustomers = [
  { name: 'Sarah Johnson', orders: 12, spent: 2450.50 },
  { name: 'Emily Davis', orders: 15, spent: 3200.75 },
  { name: 'Michael Chen', orders: 8, spent: 1680.30 },
  { name: 'David Brown', orders: 10, spent: 2100.00 },
  { name: 'Lisa Anderson', orders: 9, spent: 1950.25 },
];

const COLORS = ['#d97706', '#92400e', '#fbbf24', '#fcd34d'];

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Detailed insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="6months">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">$334,000</h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.5% vs last period
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
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Order Value</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">$318.70</h3>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +8.2% vs last period
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">3.24%</h3>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +0.5% vs last period
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customer Satisfaction</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">4.7/5.0</h3>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Based on 1,048 reviews</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance (6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
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
                <Line type="monotone" dataKey="sales" stroke="#d97706" strokeWidth={2} name="Sales ($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders vs Repair Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
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
                <Bar dataKey="orders" fill="#d97706" name="Orders" />
                <Bar dataKey="repairs" fill="#92400e" name="Repairs" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryRevenue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, idx) => (
                <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                      <span className="font-medium text-amber-700 dark:text-amber-400">{idx + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{customer.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600 dark:text-green-400">${customer.spent.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total spent</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Month</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Sales ($)</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Orders</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Repairs</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Growth</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((item, idx) => {
                  const prevMonth = idx > 0 ? salesData[idx - 1].sales : item.sales;
                  const growth = ((item.sales - prevMonth) / prevMonth * 100).toFixed(1);
                  return (
                    <tr key={item.month} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{item.month} 2026</td>
                      <td className="py-3 px-4 text-sm font-medium text-right text-gray-900 dark:text-white">${item.sales.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-gray-300">{item.orders}</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-gray-300">{item.repairs}</td>
                      <td className="py-3 px-4 text-sm text-right">
                        <span className={idx === 0 ? 'text-gray-500' : parseFloat(growth) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {idx === 0 ? '-' : `${parseFloat(growth) > 0 ? '+' : ''}${growth}%`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
