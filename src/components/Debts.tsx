import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { getDebts, saveDebts, Debt } from '../utils/storage';

interface DebtsProps {
  user: { id: string; username: string; name: string };
}

export function Debts({ user }: DebtsProps) {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    amount: '',
    reason: ''
  });

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = () => {
    setDebts(getDebts());
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      phone: '',
      amount: '',
      reason: ''
    });
    setShowForm(false);
  };

  const validatePhone = (phone: string): boolean => {
    // Basic Kenyan phone number validation
    const phoneRegex = /^(\+?254|0)?[17]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.phone || !formData.amount || !formData.reason) {
      setMessage('Jaza sehemu zote');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setMessage('Nambari ya simu si sahihi');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setMessage('Kiasi lazima kiwe nambari kubwa kuliko sifuri');
      return;
    }

    const newDebt: Debt = {
      id: `debt-${Date.now()}`,
      customerName: formData.customerName,
      phone: formData.phone,
      amount,
      reason: formData.reason,
      date: new Date().toISOString().split('T')[0],
      createdBy: user.id
    };

    const currentDebts = getDebts();
    const updatedDebts = [...currentDebts, newDebt];
    saveDebts(updatedDebts);
    setDebts(updatedDebts);
    
    setMessage('Deni limeongezwa');
    resetForm();
    setTimeout(() => setMessage(''), 3000);
  };

  const markAsPaid = (debtId: string) => {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;

    if (confirm(`Una uhakika kwamba ${debt.customerName} amelipa KES ${debt.amount.toLocaleString()}?`)) {
      const currentDebts = getDebts();
      const updatedDebts = currentDebts.filter(d => d.id !== debtId);
      saveDebts(updatedDebts);
      setDebts(updatedDebts);
      setMessage(`Deni la ${debt.customerName} limesasishwa kuwa limelipwa`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);

  const formatPhone = (phone: string): string => {
    // Format for display as clickable tel: link
    if (phone.startsWith('0')) {
      return `+254${phone.substring(1)}`;
    }
    if (phone.startsWith('254')) {
      return `+${phone}`;
    }
    if (phone.startsWith('+254')) {
      return phone;
    }
    return phone;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2>Madeni ya Wateja</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Funga' : '+ Deni Jipya'}
        </Button>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Jumla ya Madeni</p>
            <p className="text-3xl font-bold text-destructive">
              KES {totalDebts.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Wateja {debts.length}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Add Debt Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Ongeza Deni Jipya</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="customerName">Jina la Mteja</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Mfano: Mama Grace"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Nambari ya Simu</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="0712345678"
                  required
                />
              </div>

              <div>
                <Label htmlFor="amount">Kiasi (KES)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="reason">Bidhaa/Sababu</Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Mfano: Bidhaa mchanganyiko"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Ongeza Deni</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Futa
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Debts List */}
      <div className="space-y-4">
        {debts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Hakuna madeni yaliyosajiliwa
            </CardContent>
          </Card>
        ) : (
          debts.map(debt => (
            <Card key={debt.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{debt.customerName}</h3>
                    <a 
                      href={`tel:${formatPhone(debt.phone)}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      📞 {debt.phone}
                    </a>
                  </div>
                  <Badge variant="destructive">
                    KES {debt.amount.toLocaleString()}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Bidhaa/Sababu</p>
                    <p className="text-sm">{debt.reason}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tarehe</p>
                    <p className="text-sm">{new Date(debt.date).toLocaleDateString('sw-TZ')}</p>
                  </div>
                </div>

                <Button
                  onClick={() => markAsPaid(debt.id)}
                  className="w-full"
                  variant="outline"
                >
                  ✓ Weka Limelipwa
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Msaada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Bofya nambari ya simu kupiga simu moja kwa moja</p>
            <p>• Madeni yanaongezeka moja kwa moja kwenye dashbodi</p>
            <p>• Baada ya kulipwa, bofya "Weka Limelipwa" kuondoa deni</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}