import type { Product } from '../context/AppContext';
import { apiFetch, PaginatedResponse } from './client';
import { mockProducts } from '../data/products';

interface ApiCategory {
  id: string;
  name: string;
}

interface ApiProductImage {
  id: string;
  imageUrl: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  status: string;
  categoryId: string;
  category?: ApiCategory;
  images?: ApiProductImage[];
}

const mapApiProductToProduct = (apiProduct: ApiProduct): Product => {
  const priceNumber = typeof apiProduct.price === 'string' ? Number(apiProduct.price) : apiProduct.price;

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    price: priceNumber,
    category: apiProduct.category?.name ?? 'Uncategorized',
    material: apiProduct.category?.name ?? 'Material',
    image: apiProduct.images && apiProduct.images.length > 0 ? apiProduct.images[0].imageUrl : mockProducts[0]?.image,
    description: apiProduct.description,
    rating: 4.5,
    reviews: 0,
    colors: [],
    inStock: apiProduct.stock > 0,
  };
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiFetch<PaginatedResponse<ApiProduct>>('/products');
    return response.data.map(mapApiProductToProduct);
  } catch (error) {
    console.error('Failed to load products from API, using mock data instead.', error);
    return mockProducts;
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const apiProduct = await apiFetch<ApiProduct>(`/products/${id}`);
    return mapApiProductToProduct(apiProduct);
  } catch (error) {
    console.error('Failed to load product from API.', error);
    return null;
  }
};

