import { ref, reactive } from 'vue';
import type { CreateOrderDto, Order, OrderFilters, PaginationResult } from '@/types';
import { orderApi } from '@/services/api';

export function useOrders() {
  const orders = ref<Order[]>([]);
  const currentOrder = ref<Order | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const pagination = reactive({
    page: 1,
    limit: 10,
    pages: 0,
    total: 0,
  });

  const filters = reactive<OrderFilters>({
    sender: '',
    recipient: '',
    status: '',
    page: 1,
    limit: 10,
  });

  const createOrder = async (orderData: CreateOrderDto): Promise<Order> => {
    loading.value = true;
    error.value = null;

    try {
      const newOrder = await orderApi.createOrder(orderData);
      orders.value.unshift(newOrder);
      return newOrder;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to create order.";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchOrders = async () => {
    loading.value = true;
    error.value = null;

    try {
      const result: PaginationResult<Order> = await orderApi.getOrders(filters);
      orders.value = result.data;
      Object.assign(pagination, result.pagination);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch orders.";
    } finally {
      loading.value = false;
    }
  };

  const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
    try {
      const updatedOrder = await orderApi.updateOrderStatus(orderId, status);
      const index = orders.value.findIndex(order => order.id === orderId);
      if (index !== -1) {
        orders.value[index] = updatedOrder;
      }
      if (currentOrder.value?.id === orderId) {
        currentOrder.value = updatedOrder;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update order';
      throw err;
    }
  };

  const cancelOrder = async (orderId: string): Promise<void> => {
    try {
      const canceledOrder = await orderApi.cancelOrder(orderId);
      const index = orders.value.findIndex(order => order.id === orderId);
      if (index !== -1) {
        orders.value[index] = canceledOrder;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to cancel order';
      throw err;
    }
  };
  
  const setFilters = (newFilters: Partial<OrderFilters>) => {
    Object.assign(filters, newFilters);
    fetchOrders();
  };

  const resetFilters = () => {
    Object.assign(filters, {
      status: '',
      sender: '',
      recipient: '',
      page: 1,
      limit: 10,
    });
    fetchOrders();
  };

  const trackOrder = async (trackingNumber: string): Promise<Order> => {
    loading.value = true;
    error.value = null;
    
    try {
      const order = await orderApi.trackOrder(trackingNumber);
      currentOrder.value = order;
      return order;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Order not found';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    orders,
    currentOrder,
    loading,
    error,
    pagination,
    filters,
    createOrder,
    fetchOrders,
    updateOrderStatus,
    cancelOrder,
    setFilters,
    resetFilters,
    trackOrder,
  }
}