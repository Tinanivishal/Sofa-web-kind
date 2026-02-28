import { apiFetch, PaginatedResponse } from './client';

export interface AdminOrder {
  id: string;
  userId: string;
  totalAmount: number | string;
  status: string;
  createdAt: string;
  customerName?: string;
  email?: string;
  phone?: string;
  shippingAddress?: string;
  orderItems?: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export interface AdminRepair {
  id: string;
  userId: string;
  repairType: string;
  bookingDate: string;
  slot: string;
  status: string;
  customerName?: string;
  address?: string;
  technician?: string;
  notes?: string;
  cost?: number;
  images?: string[];
  phone?: string;
  email?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  status: string;
  categoryId?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount?: number;
  startDate?: string;
  endDate?: string;
  /** Backend uses expiryDate; prefer this when present */
  expiryDate?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface AdminReview {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  customerName?: string;
  productName?: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  totalOrders: number;
  totalRepairs: number;
  totalSpent: number;
  lastOrder?: string;
  createdAt: string;
  updatedAt: string;
  orders?: any[];
  repairs?: any[];
  recentRepairs?: any[];
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalRepairs: number;
  totalCustomers: number;
  pendingOrders: number;
  pendingRepairs: number;
  recentOrders: AdminOrder[];
  recentRepairs: AdminRepair[];
}

/** Admin/manager/technician user (staff) - for Admin Users management */
export interface AdminAdminUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN';
  createdAt: string;
  updatedAt: string;
}

// Orders
export const fetchAdminOrders = async (page = 1, limit = 50) => {
  return apiFetch<PaginatedResponse<AdminOrder>>(`/admin/orders?page=${page}&limit=${limit}`);
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  return apiFetch(`/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

// Repairs
export const fetchAdminRepairs = async (page = 1, limit = 50) => {
  return apiFetch<PaginatedResponse<AdminRepair>>(`/admin/repairs?page=${page}&limit=${limit}`);
};

export const updateRepairStatus = async (repairId: string, status: string) => {
  return apiFetch(`/admin/repairs/${repairId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export const assignTechnician = async (repairId: string, technicianId: string) => {
  return apiFetch(`/admin/repairs/${repairId}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ technicianId }),
  });
};

// Products
export const fetchAdminProducts = async (page = 1, limit = 100) => {
  return apiFetch<PaginatedResponse<AdminProduct>>(`/products?page=${page}&limit=${limit}`);
};

export const createProduct = async (productData: Partial<AdminProduct>) => {
  return apiFetch('/admin/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

export const updateProduct = async (productId: string, productData: Partial<AdminProduct>) => {
  return apiFetch(`/admin/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
};

export const deleteProduct = async (productId: string) => {
  return apiFetch(`/admin/products/${productId}`, {
    method: 'DELETE',
  });
};

export const updateProductStatus = async (productId: string, status: string) => {
  return apiFetch(`/admin/products/${productId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

// Coupons
export const fetchAdminCoupons = async (page = 1, limit = 50) => {
  return apiFetch<PaginatedResponse<AdminCoupon>>(`/admin/coupons?page=${page}&limit=${limit}`);
};

export const createCoupon = async (couponData: Partial<AdminCoupon>) => {
  return apiFetch('/admin/coupons', {
    method: 'POST',
    body: JSON.stringify(couponData),
  });
};

export const updateCoupon = async (couponId: string, couponData: Partial<AdminCoupon>) => {
  return apiFetch(`/admin/coupons/${couponId}`, {
    method: 'PUT',
    body: JSON.stringify(couponData),
  });
};

export const deleteCoupon = async (couponId: string) => {
  return apiFetch(`/admin/coupons/${couponId}`, {
    method: 'DELETE',
  });
};

// Reviews
export const fetchAdminReviews = async (page = 1, limit = 50) => {
  return apiFetch<PaginatedResponse<AdminReview>>(`/admin/reviews?page=${page}&limit=${limit}`);
};

export const approveReview = async (reviewId: string) => {
  return apiFetch(`/admin/reviews/${reviewId}/approve`, {
    method: 'PATCH',
  });
};

// Dashboard Stats
export const fetchDashboardStats = async () => {
  return apiFetch<DashboardStats>('/admin/dashboard/stats');
};

// Customers (Admin only)
export const fetchAdminCustomers = async (page = 1, limit = 50, search = '') => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  });
  return apiFetch<PaginatedResponse<AdminCustomer>>(`/admin/customers?${queryParams}`);
};

export const fetchAdminCustomerById = async (id: string) => {
  return apiFetch<AdminCustomer>(`/admin/customers/${id}`);
};

export const updateCustomer = async (id: string, data: Partial<AdminCustomer>) => {
  return apiFetch<AdminCustomer>(`/admin/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteCustomer = async (id: string) => {
  return apiFetch(`/admin/customers/${id}`, {
    method: 'DELETE',
  });
};

export const updateCustomerStatus = async (id: string, status: 'Active' | 'Inactive') => {
  return apiFetch<AdminCustomer>(`/admin/customers/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

// Admin users (ADMIN only) - create, list, get, update
export const fetchAdminAdmins = async (page = 1, limit = 50, search = '') => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  });
  return apiFetch<PaginatedResponse<AdminAdminUser>>(`/admin/admins?${queryParams}`);
};

export const fetchAdminAdminById = async (id: string) => {
  const res = await apiFetch<{ data: AdminAdminUser }>(`/admin/admins/${id}`);
  return res.data ?? res;
};

export const createAdminUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN';
}) => {
  return apiFetch<{ data: AdminAdminUser }>('/admin/admins', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateAdminUser = async (
  id: string,
  data: Partial<Pick<AdminAdminUser, 'name' | 'email' | 'role'> & { password?: string }>
) => {
  return apiFetch<{ data: AdminAdminUser }>(`/admin/admins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

