import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresGuest: false },
  },
  {
    path: '/:username',
    name: 'Profile',
    meta: { requiresGuest: false },
    component: () => import('../views/ProfileView.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global route guard

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  // Only check authentication if not on the home page
  if (!authStore.isAuthenticated && to.path !== '/') {
    await authStore.checkAuth();
  }

  const requiresAuth = to.meta.requiresAuth;
  const requiresGuest = to.meta.requiresGuest;
  const isLoggedIn = authStore.isAuthenticated;

  if (requiresAuth && !isLoggedIn) {
    next('/login');
  } else if (requiresGuest && isLoggedIn) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
