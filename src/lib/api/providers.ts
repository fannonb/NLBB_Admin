import { apiClient } from './client';
import type { Category, Provider } from '../../types';

export interface ProviderListFilters {
  search?: string;
  category?: string;
  onlySubscribed?: boolean;
}

const buildQueryString = (filters: ProviderListFilters) => {
  const params = new URLSearchParams();
  if (filters.search) {
    params.append('search', filters.search);
  }
  if (filters.category) {
    params.append('category', filters.category);
  }
  if (filters.onlySubscribed !== undefined) {
    params.append('onlySubscribed', filters.onlySubscribed ? 'true' : 'false');
  }
  return params.toString();
};

export const providerApi = {
  listProviders: (filters: ProviderListFilters = {}) => {
    const query = buildQueryString(filters);
    return apiClient.get<Provider[]>(`providers${query ? `?${query}` : ''}`);
  },
  listCategories: () => apiClient.get<Category[]>('categories'),
};
