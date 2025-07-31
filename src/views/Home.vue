<template>
  <div class="max-h-screen bg-gray-50">
    <!-- Stats Section -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl">
            Logistic Management
          </h2>
          <p class="mt-3 text-xl text-gray-500 sm:mt-4">
            Get started with these common actions
          </p>
        </div>
        <div class="mt-10 pb-12 sm:pb-16">
          <div class="relative">
            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="max-w-4xl mx-auto">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <router-link
                    to="/create-order"
                    class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
                  >
                    <div class="p-5">
                      <div class="flex items-center">
                        <div class="flex-shrink-0">
                          <PlusIcon class="h-6 w-6 text-indigo-600" />
                        </div>
                        <div class="ml-5 w-0 flex-1">
                          <p class="text-sm leading-5 font-medium text-gray-500">Create New</p>
                          <p class="text-lg leading-7 font-semibold text-gray-900">Order</p>
                        </div>
                      </div>
                    </div>
                  </router-link>

                  <router-link
                    to="/orders"
                    class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
                  >
                    <div class="p-5">
                      <div class="flex items-center">
                        <div class="flex-shrink-0">
                          <ListBulletIcon class="h-6 w-6 text-indigo-600" />
                        </div>
                        <div class="ml-5 w-0 flex-1">
                          <p class="text-sm leading-5 font-medium text-gray-500">View All</p>
                          <p class="text-lg leading-7 font-semibold text-gray-900">Orders</p>
                        </div>
                      </div>
                    </div>
                  </router-link>

                  <router-link
                    to="/track"
                    class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
                  >
                    <div class="p-5">
                      <div class="flex items-center">
                        <div class="flex-shrink-0">
                          <MagnifyingGlassIcon class="h-6 w-6 text-indigo-600" />
                        </div>
                        <div class="ml-5 w-0 flex-1">
                          <p class="text-sm leading-5 font-medium text-gray-500">Track</p>
                          <p class="text-lg leading-7 font-semibold text-gray-900">Order</p>
                        </div>
                      </div>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ListBulletIcon,
} from '@heroicons/vue/24/outline'
</script>