import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote } from 'lucide-react';
import { Card, CardHeader, Button, Input, Badge, Modal } from '../../components/ui';
import { Product, CartItem, PaymentMethod } from '../../types';
import { getStockLevel } from '../../utils/formatters';
import { promoService, PromoValidationResponse } from '../../services/promoService';

// Demo products for testing without backend
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

// Demo tax rate
const TAX_RATE = 0.085;

export default function POSPage() {
  const [products] = useState<Product[]>(demoProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoResult, setPromoResult] = useState<PromoValidationResponse | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Get unique categories
  const categories = Array.from(
    new Map(products.map((p) => [p.category?.id, p.category])).values()
  ).filter(Boolean);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
    const stockLevel = product.inventory
      ? getStockLevel(product.inventory.quantity, product.inventory.lowStock)
      : 'IN_STOCK';
    const passesStockFilter = hideOutOfStock ? stockLevel !== 'OUT_OF_STOCK' : true;
    return matchesSearch && matchesCategory && passesStockFilter;
  });

  // Cart calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountPercent =
    promoResult && promoResult.success ? promoResult.data.discountPercent : 0;
  const discountAmount = subtotal * (discountPercent / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = subtotalAfterDiscount * TAX_RATE;
  const total = subtotalAfterDiscount + tax;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    try {
      const result = await promoService.validatePromo(promoCode.trim(), subtotal);
      setPromoResult(result);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoResult(null);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleCheckout = async (paymentMethod: PaymentMethod) => {
    setIsProcessing(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In demo mode, just show success
    console.log('Order created:', {
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      subtotal,
      tax,
      total,
      paymentMethod,
    });

    setIsProcessing(false);
    setOrderComplete(true);
  };

  const handleNewOrder = () => {
    clearCart();
    setOrderComplete(false);
    setIsCheckoutOpen(false);
    handleRemovePromo();
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-theme(spacing.12))]">
      {/* Products Section */}
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-gray-500">Select products to add to cart</p>
        </div>

        {/* Search and Categories */}
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedCategory === null ? 'primary' : 'secondary'}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category?.id}
                size="sm"
                variant={selectedCategory === category?.id ? 'primary' : 'secondary'}
                onClick={() => setSelectedCategory(category?.id || null)}
              >
                {category?.name}
              </Button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm ml-auto">
            <input
              type="checkbox"
              checked={hideOutOfStock}
              onChange={(e) => setHideOutOfStock(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Hide out-of-stock items
          </label>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const level = product.inventory
                ? getStockLevel(product.inventory.quantity, product.inventory.lowStock)
                : 'IN_STOCK';
              const isOut = level === 'OUT_OF_STOCK';
              return (
                <button
                  key={product.id}
                  onClick={() => !isOut && addToCart(product)}
                  disabled={isOut}
                  className="p-4 bg-white rounded-lg border hover:border-primary-500 hover:shadow-md transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-full h-20 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-3xl">☕</span>
                  </div>
                  <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                  <p className="text-primary-600 font-bold">${product.price.toFixed(2)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="default">{product.category?.name}</Badge>
                    {level === 'OUT_OF_STOCK' && <Badge variant="danger">Out of Stock</Badge>}
                    {level === 'LOW_STOCK' && <Badge variant="warning">Low Stock</Badge>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <Card className="w-96 flex flex-col">
        <CardHeader
          title="Current Order"
          description={`${cart.length} items`}
          action={
            cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear All
              </button>
            )
          }
        />

        {/* Cart Items */}
        <div className="flex-1 overflow-auto space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart className="w-12 h-12 mb-2" />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    ${item.product.price.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 rounded text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Totals */}
        <div className="border-t pt-4 mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {promoResult && promoResult.success && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount ({discountPercent}%)</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tax ({(TAX_RATE * 100).toFixed(1)}%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button
          className="mt-4 w-full"
          size="lg"
          disabled={cart.length === 0}
          onClick={() => setIsCheckoutOpen(true)}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Checkout
        </Button>
      </Card>

      {/* Checkout Modal */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => !isProcessing && setIsCheckoutOpen(false)}
        title={orderComplete ? 'Order Complete!' : 'Complete Payment'}
      >
        {orderComplete ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-500 mb-6">Order total: ${total.toFixed(2)}</p>
            <Button onClick={handleNewOrder} className="w-full">
              New Order
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {promoResult && promoResult.success && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Promo ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total Due</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Promo Code</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  disabled={isApplyingPromo || (promoResult?.success ?? false)}
                  className="flex-1"
                />
                {promoResult?.success ? (
                  <Button variant="secondary" onClick={handleRemovePromo}>
                    Remove
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={handleApplyPromo}
                    isLoading={isApplyingPromo}
                    disabled={!promoCode.trim()}
                  >
                    Apply
                  </Button>
                )}
              </div>
              {promoResult?.success && (
                <p className="text-sm text-green-600">
                  Promo applied: {discountPercent}% off
                </p>
              )}
              {promoResult && !promoResult.success && (
                <p className="text-sm text-red-600">{promoResult.message}</p>
              )}
            </div>

            <p className="text-sm text-gray-500">Select payment method:</p>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleCheckout('CASH')}
                isLoading={isProcessing}
                className="flex-col py-6"
              >
                <Banknote className="w-8 h-8 mb-2" />
                Cash
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleCheckout('CARD')}
                isLoading={isProcessing}
                className="flex-col py-6"
              >
                <CreditCard className="w-8 h-8 mb-2" />
                Card
              </Button>
            </div>

            <Button
              variant="secondary"
              onClick={() => setIsCheckoutOpen(false)}
              disabled={isProcessing}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
