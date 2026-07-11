import { apiClient } from './client';
import type { Notification } from '../../types';

export const notificationsApi = {
  listMyNotifications: () => apiClient.get<Notification[]>('notifications/me'),
  markNotificationRead: (notificationId: string) =>
    apiClient.patch<Notification>(`notifications/${notificationId}/read`, {}),
  markAllNotificationsRead: () =>
    apiClient.patch<{ updated: number }>('notifications/me/read-all', {}),
};
