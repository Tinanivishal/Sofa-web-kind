import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api/client';
import { fetchCart } from '../api/cart';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  material: string;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  colors: string[];
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  total: number;
  items: CartItem[];
}

export interface RepairBooking {
  id: string;
  type: string;
  date: string;
  time: string;
  address: string;
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed';
  estimatedCost: number;
  images?: string[];
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  repairBookings: RepairBooking[];
  isLoggedIn: boolean;
  user: AuthUser | null;
  authModalOpen: boolean;
  authModalMode: 'login' | 'register';
  theme: 'light' | 'dark';
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  clearCart: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  toggleTheme: () => void;
  addOrder: (order: Order) => void;
  addRepairBooking: (booking: RepairBooking) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [repairBookings, setRepairBookings] = useState<RepairBooking[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
   const [authModalOpen, setAuthModalOpen] = useState(false);
   const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedUser = window.localStorage.getItem('user');
    const token = window.localStorage.getItem('accessToken');
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthUser;
        setUser(parsedUser);
        setIsLoggedIn(true);
        fetchCart()
          .then(items => setCart(items))
          .catch(() => {
            // ignore initial cart load errors
          });
      } catch {
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('refreshToken');
      }
    }
  }, []);

  const addToCart = (product: Product, quantity = 1, color?: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id && item.selectedColor === color);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id && item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, selectedColor: color }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const login = async (email: string, password: string) => {
    const response = await apiFetch<{
      user: AuthUser;
      accessToken: string;
      refreshToken: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setUser(response.user);
    setIsLoggedIn(true);

    fetchCart()
      .then(items => setCart(items))
      .catch(() => {
        // ignore cart load errors
      });

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('user', JSON.stringify(response.user));
      window.localStorage.setItem('accessToken', response.accessToken);
      window.localStorage.setItem('refreshToken', response.refreshToken);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCart([]);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('refreshToken');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await apiFetch<{
      user: AuthUser;
      accessToken: string;
      refreshToken: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    setUser(response.user);
    setIsLoggedIn(true);

    fetchCart()
      .then(items => setCart(items))
      .catch(() => {
        // ignore cart load errors
      });

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('user', JSON.stringify(response.user));
      window.localStorage.setItem('accessToken', response.accessToken);
      window.localStorage.setItem('refreshToken', response.refreshToken);
    }
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const addRepairBooking = (booking: RepairBooking) => {
    setRepairBookings(prev => [booking, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        repairBookings,
        isLoggedIn,
        user,
        authModalOpen,
        authModalMode,
        theme,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        clearCart,
        login,
        logout,
        register,
        openAuthModal,
        closeAuthModal,
        toggleTheme,
        addOrder,
        addRepairBooking,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
