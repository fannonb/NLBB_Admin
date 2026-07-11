import { create } from 'zustand';
import { favoritesApi } from '../lib/api/favorites';
import { notificationsApi } from '../lib/api/notifications';
import type { Booking, Notification, Review, Service } from '../types';
import type { ThemeMode, NotificationSettings } from '../lib/api/preferences';
import { DEFAULT_NOTIFICATION_SETTINGS } from '../lib/api/preferences';

export type AppointmentStatus = 'upcoming' | 'pending' | 'completed' | 'declined' | 'cancelled';

export interface ProviderAppointment {
  id: string;
  status: AppointmentStatus;
  customerName: string;
  customerImg: string;
  customerPhone: string;
  isNewClient: boolean;
  pastVisits?: number;
  service: string;
  price: number;
  date: string;
  time: string;
  duration: string;
  notes?: string;
  ago: string;
}

export interface WorkingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface ProviderProfile {
  businessName: string;
  description: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  location: string;
  category: string;
  coverImage: string;
  avatar: string;
  workingHours: WorkingHours[];
  galleryImages: string[];
  mpesaPhone: string;
}

export interface ProviderNotification {
  id: string;
  title: string;
  body: string;
  type: 'booking' | 'payment' | 'subscription' | 'review' | 'general';
  isRead: boolean;
  createdAt: string;
  actionId?: string;
}

const DEFAULT_WORKING_HOURS: WorkingHours[] = [
  { day: 'Monday', isOpen: true, openTime: '9:00 AM', closeTime: '8:00 PM' },
  { day: 'Tuesday', isOpen: true, openTime: '9:00 AM', closeTime: '8:00 PM' },
  { day: 'Wednesday', isOpen: true, openTime: '9:00 AM', closeTime: '8:00 PM' },
  { day: 'Thursday', isOpen: true, openTime: '9:00 AM', closeTime: '8:00 PM' },
  { day: 'Friday', isOpen: true, openTime: '9:00 AM', closeTime: '8:00 PM' },
  { day: 'Saturday', isOpen: true, openTime: '10:00 AM', closeTime: '6:00 PM' },
  { day: 'Sunday', isOpen: false, openTime: '10:00 AM', closeTime: '4:00 PM' },
];

const DEFAULT_PROVIDER_COVER =
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop';
const DEFAULT_PROVIDER_AVATAR =
  'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=200&auto=format&fit=crop';

const EMPTY_PROVIDER_PROFILE: ProviderProfile = {
  businessName: '',
  description: '',
  phone: '',
  whatsapp: '',
  instagram: '',
  facebook: '',
  location: '',
  category: '',
  coverImage: DEFAULT_PROVIDER_COVER,
  avatar: DEFAULT_PROVIDER_AVATAR,
  workingHours: DEFAULT_WORKING_HOURS,
  galleryImages: [],
  mpesaPhone: '',
};

const toProviderNotification = (notification: Notification): ProviderNotification => ({
  id: notification.id,
  title: notification.title,
  body: notification.body,
  type: notification.type,
  isRead: notification.isRead,
  createdAt: notification.createdAt,
});

interface AppState {
  favorites: string[];
  bookings: Booking[];
  customerNotifications: Notification[];
  theme: ThemeMode;
  notificationSettings: NotificationSettings;

  addFavorite: (providerId: string) => Promise<void>;
  removeFavorite: (providerId: string) => Promise<void>;
  toggleFavorite: (providerId: string) => Promise<void>;
  hydrateFavorites: () => Promise<void>;

  addBooking: (booking: Booking) => void;
  setBookings: (bookings: Booking[]) => void;
  updateCustomerBookingStatus: (id: string, status: Booking['status']) => void;

  hydrateCustomerNotifications: () => Promise<void>;
  markCustomerNotificationRead: (id: string) => Promise<void>;
  markAllCustomerNotificationsRead: () => Promise<void>;

  addCustomerReview: (review: Review) => void;

  setTheme: (theme: ThemeMode) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;

  providerServices: (Service & { isActive: boolean })[];
  providerAppointments: ProviderAppointment[];
  providerReviews: Review[];
  providerNotifications: ProviderNotification[];
  providerProfile: ProviderProfile;

  setProviderServices: (services: (Service & { isActive: boolean })[]) => void;
  setProviderAppointments: (appointments: ProviderAppointment[]) => void;
  setProviderReviews: (reviews: Review[]) => void;
  hydrateProviderNotifications: () => Promise<void>;

  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  toggleServiceActive: (id: string) => void;

  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  addWalkInAppointment: (apt: ProviderAppointment) => void;

  updateProviderProfile: (profile: Partial<ProviderProfile>) => void;
  updateWorkingHours: (hours: WorkingHours[]) => void;

  markProviderNotificationRead: (id: string) => Promise<void>;
  markAllProviderNotificationsRead: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  favorites: [],
  bookings: [],
  customerNotifications: [],
  theme: 'light',
  notificationSettings: { ...DEFAULT_NOTIFICATION_SETTINGS },

