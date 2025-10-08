import { api } from './api';

export interface SaleItem {
  productId: number;
  productName: string;
  qty: number;
  price: number;
}

export interface Sale {
  id: number;
  user_id: number;
  total_amount: number;
  sale_date: string;
  items_description?: string;
}

export interface CreateSaleData {
  items: SaleItem[];
  total_amount: number;
}

export const salesService = {
  getAll: async (): Promise<{ success: boolean; data: Sale[] }> => {
    return await api.get('sales.php');
  },

  create: async (saleData: CreateSaleData): Promise<{ success: boolean; message: string; sale_id: number }> => {
    return await api.post('sales.php', saleData);
  }
};