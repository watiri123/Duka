// Storage utilities and data seeding

export interface User {
  id: string;
  username: string;
  name: string;
  passwordHash: string;
}

export interface Product {
  id: string;
  name: string;
  buyingPrice: number;
  sellingPrice: number;
  qty: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  items: {
    productId: string;
    productName: string;
    qty: number;
    price: number;
  }[];
  total: number;
  userId: string;
  timestamp: string;
}

export interface Debt {
  id: string;
  customerName: string;
  phone: string;
  amount: number;
  reason: string;
  date: string;
  createdBy: string;
}

// Hash password using Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Seed initial data if not present
export async function seedData() {
  // Seed users
  if (!localStorage.getItem('dukapro_users')) {
    const defaultPasswordHash = await hashPassword('juma123');
    const users: User[] = [
      {
        id: 'user-1',
        username: 'juma',
        name: 'Juma Mwangi',
        passwordHash: defaultPasswordHash
      }
    ];
    localStorage.setItem('dukapro_users', JSON.stringify(users));
  }

  // Seed products
  if (!localStorage.getItem('dukapro_products')) {
    const products: Product[] = [
      {
        id: 'prod-1',
        name: 'Unga wa Ngano 2kg',
        buyingPrice: 150,
        sellingPrice: 180,
        qty: 25,
        ownerId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'prod-2',
        name: 'Sukari 1kg',
        buyingPrice: 120,
        sellingPrice: 150,
        qty: 3, // Low stock
        ownerId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'prod-3',
        name: 'Mchele 2kg',
        buyingPrice: 200,
        sellingPrice: 250,
        qty: 0, // Out of stock
        ownerId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('dukapro_products', JSON.stringify(products));
  }

  // Seed sales
  if (!localStorage.getItem('dukapro_sales')) {
    const today = new Date().toISOString().split('T')[0];
    const sales: Sale[] = [
      {
        id: 'sale-1',
        items: [
          {
            productId: 'prod-1',
            productName: 'Unga wa Ngano 2kg',
            qty: 2,
            price: 180
          }
        ],
        total: 360,
        userId: 'user-1',
        timestamp: new Date().toISOString()
      }
    ];
    localStorage.setItem('dukapro_sales', JSON.stringify(sales));
  }

  // Seed debts
  if (!localStorage.getItem('dukapro_debts')) {
    const debts: Debt[] = [
      {
        id: 'debt-1',
        customerName: 'Mama Grace',
        phone: '0712345678',
        amount: 500,
        reason: 'Bidhaa mchanganyiko',
        date: new Date().toISOString().split('T')[0],
        createdBy: 'user-1'
      }
    ];
    localStorage.setItem('dukapro_debts', JSON.stringify(debts));
  }
}

// Storage operations
export function getProducts(): Product[] {
  return JSON.parse(localStorage.getItem('dukapro_products') || '[]');
}

export function saveProducts(products: Product[]) {
  localStorage.setItem('dukapro_products', JSON.stringify(products));
}

export function getSales(): Sale[] {
  return JSON.parse(localStorage.getItem('dukapro_sales') || '[]');
}

export function saveSales(sales: Sale[]) {
  localStorage.setItem('dukapro_sales', JSON.stringify(sales));
}

export function getDebts(): Debt[] {
  return JSON.parse(localStorage.getItem('dukapro_debts') || '[]');
}

export function saveDebts(debts: Debt[]) {
  localStorage.setItem('dukapro_debts', JSON.stringify(debts));
}

export function resetDemoData() {
  localStorage.removeItem('dukapro_users');
  localStorage.removeItem('dukapro_products');
  localStorage.removeItem('dukapro_sales');
  localStorage.removeItem('dukapro_debts');
  localStorage.removeItem('dukapro_session');
  seedData();
}