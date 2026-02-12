import { useState } from 'react';
import { Calendar, Eye, Printer } from 'lucide-react';
import { Card, CardHeader, Input, Badge, Modal, Button } from '../../components/ui';
import { Order } from '../../types';

// Demo orders for testing without backend
const demoOrders: Order[] = [
  {
    id: 1001,
    items: [
      { id: 1, orderId: 1001, productId: 1, quantity: 2, price: 3.50, product: { id: 1, name: 'Espresso', price: 3.50, sku: 'ESP001', active: true, categoryId: 1, createdAt: '' } },
      { id: 2, orderId: 1001, productId: 5, quantity: 1, price: 3.00, product: { id: 5, name: 'Croissant', price: 3.00, sku: 'CRO001', active: true, categoryId: 2, createdAt: '' } },
    ],
    subtotal: 10.00,
    tax: 0.85,
    discount: 0,
    total: 10.85,
    paymentMethod: 'CARD',
    userId: 1,
    user: { id: 1, name: 'John Smith' },
    createdAt: new Date().toISOString(),
  },
  {
    id: 1002,
    items: [
      { id: 3, orderId: 1002, productId: 2, quantity: 1, price: 4.50, product: { id: 2, name: 'Cappuccino', price: 4.50, sku: 'CAP001', active: true, categoryId: 1, createdAt: '' } },
    ],
    subtotal: 4.50,
    tax: 0.38,
    discount: 0,
    total: 4.88,
    paymentMethod: 'CASH',
    userId: 1,
    user: { id: 1, name: 'John Smith' },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 1003,
    items: [
      { id: 4, orderId: 1003, productId: 7, quantity: 2, price: 7.50, product: { id: 7, name: 'Sandwich', price: 7.50, sku: 'SAN001', active: true, categoryId: 3, createdAt: '' } },
      { id: 5, orderId: 1003, productId: 3, quantity: 2, price: 4.00, product: { id: 3, name: 'Latte', price: 4.00, sku: 'LAT001', active: true, categoryId: 1, createdAt: '' } },
    ],
    subtotal: 23.00,
    tax: 1.96,
    discount: 2.00,
    total: 22.96,
    paymentMethod: 'CARD',
    userId: 2,
    user: { id: 2, name: 'Jane Doe' },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 1004,
    items: [
      { id: 6, orderId: 1004, productId: 6, quantity: 3, price: 2.50, product: { id: 6, name: 'Muffin', price: 2.50, sku: 'MUF001', active: true, categoryId: 2, createdAt: '' } },
    ],
    subtotal: 7.50,
    tax: 0.64,
    discount: 0,
    total: 8.14,
    paymentMethod: 'CASH',
    userId: 1,
    user: { id: 1, name: 'John Smith' },
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
];

export default function OrdersPage() {
  const [orders] = useState<Order[]>(demoOrders);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getTotalSales = () => {
    return orders.reduce((sum, order) => sum + Number(order.total), 0);
  };

  /*
   * LEVEL 4 FEATURE: Implement date filtering
   * Currently the date picker doesn't actually filter orders by date
   * Filter orders to only show those from the selected date
   */
  const filteredOrders = orders; // BUG: Should filter by selectedDate

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">View daily sales history</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold text-green-600">${getTotalSales().toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Average Order</p>
          <p className="text-2xl font-bold text-gray-900">
            ${filteredOrders.length > 0 ? (getTotalSales() / filteredOrders.length).toFixed(2) : '0.00'}
          </p>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader title="Order List" description={`${filteredOrders.length} orders on ${selectedDate}`} />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Order #</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Cashier</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Items</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Payment</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium">#{order.id}</td>
                  <td className="px-4 py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-4">{order.user?.name || 'Unknown'}</td>
                  <td className="px-4 py-4">{order.items?.length || 0} items</td>
                  <td className="px-4 py-4">
                    <Badge variant={order.paymentMethod === 'CARD' ? 'primary' : 'default'}>
                      {order.paymentMethod}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 font-bold text-green-600">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                        title="Print Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No orders found for this date
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Order #${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Date:</span>
              <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Cashier:</span>
              <span>{selectedOrder.user?.name || 'Unknown'}</span>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Items</h4>
              <div className="space-y-2">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product?.name || 'Unknown'} x{item.quantity}
                    </span>
                    <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${Number(selectedOrder.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${Number(selectedOrder.tax).toFixed(2)}</span>
              </div>
              {Number(selectedOrder.discount) > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Discount</span>
                  <span>-${Number(selectedOrder.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>${Number(selectedOrder.total).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span>Payment Method</span>
              <Badge variant={selectedOrder.paymentMethod === 'CARD' ? 'primary' : 'default'}>
                {selectedOrder.paymentMethod}
              </Badge>
            </div>

            <div className="pt-4">
              <Button onClick={() => setIsModalOpen(false)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
