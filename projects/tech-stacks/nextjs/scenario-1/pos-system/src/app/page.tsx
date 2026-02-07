'use client';

import { supabase } from '@/../supabaseClient';
import { useEffect, useState } from 'react';

interface Product {
  product_id: string;
  product_name: string;
  description?: string;
  price: number;
  quantity: number;
  category_id?: string;
  created_at?: string;
}

interface CartItem extends Product {
  cartQuantity: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const categories = ['all', ...new Set(products.map(p => p.category_id).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    if (product.quantity === 0) return;
    
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product_id === product.product_id);
      
      if (existing) {
        if (existing.cartQuantity >= product.quantity) {
          alert(`Only ${product.quantity} items available in stock`);
          return prevCart;
        }
        return prevCart.map(item =>
          item.product_id === product.product_id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, cartQuantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product_id === productId) {
          const newQuantity = item.cartQuantity + change;
          const product = products.find(p => p.product_id === productId);
          if (product && newQuantity > product.quantity) {
            alert(`Only ${product.quantity} items available`);
            return item;
          }
          return newQuantity > 0 ? { ...item, cartQuantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.cartQuantity > 0);
    });
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  };

  const calculateTax = () => {
    return calculateTotal() * 0.12;
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTax();
  };

  const clearCart = () => {
    if (confirm('Are you sure you want to clear the cart?')) {
      setCart([]);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    setCheckoutLoading(true);

    try {
      for (const item of cart) {
        const { data: currentProduct } = await supabase
          .from('products')
          .select('quantity')
          .eq('product_id', item.product_id)
          .single();
        
        if (currentProduct && currentProduct.quantity < item.cartQuantity) {
          throw new Error(`Insufficient stock for ${item.product_name}`);
        }
      }

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_date: new Date().toISOString(),
          total_amount: calculateGrandTotal(),
          customer_name: customerName,
          user_id: null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map(item => ({
        order_id: orderData.order_id,
        product_id: item.product_id,
        quantity: item.cartQuantity,
        unit_price: item.price,
        subtotal: item.price * item.cartQuantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      for (const item of cart) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ quantity: item.quantity - item.cartQuantity })
          .eq('product_id', item.product_id);
        
        if (updateError) throw updateError;
      }

      alert(`Order #${orderData.order_id} completed!\nTotal: ₱${calculateGrandTotal().toFixed(2)}`);
      setCart([]);
      setShowCheckoutModal(false);
      setCustomerName('Walk-in Customer');
      
      await fetchProducts();

    } catch (err) {
      console.error('Checkout error:', err);
      alert('Checkout failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setCheckoutLoading(false);
    }
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.cartQuantity, 0);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans dark:bg-gray-900">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
            <span className="text-xl font-bold">₱</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">POS System</h1>
            <p className="text-xs text-blue-100">{new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-white/20 px-4 py-2">
            <div className="text-xs text-blue-100">Cart Items</div>
            <div className="text-2xl font-bold">{getTotalItems()}</div>
          </div>
          <div className="rounded-lg bg-white/20 px-4 py-2">
            <div className="text-xs text-blue-100">Total</div>
            <div className="text-2xl font-bold">₱{calculateTotal().toFixed(2)}</div>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col-reverse md:flex-row">
        <section className="flex-1 p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search products"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by category"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading products...</div>
            </div>
          )}
          
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-red-600">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {!loading && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <svg className="mb-2 h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p>No products found</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => {
              const inCart = cart.find(item => item.product_id === product.product_id);
              const isLowStock = product.quantity <= 5 && product.quantity > 0;
              
              return (
                <div 
                  key={product.product_id} 
                  className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                >
                  {isLowStock && (
                    <span className="absolute right-2 top-2 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                      Low Stock
                    </span>
                  )}
                  {product.quantity === 0 && (
                    <span className="absolute right-2 top-2 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                      Out of Stock
                    </span>
                  )}
                  
                  <div className="mb-3 flex h-20 items-center justify-center rounded-lg bg-gray-100">
                    <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  
                  <h3 className="mb-1 font-semibold text-gray-900 line-clamp-2" title={product.product_name}>
                    {product.product_name}
                  </h3>
                  
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="text-lg font-bold text-blue-600">₱{product.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-500">Stock: {product.quantity}</span>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(product)}
                    disabled={product.quantity === 0}
                    className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                    aria-label={`Add ${product.product_name} to cart`}
                  >
                    {inCart ? (
                      <>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/30 text-xs">
                          {inCart.cartQuantity}
                        </span>
                        Add More
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="w-full border-l border-gray-200 bg-white shadow-xl md:w-96 lg:w-[28rem]">
          <div className="flex h-full flex-col">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Current Order</h2>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700"
                    aria-label="Clear cart"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <svg className="mb-3 h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-lg font-medium">Cart is empty</p>
                  <p className="mt-1 text-sm">Add products to get started</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {cart.map((item) => (
                    <li key={item.product_id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex-1 pr-4">
                          <h4 className="font-semibold text-gray-900">{item.product_name}</h4>
                          <p className="mt-1 text-sm text-gray-600">₱{item.price.toFixed(2)} each</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">₱{(item.price * item.cartQuantity).toFixed(2)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product_id, -1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-12 text-center font-semibold text-gray-900">{item.cartQuantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                          aria-label={`Remove ${item.product_name} from cart`}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₱{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (12%)</span>
                    <span>₱{calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-300 pt-2 text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₱{calculateGrandTotal().toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="customer-name" className="mb-2 block text-sm font-medium text-gray-700">
                    Customer Name
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter customer name"
                  />
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-4 text-lg font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  aria-label="Proceed to checkout"
                >
                  {checkoutLoading ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Complete Order
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </aside>
      </main>
      <footer className="border-t border-gray-200 bg-white px-6 py-3 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} POS System. All rights reserved.
      </footer>
    </div>
  );
}
