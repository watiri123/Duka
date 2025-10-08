import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
// Remove Select import - we'll use HTML select instead
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { getProducts, saveProducts, getSales, saveSales, Product, Sale } from '../utils/storage';

interface SalesProps {
  user: { id: string; username: string; name: string };
}

interface CartItem {
  productId: string;
  productName: string;
  qty: number;
  price: number;
  availableQty: number;
}

export function Sales({ user }: SalesProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProducts(getProducts());
    setSales(getSales());
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const addToCart = () => {
    if (!selectedProduct || !quantity) {
      setMessage('Please select product and quantity');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      setMessage('Quantity must be a number greater than zero');
      return;
    }

    if (qty > selectedProduct.qty) {
      setMessage(`Insufficient stock. Available: ${selectedProduct.qty}`);
      return;
    }

    // Check if product already in cart
    const existingItem = cart.find(item => item.productId === selectedProductId);
    const totalQtyInCart = existingItem ? existingItem.qty + qty : qty;

    if (totalQtyInCart > selectedProduct.qty) {
      setMessage(`Total quantity in cart (${totalQtyInCart}) exceeds available stock (${selectedProduct.qty})`);
      return;
    }

    if (existingItem) {
      // Update existing cart item
      setCart(prev => prev.map(item =>
        item.productId === selectedProductId
          ? { ...item, qty: item.qty + qty }
          : item
      ));
    } else {
      // Add new cart item
      const newItem: CartItem = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        qty,
        price: selectedProduct.sellingPrice,
        availableQty: selectedProduct.qty
      };
      setCart(prev => [...prev, newItem]);
    }

    setQuantity('');
    setSelectedProductId('');
    setMessage('Added to cart');
    setTimeout(() => setMessage(''), 2000);
  };

  const updateCartQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQty > product.qty) {
      setMessage(`Quantity exceeds available stock (${product.qty})`);
      return;
    }

    setCart(prev => prev.map(item =>
      item.productId === productId
        ? { ...item, qty: newQty }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const completeSale = () => {
    if (cart.length === 0) {
      setMessage('Cart is empty');
      return;
    }

    // Check stock availability one more time
    for (const item of cart) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.qty < item.qty) {
        setMessage(`Insufficient stock for ${item.productName}`);
        return;
      }
    }

    // Create sale record
    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      items: cart.map(item => ({
        productId: item.productId,
        productName: item.productName,
        qty: item.qty,
        price: item.price
      })),
      total: cartTotal,
      userId: user.id,
      timestamp: new Date().toISOString()
    };

    // Update product quantities
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.productId === product.id);
      if (cartItem) {
        return {
          ...product,
          qty: product.qty - cartItem.qty,
          updatedAt: new Date().toISOString()
        };
      }
      return product;
    });

    // Save to localStorage
    const currentSales = getSales();
    saveSales([...currentSales, newSale]);
    saveProducts(updatedProducts);

    // Update state
    setProducts(updatedProducts);
    setSales([...sales, newSale]);
    setCart([]);
    setMessage(`Sale completed! Total: KES ${cartTotal.toLocaleString()}`);
    setTimeout(() => setMessage(''), 5000);
  };

  // Get today's sales
  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(sale => 
    sale.timestamp.split('T')[0] === today
  );

  const availableProducts = products.filter(p => p.qty > 0);

  return (
    <div className="space-y-6">
      <h2>Sales & Records</h2>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Record Sale Form */}
      <Card>
        <CardHeader>
          <CardTitle>Record Sale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select Product</Label>
            {/* Replace Select with simple HTML select */}
            <select 
              value={selectedProductId} 
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              <option value="">Select product...</option>
              {availableProducts.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - KES {product.sellingPrice} (Available: {product.qty})
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Bei ya Mauzo</p>
                <p className="font-medium">KES {selectedProduct.sellingPrice}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Idadi Iliyopo</p>
                <p className="font-medium">{selectedProduct.qty}</p>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="quantity">Idadi ya Kuuza</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Jaza idadi"
              min="1"
              max={selectedProduct?.qty || 1}
            />
          </div>

          <Button onClick={addToCart} disabled={!selectedProduct || !quantity}>
            Ongeza kwenye Kati
          </Button>
        </CardContent>
      </Card>

      {/* Shopping Cart */}
      {cart.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kati ya Ununuzi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.productId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      KES {item.price} × {item.qty} = KES {(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={item.qty}
                      onChange={(e) => updateCartQuantity(item.productId, parseInt(e.target.value) || 0)}
                      className="w-16"
                      min="1"
                      max={item.availableQty}
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Jumla:</span>
                <span className="text-xl font-bold text-primary">
                  KES {cartTotal.toLocaleString()}
                </span>
              </div>
              <Button onClick={completeSale} className="w-full" size="lg">
                Maliza Mauzo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Sales History */}
      <Card>
        <CardHeader>
          <CardTitle>Mauzo ya Leo</CardTitle>
        </CardHeader>
        <CardContent>
          {todaySales.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Hakuna mauzo leo
            </p>
          ) : (
            <div className="space-y-3">
              {todaySales.map(sale => (
                <div key={sale.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(sale.timestamp).toLocaleTimeString('sw-TZ', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <Badge variant="secondary">
                      KES {sale.total.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {sale.items.map((item, index) => (
                      <p key={index} className="text-sm">
                        {item.productName} × {item.qty}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}