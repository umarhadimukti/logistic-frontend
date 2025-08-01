<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">Create New Order</h1>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Sender Information -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Sender Information</h2>
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="senderName" class="block text-sm font-medium text-gray-700">
                    Sender Name <span class="text-xs text-red-500">*</span>
                  </label>
                  <input
                    id="senderName"
                    v-model="form.senderName"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md px-2 py-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    :class="{ 'border-red-300': errors.senderName }"
                    placeholder="sender name.."
                  />
                  <p v-if="errors.senderName" class="mt-1 text-sm text-red-600">
                    {{ errors.senderName }}
                  </p>
                </div>

                <div>
                  <label for="origin" class="block text-sm font-medium text-gray-700">
                    Origin <span class="text-xs text-red-500">*</span>
                  </label>
                  <input
                    id="origin"
                    v-model="form.origin"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md px-2 py-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    :class="{ 'border-red-300': errors.origin }"
                    placeholder="origin.."
                  />
                  <p v-if="errors.origin" class="mt-1 text-sm text-red-600">
                    {{ errors.origin }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Recipient Information -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Recipient Information</h2>
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="recipientName" class="block text-sm font-medium text-gray-700">
                    Recipient Name <span class="text-xs text-red-500">*</span>
                  </label>
                  <input
                    id="recipientName"
                    v-model="form.recipientName"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md px-2 py-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    :class="{ 'border-red-300': errors.recipientName }"
                    placeholder="recipient name.."
                  />
                  <p v-if="errors.recipientName" class="mt-1 text-sm text-red-600">
                    {{ errors.recipientName }}
                  </p>
                </div>

                <div>
                  <label for="destination" class="block text-sm font-medium text-gray-700">
                    Destination <span class="text-xs text-red-500">*</span>
                  </label>
                  <input
                    id="destination"
                    v-model="form.destination"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md px-2 py-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    :class="{ 'border-red-300': errors.destination }"
                    placeholder="destination.."
                  />
                  <p v-if="errors.destination" class="mt-1 text-sm text-red-600">
                    {{ errors.destination }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="resetForm"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LoadingSpinner v-if="loading" size="sm" color="white" class="mr-2" />
                {{ loading ? 'Creating...' : 'Create Order' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click.self="closeSuccessModal"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircleIcon class="h-6 w-6 text-green-600" />
          </div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 mt-4">Order Created Successfully!</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Your tracking number is:
            </p>
            <p class="text-lg font-bold text-indigo-600 mt-1">
              {{ createdOrder?.trackingNumber }}
            </p>
          </div>
          <div class="items-center px-4 py-3">
            <button
              @click="closeSuccessModal"
              class="px-4 py-2 bg-indigo-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { CheckCircleIcon } from '@heroicons/vue/24/solid';
import { useOrders } from '@/composables/useOrders';
import LoadingSpinner from '../components/ui/LoadingSpinner.vue';
import type { CreateOrderDto, Order } from '@/types';

const router = useRouter();
const { createOrder, loading } = useOrders();

const form = reactive<CreateOrderDto>({
  senderName: '',
  recipientName: '',
  origin: '',
  destination: '',
});

const errors = reactive({
  senderName: '',
  recipientName: '',
  origin: '',
  destination: '',
});

const showSuccessModal = ref(false);
const createdOrder = ref<Order | null>(null);

const validateForm = (): boolean => {
  // reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = '';
  });

  let isValid = true;

  if (!form.senderName.trim()) {
    errors.senderName = 'Sender name is required';
    isValid = false;
  } else if (form.senderName.length < 2) {
    errors.senderName = 'Sender name must be at least 2 characters';
    isValid = false;
  }

  if (!form.recipientName.trim()) {
    errors.recipientName = 'Recipient name is required';
    isValid = false;
  } else if (form.recipientName.length < 2) {
    errors.recipientName = 'Recipient name must be at least 2 characters';
    isValid = false;
  }

  if (!form.origin.trim()) {
    errors.origin = 'Origin is required';
    isValid = false;
  }

  if (!form.destination.trim()) {
    errors.destination = 'Destination is required';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    const order = await createOrder(form);
    createdOrder.value = order;
    showSuccessModal.value = true;
    // showSuccess('Success', 'Order created successfully!');
  } catch (err) {
    // showError('Error', 'Failed to create order. Please try again.');
  }
};

const resetForm = () => {
  Object.assign(form, {
    senderName: '',
    recipientName: '',
    origin: '',
    destination: '',
  });
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = '';
  });
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  resetForm();
  router.push('/orders');
};
</script>