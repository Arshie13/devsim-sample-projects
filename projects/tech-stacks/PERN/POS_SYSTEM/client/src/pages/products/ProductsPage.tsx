import { useState } from 'react';
import { Plus, Search, Edit2, XCircle } from 'lucide-react';
import { Card, CardHeader, Button, Input, Badge, Modal, Select } from '../../components/ui';
import { Product, Category } from '../../types';

// Demo data for testing without backend
const demoCategories: Category[] = [
  { id: 1, name: 'Coffee' },
  { id: 2, name: 'Pastries' },
  { id: 3, name: 'Food' },
];

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [categories] = useState<Category[]>(demoCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [showInactive, setShowInactive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    sku: '',
    categoryId: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Demo user is admin
  const isAdmin = true;

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory ? product.categoryId === Number(filterCategory) : true;
    const matchesActive = showInactive ? true : product.active;
    return matchesSearch && matchesCategory && matchesActive;
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: String(product.price),
        sku: product.sku,
        categoryId: String(product.categoryId),
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', sku: '', categoryId: '' });
    }
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', price: '', sku: '', categoryId: '' });
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const category = categories.find((c) => c.id === Number(formData.categoryId));

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                price: Number(formData.price),
                sku: formData.sku,
                categoryId: Number(formData.categoryId),
                category,
              }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        name: formData.name,
        price: Number(formData.price),
        sku: formData.sku,
        categoryId: Number(formData.categoryId),
        category,
        active: true,
        inventory: { id: 0, productId: 0, quantity: 0, lowStock: 10 },
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [...prev, newProduct]);
    }

    setIsSubmitting(false);
    handleCloseModal();
  };

  const handleToggleActive = (product: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, active: !p.active } : p))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product catalog</p>
        </div>
        {isAdmin && (
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      <Card>
        <CardHeader title="Product List" />

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-48"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
          {isAdmin && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              Show inactive
            </label>
          )}
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                {isAdmin && (
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span>☕</span>
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-500">{product.sku}</td>
                  <td className="px-4 py-4">{product.category?.name}</td>
                  <td className="px-4 py-4 font-medium">${Number(product.price).toFixed(2)}</td>
                  <td className="px-4 py-4">
                    {product.inventory?.quantity === 0 ? (
                      <Badge variant="danger">Out of Stock</Badge>
                    ) : product.inventory && product.inventory.quantity <= product.inventory.lowStock ? (
                      <Badge variant="warning">{product.inventory.quantity}</Badge>
                    ) : (
                      <Badge variant="success">{product.inventory?.quantity}</Badge>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={product.active ? 'success' : 'default'}>
                      {product.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`p-2 transition-colors ${
                            product.active
                              ? 'text-gray-400 hover:text-red-600'
                              : 'text-gray-400 hover:text-green-600'
                          }`}
                          title={product.active ? 'Deactivate' : 'Activate'}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}

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

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {formError}
            </div>
          )}

          <Input
            label="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="SKU"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            required
          />

          <Input
            label="Price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />

          <Select
            label="Category"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
