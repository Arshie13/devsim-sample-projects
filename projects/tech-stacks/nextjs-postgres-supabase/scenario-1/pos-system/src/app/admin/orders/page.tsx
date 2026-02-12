'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

interface Order {
  order_id: string;
  order_date: string;
  customer_name: string;
  total_amount: number;
  discount_amount: number;
  coupon_id?: string;
}

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('order_date', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function viewOrderDetails(order: Order) {
    setSelectedOrder(order);
    const { data } = await supabase
      .from('order_items')
      .select('quantity, unit_price, subtotal, products(product_name)')
      .eq('order_id', order.order_id);
    
    if (data) {
      setOrderItems(data.map((item: any) => ({
        product_name: item.products?.product_name || 'Unknown',
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal
      })));
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Order History</h1>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order #{selectedOrder.order_id}</h2>
                <p className="text-gray-900">
                  {new Date(selectedOrder.order_date).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-900 hover:text-gray-700 text-2xl"
              >×</button>
            </div>

            <p className="mb-4 text-gray-900">Customer: {selectedOrder.customer_name}</p>

            <table className="w-full mb-4">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-900">Product</th>
                  <th className="text-right py-2 text-gray-900">Qty</th>
                  <th className="text-right py-2 text-gray-900">Price</th>
                  <th className="text-right py-2 text-gray-900">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 text-gray-900">{item.product_name}</td>
                    <td className="text-right py-2 text-gray-900">{item.quantity}</td>
                    <td className="text-right py-2 text-gray-900">₱{item.unit_price.toFixed(2)}</td>
                    <td className="text-right py-2 text-gray-900">₱{item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedOrder.discount_amount > 0 && (
              <p className="text-green-600 mb-2">
                Discount: -₱{selectedOrder.discount_amount.toFixed(2)}
              </p>
            )}
            <p className="font-bold text-lg text-gray-900">Total: ₱{selectedOrder.total_amount.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-gray-900">Order ID</th>
              <th className="text-left px-6 py-3 text-gray-900">Date</th>
              <th className="text-left px-6 py-3 text-gray-900">Customer</th>
              <th className="text-right px-6 py-3 text-gray-900">Total</th>
              <th className="text-right px-6 py-3 text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.order_id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{order.order_id}</td>
                  <td className="px-6 py-4 text-gray-900">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{order.customer_name}</td>
                  <td className="px-6 py-4 text-right text-gray-900">₱{order.total_amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
