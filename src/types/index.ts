export interface NotificationState {
  show: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface Order {
  id: string;
  trackingNumber: string;
  senderName: string;
  recipientName: string;
  origin: string;
  destination: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

export interface CreateOrderDto {
  senderName: string;
  recipientName: string;
  origin: string;
  destination: string;
}

export interface OrderFilters {
  sender?: string;
  recipient?: string;
  status?: OrderStatus | '';
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
}