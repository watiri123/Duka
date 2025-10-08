import { api } from './api';

export interface Product {
  id: number;
  user_id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

export const itemsService = {
  getAll: async (): Promise<{ success: boolean; data: Product[] }> => {
    return await api.get('items.php');
  },

  create: async (productData: CreateProductData): Promise<{ success: boolean; message: string; id: number }> => {
    return await api.post('items.php', productData);
  },

  update: async (id: number, productData: Partial<CreateProductData>): Promise<{ success: boolean; message: string }> => {
    return await api.put(`items.php?id=${id}`, productData);
  },

  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    return await api.delete(`items.php?id=${id}`);
  }
};