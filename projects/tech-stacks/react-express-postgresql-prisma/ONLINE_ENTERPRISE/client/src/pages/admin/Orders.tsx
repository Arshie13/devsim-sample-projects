import { useState, useEffect } from 'react';
import { Eye, Package } from 'lucide-react';
import type { Order } from '../../types';
import { orderService } from '../../services';
import { formatCurrency, formatDate } from '../../utils';
import { Select, Modal, Card, Badge, Spinner } from '../../components';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      case 'PENDING':
        return 'warning';
      case 'SHIPPED':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredOrders = filterStatus
    ? orders.filter((o) => o.status === filterStatus)
    : orders;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-warm-900">Orders</h1>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: '', label: 'All Orders' },
            ...statusOptions,
          ]}
          className="w-48"
        />
      </div>

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-warm-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-warm-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-warm-50">
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.user?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-warm-500">
                    {formatDate(order.createdAt || '')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`
                        px-2 py-1 rounded text-sm font-medium border-0
                        ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : ''}
                        ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                        ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' : ''}
                        ${order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' : ''}
                      `}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?.id.slice(0, 8)}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-warm-500">Customer</p>
                <p className="font-medium">{selectedOrder.user?.name || 'Unknown'}</p>
              </div>
              <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                {selectedOrder.status}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-warm-500">Shipping Address</p>
              <p className="font-medium">{selectedOrder.address}</p>
            </div>

            <div>
              <p className="text-sm text-warm-500 mb-2">Items</p>
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-warm-50 rounded">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-warm-400" />
                      <span>{item.product?.name || 'Product'}</span>
                      <span className="text-warm-500">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-700">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
