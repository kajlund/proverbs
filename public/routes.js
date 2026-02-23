import { authStore } from './stores/auth-store.js';

export const routes = [
  {
    path: '/',
    component: 'home-view',
    action: () => import('../views/home-view.js'),
  },
  {
    path: '/admin',
    component: 'admin-view',
    // Check auth first, then import the component if authorized
    action: async (context, commands) => {
      if (!authStore.isLoggedIn) {
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: { msg: 'Please log in to access Admin', type: 'info' },
          }),
        );
        console.warn('Unauthorized access - Redirecting to home');
        return commands.redirect('/');
      }

      // If authorized, perform the lazy load
      await import('../views/admin-view.js');
    },
  },
  {
    path: '(.*)',
    component: 'error-view',
    action: () => import('../views/error-view.js'),
  },
];
