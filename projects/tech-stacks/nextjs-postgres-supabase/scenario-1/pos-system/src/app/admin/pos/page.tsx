'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Product {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

interface CartItem extends Product {
  cartQuantity: number;
}

interface Coupon {
  coupon_id: string;
  code: string;
  discount_percent: number;
  is_active: boolean;
}

export default function AdminPOS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
    fetchCoupons();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCoupons() {
    try {
      const { data } = await supabase.from('coupons').select('*').eq('is_active', true);
      setCoupons(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  const filteredProducts = products.filter(p => 
    p.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (product.quantity === 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.product_id);
      if (existing) {
        if (existing.cartQuantity >= product.quantity) {
          alert(`Only ${product.quantity} available`);
          return prev;
        }
        return prev.map(item =>
          item.product_id === product.product_id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart(prev => prev.map(item => {
      if (item.product_id === productId) {
        const newQuantity = item.cartQuantity + change;
        const product = products.find(p => p.product_id === productId);
        if (product && newQuantity > product.quantity) {
          return item;
        }
        return newQuantity > 0 ? { ...item, cartQuantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.cartQuantity > 0));
  };

  const calculateTotal = () => cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  
  const calculateDiscount = () => {
    if (selectedCoupon) {
      return calculateTotal() * (selectedCoupon.discount_percent / 100);
    }
    return 0;
  };

  const calculateGrandTotal = () => calculateTotal() - calculateDiscount();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setCheckoutLoading(true);
    
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_date: new Date().toISOString(),
          total_amount: calculateGrandTotal(),
          customer_name: customerName,
          coupon_id: selectedCoupon?.coupon_id,
          discount_amount: calculateDiscount(),
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

      await supabase.from('order_items').insert(orderItems);

      for (const item of cart) {
        await supabase
          .from('products')
          .update({ quantity: item.quantity - item.cartQuantity })
          .eq('product_id', item.product_id);
      }

      alert(`Order #${orderData.order_id} completed!`);
      setCart([]);
      setCustomerName('Walk-in Customer');
      setSelectedCoupon(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Products Section */}
      <div className="flex-1">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-black"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <button
              key={product.product_id}
              onClick={() => addToCart(product)}
              disabled={product.quantity === 0}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md disabled:opacity-50 text-left"
            >
              <h3 className="font-medium text-gray-900">{product.product_name}</h3>
              <p className="text-blue-600 font-bold">₱{product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Stock: {product.quantity}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full lg:w-96 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Current Order</h2>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3 py-2 border rounded text-black"
          />
        </div>

        {/* Coupon Selection */}
        <div className="mb-4">
          <select
            value={selectedCoupon?.coupon_id || ''}
            onChange={(e) => {
              const coupon = coupons.find(c => c.coupon_id === e.target.value);
              setSelectedCoupon(coupon || null);
            }}
            className="w-full px-3 py-2 border rounded text-black"
          >
            <option value="">No Coupon</option>
            {coupons.map(c => (
              <option key={c.coupon_id} value={c.coupon_id}>
                {c.code} ({c.discount_percent}% off)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {cart.map(item => (
            <div key={item.product_id} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium text-gray-900">{item.product_name}</p>
                <p className="text-sm text-gray-900">₱{item.price} x {item.cartQuantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.product_id, -1)}
                  className="w-8 h-8 rounded bg-gray-900 hover:bg-gray-300"
                >-</button>
                <span className="w-8 text-center text-gray-900">{item.cartQuantity}</span>
                <button
                  onClick={() => updateQuantity(item.product_id, 1)}
                  className="w-8 h-8 rounded bg-gray-900 hover:bg-gray-300"
                >+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-900">Subtotal</span>
            <span className='text-gray-900'>₱{calculateTotal().toFixed(2)}</span>
          </div>
          {selectedCoupon && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({selectedCoupon.code})</span>
              <span className="text-gray-900">-₱{calculateDiscount().toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg">
            <span className="text-gray-900">Total</span>
            <span className='text-gray-900'>₱{calculateGrandTotal().toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={checkoutLoading || cart.length === 0}
          className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {checkoutLoading ? 'Processing...' : 'Complete Order'}
        </button>
      </div>
    </div>
  );
}
