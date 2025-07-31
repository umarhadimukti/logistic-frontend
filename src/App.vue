<template>
  <div id="app">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-xl font-bold text-indigo-600">
                LogiTrack
              </router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/"
                class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                :class="{ 'border-indigo-500 text-indigo-600': $route.path === '/' }"
              >
                Home
              </router-link>
              <router-link
                to="/orders"
                class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                :class="{ 'border-indigo-500 text-indigo-600': $route.path === '/orders' }"
              >
                Orders
              </router-link>
              <router-link
                to="/create-order"
                class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                :class="{ 'border-indigo-500 text-indigo-600': $route.path === '/create-order' }"
              >
                Create Order
              </router-link>
              <router-link
                to="/track"
                class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                :class="{ 'border-indigo-500 text-indigo-600': $route.path === '/track' }"
              >
                Track Order
              </router-link>
            </div>
          </div>
          
          <!-- Mobile menu button -->
          <div class="sm:hidden flex items-center">
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <Bars3Icon v-if="!mobileMenuOpen" class="block h-6 w-6" />
              <XMarkIcon v-else class="block h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <router-link
            to="/"
            @click="mobileMenuOpen = false"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="$route.path === '/' 
              ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'"
          >
            Home
          </router-link>
          <router-link
            to="/orders"
            @click="mobileMenuOpen = false"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="$route.path === '/orders' 
              ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'"
          >
            Orders
          </router-link>
          <router-link
            to="/create-order"
            @click="mobileMenuOpen = false"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="$route.path === '/create-order' 
              ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'"
          >
            Create Order
          </router-link>
          <router-link
            to="/track"
            @click="mobileMenuOpen = false"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="$route.path === '/track' 
              ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'"
          >
            Track Order
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <router-view />
    </main>

    <!-- Global Notification -->
    <AlertMessage
      :show="notification.show"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
      @close="hideNotification"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/solid'
import { useNotification } from './composables/useNotification'
import AlertMessage from './components/ui/AlertMessage.vue'

const { notification, hideNotification } = useNotification()
const mobileMenuOpen = ref(false)
</script>

<style scoped>
#app {
  font-family: 'Jost', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
