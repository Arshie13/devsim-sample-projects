import { useState, useEffect } from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import type { Product } from '../../types';
import { productService } from '../../services';
import { Button, Input, Card, Badge, Spinner } from '../../components';
import toast from 'react-hot-toast';

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editedStocks, setEditedStocks] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockChange = (productId: string, newStock: number) => {
    setEditedStocks((prev) => ({
      ...prev,
      [productId]: newStock,
    }));
  };

  const handleSaveStock = async (productId: string) => {
    const newStock = editedStocks[productId];
    if (newStock === undefined) return;

    setIsSaving(true);
    try {
      await productService.update(productId, { stock: newStock });
      toast.success('Stock updated');
      setEditedStocks((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
      fetchProducts();
    } catch {
      toast.error('Failed to update stock');
    } finally {
      setIsSaving(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'danger' as const };
    if (stock <= 5) return { label: 'Low Stock', variant: 'warning' as const };
    return { label: 'In Stock', variant: 'success' as const };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const lowStockCount = products.filter((p) => p.stock <= 5 && p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-warm-900 mb-8">Inventory Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-warm-500">In Stock</p>
            <p className="text-2xl font-bold">{products.length - lowStockCount - outOfStockCount}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-warm-500">Low Stock</p>
            <p className="text-2xl font-bold">{lowStockCount}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-warm-500">Out of Stock</p>
            <p className="text-2xl font-bold">{outOfStockCount}</p>
          </div>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-warm-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                  Update Stock
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                const status = getStockStatus(product.stock);
                const editedStock = editedStocks[product.id];
                const hasChanges = editedStock !== undefined && editedStock !== product.stock;

                return (
                  <tr key={product.id} className="hover:bg-warm-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="ml-4">
                          <div className="font-medium text-warm-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-warm-500">
                      {product.category?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          value={editedStock ?? product.stock}
                          onChange={(e) =>
                            handleStockChange(product.id, parseInt(e.target.value) || 0)
                          }
                          className="w-24"
                        />
                        {hasChanges && (
                          <Button
                            size="sm"
                            onClick={() => handleSaveStock(product.id)}
                            isLoading={isSaving}
                            leftIcon={<Save className="w-4 h-4" />}
                          >
                            Save
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Inventory;
