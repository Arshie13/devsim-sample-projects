import { useState } from 'react';
import { Calendar, TrendingUp, DollarSign, ShoppingCart, BarChart3 } from 'lucide-react';
import { Card, CardHeader, Input } from '../../components/ui';

// Demo data for reports
const demoReportData = {
  today: {
    orders: 24,
    revenue: 456.78,
    avgOrder: 19.03,
    topProducts: [
      { name: 'Cappuccino', quantity: 18, revenue: 81.00 },
      { name: 'Latte', quantity: 15, revenue: 60.00 },
      { name: 'Espresso', quantity: 12, revenue: 42.00 },
      { name: 'Sandwich', quantity: 8, revenue: 60.00 },
      { name: 'Croissant', quantity: 7, revenue: 21.00 },
    ],
    hourlyData: [
      { hour: '8AM', orders: 3, revenue: 45.50 },
      { hour: '9AM', orders: 5, revenue: 78.25 },
      { hour: '10AM', orders: 4, revenue: 62.00 },
      { hour: '11AM', orders: 3, revenue: 55.75 },
      { hour: '12PM', orders: 6, revenue: 98.50 },
      { hour: '1PM', orders: 3, revenue: 48.78 },
      { hour: '2PM', orders: 0, revenue: 0 },
    ],
    paymentMethods: { CASH: 156.78, CARD: 300.00 },
  },
};

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData] = useState(demoReportData.today);

  /*
   * LEVEL 5 FEATURE: Implement date range selection
   * Currently only supports single day. Add:
   * - Week view with daily breakdown
   * - Month view with weekly breakdown
   * - Custom date range picker
   * - Comparison with previous period
   */

  // Find peak hour
  const peakHour = reportData.hourlyData.reduce((max, curr) => 
    curr.orders > max.orders ? curr : max
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">View sales analytics and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.orders}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${reportData.revenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Order Value</p>
              <p className="text-2xl font-bold text-purple-600">${reportData.avgOrder.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Peak Hour</p>
              <p className="text-2xl font-bold text-orange-600">{peakHour.hour}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader title="Top Selling Products" description="Best performers today" />
          <div className="space-y-3">
            {reportData.topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0
                        ? 'bg-yellow-500'
                        : index === 1
                        ? 'bg-gray-400'
                        : index === 2
                        ? 'bg-amber-600'
                        : 'bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.quantity} sold</p>
                  </div>
                </div>
                <p className="font-bold text-green-600">${product.revenue.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Hourly Sales */}
        <Card>
          <CardHeader title="Hourly Sales" description="Revenue by hour" />
          <div className="space-y-2">
            {reportData.hourlyData.map((hour) => {
              const maxRevenue = Math.max(...reportData.hourlyData.map((h) => h.revenue));
              const percentage = maxRevenue > 0 ? (hour.revenue / maxRevenue) * 100 : 0;

              return (
                <div key={hour.hour} className="flex items-center gap-3">
                  <span className="w-12 text-sm text-gray-500">{hour.hour}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-20 text-right text-sm font-medium">
                    ${hour.revenue.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader title="Payment Methods" description="Revenue by payment type" />
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">💵</span>
                </div>
                <span className="font-medium">Cash</span>
              </div>
              <span className="font-bold text-green-600">
                ${reportData.paymentMethods.CASH.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">💳</span>
                </div>
                <span className="font-medium">Card</span>
              </div>
              <span className="font-bold text-blue-600">
                ${reportData.paymentMethods.CARD.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {/* Summary Card */}
        <Card>
          <CardHeader title="Daily Summary" description={selectedDate} />
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-500">Total Transactions</span>
              <span className="font-bold">{reportData.orders}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-500">Gross Revenue</span>
              <span className="font-bold text-green-600">${reportData.revenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-500">Average Order Size</span>
              <span className="font-bold">${reportData.avgOrder.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500">Items Sold</span>
              <span className="font-bold">
                {reportData.topProducts.reduce((sum, p) => sum + p.quantity, 0)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
