/**
 * Route configuration for the app.
 * Uses lazy loading via dynamic import() for smaller initial bundle.
 */
export const routes = [
  {
    path: '/',
    component: 'home-view',
    action: () => import('../views/home-view.js'),
  },
  {
    path: '/admin',
    component: 'admin-view',
    action: () => import('../views/admin-view.js'),
  },
  {
    path: '(.*)',
    component: 'error-view',
    action: () => import('../views/error-view.js'),
  },
];
