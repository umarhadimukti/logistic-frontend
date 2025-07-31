<template>

</template>

<script setup lang="ts">
import { useOrders } from '@/composables/useOrders';
import { onMounted } from 'vue';

const { fetchOrders } = useOrders();

onMounted(async () => {
  await fetchOrders();
});
</script>