// import api from './api';
import type { Review, CreateReviewData } from '../types';
import { mockReviews, mockUser, delay } from '../data';

// Using mock data - will connect to API later
const reviews = [...mockReviews];

export const reviewService = {
  async getByProduct(productId: string): Promise<Review[]> {
    await delay(200);
    return reviews.filter(r => r.productId === productId);
  },

  async create(productId: string, data: CreateReviewData): Promise<Review> {
    await delay(300);
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userId: mockUser.id,
      user: mockUser,
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    reviews.push(newReview);
    return newReview;
  },
};

export default reviewService;
