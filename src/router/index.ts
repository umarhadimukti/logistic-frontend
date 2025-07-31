import CreateOrder from '@/views/CreateOrder.vue'
import Home from '@/views/Home.vue'
import OrdersList from '@/views/OrdersList.vue'
import TrackOrder from '@/views/TrackOrder.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/orders",
      name: "OrdersList",
      component: OrdersList,
    },
    {
      path: "/create-order",
      name: "CreateOrder",
      component: CreateOrder,
    },
    {
      path: "/track",
      name: "TrackOrder",
      component: TrackOrder,
    },
  ],
})

export default router
