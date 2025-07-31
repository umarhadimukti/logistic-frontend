<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-gray-900">Orders</h1>
          <p class="mt-2 text-sm text-gray-700">
            A list of all orders including their status, sender, recipient, and tracking information.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <router-link
            to="/create-order"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Create Order
          </router-link>
        </div>
      </div>

      <!-- Filters -->
      <div class="mt-6 bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label for="statusFilter" class="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="statusFilter"
                v-model="filters.status"
                @change="applyFilters"
                class="mt-1 block w-full rounded-md px-2 py-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELED">Canceled</option>
              </select>
            </div>

            <div>
              <label for="senderFilter" class="block text-sm font-medium text-gray-700">Sender</label>
              <input
                id="senderFilter"
                v-model="filters.sender"
                @input="debounceFilter"
                type="text"
                placeholder="Filter by sender name"
                class="mt-1 block w-full rounded-md px-2 py-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label for="recipientFilter" class="block text-sm font-medium text-gray-700">Recipient</label>
              <input
                id="recipientFilter"
                v-model="filters.recipient"
                @input="debounceFilter"
                type="text"
                placeholder="Filter by recipient name"
                class="mt-1 block w-full rounded-md px-2 py-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div class="flex items-end">
              <button
                @click="resetFilters"
                class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <div v-if="loading" class="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" text="Loading orders..." />
        </div>

        <div v-else-if="error" class="p-6 text-center">
          <ExclamationTriangleIcon class="mx-auto h-12 w-12 text-red-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading orders</h3>
          <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
          <button
            @click="fetchOrders"
            class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>

        <div v-else-if="orders.length === 0" class="p-6 text-center">
          <InboxIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by creating a new order.
          </p>
          <router-link
            to="/create-order"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Create Order
          </router-link>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking Number
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sender
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-indigo-600">
                    {{ order.trackingNumber }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ order.senderName }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ order.recipientName }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ order.origin }} → {{ order.destination }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="order.status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <!-- Update Status Dropdown -->
                    <select
                      v-if="canUpdateStatus(order)"
                      @change="handleStatusUpdate(order.id, $event)"
                      class="text-xs border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Update Status</option>
                      <option
                        v-for="status in getAvailableStatuses(order.status)"
                        :key="status"
                        :value="status"
                      >
                        {{ getStatusLabel(status) }}
                      </option>
                    </select>

                    <!-- Cancel Button -->
                    <button
                      v-if="order.status === 'PENDING'"
                      @click="handleCancelOrder(order.id)"
                      class="text-red-600 hover:text-red-900 text-xs"
                      :disabled="loading"
                    >
                      Cancel
                    </button>

                    <!-- View Details Button -->
                    <router-link
                      :to="`/track?tracking=${order.trackingNumber}`"
                      class="text-indigo-600 hover:text-indigo-900 text-xs"
                    >
                      View Details
                    </router-link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.pages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="goToPage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="goToPage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.pages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
                to
                <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
                of
                <span class="font-medium">{{ pagination.total }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="goToPage(pagination.page - 1)"
                  :disabled="pagination.page <= 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon class="h-5 w-5" />
                </button>

                <button
                  v-for="page in getVisiblePages()"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    page === pagination.page
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]"
                >
                  {{ page }}
                </button>

                <button
                  @click="goToPage(pagination.page + 1)"
                  :disabled="pagination.page >= pagination.pages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { format } from 'date-fns';
import {
  PlusIcon,
  ExclamationTriangleIcon,
  InboxIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/solid';
import { useOrders } from '@/composables/useOrders';
import { useNotification } from '@/composables/useNotification';
import LoadingSpinner from '../components/ui/LoadingSpinner.vue';
import StatusBadge from '../components/orders/StatusBadge.vue';
import { OrderStatus } from '@/types';

const route = useRoute();
const router = useRouter();
const {
  orders,
  loading,
  error,
  pagination,
  filters,
  fetchOrders,
  updateOrderStatus,
  cancelOrder,
  setFilters,
  resetFilters: resetOrderFilters,
} = useOrders();
const { showSuccess, showError } = useNotification();

let debounceTimer: number | null | undefined = null;

onMounted(() => {
  // Initialize filters from query params
  if (route.query.status) filters.status = route.query.status as string;
  if (route.query.sender) filters.sender = route.query.sender as string;
  if (route.query.recipient) filters.recipient = route.query.recipient as string;
  if (route.query.page) filters.page = parseInt(route.query.page as string);
  
  fetchOrders();
})

const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

const canUpdateStatus = (order: any): boolean => {
  return order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELED;
};

const getAvailableStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  switch (currentStatus) {
    case OrderStatus.PENDING:
      return [OrderStatus.IN_TRANSIT];
    case OrderStatus.IN_TRANSIT:
      return [OrderStatus.DELIVERED];
    default:
      return [];
  }
};

const getStatusLabel = (status: OrderStatus): string => {
  const labels = {
    [OrderStatus.PENDING]: 'Pending',
    [OrderStatus.IN_TRANSIT]: 'In Transit',
    [OrderStatus.DELIVERED]: 'Delivered',
    [OrderStatus.CANCELED]: 'Canceled',
  }
  return labels[status];
};

const handleStatusUpdate = async (orderId: string, event: Event) => {
  const target = event.target as HTMLSelectElement;
  const newStatus = target.value;
  
  if (!newStatus) return;

  try {
    await updateOrderStatus(orderId, newStatus);
    showSuccess('Success', 'Order status updated successfully');
    target.value = ''; // Reset dropdown
  } catch (err) {
    showError('Error', 'Failed to update order status');
  }
};

const handleCancelOrder = async (orderId: string) => {
  if (!confirm('Are you sure you want to cancel this order?')) {
    return;
  }

  try {
    await cancelOrder(orderId);
    showSuccess('Success', 'Order canceled successfully');
  } catch (err) {
    showError('Error', 'Failed to cancel order');
  }
};

const applyFilters = () => {
  filters.page = 1; // Reset to first page
  updateQueryParams();
  fetchOrders();
};

const debounceFilter = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  debounceTimer = setTimeout(() => {
    applyFilters();
  }, 500);
};

const resetFilters = () => {
  resetOrderFilters();
  router.replace({ query: {} });
};

const updateQueryParams = () => {
  const query: Record<string, string> = {};
  
  if (filters.status) query.status = filters.status;
  if (filters.sender) query.sender = filters.sender;
  if (filters.recipient) query.recipient = filters.recipient;
  if (filters.page && filters.page > 1) query.page = filters.page.toString();
  
  router.replace({ query });
};

const goToPage = (page: number) => {
  if (page < 1 || page > pagination.pages) return;
  
  filters.page = page;
  updateQueryParams();
  fetchOrders();
}

const getVisiblePages = (): number[] => {
  const current = pagination.page;
  const total = pagination.pages;
  const delta = 2;
  
  const range = [];
  const rangeWithDots = [];
  
  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(total - 1, current + delta);
    i++
  ) {
    range.push(i);
  }
  
  if (current - delta > 2) {
    rangeWithDots.push(1, '...' as any);
  } else {
    rangeWithDots.push(1);
  }
  
  rangeWithDots.push(...range);
  
  if (current + delta < total - 1) {
    rangeWithDots.push('...' as any, total);
  } else {
    rangeWithDots.push(total);
  }
  
  return rangeWithDots.filter((item, index, array) => 
    array.indexOf(item) === index && typeof item === 'number'
  ) as number[];
}
</script>