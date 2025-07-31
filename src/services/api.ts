import type { ApiResponse, CreateOrderDto, Order, OrderFilters, PaginationResult } from '@/types';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// request interceptor
api.interceptors.request.use(
  (config) => { return config },
  (error) => { return Promise.reject(error) },
)

// response interceptor
api.interceptors.response.use(
  (response) => { return response },
  (error) => {
    const message = error.response?.data?.message || 'An error occurred.';
    return Promise.reject(new Error(message));
  }
)

export const orderApi = {
  createOrder: async (orderData: CreateOrderDto): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>('/orders', orderData);
    return response.data.data!;
  },
  
  getOrders: async (filters: OrderFilters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined || value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get<ApiResponse<PaginationResult<Order>>>(`/orders?${params}`);
    return response.data.data!;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    const response = await api.put<ApiResponse<Order>>(`/orders/${orderId}/status`, { status })
    return response.data.data!
  },

  cancelOrder: async (orderId: string): Promise<Order> => {
    const response = await api.put<ApiResponse<Order>>(`/orders/${orderId}/cancel`)
    return response.data.data!
  },

  trackOrder: async (trackingNumber: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/track/${trackingNumber}`)
    return response.data.data!
  },
}