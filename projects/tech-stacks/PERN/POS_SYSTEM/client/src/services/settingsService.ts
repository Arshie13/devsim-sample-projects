import api from './api';
import { StoreSettings } from '../types';

export const settingsService = {
  async get(): Promise<StoreSettings> {
    const response = await api.get<StoreSettings>('/settings');
    return response.data;
  },

  async update(data: {
    name: string;
    address?: string;
    taxRate: number;
    cashEnabled: boolean;
    cardEnabled: boolean;
  }): Promise<StoreSettings> {
    const response = await api.put<StoreSettings>('/settings', data);
    return response.data;
  },
};
