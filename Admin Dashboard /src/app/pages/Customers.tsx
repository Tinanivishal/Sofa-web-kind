import React, { useState } from 'react';
import { Eye, Edit, Trash2, Search, ShoppingCart, Wrench, Ban, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchAdminCustomers, 
  fetchAdminCustomerById, 
  updateCustomer, 
  deleteCustomer, 
  updateCustomerStatus,
  AdminCustomer 
} from '../api/admin';

export default function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<AdminCustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    isActive: true,
  });

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'customers', searchTerm],
    queryFn: () => fetchAdminCustomers(1, 50, searchTerm),
  });

  const customers: AdminCustomer[] = data?.data ?? [];

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminCustomer> }) => 
      updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      setEditingCustomer(null);
      setSelectedCustomer(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      setSelectedCustomer(null);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'Active' | 'Inactive' }) => 
      updateCustomerStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      setSelectedCustomer(null);
    },
  });

  const handleEdit = (customer: AdminCustomer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      isActive: customer.isActive,
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      updateMutation.mutate({
        id: editingCustomer.id,
        data: formData,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusToggle = (customer: AdminCustomer) => {
    const newStatus = customer.isActive ? 'Inactive' : 'Active';
    if (confirm(`Are you sure you want to ${newStatus.toLowerCase()} this customer?`)) {
      statusMutation.mutate({
        id: customer.id,
        status: newStatus,
      });
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Active</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">Inactive</Badge>;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'Processing':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">Processing</Badge>;
      case 'Shipped':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">Shipped</Badge>;
      case 'Delivered':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Delivered</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRepairStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">Pending</Badge>;
      case 'Technician Assigned':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">Technician Assigned</Badge>;
      case 'In Progress':
        return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">In Progress</Badge>;
      case 'Completed':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.isActive).length,
    totalOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0),
    totalSpent: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Customers</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage customer accounts and view order history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Customers</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{stats.total}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-green-600 dark:text-green-400">Active Customers</p>
              <h3 className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
                {stats.active}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {stats.totalOrders}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                ${stats.totalSpent.toFixed(2)}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search customers by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ID: {customer.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="text-gray-900 dark:text-white">{customer.email}</p>
                      <p className="text-gray-500 dark:text-gray-400">{customer.phone || 'N/A'}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="w-4 h-4" />
                      <span>{customer.totalOrders}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    ${customer.totalSpent.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : 'No orders'}
                  </TableCell>
                  <TableCell>{getStatusBadge(customer.isActive)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(customer)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusToggle(customer)}
                        className={customer.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(customer.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details - {selectedCustomer?.name}</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6 py-4">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Contact Information</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                    <p className="text-sm"><strong>Name:</strong> {selectedCustomer.name}</p>
                    <p className="text-sm"><strong>Email:</strong> {selectedCustomer.email}</p>
                    <p className="text-sm"><strong>Phone:</strong> {selectedCustomer.phone || 'N/A'}</p>
                    <p className="text-sm"><strong>Status:</strong> {getStatusBadge(selectedCustomer.isActive)}</p>
                    <p className="text-sm"><strong>Joined:</strong> {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Order Summary</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                    <p className="text-sm"><strong>Total Orders:</strong> {selectedCustomer.totalOrders}</p>
                    <p className="text-sm"><strong>Total Repairs:</strong> {selectedCustomer.totalRepairs}</p>
                    <p className="text-sm"><strong>Total Spent:</strong> ${selectedCustomer.totalSpent.toFixed(2)}</p>
                    <p className="text-sm"><strong>Last Order:</strong> {selectedCustomer.lastOrder ? new Date(selectedCustomer.lastOrder).toLocaleDateString() : 'No orders'}</p>
                  </div>
                </div>
              </div>

              {/* Tabs for Orders and Bookings */}
              <Tabs defaultValue="orders" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="bookings">Repair Bookings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="orders" className="mt-4">
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCustomer.orders?.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="font-medium">${order.totalAmount}</TableCell>
                            <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                          </TableRow>
                        )) || (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                              No orders found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="bookings" className="mt-4">
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCustomer.repairs?.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">#{booking.id}</TableCell>
                            <TableCell>{booking.repairType}</TableCell>
                            <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                            <TableCell>{getRepairStatusBadge(booking.status)}</TableCell>
                          </TableRow>
                        )) || (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                              No repair bookings found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleStatusToggle(selectedCustomer)}
                >
                  <Ban className="w-4 h-4 mr-2" />
                  {selectedCustomer.isActive ? 'Deactivate' : 'Activate'} Customer
                </Button>
                <Button 
                  variant="outline" 
                  className="border-red-600 text-red-600 flex-1"
                  onClick={() => handleDelete(selectedCustomer.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Customer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer - {editingCustomer?.name}</DialogTitle>
          </DialogHeader>
          {editingCustomer && (
            <form onSubmit={handleUpdate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label htmlFor="active">Active Status</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Customer can login and place orders</p>
                </div>
                <input
                  id="active"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  onClick={() => setEditingCustomer(null)} 
                  variant="outline" 
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateMutation.isPending}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update Customer'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
