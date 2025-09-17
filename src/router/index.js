import { createRouter, createWebHistory } from 'vue-router'
import AuthRoutes from './AuthRoutes'
import DashboardRoutes from './DashboardRoutes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardPage.vue')
    },
    {
      path: '/dashboard/analytics',
      name: 'dashboard/analytics',
      component: () => import('../views/AnalyticsPage.vue')
    },
    AuthRoutes,
    DashboardRoutes
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})


export default router
