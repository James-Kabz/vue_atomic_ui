import AuthLayout from '../layouts/AuthLayout.vue'

const AuthRoutes = {
  path: '/auth',
  component: AuthLayout,
  meta: {
    requiresAuth: false
  },
  children: [
    {
      name: 'login',
      path: '/',
      component: () => import('../views/authentication/LoginPage.vue')
    },
    {
      name: 'forgot-password',
      path: '/auth/forgot-password',
      component: () => import('../views/authentication/ForgotPasswordPage.vue')
    }
  ]
}

export default AuthRoutes
