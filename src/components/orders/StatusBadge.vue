<!-- src/components/orders/StatusBadge.vue -->
<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="badgeClasses"
  >
    <component :is="iconComponent" class="w-3 h-3 mr-1" />
    {{ statusText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'
import { OrderStatus } from '@/types'

interface Props {
  status: OrderStatus
}

const props = defineProps<Props>()

const badgeClasses = computed(() => {
  const classes = {
    [OrderStatus.PENDING]: 'bg-warning-100 text-warning-700',
    [OrderStatus.IN_TRANSIT]: 'bg-primary-100 text-primary-700',
    [OrderStatus.DELIVERED]: 'bg-success-100 text-success-700',
    [OrderStatus.CANCELED]: 'bg-danger-100 text-danger-700'
  }
  return classes[props.status]
})

const iconComponent = computed(() => {
  const icons = {
    [OrderStatus.PENDING]: ClockIcon,
    [OrderStatus.IN_TRANSIT]: TruckIcon,
    [OrderStatus.DELIVERED]: CheckCircleIcon,
    [OrderStatus.CANCELED]: XCircleIcon
  }
  return icons[props.status]
})

const statusText = computed(() => {
  const texts = {
    [OrderStatus.PENDING]: 'Pending',
    [OrderStatus.IN_TRANSIT]: 'In Transit',
    [OrderStatus.DELIVERED]: 'Delivered',
    [OrderStatus.CANCELED]: 'Canceled'
  }
  return texts[props.status]
})
</script>