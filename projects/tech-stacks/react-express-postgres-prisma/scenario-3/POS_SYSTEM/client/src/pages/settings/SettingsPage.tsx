import { useState } from 'react';
import { Save, Store, DollarSign, CreditCard, Banknote, Receipt } from 'lucide-react';
import { Card, CardHeader, Button, Input } from '../../components/ui';

// Demo settings
const initialSettings = {
  name: 'Demo Coffee Shop',
  address: '123 Main Street, Downtown',
  phone: '(555) 123-4567',
  email: 'hello@democoffee.com',
  taxRate: 8.5,
  cashEnabled: true,
  cardEnabled: true,
  receiptFooter: 'Thank you for your purchase!',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Demo user is admin
  const isAdmin = true;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setSaveMessage('Settings saved successfully!');
    setIsSaving(false);

    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(''), 3000);
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">Access Denied</p>
          <p className="text-sm">Only administrators can access settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Configure your POS system</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Information */}
        <Card>
          <CardHeader
            title="Store Information"
            description="Basic information about your store"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Store className="w-5 h-5 text-primary-600" />
                <span className="font-medium">Store Details</span>
              </div>
            </div>
            <Input
              label="Store Name"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              required
            />
            <Input
              label="Phone"
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />
            <div className="md:col-span-2">
              <Input
                label="Address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* Tax Settings */}
        <Card>
          <CardHeader
            title="Tax Configuration"
            description="Set up tax rates for your transactions"
          />
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="font-medium">Tax Rate</span>
          </div>
          <div className="max-w-xs">
            <Input
              label="Tax Rate (%)"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={settings.taxRate}
              onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              This tax rate will be applied to all orders
            </p>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader
            title="Payment Methods"
            description="Enable or disable payment options"
          />
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Banknote className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium">Cash Payments</p>
                  <p className="text-sm text-gray-500">Accept cash transactions</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.cashEnabled}
                onChange={(e) => setSettings({ ...settings, cashEnabled: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium">Card Payments</p>
                  <p className="text-sm text-gray-500">Accept credit/debit cards</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.cardEnabled}
                onChange={(e) => setSettings({ ...settings, cardEnabled: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </Card>

        {/* Receipt Settings */}
        <Card>
          <CardHeader
            title="Receipt Settings"
            description="Customize your receipt appearance"
          />
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="w-5 h-5 text-primary-600" />
            <span className="font-medium">Receipt Footer</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Footer Message
            </label>
            <textarea
              value={settings.receiptFooter}
              onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Thank you for your purchase!"
            />
            <p className="text-sm text-gray-500 mt-2">
              This message will appear at the bottom of receipts
            </p>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button type="submit" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
          {saveMessage && (
            <span
              className={`text-sm ${
                saveMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {saveMessage}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
