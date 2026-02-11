import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import type { Order } from '../types';
import { orderService } from '../services';
import { formatCurrency } from '../utils';
import { Button, Badge, Spinner } from '../components';

const OrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await orderService.getById(id);
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-warm-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-warm-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-warm-900 mb-2">
            Thank you for your order!
          </h1>
          <p className="text-warm-600">
            Your order has been placed successfully.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-warm-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-warm-500">Order Number</p>
              <p className="font-mono text-lg font-bold text-warm-900">{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
          <Badge
            variant={
              order.status === 'DELIVERED'
                ? 'success'
                : order.status === 'CANCELLED'
                ? 'danger'
                : 'info'
            }
          >
            {order.status}
          </Badge>
        </div>

        <div className="border-t border-warm-100 pt-4">
          <h3 className="font-semibold text-warm-900 mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-warm-800">{item.product?.name || 'Product'}</p>
                  <p className="text-sm text-warm-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-warm-800">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-warm-100 mt-4 pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-warm-800">Total</span>
            <span className="text-primary-700">{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div className="border-t border-warm-100 mt-4 pt-4">
          <h3 className="font-semibold text-warm-900 mb-2">Shipping Address</h3>
          <p className="text-warm-600">{order.address}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/orders">
          <Button variant="outline" leftIcon={<Package className="w-5 h-5" />}>
            View All Orders
          </Button>
        </Link>
        <Link to="/shop">
          <Button rightIcon={<ArrowRight className="w-5 h-5" />}>
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
    </div>
  );
};

export default OrderConfirmation;
