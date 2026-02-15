import { useState } from 'react';
import { DollarSign, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, Badge } from '../../components/ui';
import { Order, Product } from '../../types';

// Demo data for testing without backend
const demoStats = {
  todaySales: 1234.56,
  ordersToday: 24,
  productsCount: 48,
  lowStockCount: 3,
};

const demoRecentOrders: Order[] = [
  {
    id: 1001,
    items: [],
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
    items: [],
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
    items: [],
    subtotal: 23.00,
    tax: 1.96,
    discount: 2.00,
    total: 22.96,
    paymentMethod: 'CARD',
    userId: 2,
    user: { id: 2, name: 'Jane Doe' },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

const demoLowStockProducts: Product[] = [
  { id: 3, name: 'Latte', price: 4.00, sku: 'LAT001', active: true, categoryId: 1, category: { id: 1, name: 'Coffee' }, inventory: { id: 3, productId: 3, quantity: 8, lowStock: 10 }, createdAt: '' },
  { id: 4, name: 'Mocha', price: 5.00, sku: 'MOC001', active: true, categoryId: 1, category: { id: 1, name: 'Coffee' }, inventory: { id: 4, productId: 4, quantity: 0, lowStock: 10 }, createdAt: '' },
  { id: 7, name: 'Sandwich', price: 7.50, sku: 'SAN001', active: true, categoryId: 3, category: { id: 3, name: 'Food' }, inventory: { id: 7, productId: 7, quantity: 3, lowStock: 5 }, createdAt: '' },
];

export default function DashboardPage() {
  const [stats] = useState(demoStats);
  const [recentOrders] = useState(demoRecentOrders);
  const [lowStockProducts] = useState(demoLowStockProducts);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today's Sales</p>
              <p className="text-2xl font-bold text-gray-900">${stats.todaySales.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Orders Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.ordersToday}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.productsCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lowStockCount}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader title="Recent Orders" description="Latest transactions" />
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${Number(order.total).toFixed(2)}</p>
                  <Badge variant={order.paymentMethod === 'CARD' ? 'primary' : 'default'}>
                    {order.paymentMethod}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader title="Low Stock Alert" description="Products needing restocking" />
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  {product.inventory?.quantity === 0 ? (
                    <Badge variant="danger">Out of Stock</Badge>
                  ) : (
                    <Badge variant="warning">{product.inventory?.quantity} left</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
