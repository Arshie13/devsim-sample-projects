import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Star, Truck, Shield, RotateCcw, Heart, Share2, ChevronRight } from 'lucide-react';
import type { Product } from '../types';
import { productService } from '../services';
import { useCart } from '../context';
import { formatCurrency } from '../utils';
import { Button, Badge, Spinner } from '../components';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await productService.getById(id);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        navigate('/shop');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner size="lg" />
        <p className="text-warm-500 animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-warm-100 flex items-center justify-center">
          <ShoppingCart className="w-10 h-10 text-warm-400" />
        </div>
        <h2 className="text-2xl font-bold text-warm-800 mb-2">Product not found</h2>
        <p className="text-warm-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const cartQuantity = getItemQuantity(product.id);
  const isOutOfStock = product.stock === 0;
  const availableStock = product.stock - cartQuantity;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= availableStock) {
      setQuantity(newQuantity);
    }
  };

  const features = [
    { icon: <Truck className="w-5 h-5" />, title: 'Free Shipping', desc: 'On orders over $75' },
    { icon: <Shield className="w-5 h-5" />, title: 'Quality Guarantee', desc: '30-day satisfaction' },
    { icon: <RotateCcw className="w-5 h-5" />, title: 'Easy Returns', desc: 'Hassle-free process' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-warm-50 to-white">
      <div className="page-container py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-3 text-sm text-warm-500 mb-10">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/shop" className="hover:text-primary-600 transition-colors">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          {product.category && (
            <>
              <Link to={`/shop?category=${product.category.id}`} className="hover:text-primary-600 transition-colors">
                {product.category.name}
              </Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-warm-800 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="aspect-square rounded-3xl overflow-hidden bg-warm-100 shadow-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* Overlay badges */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-warm-900/60 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                  <Badge variant="danger" size="md" className="text-lg py-2 px-4">Out of Stock</Badge>
                </div>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <div className="absolute top-4 left-4">
                  <Badge variant="warning" size="md" className="shadow-lg">Only {product.stock} left!</Badge>
                </div>
              )}
              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-xl shadow-lg transition-all duration-200 ${
                    isWishlisted
                      ? 'bg-red-500 text-white'
                      : 'bg-white/90 backdrop-blur-sm text-warm-600 hover:bg-white hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg text-warm-600 hover:bg-white hover:text-primary-600 transition-all duration-200">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            {/* Category & Title */}
            {product.category && (
              <Link 
                to={`/shop?category=${product.category.id}`}
                className="inline-flex items-center gap-1 text-sm text-primary-600 font-medium mb-2 hover:text-primary-700 transition-colors"
              >
                {product.category.name}
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-warm-900 mb-5">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-warm-800 font-medium">5.0</span>
              <span className="text-warm-400">•</span>
              <span className="text-warm-500">24 reviews</span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <span className="text-4xl font-bold bg-linear-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                {formatCurrency(product.price)}
              </span>
            </div>

            {/* Description */}
            <p className="text-warm-600 mb-10 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mb-8">
              {isOutOfStock ? (
                <Badge variant="danger" size="md">Out of Stock</Badge>
              ) : product.stock <= 5 ? (
                <Badge variant="warning" size="md">Low Stock - Only {product.stock} left</Badge>
              ) : (
                <Badge variant="success" size="md">✓ In Stock - Ready to ship</Badge>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {!isOutOfStock && (
              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-5">
                  <span className="text-warm-700 font-medium">Quantity:</span>
                  <div className="flex items-center bg-warm-100 rounded-xl">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-warm-200 rounded-l-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-5 h-5 text-warm-700" />
                    </button>
                    <span className="w-14 text-center font-semibold text-warm-800 text-lg">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= availableStock}
                      className="p-3 hover:bg-warm-200 rounded-r-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-5 h-5 text-warm-700" />
                    </button>
                  </div>
                  {cartQuantity > 0 && (
                    <span className="text-sm text-warm-500">
                      ({cartQuantity} already in cart)
                    </span>
                  )}
                </div>

                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || availableStock === 0}
                  leftIcon={<ShoppingCart className="w-5 h-5" />}
                  className="w-full shadow-lg shadow-primary-500/25"
                >
                  {cartQuantity > 0 ? `Add More to Cart` : 'Add to Cart'}
                </Button>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-warm-50 rounded-2xl border border-warm-100">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <p className="text-sm font-semibold text-warm-800">{feature.title}</p>
                  <p className="text-xs text-warm-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-warm-900">Customer Reviews</h2>
            <Button variant="outline">Write a Review</Button>
          </div>
          <div className="bg-white rounded-2xl border border-warm-100 p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-warm-100 flex items-center justify-center">
              <Star className="w-8 h-8 text-warm-400" />
            </div>
            <h3 className="text-xl font-semibold text-warm-800 mb-2">No reviews yet</h3>
            <p className="text-warm-500 mb-6">Be the first to share your thoughts on this product!</p>
            <Button variant="primary">Write a Review</Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetails;
