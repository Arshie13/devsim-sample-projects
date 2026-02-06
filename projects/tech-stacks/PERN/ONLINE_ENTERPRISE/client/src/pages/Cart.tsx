import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Minus, Plus, Package, Truck } from 'lucide-react';
import { useCart } from '../context';
import { formatCurrency } from '../utils';
import { Button } from '../components';

const Cart = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-warm-50">
        <div className="text-center px-6">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-warm-100 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-warm-400" />
          </div>
          <h1 className="text-3xl font-bold text-warm-900 mb-4">Your cart is empty</h1>
          <p className="text-warm-500 mb-10 max-w-sm mx-auto text-lg">
            Looks like you haven't added any ceramics yet.
          </p>
          <Link to="/shop">
            <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Browse Collection
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = total >= 75 ? 0 : 9.99;
  const progressToFreeShipping = Math.min((total / 75) * 100, 100);

  return (
    <div className="animate-fade-in bg-warm-50 min-h-screen py-16">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-warm-900">Shopping Cart</h1>
            <p className="text-warm-500 mt-2 text-lg">
              {items.length} item{items.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-5">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-2xl p-6 flex gap-6 card-shadow border border-warm-100"
              >
                <Link to={`/product/${item.product.id}`} className="shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-28 h-28 object-cover rounded-xl"
                  />
                </Link>
                <div className="grow min-w-0">
                  <Link
                    to={`/product/${item.product.id}`}
                    className="font-semibold text-lg text-warm-900 hover:text-primary-600 transition-colors block truncate"
                  >
                    {item.product.name}
                  </Link>
                  {item.product.category && (
                    <p className="text-sm text-warm-400 mt-1">{item.product.category.name}</p>
                  )}
                  <p className="text-lg font-bold text-primary-600 mt-3">
                    {formatCurrency(item.product.price)}
                  </p>
                  <div className="flex items-center gap-5 mt-4">
                    <div className="flex items-center bg-warm-100 rounded-xl">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-2.5 hover:bg-warm-200 rounded-l-xl transition-colors"
                      >
                        <Minus className="w-4 h-4 text-warm-600" />
                      </button>
                      <span className="px-5 py-1 font-medium text-warm-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-2.5 hover:bg-warm-200 rounded-r-xl transition-colors"
                      >
                        <Plus className="w-4 h-4 text-warm-600" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-warm-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-warm-900">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 card-shadow border border-warm-100 sticky top-24">
              <h2 className="text-xl font-bold text-warm-900 mb-8">Order Summary</h2>

              {/* Free shipping progress */}
              {total < 75 && (
                <div className="mb-6 p-4 bg-primary-50 rounded-xl">
                  <div className="flex items-center gap-2 text-primary-700 mb-2">
                    <Truck className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Add {formatCurrency(75 - total)} more for FREE shipping!
                    </span>
                  </div>
                  <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>
              )}
              {total >= 75 && (
                <div className="mb-6 p-4 bg-green-50 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Free shipping unlocked!</p>
                    <p className="text-sm text-green-600">Your order qualifies</p>
                  </div>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-warm-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium text-warm-800">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-warm-600">
                  <span>Shipping</span>
                  <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : 'text-warm-800'}`}>
                    {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}
                  </span>
                </div>
                <div className="border-t border-warm-100 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-warm-900">Total</span>
                    <span className="text-primary-600">{formatCurrency(total + shippingCost)}</span>
                  </div>
                </div>
              </div>

              <Link to="/checkout">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link
                to="/shop"
                className="flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700 font-medium mt-4 py-2 transition-colors"
              >
                <Package className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
