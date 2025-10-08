import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { getProducts, getSales, getDebts } from '../utils/storage';

export function Dashboard() {
  const products = getProducts();
  const sales = getSales();
  const debts = getDebts();

  // Calculate today's sales
  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(sale => 
    sale.timestamp.split('T')[0] === today
  );
  const totalSalesToday = todaySales.reduce((sum, sale) => sum + sale.total, 0);

  // Get low stock alerts
  const lowStockProducts = products.filter(product => product.qty < 5);
  const outOfStockProducts = products.filter(product => product.qty === 0);

  // Calculate total pending debts
  const totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);

  return (
    <div className="space-y-6">
      <h2>Welcome - Dashboard</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              💰 Today's Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              KES {totalSalesToday.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              {todaySales.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              📋 Customer Debts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              KES {totalDebts.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              {debts.length} customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⚠️ Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockProducts.length === 0 ? (
            <p className="text-muted-foreground">No stock issues</p>
          ) : (
            <div className="space-y-3">
              {outOfStockProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">Stock: {product.qty}</p>
                  </div>
                  <Badge variant="destructive">OUT OF STOCK</Badge>
                </div>
              ))}
              {lowStockProducts.filter(p => p.qty > 0).map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">Stock: {product.qty}</p>
                  </div>
                  <Badge className="bg-yellow-500 text-white">LOW STOCK</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3">
          <Button size="lg" className="w-full">
            🛒 New Sale
          </Button>
          <Button size="lg" variant="outline" className="w-full">
            📦 Add Product
          </Button>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Need to save time? Use our quick actions!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}