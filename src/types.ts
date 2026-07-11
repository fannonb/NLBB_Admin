export type UserRole = 'customer' | 'provider' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  location?: string;
}

export interface BackendUserProfile {
  id: string;
  email: string | null;
  name: string;
  phone: string;
  role: UserRole;
  status?: 'active' | 'disabled';
  avatar?: string | null;
  location?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  isActive?: boolean;
}

export interface WorkingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface Provider {
  id: string;
  ownerUserId?: string;
  name: string;
  category: string;
  description: string;
  avatar?: string;
  coverImage?: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  distance?: string;
  location: string;
  address: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  mpesaPhone?: string;
  openTime: string;
  closeTime: string;
  workDays: string;
  workingHours?: WorkingHours[];
  priceFrom: number;
  isVerified: boolean;
  isSubscribed: boolean;
  isOpen: boolean;
  services: Service[];
  galleryImages?: string[];
  coordinates?: { lat: number; lng: number };
}

export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  ref: string;
  customerId: string;
  providerId: string;
  providerName: string;
  providerImage?: string;
  serviceName: string;
  servicePrice: number;
  date: string;
  time: string;
  endTime: string;
  duration: number;
  status: BookingStatus;
  notes?: string;
  totalAmount: number;
  platformFee: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  serviceName: string;
  date: string;
}

export interface Subscription {
  providerId: string;
  status: 'active' | 'expired' | 'pending' | 'suspended';
  renewalDate: string;
  amount: number;
  paymentMethod: 'mpesa';
  lastPaymentId?: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  providerId: string;
  amount: number;
  phoneNumber: string;
  method: 'mpesa';
  status: 'pending' | 'success' | 'failed';
  checkoutRequestId: string;
  merchantRequestId?: string;
  mpesaReceiptNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'booking' | 'payment' | 'subscription' | 'review' | 'general';
  isRead: boolean;
  createdAt: string;
}
