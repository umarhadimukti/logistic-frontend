// src/composables/useNotification.ts
import { ref } from 'vue'
import type { NotificationState } from '@/types'

export function useNotification() {
  const notification = ref<NotificationState>({
    show: false,
    type: 'info',
    title: '',
    message: ''
  });

  const showNotification = (
    type: NotificationState['type'],
    title: string,
    message: string,
    duration = 5000
  ) => {
    notification.value = {
      show: true,
      type,
      title,
      message
    }

    if (duration > 0) {
      setTimeout(() => {
        hideNotification()
      }, duration)
    }
  }

  const hideNotification = () => {
    notification.value.show = false
  }

  const showSuccess = (title: string, message: string) => {
    showNotification('success', title, message)
  }

  const showError = (title: string, message: string) => {
    showNotification('error', title, message)
  }

  const showWarning = (title: string, message: string) => {
    showNotification('warning', title, message)
  }

  const showInfo = (title: string, message: string) => {
    showNotification('info', title, message)
  }

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}