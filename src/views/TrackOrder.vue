<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Search Section -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">Track Your Order</h1>
          
          <form @submit.prevent="handleTrack" class="flex space-x-4">
            <div class="flex-1">
              <label for="trackingNumber" class="sr-only">Tracking Number</label>
              <input
                id="trackingNumber"
                v-model="trackingNumber"
                type="text"
                placeholder="Enter tracking number (e.g., TRC123456)"
                class="mt-1 block w-full rounded-md px-2 py-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :class="{ 'border-red-300': error }"
              />
            </div>
            <button
              type="submit"
              :disabled="loading || !trackingNumber.trim()"
              class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LoadingSpinner v-if="loading" size="sm" color="white" class="mr-2" />
              {{ loading ? 'Tracking...' : 'Track Order' }}
            </button>
          </form>
          
          <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
        </div>
      </div>

      <!-- Order Details -->
      <div v-if="currentOrder" class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900">Order Details</h2>
            <StatusBadge :status="currentOrder.status" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Order Information -->
            <div class="space-y-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Tracking Number</dt>
                <dd class="mt-1 text-lg font-semibold text-indigo-600">
                  {{ currentOrder.trackingNumber }}
                </dd>
              </div>
              
              <div>
                <dt class="text-sm font-medium text-gray-500">Order ID</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ currentOrder.id }}</dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Created Date</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ formatDate(currentOrder.createdAt) }}
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ formatDate(currentOrder.updatedAt) }}
                </dd>
              </div>
            </div>

            <!-- Shipping Information -->
            <div class="space-y-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Sender</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ currentOrder.senderName }}</dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Recipient</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ currentOrder.recipientName }}</dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Origin</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ currentOrder.origin }}</dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Destination</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ currentOrder.destination }}</dd>
              </div>
            </div>
          </div>

          <!-- Status Timeline -->
          <div class="mt-8">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Status Timeline</h3>
            <div class="flow-root">
              <ul class="-mb-8">
                <li class="relative pb-8">
                  <div class="relative flex space-x-3">
                    <div>
                      <span
                        class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                        :class="getTimelineIconClass(OrderStatus.PENDING)"
                      >
                        <ClockIcon class="h-4 w-4" />
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div>
                        <p class="text-sm text-gray-500">
                          Order created and pending processing
                        </p>
                        <p class="text-xs text-gray-400">
                          {{ formatDate(currentOrder.createdAt) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>

                <li v-if="isStatusReached(OrderStatus.IN_TRANSIT)" class="relative pb-8">
                  <div class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></div>
                  <div class="relative flex space-x-3">
                    <div>
                      <span
                        class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                        :class="getTimelineIconClass(OrderStatus.IN_TRANSIT)"
                      >
                        <TruckIcon class="h-4 w-4" />
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div>
                        <p class="text-sm text-gray-500">
                          Order is in transit
                        </p>
                        <p class="text-xs text-gray-400">
                          {{ formatDate(currentOrder.updatedAt) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>

                <li v-if="isStatusReached(OrderStatus.DELIVERED)" class="relative">
                  <div class="relative flex space-x-3">
                    <div>
                      <span
                        class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                        :class="getTimelineIconClass(OrderStatus.DELIVERED)"
                      >
                        <CheckCircleIcon class="h-4 w-4" />
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div>
                        <p class="text-sm text-gray-500">
                          Order delivered greenfully
                        </p>
                        <p class="text-xs text-gray-400">
                          {{ formatDate(currentOrder.updatedAt) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>

                <li v-if="currentOrder.status === 'CANCELED'" class="relative">
                  <div class="relative flex space-x-3">
                    <div>
                      <span
                        class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-red-500 text-white"
                      >
                        <XCircleIcon class="h-4 w-4" />
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div>
                        <p class="text-sm text-gray-500">
                          Order was canceled
                        </p>
                        <p class="text-xs text-gray-400">
                          {{ formatDate(currentOrder.updatedAt) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!currentOrder && !loading" class="text-center py-12">
        <MagnifyingGlassIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No order found</h3>
        <p class="mt-1 text-sm text-gray-500">
          Enter a tracking number above to track your order.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { format } from 'date-fns'
import {
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import { useOrders } from '@/composables/useOrders'
import { useNotification } from '@/composables/useNotification'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import StatusBadge from '@/components/orders/StatusBadge.vue'
import { OrderStatus } from '@/types'

const { currentOrder, loading, error, trackOrder } = useOrders()
const { showError } = useNotification()

const trackingNumber = ref('')

const handleTrack = async () => {
  if (!trackingNumber.value.trim()) {
    showError('Validation Error', 'Please enter a tracking number')
    return
  }

  try {
    await trackOrder(trackingNumber.value.trim())
  } catch (err) {
    // Error is already handled in composable
  }
}

const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
}

const isStatusReached = (status: OrderStatus): boolean => {
  const statusOrder = [OrderStatus.PENDING, OrderStatus.IN_TRANSIT, OrderStatus.DELIVERED]
  const currentIndex = statusOrder.indexOf(currentOrder.value?.status as OrderStatus)
  const targetIndex = statusOrder.indexOf(status)
  return currentIndex >= targetIndex
}

const getTimelineIconClass = (status: OrderStatus): string => {
  if (currentOrder.value?.status === status) {
    const classes = {
      [OrderStatus.PENDING]: 'bg-orange-500 text-white',
      [OrderStatus.IN_TRANSIT]: 'bg-indigo-500 text-white',
      [OrderStatus.DELIVERED]: 'bg-green-500 text-white',
      [OrderStatus.CANCELED]: 'bg-red-500 text-white'
    }
    return classes[status]
  } else if (isStatusReached(status)) {
    return 'bg-green-500 text-white'
  }
  return 'bg-gray-200 text-gray-400'
}
</script>