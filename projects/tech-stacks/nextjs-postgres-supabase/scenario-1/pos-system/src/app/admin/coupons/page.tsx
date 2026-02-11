'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

interface Coupon {
  coupon_id: string;
  code: string;
  discount_percent: number;
  is_active: boolean;
  created_at: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ code: '', discount_percent: '' });
  const supabase = createClient();

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCoupons(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createCoupon(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase.from('coupons').insert({
        code: formData.code.toUpperCase(),
        discount_percent: parseFloat(formData.discount_percent),
        is_active: true
      });
      
      if (error) throw error;
      setFormData({ code: '', discount_percent: '' });
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      console.error(err);
      alert('Failed to create coupon');
    }
  }

  async function toggleCoupon(coupon: Coupon) {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !coupon.is_active })
        .eq('coupon_id', coupon.coupon_id);
      
      if (error) throw error;
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteCoupon(couponId: string) {
    if (!confirm('Delete this coupon?')) return;
    
    try {
      const { error } = await supabase.from('coupons').delete().eq('coupon_id', couponId);
      if (error) throw error;
      fetchCoupons();
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
        <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Coupon
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Coupon</h2>
            <form onSubmit={createCoupon}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-black uppercase"
                  placeholder="e.g., SAVE10"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={formData.discount_percent}
                  onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-black"
                  placeholder="e.g., 10"
                  min="1"
                  max="100"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {coupons.length === 0 ? (
          <p className="text-gray-500 col-span-full">No coupons created yet.</p>
        ) : (
          coupons.map(coupon => (
            <div
              key={coupon.coupon_id}
              className={`bg-white rounded-lg shadow p-6 ${
                !coupon.is_active ? 'opacity-50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{coupon.code}</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {coupon.discount_percent}% OFF
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {coupon.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Created: {new Date(coupon.created_at).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleCoupon(coupon)}
                  className="flex-1 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-900"
                >
                  {coupon.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => deleteCoupon(coupon.coupon_id)}
                  className="flex-1 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
