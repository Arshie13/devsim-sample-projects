import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import type { Product, Order } from '../../types';
import { productService, orderService } from '../../services';
import { formatCurrency } from '../../utils';
import { Card, Badge, Spinner } from '../../components';

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, ordersData] = await Promise.all([
          productService.getAll(),
          orderService.getAll(),
        ]);
        setProducts(productsData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);

  const lowStockProducts = products.filter((p) => p.stock <= 5 && p.stock > 0);
  const outOfStockProducts = products.filter((p) => p.stock === 0);
  const pendingOrders = orders.filter((o) => o.status === 'PENDING');

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Products',
      value: products.length,
      icon: <Package className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders.length,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-warm-900 mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center gap-4">
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-warm-500">{stat.title}</p>
                <p className="text-2xl font-bold text-warm-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alerts */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
            </div>
          </Card.Header>
          <Card.Content>
            {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
              <p className="text-warm-500 text-center py-4">All products are well stocked!</p>
            ) : (
              <div className="space-y-3">
                {outOfStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <span className="font-medium">{product.name}</span>
                    <Badge variant="danger">Out of Stock</Badge>
                  </div>
                ))}
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                    <span className="font-medium">{product.name}</span>
                    <Badge variant="warning">{product.stock} left</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
          <Card.Footer>
            <Link to="/admin/inventory" className="text-primary-700 hover:underline">
              Manage Inventory →
            </Link>
          </Card.Footer>
        </Card>

        {/* Recent Orders */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Recent Orders</h2>
            </div>
          </Card.Header>
          <Card.Content>
            {orders.length === 0 ? (
              <p className="text-warm-500 text-center py-4">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-2 bg-warm-50 rounded-lg">
                    <div>
                      <span className="font-medium">#{order.id.slice(0, 8)}</span>
                      <p className="text-sm text-warm-500">{formatCurrency(order.total)}</p>
                    </div>
                    <Badge
                      variant={
                        order.status === 'DELIVERED'
                          ? 'success'
                          : order.status === 'CANCELLED'
                          ? 'danger'
                          : order.status === 'PENDING'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
          <Card.Footer>
            <Link to="/admin/orders" className="text-primary-700 hover:underline">
              View All Orders →
            </Link>
          </Card.Footer>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/admin/products">
          <Card hoverable className="p-6 text-center">
            <Package className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="font-semibold">Manage Products</p>
          </Card>
        </Link>
        <Link to="/admin/orders">
          <Card hoverable className="p-6 text-center">
            <ShoppingCart className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="font-semibold">Manage Orders</p>
          </Card>
        </Link>
        <Link to="/admin/inventory">
          <Card hoverable className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="font-semibold">Manage Inventory</p>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
