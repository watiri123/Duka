import { api } from './api';

export interface DashboardStats {
  totalProducts: number;
  todaySales: number;
  todayRevenue: number;
  pendingDebts: number;
  totalDebts: number;
  lowStockItems: number;
  recentSales: any[];
}

export const dashboardService = {
  getStats: async (): Promise<{ success: boolean; data: DashboardStats }> => {
    return await api.get('dashboard.php');
  }
};