import api from './api';

export type PromoValidationSuccess = {
  success: true;
  data: {
    discountPercent: number;
    finalTotal: number;
  };
};

export type PromoValidationFailure = {
  success: false;
  reason: 'NOT_FOUND' | 'INACTIVE' | 'EXPIRED' | 'EXHAUSTED';
  message: string;
};

export type PromoValidationResponse = PromoValidationSuccess | PromoValidationFailure;

export interface PromoSummary {
  id: number;
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  remainingUses: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

export const promoService = {
  async validatePromo(code: string, subtotal: number): Promise<PromoValidationResponse> {
    try {
      const response = await api.post<PromoValidationSuccess>('/promos/validate', {
        code,
        subtotal,
      });
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: PromoValidationFailure } };
      if (err.response?.data && err.response.data.success === false) {
        return err.response.data;
      }
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: 'Unable to validate promo code',
      };
    }
  },

  async listPromos(): Promise<PromoSummary[]> {
    const response = await api.get<PromoSummary[]>('/promos');
    return response.data;
  },
};

export async function validatePromo(code: string, subtotal: number) {
  return promoService.validatePromo(code, subtotal);
}
