import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../services/supabase'

// Lazy load components
const LoginPage = () => import('../pages/LoginPage.vue')
const SalesPage = () => import('../pages/SalesPage.vue')
const ProductManagement = () => import('../pages/ProductManagement.vue')
const SalesHistory = () => import('../pages/SalesHistory.vue')

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/sales',
    name: 'Sales',
    component: SalesPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/history',
    name: 'History',
    component: SalesHistory,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory('/minipos5/'),
  routes
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (requiresGuest && isAuthenticated) {
    next('/sales')
  } else {
    next()
  }
})

export default router