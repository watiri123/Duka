import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { getProducts, saveProducts, Product } from '../utils/storage';

interface ProductsProps {
  user: { id: string; username: string; name: string };
}

export function Products({ user }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    buyingPrice: '',
    sellingPrice: '',
    qty: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setProducts(getProducts());
  };

  const resetForm = () => {
    setFormData({
      name: '',
      buyingPrice: '',
      sellingPrice: '',
      qty: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.buyingPrice || !formData.sellingPrice || !formData.qty) {
      setMessage('Please fill in all fields');
      return;
    }

    const buyingPrice = parseFloat(formData.buyingPrice);
    const sellingPrice = parseFloat(formData.sellingPrice);
    const qty = parseInt(formData.qty);

    if (isNaN(buyingPrice) || isNaN(sellingPrice) || isNaN(qty)) {
      setMessage('Prices and quantity must be numbers');
      return;
    }

    if (sellingPrice <= buyingPrice) {
      setMessage('Selling price must be higher than buying price');
      return;
    }

    const currentProducts = getProducts();
    
    if (editingProduct) {
      // Update existing product
      const updatedProducts = currentProducts.map(p => 
        p.id === editingProduct.id 
          ? {
              ...p,
              name: formData.name,
              buyingPrice,
              sellingPrice,
              qty,
              updatedAt: new Date().toISOString()
            }
          : p
      );
      saveProducts(updatedProducts);
      setMessage('Product updated successfully');
    } else {
      // Add new product
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        buyingPrice,
        sellingPrice,
        qty,
        ownerId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedProducts = [...currentProducts, newProduct];
      saveProducts(updatedProducts);
      setMessage('Product added successfully');
    }
    
    loadProducts();
    resetForm();
    setTimeout(() => setMessage(''), 3000);
  };

  const handleEdit = (product: Product) => {
    if (product.ownerId !== user.id) {
      setMessage('You can only edit your own products');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    setEditingProduct(product);
    setFormData({
      name: product.name,
      buyingPrice: product.buyingPrice.toString(),
      sellingPrice: product.sellingPrice.toString(),
      qty: product.qty.toString()
    });
    setShowForm(true);
  };

  const handleDelete = (product: Product) => {
    if (product.ownerId !== user.id) {
      setMessage('You can only delete your own products');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      const currentProducts = getProducts();
      const updatedProducts = currentProducts.filter(p => p.id !== product.id);
      saveProducts(updatedProducts);
      loadProducts();
      setMessage('Product deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (qty: number) => {
    if (qty === 0) return { label: 'OUT OF STOCK', variant: 'destructive' as const };
    if (qty < 5) return { label: 'LOW STOCK', variant: 'secondary' as const };
    return { label: 'IN STOCK', variant: 'default' as const };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2>Products & Inventory</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close' : '+ New Product'}
        </Button>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Example: Wheat Flour 2kg"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buyingPrice">Buying Price (KES)</Label>
                  <Input
                    id="buyingPrice"
                    type="number"
                    step="0.01"
                    value={formData.buyingPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, buyingPrice: e.target.value }))}
                    placeholder="150"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="sellingPrice">Selling Price (KES)</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: e.target.value }))}
                    placeholder="180"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="qty">Initial Quantity</Label>
                <Input
                  id="qty"
                  type="number"
                  value={formData.qty}
                  onChange={(e) => setFormData(prev => ({ ...prev, qty: e.target.value }))}
                  placeholder="20"
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  {editingProduct ? 'Update' : 'Add Product'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div>
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No products found
            </CardContent>
          </Card>
        ) : (
          filteredProducts.map(product => {
            const stockStatus = getStockStatus(product.qty);
            const profit = product.sellingPrice - product.buyingPrice;
            const profitMargin = ((profit / product.buyingPrice) * 100).toFixed(1);
            
            return (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Profit: KES {profit} ({profitMargin}%)
                      </p>
                    </div>
                    <Badge variant={stockStatus.variant}>
                      {stockStatus.label}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-muted-foreground">Buying Price</p>
                      <p className="font-medium">KES {product.buyingPrice}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Selling Price</p>
                      <p className="font-medium">KES {product.sellingPrice}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quantity</p>
                      <p className="font-medium">{product.qty}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                      disabled={product.ownerId !== user.id}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product)}
                      disabled={product.ownerId !== user.id}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}