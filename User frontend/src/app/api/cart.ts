import { apiFetch } from './client';
import type { Product, CartItem } from '../context/AppContext';

interface ApiCartItem {
  id: string;
  quantity: number;
  productId: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number | string;
    stock: number;
  };
}

interface ApiCart {
  id: string;
  userId: string;
  items: ApiCartItem[];
}

const mapApiCartToCartItems = (cart: ApiCart): CartItem[] => {
  return cart.items.map(item => {
    const price =
      typeof item.product.price === 'string'
        ? Number(item.product.price)
        : item.product.price;

    const base: Product = {
      id: item.product.id,
      name: item.product.name,
      price,
      category: 'Cart Item',
      material: 'Material',
      image: '',
      description: item.product.description,
      rating: 4.5,
      reviews: 0,
      colors: [],
      inStock: item.product.stock > 0,
    };

    return {
      ...base,
      quantity: item.quantity,
      selectedColor: undefined,
    };
  });
};

export const fetchCart = async (): Promise<CartItem[]> => {
  const cart = await apiFetch<ApiCart>('/cart');
  return mapApiCartToCartItems(cart);
};

export const addItemToCart = async (
  productId: string,
  quantity = 1,
): Promise<CartItem[]> => {
  const cart = await apiFetch<ApiCart>('/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
  return mapApiCartToCartItems(cart);
};

export const updateCartItemQuantity = async (
  itemId: string,
  quantity: number,
): Promise<CartItem[]> => {
  const cart = await apiFetch<ApiCart>(`/cart/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
  return mapApiCartToCartItems(cart);
};

export const deleteCartItem = async (itemId: string): Promise<CartItem[]> => {
  const cart = await apiFetch<ApiCart>(`/cart/${itemId}`, {
    method: 'DELETE',
  });
  return mapApiCartToCartItems(cart);
};

