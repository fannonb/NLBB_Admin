import { apiClient } from './client';
import type { Provider } from '../../types';

export interface FavoritePayload {
  providerId: string;
}

export const favoritesApi = {
  listFavorites: () => apiClient.get<Provider[]>('favorites/me'),
  addFavorite: (providerId: string) =>
    apiClient.post<{ providerId: string }>('favorites/me', { providerId }),
  removeFavorite: (providerId: string) => apiClient.delete<{ providerId: string }>(`favorites/me/${providerId}`),
};
