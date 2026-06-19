import { createRouter, createWebHistory } from 'vue-router'
import ProductDetail from '../App.vue'
import OrderConfirm from '../views/OrderConfirm.vue'

const routes = [
  {
    path: '/',
    name: 'ProductDetail',
    component: ProductDetail
  },
  {
    path: '/order/confirm',
    name: 'OrderConfirm',
    component: OrderConfirm,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
