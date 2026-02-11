import { useState } from 'react';
import { Package, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, Button, Input, Badge, Modal } from '../../components/ui';
import { Product } from '../../types';

// Demo products with inventory for testing without backend
const demoProducts: Product[] = [
  { id: 1, name: 'Espresso', price: 3.50, sku: 'ESP001', active: true, categoryId: 1, category: { id: 1, name: 'Coffee' }, inventory: { id: 1, productId: 1, quantity: 50, lowStock: 10 }, createdAt: '' },
  { id: 2, name: 'Cappuccino', price: 4.50, sku: 'CAP001', active: true, categoryId: 1, category: { id: 1, name: 'Coffee' }, inventory: { id: 2, productId: 2, quantity: 45, lowStock: 10 }, createdAt: '' },
  { id: 3, name: 'Latte', price: 4.00, sku: 'LAT001', active: true, categoryId: 1, category: { id: 1, name: 'Coffee' }, inventory: { id: 3, productId: 3, quantity: 8, lowStock: 10 }, createdAt: '' },
  { id: 4, name: 'Mocha', price: 5.00, sku: 'MOC001', active: true, categoryId: 1, category: { id: 1, name: 'Coffee' }, inventory: { id: 4, productId: 4, quantity: 0, lowStock: 10 }, createdAt: '' },
  { id: 5, name: 'Croissant', price: 3.00, sku: 'CRO001', active: true, categoryId: 2, category: { id: 2, name: 'Pastries' }, inventory: { id: 5, productId: 5, quantity: 25, lowStock: 5 }, createdAt: '' },
  { id: 6, name: 'Muffin', price: 2.50, sku: 'MUF001', active: true, categoryId: 2, category: { id: 2, name: 'Pastries' }, inventory: { id: 6, productId: 6, quantity: 30, lowStock: 5 }, createdAt: '' },
  { id: 7, name: 'Sandwich', price: 7.50, sku: 'SAN001', active: true, categoryId: 3, category: { id: 3, name: 'Food' }, inventory: { id: 7, productId: 7, quantity: 3, lowStock: 5 }, createdAt: '' },
  { id: 8, name: 'Salad', price: 8.00, sku: 'SAL001', active: true, categoryId: 3, category: { id: 3, name: 'Food' }, inventory: { id: 8, productId: 8, quantity: 12, lowStock: 5 }, createdAt: '' },
];

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Demo user is admin
  const isAdmin = true;

  const lowStockProducts = products.filter(
    (p) => p.inventory && p.inventory.quantity <= p.inventory.lowStock
  );

  const outOfStockProducts = products.filter((p) => p.inventory?.quantity === 0);

  const filteredProducts = showLowStockOnly ? lowStockProducts : products;

  const handleOpenAdjustment = (product: Product, type: 'add' | 'remove') => {
    setSelectedProduct(product);
    setAdjustmentType(type);
    setAdjustmentQuantity('');
    setIsModalOpen(true);
  };

  /*
   * LEVEL 3 FEATURE: Add inventory adjustment validation
   * - Cannot remove more than current stock
   * - Add maximum limit check (e.g., max 1000 units)
   * - Log the adjustment reason
   */
  const handleAdjustInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !adjustmentQuantity) return;

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const quantity = Number(adjustmentQuantity);
    const currentQuantity = selectedProduct.inventory?.quantity || 0;
    const newQuantity =
      adjustmentType === 'add' ? currentQuantity + quantity : currentQuantity - quantity;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === selectedProduct.id
          ? { ...p, inventory: { ...p.inventory!, quantity: Math.max(0, newQuantity) } }
          : p
      )
    );

    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500">Manage stock levels and inventory</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
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
              <p className="text-2xl font-bold text-yellow-600">{lowStockProducts.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">Low Stock Alert</h3>
              <p className="text-sm text-yellow-700 mt-1">
                {lowStockProducts.length} products need restocking:{' '}
                {lowStockProducts.map((p) => p.name).join(', ')}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader title="Stock Levels" />

        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Show low stock only
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Low Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                {isAdmin && (
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => {
                const quantity = product.inventory?.quantity ?? 0;
                const lowStock = product.inventory?.lowStock ?? 0;
                const isLow = quantity <= lowStock && quantity > 0;
                const isOut = quantity === 0;

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-500">{product.sku}</td>
                    <td className="px-4 py-4">{product.category?.name}</td>
                    <td className="px-4 py-4 font-medium">{quantity}</td>
                    <td className="px-4 py-4 text-gray-500">{lowStock}</td>
                    <td className="px-4 py-4">
                      {isOut ? (
                        <Badge variant="danger">Out of Stock</Badge>
                      ) : isLow ? (
                        <Badge variant="warning">Low Stock</Badge>
                      ) : (
                        <Badge variant="success">In Stock</Badge>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleOpenAdjustment(product, 'add')}
                          >
                            + Add
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleOpenAdjustment(product, 'remove')}
                            disabled={quantity === 0}
                          >
                            - Remove
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inventory Adjustment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${adjustmentType === 'add' ? 'Add to' : 'Remove from'} Inventory`}
      >
        <form onSubmit={handleAdjustInventory} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Package className="w-8 h-8 text-gray-400" />
            <div>
              <p className="font-medium">{selectedProduct?.name}</p>
              <p className="text-sm text-gray-500">
                Current stock: {selectedProduct?.inventory?.quantity}
              </p>
            </div>
          </div>

          <Input
            label="Quantity"
            type="number"
            min="1"
            value={adjustmentQuantity}
            onChange={(e) => setAdjustmentQuantity(e.target.value)}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="flex-1"
              variant={adjustmentType === 'remove' ? 'danger' : 'primary'}
            >
              {adjustmentType === 'add' ? 'Add Stock' : 'Remove Stock'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
