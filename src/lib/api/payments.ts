import { apiClient } from './client';
import type { Payment } from '../../types';

export const paymentsApi = {
  listMyPayments: () => apiClient.get<Payment[]>('payments/me'),
};
