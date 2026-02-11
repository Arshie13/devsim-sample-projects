import { ShoppingCart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../context';
import { formatCurrency } from '../utils';
import { Card, Button, Badge } from './ui';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  return (
    <Card
      hoverable
      onClick={() => navigate(`/products/${product.id}`)}
      className="group overflow-hidden flex flex-col h-full"
    >
      <div className="relative aspect-square overflow-hidden bg-warm-100 shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-warm-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleQuickView}
            className="px-5 py-2.5 bg-white text-warm-800 rounded-xl font-medium flex items-center gap-2 hover:bg-warm-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Quick View
          </button>
        </div>

        {/* Badges */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-warm-900/60 flex items-center justify-center">
            <Badge variant="danger" size="md">Out of Stock</Badge>
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-3 right-3">
            <Badge variant="warning" size="sm">Only {product.stock} left</Badge>
          </div>
        )}

        {/* Category */}
        {product.category && (
          <div className="absolute top-3 left-3">
            <span className="px-4 py-1.5 bg-white/90 text-xs font-medium text-warm-700 rounded-full">
              {product.category.name}
            </span>
          </div>
        )}
      </div>

      <Card.Content className="p-4 md:p-5 flex flex-col grow">
        <h3 className="font-semibold text-warm-900 group-hover:text-primary-600 transition-colors mb-2 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-warm-600 line-clamp-2 mb-4 leading-relaxed grow">
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-3 mt-auto pt-2">
          <span className="text-lg md:text-xl font-bold text-primary-600">
            {formatCurrency(product.price)}
          </span>
          <Button
            variant={isInCart(product.id) ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            leftIcon={<ShoppingCart className="w-4 h-4" />}
            aria-label={isInCart(product.id) ? `${product.name} added to cart` : `Add ${product.name} to cart`}
          >
            {isInCart(product.id) ? 'Added' : 'Add'}
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default ProductCard;
