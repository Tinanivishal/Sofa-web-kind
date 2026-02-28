import { useParams, Link } from 'react-router';
import { useState } from 'react';
import { motion } from 'motion/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ShoppingCart,
  Heart,
  Star,
  Check,
  Minus,
  Plus,
  ArrowLeft,
} from 'lucide-react';
import { fetchProductById } from '../api/products';
import type { Product } from '../context/AppContext';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { toast } from 'sonner';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', id],
    enabled: !!id,
    queryFn: () => fetchProductById(id as string),
  });

  const { addToCart, toggleWishlist, wishlist, isLoggedIn, openAuthModal } = useApp();

  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0] || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
          <Link to="/shop" className="text-primary hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlist.some(item => item.id === product.id);

  // Mock images - using same image with slight variations
  const images = [product.image, product.image, product.image];

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      openAuthModal('register');
      return;
    }
    addToCart(product, quantity, selectedColor);
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      openAuthModal('register');
      return;
    }
    addToCart(product, quantity, selectedColor);
    window.location.href = '/cart';
  };

  const allProducts = (queryClient.getQueryData<Product[]>(['products']) ?? []);
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image Gallery */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-muted rounded-2xl overflow-hidden mb-4 aspect-square"
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-primary'
                      : 'border-transparent hover:border-border'
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="text-sm text-primary font-semibold mb-2 uppercase tracking-wide">
              {product.category}
            </div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-accent text-accent'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-primary mb-6">
              ${product.price}
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Material */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Material</h3>
              <div className="inline-block px-4 py-2 bg-muted rounded-lg">
                {product.material}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">
                  Select Color: {selectedColor}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedColor === color
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="px-6 py-3 border-x-2 border-border">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-muted-foreground">
                  {product.inStock ? (
                    <span className="flex items-center gap-2 text-green-600">
                      <Check className="w-4 h-4" />
                      In Stock
                    </span>
                  ) : (
                    <span className="text-destructive">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 px-6 py-4 bg-primary text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleWishlist(product)}
                className={`px-6 py-4 rounded-lg border-2 transition-colors ${
                  isInWishlist
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-border hover:border-primary'
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`}
                />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="w-full px-6 py-4 bg-accent text-white rounded-lg font-semibold disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              Buy Now
            </motion.button>

            {/* Features */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Check className="w-5 h-5 text-primary" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Check className="w-5 h-5 text-primary" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Check className="w-5 h-5 text-primary" />
                <span>Expert customer support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
