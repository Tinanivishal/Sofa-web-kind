import { Link } from 'react-router';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, useApp } from '../context/AppContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, toggleWishlist, wishlist, isLoggedIn, openAuthModal } = useApp();

  const isInWishlist = wishlist.some(item => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openAuthModal('register');
      return;
    }
    addToCart(product);
    toast.success('Added to cart!');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  return (
    <Link to={`/product/${product.id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
      >
        {/* Product Image */}
        <div className="relative h-64 overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleWishlist}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
              isInWishlist
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-foreground hover:bg-white'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`}
            />
          </motion.button>

          {/* Stock Badge */}
          {!product.inStock && (
            <div className="absolute top-4 left-4 bg-destructive text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          {/* Category */}
          <div className="text-xs text-primary font-semibold mb-2 uppercase tracking-wide">
            {product.category}
          </div>

          {/* Name */}
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-accent text-accent'
                      : 'text-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviews})
            </span>
          </div>

          {/* Material */}
          <div className="text-sm text-muted-foreground mb-3">
            Material: {product.material}
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">
              ${product.price}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
                product.inStock
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </motion.button>
          </div>

          {/* Available Colors */}
          {product.colors.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Colors:</span>
              <div className="flex gap-1">
                {product.colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: getColorHex(color),
                    }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <div className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center text-xs bg-muted">
                    +{product.colors.length - 4}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

// Helper function to get color hex values
const getColorHex = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    Brown: '#8B4513',
    Black: '#000000',
    Tan: '#D2B48C',
    Burgundy: '#800020',
    Cognac: '#9A463D',
    Espresso: '#3D2817',
    Charcoal: '#36454F',
    Navy: '#000080',
    Emerald: '#50C878',
    Blush: '#DE5D83',
    Gold: '#FFD700',
    Beige: '#F5F5DC',
    Cream: '#FFFDD0',
    'Light Gray': '#D3D3D3',
    White: '#FFFFFF',
    Gray: '#808080',
    Taupe: '#B38B6D',
    Chocolate: '#7B3F00',
    Brass: '#B5A642',
    Silver: '#C0C0C0',
    Bronze: '#CD7F32',
    'Natural Oak': '#C19A6B',
    'Dark Walnut': '#5C4033',
    Natural: '#E8D5C4',
    Olive: '#808000',
    Turquoise: '#40E0D0',
    Purple: '#800080',
    Red: '#FF0000',
    Mustard: '#FFDB58',
    'Forest Green': '#228B22',
  };

  return colorMap[colorName] || '#CCCCCC';
};
