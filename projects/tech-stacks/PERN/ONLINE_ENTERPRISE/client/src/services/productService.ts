// import api from './api';
import type { Product, ProductFormData } from '../types';
import { mockProducts, delay } from '../data';

// Using mock data - will connect to API later
let products = [...mockProducts];

export const productService = {
  async getAll(categoryId?: string): Promise<Product[]> {
    await delay(300);
    if (categoryId) {
      return products.filter(p => p.categoryId === categoryId);
    }
    return products;
  },

  async getById(id: string): Promise<Product> {
    await delay(200);
    const product = products.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  async create(data: ProductFormData): Promise<Product> {
    await delay(300);
    const newProduct: Product = {
      id: `${Date.now()}`,
      ...data,
      category: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.push(newProduct);
    return newProduct;
  },

  async update(id: string, data: Partial<ProductFormData>): Promise<Product> {
    await delay(300);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    products[index] = { ...products[index], ...data, updatedAt: new Date().toISOString() };
    return products[index];
  },

  async delete(id: string): Promise<void> {
    await delay(200);
    products = products.filter(p => p.id !== id);
  },

  async search(query: string): Promise<Product[]> {
    await delay(300);
    return products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
  },
};

export default productService;
