import AuthLayout from '../layouts/AuthLayout.vue'

const AuthRoutes = {
  path: '/auth',
  component: AuthLayout,
  props: {
    companyInitials: 'STL',
    companyName: 'SOFTWARE',
    variant: 'centered',
    appName: 'eRisk & Compliance Management',
    appVersion: '1.0.0',
    secondaryLogoText: 'Risk & Compliance Management',
    backgroundOpacity: 1,
    backgroundImage: './stlbacklogo.png'
  },
  meta: { requiresAuth: false },
  children: [
    {
      name: 'login',
      path: '/login',
      component: () => import('../views/authentication/LoginPage.vue')
    },
    {
      name: 'forgot-password',
      path: 'forgot-password',
      component: () => import('../views/authentication/ForgotPasswordPage.vue')
    }
  ]
}


export default AuthRoutes
