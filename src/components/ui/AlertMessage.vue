<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 transform scale-95"
    enter-to-class="opacity-100 transform scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 transform scale-100"
    leave-to-class="opacity-0 transform scale-95"
  >
    <div
      v-if="show"
      class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4"
      :class="alertClasses"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <component :is="iconComponent" class="h-5 w-5" :class="iconClasses" />
          </div>
          <div class="ml-3 flex-1">
            <h3 class="text-sm font-medium" :class="titleClasses">
              {{ title }}
            </h3>
            <div class="mt-1 text-sm" :class="messageClasses">
              {{ message }}
            </div>
          </div>
          <div class="ml-4 flex-shrink-0">
            <button
              @click="$emit('close')"
              class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

interface Props {
  show: boolean
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
}

const props = defineProps<Props>()
defineEmits<{
  close: []
}>()

const alertClasses = computed(() => {
  const classes = {
    success: 'border-success-500',
    error: 'border-danger-500',
    warning: 'border-warning-500',
    info: 'border-primary-500'
  }
  return classes[props.type]
})

const iconComponent = computed(() => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  }
  return icons[props.type]
})

const iconClasses = computed(() => {
  const classes = {
    success: 'text-success-500',
    error: 'text-danger-500',
    warning: 'text-warning-500',
    info: 'text-primary-500'
  }
  return classes[props.type]
})

const titleClasses = computed(() => {
  const classes = {
    success: 'text-success-700',
    error: 'text-danger-700',
    warning: 'text-warning-700',
    info: 'text-primary-700'
  }
  return classes[props.type]
})

const messageClasses = computed(() => {
  return 'text-gray-600'
})
</script>