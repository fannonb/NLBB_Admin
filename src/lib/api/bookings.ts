import { apiClient } from './client';

export type BookingBackendStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
export type CustomerBookingStatus = 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
export type ProviderAppointmentStatus = 'upcoming' | 'pending' | 'declined' | 'completed' | 'cancelled';

export interface BookingRecord {
  id: string;
  ref: string;
  customerId: string;
  providerId: string;
  providerName: string;
  providerImage?: string | null;
  providerPhone?: string | null;
  providerWhatsapp?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  customerAvatar?: string | null;
  serviceName: string;
  servicePrice: number;
  scheduledAt: string;
  endAt: string;
  duration: number;
  status: BookingBackendStatus;
  notes?: string | null;
  totalAmount: number;
  platformFee: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  providerId: string;
  serviceId?: string;
  serviceName?: string;
  servicePrice?: number;
  duration?: number;
  scheduledAt: string;
  notes?: string;
}

export interface UpdateBookingStatusPayload {
  status: 'confirmed' | 'upcoming' | 'accepted' | 'declined' | 'rejected' | 'completed' | 'cancelled';
}

export interface CustomerBookingCard {
  id: string;
  ref: string;
  customerId: string;
  providerId: string;
  providerName: string;
  providerImage?: string;
  providerPhone?: string | null;
  providerWhatsapp?: string | null;
  serviceName: string;
  servicePrice: number;
  scheduledAt: string;
  endAt: string;
  duration: number;
  status: CustomerBookingStatus;
  notes?: string;
  totalAmount: number;
  platformFee: number;
  date: string;
  time: string;
  endTime: string;
}

export interface ProviderAppointmentCard {
  id: string;
  ref: string;
  status: ProviderAppointmentStatus;
  customerName: string;
  customerImg?: string | null;
  customerPhone: string;
  isNewClient: boolean;
  pastVisits?: number;
  service: string;
  price: number;
  scheduledAt: string;
  endAt: string;
  date: string;
  time: string;
  duration: string;
  notes?: string;
  ago: string;
  providerId: string;
}

const CUSTOMER_STATUS_MAP: Record<BookingBackendStatus, CustomerBookingStatus> = {
  pending: 'pending',
  accepted: 'confirmed',
  rejected: 'rejected',
  completed: 'completed',
  cancelled: 'cancelled',
};

const PROVIDER_STATUS_MAP: Record<BookingBackendStatus, ProviderAppointmentStatus> = {
  pending: 'pending',
  accepted: 'upcoming',
  rejected: 'declined',
  completed: 'completed',
  cancelled: 'cancelled',
};

const BACKEND_STATUS_MAP: Record<UpdateBookingStatusPayload['status'], BookingBackendStatus> = {
  accepted: 'accepted',
  confirmed: 'accepted',
  upcoming: 'accepted',
  declined: 'rejected',
  rejected: 'rejected',
  completed: 'completed',
  cancelled: 'cancelled',
};

const parseDateTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const buildScheduledAt = (date: Date, time: string) => {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    throw new Error(`Invalid time value: ${time}`);
  }

  const [, hoursString, minutesString, period] = match;
  let hours = Number(hoursString);
  const minutes = Number(minutesString);
  const upperPeriod = period.toUpperCase();

  if (upperPeriod === 'AM' && hours === 12) {
    hours = 0;
  } else if (upperPeriod === 'PM' && hours !== 12) {
    hours += 12;
  }

  const scheduledAt = new Date(date);
  scheduledAt.setHours(hours, minutes, 0, 0);

  return scheduledAt.toISOString();
};

export const formatBookingDate = (value: string) => {
  const date = parseDateTime(value);
  if (!date) {
    return 'TBA';
  }

  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
  return `${weekday}, ${month} ${date.getDate()}`;
};

export const formatBookingTime = (value: string) => {
  const date = parseDateTime(value);
  if (!date) {
    return 'TBA';
  }

  const hours24 = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${minutes} ${period}`;
};

export const formatDuration = (minutes: number) => `${minutes}m`;

export const toCustomerBookingCard = (booking: BookingRecord): CustomerBookingCard => ({
  id: booking.id,
  ref: booking.ref,
  customerId: booking.customerId,
  providerId: booking.providerId,
  providerName: booking.providerName,
  providerImage: booking.providerImage ?? undefined,
  providerPhone: booking.providerPhone ?? undefined,
  providerWhatsapp: booking.providerWhatsapp ?? undefined,
  serviceName: booking.serviceName,
  servicePrice: booking.servicePrice,
  scheduledAt: booking.scheduledAt,
  endAt: booking.endAt,
  duration: booking.duration,
  status: CUSTOMER_STATUS_MAP[booking.status],
  notes: booking.notes ?? undefined,
  totalAmount: booking.totalAmount,
  platformFee: booking.platformFee,
  date: formatBookingDate(booking.scheduledAt),
  time: formatBookingTime(booking.scheduledAt),
  endTime: formatBookingTime(booking.endAt),
});

export const toProviderAppointmentCard = (booking: BookingRecord): ProviderAppointmentCard => ({
  id: booking.id,
  ref: booking.ref,
  status: PROVIDER_STATUS_MAP[booking.status],
  customerName: booking.customerName ?? 'Customer',
  customerImg: booking.customerAvatar ?? null,
  customerPhone: booking.customerPhone ?? '',
  isNewClient: false,
  service: booking.serviceName,
  price: booking.servicePrice,
  scheduledAt: booking.scheduledAt,
  endAt: booking.endAt,
  date: formatBookingDate(booking.scheduledAt),
  time: formatBookingTime(booking.scheduledAt),
  duration: formatDuration(booking.duration),
  notes: booking.notes ?? undefined,
  ago: formatRelative(booking.createdAt),
  providerId: booking.providerId,
});

const formatRelative = (value: string) => {
  const date = parseDateTime(value);
  if (!date) {
    return 'Recently';
  }

  const diffMinutes = Math.round((date.getTime() - Date.now()) / 60_000);
  const absMinutes = Math.abs(diffMinutes);

  if (absMinutes < 60) {
    return diffMinutes >= 0 ? `in ${absMinutes} min` : `${absMinutes} min ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    const absHours = Math.abs(diffHours);
    return diffHours >= 0 ? `in ${absHours} hr` : `${absHours} hr ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  const absDays = Math.abs(diffDays);
  return diffDays >= 0 ? `in ${absDays} day${absDays === 1 ? '' : 's'}` : `${absDays} day${absDays === 1 ? '' : 's'} ago`;
};

export const mapBookingStatusToBackend = (
  status: UpdateBookingStatusPayload['status']
): BookingBackendStatus => BACKEND_STATUS_MAP[status];

export const bookingApi = {
  listMyBookings: () => apiClient.get<BookingRecord[]>('bookings/me'),
  createBooking: (payload: CreateBookingPayload) => apiClient.post<BookingRecord>('bookings', payload),
  updateBookingStatus: (bookingId: string, status: UpdateBookingStatusPayload['status']) =>
    apiClient.patch<BookingRecord>(`bookings/${bookingId}/status`, {
      status: mapBookingStatusToBackend(status),
    }),
};
