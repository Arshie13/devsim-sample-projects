import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, MapPin, ShoppingBag } from 'lucide-react';
import { useCart } from '../context';
import { orderService } from '../services';
import { formatCurrency } from '../utils';
import { Button, Input } from '../components';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  // const { isAuthenticated } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  // NOTE: Auth check disabled for frontend-only testing
  // Uncomment the block below when backend is connected
  /*
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-b from-warm-50 to-white">
        <div className="page-container py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
              <LogIn className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-warm-900 mb-4">Sign In to Continue</h1>
            <p className="text-warm-600 mb-8">
              Please log in to your account to proceed with checkout.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login?redirect=/checkout">
                <Button size="lg">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  */

  // Show empty cart message if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-b from-warm-50 to-white">
        <div className="page-container py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-warm-100 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-warm-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-warm-900 mb-4">Your Cart is Empty</h1>
            <p className="text-warm-600 mb-8">
              Add some products to your cart before proceeding to checkout.
            </p>
            <Link to="/shop">
              <Button size="lg">Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shippingCost = total >= 75 ? 0 : 9.99;
  const grandTotal = total + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.zipCode) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.zipCode}`;
      
      const order = await orderService.create({
        address: fullAddress,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      console.error('Checkout error:', err);
      // BUG: Error handling should show specific error message
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-warm-50 to-white">
      <div className="page-container py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-warm-900 my-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Shipping Information */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg border border-warm-100 p-8">
                <h2 className="text-xl font-bold text-warm-900 mb-8 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  Shipping Information
                </h2>

                <div className="space-y-5">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    required
                  />
                  <Input
                    label="Street Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    required
                  />
                  <div className="grid grid-cols-2 gap-5">
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      required
                    />
                    <Input
                      label="ZIP Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section (Simulated) */}
              <div className="bg-white rounded-2xl shadow-lg border border-warm-100 p-8 my-8">
                <h2 className="text-xl font-bold text-warm-900 mb-8 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary-600" />
                  Payment Method
                </h2>
                <div className="bg-warm-50 rounded-xl p-6 text-center text-warm-600 border border-warm-100">
                  <p className="font-medium text-lg">Payment is simulated for this demo.</p>
                  <p className="text-sm mt-2 text-warm-500">No actual charges will be made.</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg border border-warm-100 p-8 sticky top-24 mb-8">
                <h2 className="text-xl font-bold text-warm-900 mb-8">Order Summary</h2>

                {/* Items */}
                <div className="space-y-5 mb-8">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-5">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-warm-900 truncate">{item.product.name}</p>
                        <p className="text-sm text-warm-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-warm-800">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-warm-100 pt-6 space-y-4">
                  <div className="flex justify-between text-warm-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-warm-600">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>{shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}</span>
                  </div>
                  <div className="border-t border-warm-100 pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-warm-800">Total</span>
                      <span className="text-primary-700">{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-8"
                  size="lg"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
