import { ref, reactive } from 'vue';
import type { CreateOrderDto, Order, OrderFilters } from '@/types';
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
  }

  return {
    orders,
    currentOrder,
    loading,
    error,
    pagination,
    filters,
    createOrder,
  }
}