import { motion } from 'motion/react';
import { Package, Truck, CheckCircle, Download, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchMyOrders } from '../api/orders';
import { fetchMyRepairs } from '../api/repairs';

export const MyOrdersPage = () => {
  const { orders, repairBookings, isLoggedIn } = useApp();

  const {
    data: apiOrders,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useQuery({
    queryKey: ['me', 'orders'],
    queryFn: fetchMyOrders,
    enabled: isLoggedIn,
  });

  const {
    data: apiRepairs,
    isLoading: repairsLoading,
    isError: repairsError,
  } = useQuery({
    queryKey: ['me', 'repairs'],
    queryFn: fetchMyRepairs,
    enabled: isLoggedIn,
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Please log in</h2>
          <p className="text-muted-foreground mb-8">
            You need to be logged in to view your orders
          </p>
          <Link to="/login">
            <button className="px-8 py-4 bg-primary text-white rounded-lg font-semibold">
              Log In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processing':
      case 'Pending':
        return <Package className="w-5 h-5" />;
      case 'Shipped':
      case 'Confirmed':
        return <Truck className="w-5 h-5" />;
      case 'Delivered':
      case 'Completed':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
      case 'Confirmed':
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">My Orders & Bookings</h1>

        {/* Tabs */}
        <div className="mb-8 border-b border-border">
          <div className="flex gap-8">
            <button className="pb-4 border-b-2 border-primary font-semibold text-primary">
              Product Orders
            </button>
            <button className="pb-4 border-b-2 border-transparent font-semibold text-muted-foreground hover:text-primary">
              Repair Bookings
            </button>
          </div>
        </div>

        {/* Product Orders */}
        <div className="space-y-6 mb-12">
          {ordersLoading ? (
            <div className="bg-card rounded-2xl p-12 text-center shadow-lg">
              <p className="text-muted-foreground">Loading your orders...</p>
            </div>
          ) : ordersError ? (
            <div className="bg-card rounded-2xl p-12 text-center shadow-lg">
              <p className="text-destructive">Failed to load orders.</p>
            </div>
          ) : (apiOrders && apiOrders.length === 0 && orders.length === 0) ? (
            <div className="bg-card rounded-2xl p-12 text-center shadow-lg">
              <Package className="w-16 h-16 text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here
              </p>
              <Link to="/shop">
                <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold">
                  Browse Products
                </button>
              </Link>
            </div>
          ) : (
            (apiOrders ?? orders).map(order => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">Order #{order.id}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="text-2xl font-bold text-primary">
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-6">
                  {order.items.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ${item.price}
                        </p>
                        {item.selectedColor && (
                          <p className="text-sm text-primary">
                            Color: {item.selectedColor}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border-2 border-border rounded-lg hover:border-primary transition-colors">
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </button>
                  {order.status === 'Shipped' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg">
                      <Truck className="w-4 h-4" />
                      Track Order
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Repair Bookings */}
        {(apiRepairs && apiRepairs.length > 0) || repairBookings.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">Repair Bookings</h2>
            <div className="space-y-6">
              {(apiRepairs ?? repairBookings).map(booking => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">Booking #{booking.id}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {booking.type}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <div className="text-2xl font-bold text-primary">
                        ${booking.estimatedCost}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Date & Time
                      </div>
                      <div className="font-semibold">
                        {booking.date} at {booking.time}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Address
                      </div>
                      <div className="font-semibold">{booking.address}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Status
                      </div>
                      <div className="font-semibold">{booking.status}</div>
                    </div>
                  </div>

                  {booking.images && booking.images.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        Uploaded Images
                      </div>
                      <div className="flex gap-2">
                        {booking.images.slice(0, 3).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Sofa ${idx + 1}`}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