  addFavorite: async (providerId) => {
    set((state) => ({
      favorites: state.favorites.includes(providerId) ? state.favorites : [...state.favorites, providerId],
    }));
    try {
      await favoritesApi.addFavorite(providerId);
    } catch {
      // Keep optimistic UI state even when request fails.
    }
  },

  removeFavorite: async (providerId) => {
    set((state) => ({ favorites: state.favorites.filter((id) => id !== providerId) }));
    try {
      await favoritesApi.removeFavorite(providerId);
    } catch {
      // Keep optimistic UI state even when request fails.
    }
  },

  toggleFavorite: async (providerId) => {
    const { favorites } = get();
    if (favorites.includes(providerId)) {
      await get().removeFavorite(providerId);
      return;
    }
    await get().addFavorite(providerId);
  },

  hydrateFavorites: async () => {
    try {
      const backendFavorites = await favoritesApi.listFavorites();
      set({ favorites: backendFavorites.map((provider) => provider.id) });
    } catch {
      // Ignore load failures and keep current state.
    }
  },

  addBooking: (booking) =>
    set((state) => ({ bookings: [booking, ...state.bookings] })),

  setBookings: (bookings) => set({ bookings }),

  updateCustomerBookingStatus: (id, status) =>
    set((state) => ({
      bookings: state.bookings.map((booking) => (booking.id === id ? { ...booking, status } : booking)),
    })),

  hydrateCustomerNotifications: async () => {
    try {
      const notifications = await notificationsApi.listMyNotifications();
      set({ customerNotifications: notifications });
    } catch {
      // Ignore load failures and keep current state.
    }
  },

  markCustomerNotificationRead: async (id) => {
    const previous = get().customerNotifications;
    set((state) => ({
      customerNotifications: state.customerNotifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      ),
    }));

    try {
      const updated = await notificationsApi.markNotificationRead(id);
      set((state) => ({
        customerNotifications: state.customerNotifications.map((notification) =>
          notification.id === id ? updated : notification
        ),
      }));
    } catch {
      set({ customerNotifications: previous });
    }
  },

  markAllCustomerNotificationsRead: async () => {
    const previous = get().customerNotifications;
    set((state) => ({
      customerNotifications: state.customerNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    }));

    try {
      await notificationsApi.markAllNotificationsRead();
    } catch {
      set({ customerNotifications: previous });
    }
  },

  addCustomerReview: (_review) => {
    // Placeholder until customer review submission endpoint is wired.
  },

  providerServices: [],
  providerAppointments: [],
  providerReviews: [],
  providerNotifications: [],
  providerProfile: EMPTY_PROVIDER_PROFILE,

  setProviderServices: (services) => set({ providerServices: services }),

  setProviderAppointments: (appointments) => set({ providerAppointments: appointments }),

  setProviderReviews: (reviews) => set({ providerReviews: reviews }),

  hydrateProviderNotifications: async () => {
    try {
      const notifications = await notificationsApi.listMyNotifications();
      set({ providerNotifications: notifications.map(toProviderNotification) });
    } catch {
      // Ignore load failures and keep current state.
    }
  },

  addService: (service) =>
    set((state) => ({ providerServices: [...state.providerServices, { ...service, isActive: true }] })),

  updateService: (service) =>
    set((state) => ({
      providerServices: state.providerServices.map((item) =>
        item.id === service.id ? { ...item, ...service } : item
      ),
    })),

  deleteService: (id) =>
    set((state) => ({ providerServices: state.providerServices.filter((item) => item.id !== id) })),

  toggleServiceActive: (id) =>
    set((state) => ({
      providerServices: state.providerServices.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      ),
    })),

  updateAppointmentStatus: (id, status) =>
    set((state) => ({
      providerAppointments: state.providerAppointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment
      ),
    })),

  addWalkInAppointment: (apt) =>
    set((state) => ({ providerAppointments: [apt, ...state.providerAppointments] })),

  updateProviderProfile: (profile) =>
    set((state) => ({ providerProfile: { ...state.providerProfile, ...profile } })),

  updateWorkingHours: (hours) =>
    set((state) => ({ providerProfile: { ...state.providerProfile, workingHours: hours } })),

  markProviderNotificationRead: async (id) => {
    const previous = get().providerNotifications;
    set((state) => ({
      providerNotifications: state.providerNotifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      ),
    }));

    try {
      const updated = await notificationsApi.markNotificationRead(id);
      const normalized = toProviderNotification(updated);
      set((state) => ({
        providerNotifications: state.providerNotifications.map((notification) =>
          notification.id === id ? normalized : notification
        ),
      }));
    } catch {
      set({ providerNotifications: previous });
    }
  },

  markAllProviderNotificationsRead: async () => {
    const previous = get().providerNotifications;
    set((state) => ({
      providerNotifications: state.providerNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    }));

    try {
      await notificationsApi.markAllNotificationsRead();
    } catch {
      set({ providerNotifications: previous });
    }
  },

  setTheme: (theme) => {
    set({ theme });
  },

  updateNotificationSettings: (settings) => {
    set((state) => ({
      notificationSettings: { ...state.notificationSettings, ...settings },
    }));
  },
}));
