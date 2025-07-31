<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div
      class="animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      :class="spinnerClass"
      role="status"
    >
      <span class="sr-only">Loading...</span>
    </div>
    <span v-if="text" class="ml-2 text-sm" :class="textClass">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  color?: 'primary' | 'white' | 'gray'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary'
})

const spinnerClass = computed(() => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-4'
  }

  const colorClasses = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-600'
  }

  return `${sizeClasses[props.size]} ${colorClasses[props.color]}`
})

const containerClass = computed(() => {
  return props.text ? 'space-x-2' : ''
})

const textClass = computed(() => {
  const colorClasses = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-600'
  }
  return colorClasses[props.color]
})
</script>