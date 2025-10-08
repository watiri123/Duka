import { api } from './api';

export interface Debt {
  id: number;
  user_id: number;
  customer_name: string;
  customer_phone: string;
  amount: number;
  description: string;
  status: 'pending' | 'paid';
  created_at: string;
}

export interface CreateDebtData {
  customer_name: string;
  customer_phone?: string;
  amount: number;
  description?: string;
  status?: 'pending' | 'paid';
}

export const debtsService = {
  getAll: async (status?: string): Promise<{ success: boolean; data: Debt[] }> => {
    const endpoint = status ? `debts.php?status=${status}` : 'debts.php';
    return await api.get(endpoint);
  },

  create: async (debtData: CreateDebtData): Promise<{ success: boolean; message: string; debt_id: number }> => {
    return await api.post('debts.php', debtData);
  },

  update: async (id: number, debtData: Partial<CreateDebtData>): Promise<{ success: boolean; message: string }> => {
    return await api.put(`debts.php?id=${id}`, debtData);
  },

  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    return await api.delete(`debts.php?id=${id}`);
  }
};