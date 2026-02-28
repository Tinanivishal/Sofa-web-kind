import { apiFetch, PaginatedResponse } from './client';
import type { CartItem } from '../context/AppContext';

export interface ApiOrderItem {
  id: string;
  quantity: number;
  price: number | string;
  productId: string;
  product: {
    id: string;
    name: string;
    description: string;
  };
}

export interface ApiOrder {
  id: string;
  userId: string;
  totalAmount: number | string;
  status: string;
  createdAt: string;
  items: ApiOrderItem[];
}

export interface OrderSummary {
  id: string;
  date: string;
  status: string;
  total: number;
  items: CartItem[];
}

export const createOrderFromCart = async (couponCode?: string) => {
  const body = couponCode ? { couponCode } : {};
  const order = await apiFetch<ApiOrder>('/orders', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return order;
};

export const fetchMyOrders = async (): Promise<OrderSummary[]> => {
  const response = await apiFetch<PaginatedResponse<ApiOrder>>(
    '/orders?page=1&limit=50',
  );

  return response.data.map(order => {
    const totalAmount =
      typeof order.totalAmount === 'string'
        ? Number(order.totalAmount)
        : order.totalAmount;

    const items: CartItem[] = order.items.map(item => {
      const price =
        typeof item.price === 'string' ? Number(item.price) : item.price;
      return {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price,
        category: 'Order Item',
        material: 'Material',
        image: '',
        rating: 4.5,
        reviews: 0,
        colors: [],
        inStock: true,
        quantity: item.quantity,
      };
    });

    return {
      id: order.id,
      date: order.createdAt,
      status: order.status,
      total: totalAmount,
      items,
    };
  });
};

