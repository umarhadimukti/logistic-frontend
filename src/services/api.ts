import type { ApiResponse, CreateOrderDto, Order } from '@/types';
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
  }
}