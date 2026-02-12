import { X, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context';
import { Button } from '../ui';
import { formatCurrency } from '../../utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-warm-900/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-warm-100 bg-warm-50">
          <h2 className="text-lg font-bold text-warm-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            Your Cart
            {items.length > 0 && (
              <span className="ml-2 px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                {items.length}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-warm-100 rounded-xl transition-colors text-warm-600 hover:text-warm-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="grow overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-warm-500">
              <div className="w-24 h-24 rounded-full bg-warm-100 flex items-center justify-center mb-6">
                <ShoppingBag className="w-12 h-12 text-warm-400" />
              </div>
              <p className="text-xl font-medium text-warm-700 mb-3">Your cart is empty</p>
              <p className="text-warm-500 mb-8 text-center">Add some beautiful ceramics to get started!</p>
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  navigate('/shop');
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Collection
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-5 p-5 bg-warm-50 rounded-2xl border border-warm-100 hover:border-primary-200 transition-colors"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div className="grow min-w-0">
                    <h3 className="font-semibold text-warm-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-primary-600 font-bold mt-1">
                      {formatCurrency(item.product.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-warm-200 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4 text-warm-600" />
                      </button>
                      <span className="w-10 text-center font-medium text-warm-800">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-warm-200 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4 text-warm-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-warm-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-semibold text-warm-800">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-warm-100 p-6 space-y-5 bg-warm-50">
            {/* Free shipping progress */}
            {total < 75 && (
              <div className="p-4 bg-primary-50 rounded-xl">
                <div className="flex items-center gap-3 text-primary-700 text-sm">
                  <Sparkles className="w-5 h-5" />
                  <span>Add {formatCurrency(75 - total)} more for FREE shipping!</span>
                </div>
            </div>
            )}
            
            <div className="flex justify-between text-lg">
              <span className="text-warm-600">Subtotal:</span>
              <span className="font-bold text-warm-900">{formatCurrency(total)}</span>
            </div>
            <div className="space-y-3">
              <Button onClick={handleCheckout} className="w-full shadow-lg" size="lg">
                Proceed to Checkout
              </Button>
              <button
                onClick={handleViewCart}
                className="w-full py-3 text-primary-600 hover:text-primary-700 font-medium hover:bg-primary-50 rounded-xl transition-colors"
              >
                View Full Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
