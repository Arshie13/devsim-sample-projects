'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

interface Product {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    product_name: '',
    price: '',
    quantity: ''
  });
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('product_name');
      
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setFormData({
      product_name: product.product_name,
      price: product.price.toString(),
      quantity: product.quantity.toString()
    });
    setShowForm(true);
  }

  function openAddForm() {
    setEditingProduct(null);
    setFormData({
      product_name: '',
      price: '',
      quantity: ''
    });
    setShowForm(true);
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update({
            product_name: formData.product_name,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity)
          })
          .eq('product_id', editingProduct.product_id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert({
          product_name: formData.product_name,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity)
        });
        
        if (error) throw error;
      }
      
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    }
  }

  async function deleteProduct(productId: string) {
    if (!confirm('Delete this product?')) return;
    
    try {
      const { error } = await supabase.from('products').delete().eq('product_id', productId);
      if (error) throw error;
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  }

  async function updateStock(product: Product, change: number) {
    const newQuantity = product.quantity + change;
    if (newQuantity < 0) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ quantity: newQuantity })
        .eq('product_id', product.product_id);
      
      if (error) throw error;
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <button
          onClick={openAddForm}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={saveProduct}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-900">Product Name</label>
                <input
                  type="text"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-gray-900"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900">Price (₱)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-gray-900"
                    required
                    disabled={!!editingProduct}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400 text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-gray-900">Product</th>
              <th className="text-right px-6 py-3 text-gray-900">Price</th>
              <th className="text-center px-6 py-3 text-gray-900">Stock</th>
              <th className="text-center px-6 py-3 text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.product_id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{product.product_name}</p>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900">
                    ₱{product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-900">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => updateStock(product, -1)}
                        className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300"
                        disabled={product.quantity === 0}
                      >-</button>
                      <span className="w-16 text-center font-medium">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() => updateStock(product, 1)}
                        className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300"
                      >+</button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditForm(product)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product.product_id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
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
