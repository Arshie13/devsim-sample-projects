// import api from './api';
import type { Category } from '../types';
import { mockCategories, delay } from '../data';

// Using mock data - will connect to API later
const categories = [...mockCategories];

export const categoryService = {
  async getAll(): Promise<Category[]> {
    await delay(200);
    return categories;
  },

  async create(name: string): Promise<Category> {
    await delay(300);
    const newCategory: Category = {
      id: `${Date.now()}`,
      name,
      description: '',
    };
    categories.push(newCategory);
    return newCategory;
  },
};

export default categoryService;
