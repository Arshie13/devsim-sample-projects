// import api from './api';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '../types';
import { mockUser, delay } from '../data';

// Using mock data - will connect to API later
export const authService = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(_credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(500);
    // Always succeed with mock user for now
    const response: AuthResponse = {
      user: mockUser,
      token: 'mock-jwt-token-12345',
    };
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    await delay(500);
    const newUser: User = {
      id: `${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'CUSTOMER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const response: AuthResponse = {
      user: newUser,
      token: 'mock-jwt-token-12345',
    };
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  },

  async getMe(): Promise<User> {
    await delay(200);
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return mockUser;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;
