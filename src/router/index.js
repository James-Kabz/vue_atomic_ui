import { createRouter, createWebHistory } from 'vue-router'
import AuthRoutes from './AuthRoutes'
import DashboardRoutes from './DashboardRoutes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/templates/overview'
    },
    {
      path: '/components',
      name: 'components',
      component: () => import('../views/ComponentShowcase.vue')
    },
    {
      path: '/components/full-gallery',
      name: 'components/full-gallery',
      component: () => import('../views/ComponentGallery.vue')
    },
    {
      path: '/templates/overview',
      name: 'templates/overview',
      component: () => import('../views/templates/DashboardOverview.vue')
    },
    {
      path: '/templates/analytics',
      name: 'templates/analytics',
      component: () => import('../views/templates/DashboardAnalytics.vue')
    },
    {
      path: '/templates/users',
      name: 'templates/users',
      component: () => import('../views/templates/DashboardUsers.vue')
    },
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
    {
      path: '/table',
      name: 'table',
      component: () => import('../views/DataTableTest.vue')
    },
    {
      path: '/widgets-test',
      name: 'widgets-test',
      component: () => import('../views/WidgetsTest.vue')
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
