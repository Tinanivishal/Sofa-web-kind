import React, { useState } from 'react';
import { Eye, User, Calendar, MapPin, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
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
import { useQuery } from '@tanstack/react-query';
import { fetchAdminRepairs, AdminRepair } from '../api/admin';

interface AdminRepairWithDetails extends AdminRepair {
  customerName?: string;
  address?: string;
  technician?: string;
  notes?: string;
  cost?: number;
  images?: string[];
}

export default function RepairBookings() {
  const [selectedBooking, setSelectedBooking] = useState<AdminRepairWithDetails | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'repairs'],
    queryFn: fetchAdminRepairs,
  });

  const bookings: AdminRepairWithDetails[] =
    data?.data.map(booking => ({
      ...booking,
      customerName: booking.userId,
      date: new Date(booking.bookingDate).toLocaleDateString(),
      images: [],
    })) ?? [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">Pending</Badge>;
      case 'Technician Assigned':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">Technician Assigned</Badge>;
      case 'In Progress':
        return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">In Progress</Badge>;
      case 'Completed':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Completed</Badge>;
      case 'Cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Repair Bookings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage repair appointments and assignments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {bookings.length}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-amber-600 dark:text-amber-400">Pending</p>
              <h3 className="text-2xl font-semibold text-amber-600 dark:text-amber-400 mt-1">12</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-purple-600 dark:text-purple-400">In Progress</p>
              <h3 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mt-1">8</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-green-600 dark:text-green-400">Completed</p>
              <h3 className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">214</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading && (
            <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
              Loading repair bookings from backend...
            </div>
          )}
          {isError && !isLoading && (
            <div className="p-6 text-sm text-red-600 dark:text-red-400">
              Failed to load repair bookings from backend.
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Repair Type</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium text-amber-700 dark:text-amber-400">
                    #{booking.id}
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-white">
                    {booking.customerName ?? 'Customer'}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{booking.repairType}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-gray-900 dark:text-white">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">{booking.slot}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details - {selectedBooking?.id}</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6 py-4">
              {/* Customer & Address */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedBooking.customer}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Schedule
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.date}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBooking.slot}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Service Address
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedBooking.address}</p>
                </div>
              </div>

              {/* Repair Type & Images */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Repair Type</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedBooking.repairType}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedBooking.notes}</p>
                </div>
              </div>

              {/* Images */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Uploaded Images
                </h3>
                <div className="flex gap-2">
                  {selectedBooking.images.map((img, idx) => (
                    <div key={idx} className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-3xl">
                      {img}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Technician */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Status</h3>
                  <Select defaultValue={selectedBooking.status.toLowerCase().replace(/ /g, '-')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="technician-assigned">Technician Assigned</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Assign Technician</h3>
                  <Select defaultValue={selectedBooking.technician || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Smith</SelectItem>
                      <SelectItem value="david">David Brown</SelectItem>
                      <SelectItem value="sarah">Sarah Miller</SelectItem>
                      <SelectItem value="mike">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Cost */}
              <div>
                <Label htmlFor="cost">Repair Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  defaultValue={selectedBooking.cost}
                  placeholder="Enter repair cost"
                  className="mt-2"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                  Update Booking
                </Button>
                <Button variant="outline" className="flex-1">
                  Send Notification
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
